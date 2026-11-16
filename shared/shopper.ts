/** Shared between the /shopper page and the api/shopper function. */

export interface ShopperItem {
  id: string
  title: string
  done: boolean
  createdAt: number
}

export const MAX_TITLE_LENGTH = 200
export const MAX_ITEMS = 500
export const MAX_BATCH = 50

export type ShopperMutation =
  | { op: 'add'; items: { id: string; title: string }[] }
  | { op: 'update'; id: string; title?: string; done?: boolean }
  | { op: 'remove'; ids: string[] }

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export const isId = (value: unknown): value is string =>
  typeof value === 'string' && UUID.test(value)

export function cleanTitle(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const title = value.trim().replace(/\s+/g, ' ')
  return title.length > 0 && title.length <= MAX_TITLE_LENGTH ? title : null
}
