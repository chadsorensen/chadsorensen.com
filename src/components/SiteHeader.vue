<script setup lang="ts">
import { sections } from '@/data/sections'
import { useActiveSection } from '@/composables/useActiveSection'

const active = useActiveSection(sections)

const nav = [
  { id: 'work', label: 'Work' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
] as const
</script>

<template>
  <header class="header">
    <a href="#top" class="brand">
      <span class="brand__mark" aria-hidden="true">cs</span>
      Chad Sorensen
    </a>
    <nav aria-label="Sections">
      <ul class="nav">
        <li v-for="item in nav" :key="item.id">
          <a
            :href="`#${item.id}`"
            class="nav__link"
            :class="{ 'is-active': active === item.id, 'is-cta': item.id === 'contact' }"
            :aria-current="active === item.id ? 'location' : undefined"
          >
            {{ item.label }}
          </a>
        </li>
      </ul>
    </nav>
  </header>
</template>

<style scoped>
.header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 8px 4px 16px;
  font-family: var(--font-mono);
  font-size: 0.8125rem;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
}

.brand__mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: var(--accent);
  color: var(--on-accent);
  font-weight: 500;
}

.nav {
  display: flex;
  gap: 4px;
  padding: 4px;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: var(--surface);
}

.nav__link {
  display: block;
  padding: 10px 16px;
  border-radius: 999px;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.nav__link:hover,
.nav__link.is-active {
  background: var(--surface-2);
}

.nav__link.is-cta {
  background: var(--text);
  color: var(--bg);
}

.nav__link.is-cta:hover,
.nav__link.is-cta.is-active {
  background: var(--accent);
  color: var(--on-accent);
}
</style>
