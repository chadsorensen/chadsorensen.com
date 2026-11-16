<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { MAX_TITLE_LENGTH, type ShopperItem } from '../../shared/shopper'
import { useShopperList } from './useShopperList'

const {
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
} = useShopperList()

/* ---------- Filters (kept in the URL hash, like the original) ---------- */

const filters = ['active', 'all', 'done'] as const
type Filter = (typeof filters)[number]
const filterLabels: Record<Filter, string> = { active: 'To get', all: 'All', done: 'Got it' }

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
  if (!items.value.length) return 'The list is empty. Add something above.'
  if (filter.value === 'active') return 'Got everything. Nice.'
  if (filter.value === 'done') return 'Nothing checked off yet.'
  return ''
})

/* ---------- Adding ---------- */

const newTitle = ref('')
function submitNew() {
  if (add(newTitle.value)) newTitle.value = ''
}

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
      syncing: 'Syncing…',
      ready: 'Synced',
      offline: 'Offline. Changes may not save.',
    })[state.value],
)
</script>

<template>
  <div class="shopper">
    <header class="top">
      <h1>Shopper</h1>
      <p v-if="state !== 'locked'" class="status" :class="`status--${state}`" role="status">
        <span class="status__dot" aria-hidden="true" />{{ statusLabel }}
      </p>
    </header>

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
      <p v-if="wrongPassphrase" class="unlock__error" role="alert">That passphrase didn't work.</p>
      <button type="submit" class="primary">Open list</button>
    </form>

    <!-- List -->
    <template v-else>
      <form class="add" @submit.prevent="submitNew">
        <label for="new-item" class="visually-hidden">Add an item</label>
        <input
          id="new-item"
          v-model="newTitle"
          placeholder="What do we need?"
          autocomplete="off"
          autocapitalize="sentences"
          enterkeyhint="enter"
          :maxlength="MAX_TITLE_LENGTH"
          autofocus
        />
        <button type="submit" class="primary" :disabled="!newTitle.trim()">Add</button>
      </form>

      <ul v-if="visible.length" class="list">
        <li v-for="item in visible" :key="item.id" class="item" :class="{ 'item--done': item.done }">
          <template v-if="editingId === item.id">
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
              @click="toggle(item)"
              @dblclick.prevent="startEdit(item)"
            >
              <span class="item__check" aria-hidden="true" />
              <span class="item__title">{{ item.title }}</span>
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

      <footer class="bottom">
        <span class="count">{{ remaining }} {{ remaining === 1 ? 'item' : 'items' }} left</span>
        <nav class="filters" aria-label="Filter">
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
        <div class="bottom__actions">
          <button v-if="completed" type="button" class="link" @click="clearCompleted">
            Clear checked ({{ completed }})
          </button>
          <button type="button" class="link link--muted" @click="lock">Lock</button>
        </div>
      </footer>
    </template>
  </div>
</template>

<style>
:root {
  --green: #00cc93;
  --green-ink: #00805c;
  --bg: #f4f6f5;
  --card: #fff;
  --text: #1d2321;
  --muted: #6b7672;
  --line: #e3e8e6;
  color-scheme: light dark;
}

@media (prefers-color-scheme: dark) {
  :root {
    --green-ink: #3ee0b1;
    --bg: #111514;
    --card: #1a201e;
    --text: #e8eeec;
    --muted: #94a19c;
    --line: #2a3330;
  }
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
  font-family: 'Open Sans', system-ui, sans-serif;
  font-size: 16px;
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
.shopper {
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
  max-width: 560px;
  margin: 0 auto;
  padding: max(16px, env(safe-area-inset-top)) 16px max(16px, env(safe-area-inset-bottom));
}

/* ---------- Header ---------- */

.top {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}

h1 {
  margin: 0;
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.status {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0;
  color: var(--muted);
  font-size: 13px;
}

.status__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--green);
}

.status--syncing .status__dot {
  animation: pulse 1s ease-in-out infinite alternate;
}

.status--offline {
  color: #c2410c;
}

.status--offline .status__dot {
  background: #f97316;
}

@keyframes pulse {
  to {
    opacity: 0.3;
  }
}

/* ---------- Inputs & buttons ---------- */

input {
  width: 100%;
  min-width: 0;
  padding: 12px 14px;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: var(--card);
  outline: none;
}

input:focus-visible {
  border-color: var(--green);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--green) 25%, transparent);
}

.primary {
  flex: none;
  padding: 12px 18px;
  border: none;
  border-radius: 12px;
  background: var(--green);
  color: #fff;
  font-weight: 700;
}

.primary:disabled {
  opacity: 0.45;
  cursor: default;
}

.primary:focus-visible,
.icon:focus-visible,
.link:focus-visible,
.item__toggle:focus-visible,
.filters a:focus-visible {
  outline: 2px solid var(--green);
  outline-offset: 2px;
}

/* ---------- Unlock ---------- */

.unlock {
  display: grid;
  gap: 10px;
  margin-top: 15vh;
}

.unlock label {
  font-weight: 600;
}

.unlock__error {
  margin: 0;
  color: #dc2626;
  font-size: 14px;
}

/* ---------- Add ---------- */

.add {
  position: sticky;
  top: 0;
  z-index: 1;
  display: flex;
  gap: 8px;
  margin: 0 -16px 12px;
  padding: 8px 16px;
  background: var(--bg);
}

/* ---------- List ---------- */

.list {
  margin: 0;
  padding: 0;
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: 14px;
  background: var(--card);
  list-style: none;
}

.item {
  display: flex;
  align-items: center;
  min-height: 52px;
  padding-right: 4px;
}

.item + .item {
  border-top: 1px solid var(--line);
}

.item__toggle {
  display: flex;
  flex: 1;
  align-items: center;
  gap: 12px;
  min-width: 0;
  padding: 14px 8px 14px 14px;
  border: none;
  background: none;
  text-align: left;
}

.item__check {
  flex: none;
  width: 22px;
  height: 22px;
  border: 2px solid var(--line);
  border-radius: 50%;
  transition:
    background-color 0.15s,
    border-color 0.15s;
}

.item--done .item__check {
  border-color: var(--green);
  background: var(--green)
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='3.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M5 12.5l4.5 4.5L19 7.5'/%3E%3C/svg%3E")
    center / 14px no-repeat;
}

.item__title {
  overflow-wrap: anywhere;
  transition: color 0.15s;
}

.item--done .item__title {
  color: var(--muted);
  text-decoration: line-through;
}

.item__edit {
  margin: 6px 4px 6px 8px;
  padding: 8px 10px;
}

.icon {
  display: grid;
  flex: none;
  place-items: center;
  width: 40px;
  height: 40px;
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
    background: var(--bg);
    color: var(--text);
  }
}

.empty {
  margin: 32px 0;
  color: var(--muted);
  text-align: center;
}

/* ---------- Footer ---------- */

.bottom {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: auto;
  padding-top: 20px;
  color: var(--muted);
  font-size: 14px;
}

.filters {
  display: flex;
  gap: 4px;
}

.filters a {
  padding: 6px 10px;
  border-radius: 999px;
  color: inherit;
  text-decoration: none;
}

.filters a.selected {
  background: color-mix(in srgb, var(--green) 15%, transparent);
  color: var(--green-ink);
  font-weight: 600;
}

.bottom__actions {
  display: flex;
  gap: 12px;
  width: 100%;
  justify-content: space-between;
}

.link {
  padding: 4px 0;
  border: none;
  background: none;
  color: var(--green-ink);
  font-weight: 600;
}

.link--muted {
  margin-left: auto;
  color: var(--muted);
  font-weight: 400;
}
</style>
