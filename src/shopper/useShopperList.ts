import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { cleanTitle, type ShopperItem, type ShopperMutation } from '../../shared/shopper'
import {
  UnauthorizedError,
  cacheItems,
  fetchItems,
  getPassphrase,
  readCachedItems,
  sendMutation,
  setPassphrase,
} from './api'

const POLL_MS = 5000

export type SyncState = 'locked' | 'syncing' | 'ready' | 'offline'

/**
 * The shared list, kept in sync with the server.
 *
 * Changes are applied locally first (optimistic), then sent. While any change
 * is in flight, polling results are ignored so the list doesn't flicker back.
 */
export function useShopperList() {
  const items = ref<ShopperItem[]>(readCachedItems())
  const state = ref<SyncState>(getPassphrase() ? 'syncing' : 'locked')
  const wrongPassphrase = ref(false)
  let pending = 0
  let timer: ReturnType<typeof setInterval> | undefined

  const remaining = computed(() => items.value.filter((item) => !item.done).length)
  const completed = computed(() => items.value.length - remaining.value)

  function commit(list: ShopperItem[]) {
    items.value = list
    cacheItems(list)
  }

  function handleError(error: unknown) {
    if (error instanceof UnauthorizedError) {
      setPassphrase(null)
      wrongPassphrase.value = state.value === 'syncing'
      state.value = 'locked'
    } else {
      state.value = 'offline'
    }
  }

  async function refresh() {
    if (state.value === 'locked' || pending > 0) return
    try {
      const list = await fetchItems()
      if (pending === 0) commit(list)
      state.value = 'ready'
    } catch (error) {
      handleError(error)
    }
  }

  async function mutate(mutation: ShopperMutation, optimistic: (list: ShopperItem[]) => ShopperItem[]) {
    commit(optimistic(items.value))
    pending++
    try {
      const list = await sendMutation(mutation)
      pending--
      if (pending === 0) commit(list)
      state.value = 'ready'
    } catch (error) {
      pending--
      handleError(error)
      // Snap back to whatever the server actually has once it's reachable.
      setTimeout(refresh, 2000)
    }
  }

  function add(rawTitle: string): boolean {
    const title = cleanTitle(rawTitle)
    if (!title) return false
    const id = crypto.randomUUID()
    const item: ShopperItem = { id, title, done: false, createdAt: Date.now() }
    void mutate({ op: 'add', id, title }, (list) => [item, ...list])
    return true
  }

  const patch = (id: string, changes: Partial<ShopperItem>) => (list: ShopperItem[]) =>
    list.map((item) => (item.id === id ? { ...item, ...changes } : item))

  function toggle(item: ShopperItem) {
    void mutate({ op: 'update', id: item.id, done: !item.done }, patch(item.id, { done: !item.done }))
  }

  function rename(item: ShopperItem, rawTitle: string) {
    const title = cleanTitle(rawTitle)
    if (!title) return remove(item)
    if (title === item.title) return
    void mutate({ op: 'update', id: item.id, title }, patch(item.id, { title }))
  }

  function remove(item: ShopperItem) {
    void mutate({ op: 'remove', ids: [item.id] }, (list) => list.filter((i) => i.id !== item.id))
  }

  function clearCompleted() {
    const ids = items.value.filter((item) => item.done).map((item) => item.id)
    if (ids.length) void mutate({ op: 'remove', ids }, (list) => list.filter((i) => !i.done))
  }

  async function unlock(passphrase: string) {
    setPassphrase(passphrase.trim())
    wrongPassphrase.value = false
    state.value = 'syncing'
    await refresh()
  }

  function lock() {
    setPassphrase(null)
    commit([])
    state.value = 'locked'
  }

  const onVisibility = () => {
    if (document.visibilityState === 'visible') void refresh()
  }

  onMounted(() => {
    void refresh()
    timer = setInterval(() => {
      if (document.visibilityState === 'visible') void refresh()
    }, POLL_MS)
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('online', onVisibility)
  })

  onBeforeUnmount(() => {
    clearInterval(timer)
    document.removeEventListener('visibilitychange', onVisibility)
    window.removeEventListener('online', onVisibility)
  })

  return {
    items,
    state,
    wrongPassphrase,
    remaining,
    completed,
    add,
    toggle,
    rename,
    remove,
    clearCompleted,
    unlock,
    lock,
  }
}
