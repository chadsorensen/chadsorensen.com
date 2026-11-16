<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { MAX_TITLE_LENGTH, type ShopperItem } from '../../shared/shopper'
import { useShopperList } from './useShopperList'
import { speechSupported } from './useSpeech'
import { splitTyped } from './parse'
import { stickerFor } from './stickers'
import VoiceSheet from './VoiceSheet.vue'

const {
  items,
  state,
  wrongPassphrase,
  remaining,
  completed,
  addMany,
  toggle,
  rename,
  remove,
  clearCompleted,
  unlock,
  lock,
} = useShopperList()

/* ---------- Filters (kept in the URL hash, like the original) ---------- */

const filters = ['active', 'all', 'done'] as const
type Filter = (typeof filters)[number]
const filterLabels: Record<Filter, string> = { active: 'To grab', all: 'Everything', done: 'In the bag' }

const readFilter = (): Filter => {
  const hash = location.hash.replace('#/', '') as Filter
  return filters.includes(hash) ? hash : 'active'
}
const filter = ref<Filter>(readFilter())
const onHash = () => (filter.value = readFilter())
onMounted(() => window.addEventListener('hashchange', onHash))
onBeforeUnmount(() => window.removeEventListener('hashchange', onHash))

const visible = computed(() =>
  items.value.filter((item) =>
    filter.value === 'all' ? true : filter.value === 'done' ? item.done : !item.done,
  ),
)

const emptyMessage = computed(() => {
  if (!items.value.length) return 'Nothing on the list. Type a few things separated by commas, or say them.'
  if (filter.value === 'active') return "Everything's in the bag."
  if (filter.value === 'done') return 'Nothing checked off yet.'
  return ''
})

const subtitle = computed(() => {
  if (state.value === 'locked') return 'The household grocery list'
  if (!items.value.length) return 'Empty list'
  if (!remaining.value) return 'All done'
  return `${remaining.value} ${remaining.value === 1 ? 'thing' : 'things'} to grab`
})

/* ---------- Toast ---------- */

const toast = ref('')
let toastTimer: ReturnType<typeof setTimeout> | undefined
function say(message: string) {
  toast.value = message
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => (toast.value = ''), 2600)
}

function addTitles(titles: string[]) {
  const { added, skipped } = addMany(titles)
  const parts: string[] = []
  if (added.length > 1) parts.push(`Added ${added.length} items`)
  if (skipped.length) parts.push(`Already on the list: ${skipped.join(', ')}`)
  if (parts.length) say(parts.join('. '))
  if (added.length && filter.value === 'done') location.hash = '#/active'
  return added.length + skipped.length > 0
}

/* ---------- Adding ---------- */

const newTitle = ref('')
function submitNew() {
  if (addTitles(splitTyped(newTitle.value))) newTitle.value = ''
}

const voiceSupported = speechSupported
const voiceOpen = ref(false)
function addSpoken(titles: string[]) {
  voiceOpen.value = false
  addTitles(titles)
}

/* ---------- Checking off (+ a little celebration for the last one) ---------- */

const burst = ref(0)
let celebrate = false
function check(item: ShopperItem) {
  celebrate = !item.done && remaining.value === 1
  toggle(item)
}
watch(remaining, (now) => {
  if (celebrate && now === 0) burst.value++
  celebrate = false
})
const burstEmoji = computed(() => {
  const pool = items.value.map((item) => stickerFor(item.title).emoji)
  return Array.from({ length: 14 }, (_, i) => pool[i % Math.max(pool.length, 1)] ?? '🛒')
})

/* ---------- Inline editing ---------- */

const editingId = ref<string | null>(null)
const draft = ref('')

async function startEdit(item: ShopperItem) {
  editingId.value = item.id
  draft.value = item.title
  await nextTick()
  const input = document.querySelector<HTMLInputElement>(`[data-edit="${item.id}"]`)
  input?.focus()
  input?.select()
}

