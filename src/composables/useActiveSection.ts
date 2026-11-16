import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue'

/**
 * Tracks which section currently spans the vertical middle of the viewport.
 * When the page is scrolled to the bottom, the last section wins so short
 * final sections (like contact) can still become active.
 */
export function useActiveSection<T extends string>(ids: readonly T[]): Ref<T | null> {
  const active = ref<T | null>(null) as Ref<T | null>
  let frame = 0

  const update = () => {
    frame = 0
    const { scrollY, innerHeight } = window
    const atBottom = scrollY + innerHeight > document.documentElement.scrollHeight - 50

    if (atBottom) {
      active.value = ids[ids.length - 1] ?? null
      return
    }

    const middle = scrollY + innerHeight / 2
    active.value =
      ids.find((id) => {
        const el = document.getElementById(id)
        if (!el) return false
        const top = el.getBoundingClientRect().top + scrollY
        return top <= middle && top + el.offsetHeight > middle
      }) ?? null
  }

  const onScroll = () => {
    if (!frame) frame = requestAnimationFrame(update)
  }

  onMounted(() => {
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
  })

  onBeforeUnmount(() => {
    cancelAnimationFrame(frame)
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', onScroll)
  })

  return active
}
