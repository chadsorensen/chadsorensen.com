<script setup lang="ts">
import { onBeforeUnmount, onMounted, useTemplateRef } from 'vue'
import { useSpeech } from './useSpeech'
import { stickerFor } from './stickers'

const emit = defineEmits<{ add: [titles: string[]]; close: [] }>()

const { listening, interim, captured, error, start, stop, reset, removeAt } = useSpeech()
const sheet = useTemplateRef<HTMLElement>('sheet')

function toggleMic() {
  if (listening.value) stop()
  else start()
}

function add() {
  stop()
  emit('add', [...captured.value])
  reset()
}

function close() {
  reset()
  emit('close')
}

const onKey = (event: KeyboardEvent) => {
  if (event.key === 'Escape') close()
}

onMounted(() => {
  start()
  sheet.value?.focus()
  window.addEventListener('keydown', onKey)
})
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <div class="scrim" @click.self="close">
    <section
      ref="sheet"
      class="sheet"
      role="dialog"
      aria-modal="true"
      aria-labelledby="voice-title"
      tabindex="-1"
    >
      <h2 id="voice-title">Say your list</h2>
      <p class="hint">Pause between items. You can check them before they're added.</p>

      <button
        type="button"
        class="mic"
        :class="{ 'mic--live': listening }"
        :aria-pressed="listening"
        @click="toggleMic"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="9" y="3" width="6" height="11" rx="3" />
          <path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21" />
        </svg>
        <span>{{ listening ? 'Listening… tap to pause' : 'Tap to keep talking' }}</span>
      </button>

      <p class="interim" aria-live="polite">{{ interim }}</p>
      <p v-if="error" class="error" role="alert">{{ error }}</p>

      <ul v-if="captured.length" class="chips" aria-label="Heard so far">
        <li v-for="(title, i) in captured" :key="`${i}-${title}`">
          <span aria-hidden="true">{{ stickerFor(title).emoji }}</span>
          {{ title }}
          <button type="button" :aria-label="`Drop ${title}`" @click="removeAt(i)">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7l10 10M17 7L7 17" /></svg>
          </button>
        </li>
      </ul>

      <div class="actions">
        <button type="button" class="ghost" @click="close">Cancel</button>
        <button type="button" class="go" :disabled="!captured.length" @click="add">
          {{
            captured.length
              ? `Add ${captured.length} ${captured.length === 1 ? 'item' : 'items'}`
              : 'Add items'
          }}
        </button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.scrim {
  position: fixed;
  inset: 0;
  z-index: 20;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  background: rgb(42 32 23 / 0.45);
  animation: fade 0.2s ease-out;
}

.sheet {
  width: 100%;
  max-width: 560px;
  max-height: 85dvh;
  overflow-y: auto;
  padding: 24px 20px max(20px, env(safe-area-inset-bottom));
  border-radius: 22px 22px 0 0;
  background: var(--paper);
  outline: none;
  animation: rise 0.25s cubic-bezier(0.2, 0.9, 0.3, 1.2);
}

h2 {
  margin: 0;
  font-size: 26px;
  font-weight: 800;
  font-stretch: 80%;
  letter-spacing: -0.01em;
}

.hint {
  margin: 4px 0 20px;
  color: var(--muted);
}

.mic {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 8px;
  border: none;
  background: none;
  color: var(--muted);
  font-weight: 600;
}

.mic svg {
  box-sizing: content-box;
  width: 34px;
  height: 34px;
  padding: 22px;
  border-radius: 50%;
  background: var(--ink);
  fill: none;
  stroke: var(--paper);
  stroke-width: 2;
  stroke-linecap: round;
}

.mic--live svg {
  background: var(--tomato);
  box-shadow: 0 0 0 0 color-mix(in srgb, var(--tomato) 50%, transparent);
  animation: ping 1.4s ease-out infinite;
}

.mic:focus-visible svg {
  outline: 3px solid var(--citrus);
  outline-offset: 3px;
}

.interim {
  min-height: 1.4em;
  margin: 12px 0 0;
  color: var(--muted);
  font-style: italic;
  text-align: center;
}

.error {
  margin: 8px 0 0;
  color: var(--tomato-ink);
  text-align: center;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 16px 0 0;
  padding: 0;
  list-style: none;
}

.chips li {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 4px 6px 12px;
  border-radius: 999px;
  background: var(--kraft-soft);
  font-weight: 600;
  animation: pop 0.25s cubic-bezier(0.2, 0.9, 0.3, 1.4);
}

.chips button {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 50%;
  background: none;
}

.chips svg {
  width: 14px;
  height: 14px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2.5;
  stroke-linecap: round;
}

.actions {
  display: flex;
  gap: 10px;
  margin-top: 24px;
}

.actions button {
  flex: 1;
  padding: 14px;
  border-radius: 14px;
  font-weight: 700;
}

.ghost {
  border: 2px solid var(--line);
  background: none;
}

.go {
  border: none;
  background: var(--tomato);
  color: #fff;
}

.go:disabled {
  opacity: 0.4;
}

.actions button:focus-visible,
.chips button:focus-visible {
  outline: 3px solid var(--citrus);
  outline-offset: 2px;
}

@keyframes fade {
  from {
    opacity: 0;
  }
}

@keyframes rise {
  from {
    transform: translateY(100%);
  }
}

@keyframes pop {
  from {
    transform: scale(0.6);
    opacity: 0;
  }
}

@keyframes ping {
  to {
    box-shadow: 0 0 0 22px transparent;
  }
}
</style>