function finishEdit(item: ShopperItem) {
  if (editingId.value !== item.id) return
  editingId.value = null
  rename(item, draft.value)
}

const cancelEdit = () => (editingId.value = null)

/* ---------- Unlock ---------- */

const passphrase = ref('')
async function submitPassphrase() {
  if (passphrase.value.trim()) {
    await unlock(passphrase.value)
    passphrase.value = ''
  }
}

const statusLabel = computed(
  () =>
    ({
      locked: '',
      syncing: 'Syncing',
      ready: 'Synced',
      offline: "Offline. Changes might not save",
    })[state.value],
)
</script>

<template>
  <div class="bag">
    <header class="masthead">
      <h1>Shopper</h1>
      <p class="subtitle">{{ subtitle }}</p>
      <p v-if="state !== 'locked'" class="status" :class="`status--${state}`" role="status">
        <span class="status__dot" aria-hidden="true" />{{ statusLabel }}
      </p>
    </header>

    <main class="pad">
      <!-- Locked -->
      <form v-if="state === 'locked'" class="unlock" @submit.prevent="submitPassphrase">
        <label for="passphrase">Passphrase</label>
        <input
          id="passphrase"
          v-model="passphrase"
          type="password"
          autocomplete="current-password"
          enterkeyhint="go"
          autofocus
        />
        <p v-if="wrongPassphrase" class="unlock__error" role="alert">
          That passphrase didn't match. Check it and try again.
        </p>
        <button type="submit" class="btn-tomato">Open the list</button>
      </form>

      <!-- List -->
      <template v-else>
        <form class="add" @submit.prevent="submitNew">
          <label for="new-item" class="visually-hidden">Add items, separated by commas</label>
          <input
            id="new-item"
            v-model="newTitle"
            placeholder="Eggs, limes, tortillas…"
            autocomplete="off"
            autocapitalize="off"
            enterkeyhint="enter"
            :maxlength="MAX_TITLE_LENGTH * 4"
          />
          <button
            v-if="voiceSupported"
            type="button"
            class="add__mic"
            aria-label="Say your list"
            @click="voiceOpen = true"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <rect x="9" y="3" width="6" height="11" rx="3" />
              <path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21" />
            </svg>
          </button>
          <button type="submit" class="btn-tomato" :disabled="!newTitle.trim()">Add</button>
        </form>

        <ul v-if="visible.length" class="list">
          <li
            v-for="item in visible"
            :key="item.id"
            class="item"
            :class="[{ 'item--done': item.done }, `aisle-${stickerFor(item.title).aisle}`]"
          >
            <template v-if="editingId === item.id">
              <span class="sticker" aria-hidden="true">{{ stickerFor(draft || item.title).emoji }}</span>
              <input
                v-model="draft"
                class="item__edit"
                :data-edit="item.id"
                :maxlength="MAX_TITLE_LENGTH"
                enterkeyhint="done"
                aria-label="Edit item"
                @keydown.enter.prevent="finishEdit(item)"
                @keydown.esc.prevent="cancelEdit"
                @blur="finishEdit(item)"
              />
            </template>
            <template v-else>
              <button
                type="button"
                class="item__toggle"
                :aria-pressed="item.done"
                @click="check(item)"
                @dblclick.prevent="startEdit(item)"
              >
                <span class="sticker" aria-hidden="true">{{ stickerFor(item.title).emoji }}</span>
                <span class="item__title">
                  {{ item.title }}
                  <svg class="scribble" viewBox="0 0 100 12" preserveAspectRatio="none" aria-hidden="true">
                    <path
                      d="M1 7 C 12 3, 20 10, 32 6 S 52 3, 64 7 S 86 9, 99 5"
                    />
                  </svg>
                </span>
              </button>
              <button type="button" class="icon" :aria-label="`Edit ${item.title}`" @click="startEdit(item)">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M4 20h4L19 9l-4-4L4 16v4zM14 6l4 4" />
                </svg>
              </button>
              <button type="button" class="icon" :aria-label="`Remove ${item.title}`" @click="remove(item)">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
              </button>
            </template>
          </li>
        </ul>
        <p v-else class="empty">{{ emptyMessage }}</p>

        <footer class="pad__foot">
          <nav class="filters" aria-label="Show">
            <a
              v-for="f in filters"
              :key="f"
              :href="`#/${f}`"
              :class="{ selected: filter === f }"
              :aria-current="filter === f ? 'page' : undefined"
            >
              {{ filterLabels[f] }}
            </a>
          </nav>
          <div class="pad__actions">
            <button v-if="completed" type="button" class="link" @click="clearCompleted">
              Clear what's in the bag ({{ completed }})
            </button>
            <button type="button" class="link link--quiet" @click="lock">Lock</button>
          </div>
        </footer>
      </template>
    </main>

    <p class="toast" :class="{ 'toast--on': toast }" role="status" aria-live="polite">{{ toast }}</p>

    <div v-if="burst" :key="burst" class="burst" aria-hidden="true">
      <span
        v-for="(emoji, i) in burstEmoji"
        :key="i"
        :style="{ '--x': `${(i * 37) % 100}%`, '--d': `${(i % 7) * 70}ms`, '--r': `${((i * 53) % 60) - 30}deg` }"
      >
        {{ emoji }}
      </span>
    </div>

    <VoiceSheet v-if="voiceOpen" @add="addSpoken" @close="voiceOpen = false" />
  </div>
