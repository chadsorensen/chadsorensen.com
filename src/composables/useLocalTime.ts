import { onBeforeUnmount, onMounted, ref } from 'vue'

/** Live clock for a given IANA time zone, e.g. "11:52 PM" + "PST". */
export function useLocalTime(timeZone: string) {
  const time = ref('')
  const zone = ref('')

  const timeFormat = new Intl.DateTimeFormat('en-US', { timeZone, hour: 'numeric', minute: '2-digit' })
  const zoneFormat = new Intl.DateTimeFormat('en-US', { timeZone, timeZoneName: 'short' })

  const update = () => {
    const now = new Date()
    time.value = timeFormat.format(now)
    zone.value = zoneFormat.formatToParts(now).find((p) => p.type === 'timeZoneName')?.value ?? ''
  }

  let timer: ReturnType<typeof setInterval> | undefined

  update()
  onMounted(() => {
    timer = setInterval(update, 15_000)
  })
  onBeforeUnmount(() => clearInterval(timer))

  return { time, zone }
}
