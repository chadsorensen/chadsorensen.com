import type { ShopperItem, ShopperMutation } from '../../shared/shopper'

const PASSPHRASE_KEY = 'shopper:passphrase'
const CACHE_KEY = 'shopper:items'

export class UnauthorizedError extends Error {}

// localStorage can throw (private mode, storage disabled), so guard every access.
function read(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function write(key: string, value: string | null) {
  try {
    if (value === null) localStorage.removeItem(key)
    else localStorage.setItem(key, value)
  } catch {
    /* ignore */
  }
}

export const getPassphrase = () => read(PASSPHRASE_KEY)
export const setPassphrase = (value: string | null) => write(PASSPHRASE_KEY, value)

export function readCachedItems(): ShopperItem[] {
  try {
    const parsed: unknown = JSON.parse(read(CACHE_KEY) ?? '[]')
    return Array.isArray(parsed) ? (parsed as ShopperItem[]) : []
  } catch {
    return []
  }
}

export const cacheItems = (items: ShopperItem[]) => write(CACHE_KEY, JSON.stringify(items))

async function request(mutation?: ShopperMutation): Promise<ShopperItem[]> {
  const response = await fetch('/api/shopper', {
    method: mutation ? 'POST' : 'GET',
    cache: 'no-store',
    headers: {
      Authorization: `Bearer ${getPassphrase() ?? ''}`,
      ...(mutation && { 'Content-Type': 'application/json' }),
    },
    body: mutation && JSON.stringify(mutation),
  })

  if (response.status === 401) throw new UnauthorizedError()
  if (!response.ok) throw new Error(`Shopper API ${response.status}`)

  const data = (await response.json()) as { items: ShopperItem[] }
  return data.items
}

export const fetchItems = () => request()
export const sendMutation = (mutation: ShopperMutation) => request(mutation)