</template>

<style>
:root {
  --kraft: #d7b98e;
  --kraft-deep: #c49f6c;
  --kraft-soft: #f1e4cf;
  --paper: #fffefa;
  --ink: #2a2017;
  --muted: #7a6a58;
  --line: #e7dccb;
  --tomato: #e5482c;
  --tomato-ink: #b3301a;
  --leaf: #2f9b5a;
  --citrus: #f5c342;
  color-scheme: light dark;
}

@media (prefers-color-scheme: dark) {
  :root {
    --kraft: #3a2b1d;
    --kraft-deep: #2e2216;
    --kraft-soft: #3b2f23;
    --paper: #221b15;
    --ink: #f4ecdf;
    --muted: #b5a48f;
    --line: #3a3027;
    --tomato-ink: #ff8a73;
    --leaf: #4cc27c;
  }
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

html {
  background: var(--kraft);
}

body {
  margin: 0;
  color: var(--ink);
  font-family: 'Bricolage Grotesque', system-ui, sans-serif;
  font-size: 17px;
  line-height: 1.35;
  -webkit-font-smoothing: antialiased;
  -webkit-tap-highlight-color: transparent;
}

button,
input {
  font: inherit;
  color: inherit;
}

button {
  cursor: pointer;
  touch-action: manipulation;
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}
</style>

<style scoped>
/* ---------- Bag + masthead ---------- */

.bag {
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
  max-width: 560px;
  margin: 0 auto;
  padding: max(20px, env(safe-area-inset-top)) 14px max(16px, env(safe-area-inset-bottom));
  /* faint paper-bag fibres */
  background-image:
    repeating-linear-gradient(97deg, transparent 0 7px, rgb(0 0 0 / 0.018) 7px 8px),
    repeating-linear-gradient(3deg, transparent 0 11px, rgb(255 255 255 / 0.03) 11px 12px);
}

.masthead {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: end;
  padding: 0 6px 18px;
}

h1 {
  grid-column: 1 / -1;
  margin: 0;
  font-size: clamp(52px, 17vw, 76px);
  font-weight: 800;
  font-stretch: 75%;
  line-height: 0.85;
  letter-spacing: -0.02em;
  transform: rotate(-2deg);
  transform-origin: left bottom;
}

.subtitle {
  margin: 10px 0 0;
  font-weight: 600;
}

.status {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0;
  font-size: 14px;
}

.status__dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: var(--leaf);
}

.status--syncing .status__dot {
  background: var(--citrus);
  animation: blink 0.9s ease-in-out infinite alternate;
}

