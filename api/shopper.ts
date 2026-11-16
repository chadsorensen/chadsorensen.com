import { timingSafeEqual } from 'node:crypto'
import { Redis } from '@upstash/redis'
import {
  MAX_ITEMS,
  cleanTitle,
  isId,
  type ShopperItem,
  type ShopperMutation,
} from '../shared/shopper.js'

/**
 * Shared grocery list for /shopper.
 *
 * Items live in a single Redis hash (field = item id), so concurrent edits
 * from different devices touch separate fields and can't overwrite each other.
 *
 *   GET  /api/shopper              -> { items: ShopperItem[] }
 *   POST /api/shopper  { op, ... } -> { items: ShopperItem[] }
 *
 * Every request needs `Authorization: Bearer <SHOPPER_PASSPHRASE>`.
 * Redis credentials come from the Upstash integration env vars
 * (UPSTASH_REDIS_REST_* or KV_REST_API_*).
 */

const KEY = 'shopper:items'

let client: Redis | undefined
const redis = () => (client ??= Redis.fromEnv())

const json = (body: unknown, status = 200) =>
  Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } })

function isAuthorized(request: Request): boolean {
  const expected = process.env.SHOPPER_PASSPHRASE
  if (!expected) return false
  const given = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ?? ''
  const a = Buffer.from(given)
  const b = Buffer.from(expected)
  return a.length === b.length && timingSafeEqual(a, b)
}

async function listItems(): Promise<ShopperItem[]> {
  const all = (await redis().hgetall<Record<string, ShopperItem>>(KEY)) ?? {}
  return Object.values(all).sort((a, b) => b.createdAt - a.createdAt)
}

async function apply(mutation: ShopperMutation): Promise<Response | null> {
  switch (mutation.op) {
    case 'add': {
      const title = cleanTitle(mutation.title)
      if (!isId(mutation.id) || !title) return json({ error: 'Invalid item' }, 400)
      if ((await redis().hlen(KEY)) >= MAX_ITEMS) return json({ error: 'List is full' }, 409)
      const item: ShopperItem = { id: mutation.id, title, done: false, createdAt: Date.now() }
      // hsetnx so a retried add can't clobber an item that was edited since
      await redis().hsetnx(KEY, item.id, item)
      return null
    }

    case 'update': {
      if (!isId(mutation.id)) return json({ error: 'Invalid id' }, 400)
      const current = await redis().hget<ShopperItem>(KEY, mutation.id)
      if (!current) return null // already removed elsewhere; nothing to do
      const next = { ...current }
      if (mutation.title !== undefined) {
        const title = cleanTitle(mutation.title)
        if (!title) return json({ error: 'Invalid title' }, 400)
        next.title = title
      }
      if (mutation.done !== undefined) next.done = Boolean(mutation.done)
      await redis().hset(KEY, { [next.id]: next })
      return null
    }

    case 'remove': {
      const ids = Array.isArray(mutation.ids) ? mutation.ids.filter(isId) : []
      if (ids.length) await redis().hdel(KEY, ...ids)
      return null
    }

    default:
      return json({ error: 'Unknown op' }, 400)
  }
}

export default {
  async fetch(request: Request): Promise<Response> {
    if (!isAuthorized(request)) return json({ error: 'Unauthorized' }, 401)

    try {
      if (request.method === 'GET') return json({ items: await listItems() })

      if (request.method === 'POST') {
        const mutation = (await request.json().catch(() => null)) as ShopperMutation | null
        if (!mutation || typeof mutation !== 'object') return json({ error: 'Bad request' }, 400)
        const error = await apply(mutation)
        return error ?? json({ items: await listItems() })
      }

      return json({ error: 'Method not allowed' }, 405)
    } catch (error) {
      console.error('shopper api error', error)
      return json({ error: 'Server error' }, 500)
    }
  },
}
