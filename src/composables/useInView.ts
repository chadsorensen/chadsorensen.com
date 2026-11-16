import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue'

/** Flips to true the first time the element scrolls into view, then stops observing. */
export function useInView(target: Ref<HTMLElement | null>, threshold = 0.25): Ref<boolean> {
  const inView = ref(false)
  let observer: IntersectionObserver | undefined

  onMounted(() => {
    if (!target.value) return
    observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          inView.value = true
          observer?.disconnect()
        }
      },
      { threshold },
    )
    observer.observe(target.value)
  })

  onBeforeUnmount(() => observer?.disconnect())

  return inView
}