.status--offline {
  color: var(--tomato-ink);
}

.status--offline .status__dot {
  background: var(--tomato);
}

/* ---------- Notepad ---------- */

.pad {
  position: relative;
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 22px 16px 18px;
  border-radius: 4px 4px 14px 14px;
  background: var(--paper);
  box-shadow:
    0 1px 0 rgb(0 0 0 / 0.05),
    0 14px 30px -18px rgb(60 35 10 / 0.55);
}

/* perforated top edge where it tore off the pad */
.pad::before {
  content: '';
  position: absolute;
  top: -7px;
  right: 0;
  left: 0;
  height: 8px;
  background: radial-gradient(circle at 7px 8px, var(--paper) 6.5px, transparent 7px) 0 0 / 14px 8px repeat-x;
}

/* ---------- Inputs ---------- */

input {
  width: 100%;
  min-width: 0;
  padding: 13px 14px;
  border: 2px solid var(--line);
  border-radius: 12px;
  background: var(--paper);
  outline: none;
}

input:focus-visible {
  border-color: var(--ink);
}

input::placeholder {
  color: var(--muted);
  opacity: 0.8;
}

.btn-tomato {
  flex: none;
  padding: 13px 18px;
  border: none;
  border-radius: 12px;
  background: var(--tomato);
  color: #fff;
  font-weight: 700;
  transition: transform 0.1s;
}

.btn-tomato:active:not(:disabled) {
  transform: scale(0.96);
}

.btn-tomato:disabled {
  opacity: 0.4;
  cursor: default;
}

:is(.btn-tomato, .add__mic, .icon, .link, .item__toggle, .filters a):focus-visible {
  outline: 3px solid var(--citrus);
  outline-offset: 2px;
}

/* ---------- Unlock ---------- */

.unlock {
  display: grid;
  gap: 10px;
  padding: 12px 0;
}

.unlock label {
  font-weight: 700;
}

.unlock__error {
  margin: 0;
  color: var(--tomato-ink);
  font-size: 15px;
}

/* ---------- Add bar ---------- */

.add {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.add__mic {
  display: grid;
  flex: none;
  place-items: center;
  width: 50px;
  border: 2px solid var(--line);
  border-radius: 12px;
  background: none;
}

.add__mic svg {
  width: 22px;
  height: 22px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
}

/* ---------- List ---------- */

.list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.item {
  display: flex;
  align-items: center;
  min-height: 58px;
  border-bottom: 2px dashed var(--line);
}

.item__toggle {
  display: flex;
  flex: 1;
  align-items: center;
  gap: 12px;
  min-width: 0;
  padding: 9px 4px 9px 0;
  border: none;
  background: none;
  text-align: left;
}

/* Produce-sticker badge, tinted by aisle */
.sticker {
  display: grid;
  flex: none;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--aisle);
  box-shadow: inset 0 0 0 2px rgb(255 255 255 / 0.55);
  font-size: 21px;
  transition:
    transform 0.25s cubic-bezier(0.3, 1.6, 0.5, 1),
    filter 0.25s;
}

.aisle-produce { --aisle: #cdeac3; }
.aisle-dairy   { --aisle: #d5e5f5; }
.aisle-meat    { --aisle: #f6d1c7; }
.aisle-bakery  { --aisle: #f3ddb5; }
.aisle-pantry  { --aisle: #f8e8a6; }
.aisle-frozen  { --aisle: #d4eff1; }
.aisle-drinks  { --aisle: #e6d7f2; }
.aisle-home    { --aisle: #e5dfd6; }

@media (prefers-color-scheme: dark) {
  .sticker {
    background: color-mix(in srgb, var(--aisle) 22%, var(--paper));
    box-shadow: none;
  }
}

.item--done .sticker {
  filter: grayscale(1) opacity(0.5);
  transform: rotate(-14deg) scale(0.9);
}

.item__title {
  position: relative;
  overflow-wrap: anywhere;
  font-weight: 500;
  transition: color 0.2s;
}

.item--done .item__title {
  color: var(--muted);
}

/* Hand-drawn strike-through that draws itself on check */
.scribble {
  position: absolute;
  top: 50%;
  left: -3px;
  width: calc(100% + 6px);
  height: 12px;
  overflow: visible;
  transform: translateY(-45%);
  pointer-events: none;
}

.scribble path {
  fill: none;
  stroke: var(--tomato);
  stroke-width: 2.6;
  stroke-linecap: round;
  vector-effect: non-scaling-stroke;
  /* dash longer than any title, in screen px (non-scaling-stroke) */
  stroke-dasharray: 1200;
  stroke-dashoffset: 1200;
  transition: stroke-dashoffset 0.6s ease-out;
}

.item--done .scribble path {
  stroke-dashoffset: 0;
}

.item__edit {
  flex: 1;
  margin: 8px 0 8px 12px;
  padding: 8px 10px;
}

.icon {
  display: grid;
  flex: none;
  place-items: center;
  width: 38px;
  height: 38px;
  border: none;
  border-radius: 10px;
  background: none;
  color: var(--muted);
}

.icon svg {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

@media (hover: hover) {
  .icon {
    opacity: 0;
  }

  .item:hover .icon,
  .icon:focus-visible {
    opacity: 1;
  }

  .icon:hover {
    background: var(--kraft-soft);
    color: var(--ink);
  }
}

.empty {
  margin: 36px 8px;
  color: var(--muted);
  font-size: 19px;
  text-align: center;
  text-wrap: balance;
}

/* ---------- Pad footer ---------- */

.pad__foot {
  display: grid;
  gap: 14px;
  margin-top: auto;
  padding-top: 22px;
}

.filters {
  display: flex;
  gap: 4px;
  padding: 4px;
  border-radius: 999px;
  background: var(--kraft-soft);
}

.filters a {
  flex: 1;
  padding: 8px 6px;
  border-radius: 999px;
  color: var(--muted);
  font-size: 15px;
  font-weight: 600;
  text-align: center;
  text-decoration: none;
}

.filters a.selected {
  background: var(--ink);
  color: var(--paper);
}

.pad__actions {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.link {
  padding: 4px 0;
  border: none;
  background: none;
  color: var(--tomato-ink);
  font-size: 15px;
  font-weight: 700;
}

.link--quiet {
  margin-left: auto;
  color: var(--muted);
  font-weight: 500;
}

/* ---------- Toast ---------- */

.toast {
  position: fixed;
  bottom: max(18px, env(safe-area-inset-bottom));
  left: 50%;
  z-index: 10;
  max-width: min(520px, calc(100% - 28px));
  margin: 0;
  padding: 11px 16px;
  border-radius: 12px;
  background: var(--ink);
  color: var(--paper);
  font-size: 15px;
  font-weight: 600;
  opacity: 0;
  transform: translate(-50%, 12px);
  transition:
    opacity 0.2s,
    transform 0.2s;
  pointer-events: none;
}

.toast--on {
  opacity: 1;
  transform: translate(-50%, 0);
}

/* ---------- Last-item celebration ---------- */

.burst {
  position: fixed;
  inset: 0;
  z-index: 15;
  overflow: hidden;
  pointer-events: none;
}

.burst span {
  position: absolute;
  bottom: -40px;
  left: var(--x);
  font-size: 30px;
  animation: float-up 1.6s cubic-bezier(0.2, 0.7, 0.3, 1) var(--d) forwards;
  opacity: 0;
}

@keyframes float-up {
  0% {
    opacity: 1;
    transform: translateY(0) rotate(0);
  }
  100% {
    opacity: 0;
    transform: translateY(-85vh) rotate(var(--r));
  }
}

@keyframes blink {
  to {
    opacity: 0.35;
  }
}

@media (prefers-reduced-motion: reduce) {
  .burst {
    display: none;
  }

  .sticker,
  .scribble path {
    transition: none;
  }
}
</style>
