<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { sections } from '@/data/sections'
import { useActiveSection } from '@/composables/useActiveSection'

const active = useActiveSection(sections)
const open = ref(false)

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') open.value = false
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <nav id="site-nav" class="nav" :class="{ open }" aria-label="Sections">
    <ul>
      <li v-for="id in sections" :key="id">
        <a
          :href="`#${id}`"
          :class="{ active: active === id }"
          :aria-current="active === id ? 'location' : undefined"
          @click="open = false"
        >
          <span class="nav__label">{{ id }}</span>
        </a>
      </li>
    </ul>
  </nav>
  <button
    type="button"
    class="nav-trigger"
    :class="{ open }"
    aria-controls="site-nav"
    :aria-expanded="open"
    @click="open = !open"
  >
    <span class="visually-hidden">{{ open ? 'Close' : 'Open' }} navigation</span>
    <span class="nav-trigger__dots" aria-hidden="true" />
  </button>
</template>

<style scoped>
/* ---------- Small screens: floating menu + trigger ---------- */

.nav {
  position: fixed;
  z-index: 100;
  right: 5%;
  bottom: 30px;
  width: 90%;
  max-width: 400px;
  max-height: 90%;
  overflow-y: auto;
  border-radius: 0.25em;
  background-color: rgb(32 32 32 / 0.9);
  transform: scale(0);
  transform-origin: right bottom;
  visibility: hidden;
  transition:
    transform 0.2s,
    visibility 0s 0.2s;
}

.nav.open {
  transform: scale(1);
  visibility: visible;
  transition: transform 0.2s;
}

ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

a {
  display: block;
  padding: 1em;
  border-bottom: 1px solid rgb(255 255 255 / 0.1);
  color: var(--color-white);
  font-weight: 700;
  transition: color 0.3s;
}

a:hover,
a.active {
  color: var(--color-green);
}

.nav-trigger {
  position: fixed;
  z-index: 100;
  right: 5%;
  bottom: 30px;
  width: 44px;
  height: 44px;
  padding: 0;
  border: none;
  border-radius: 0.25em;
  background: rgb(255 255 255 / 0.9);
  cursor: pointer;
  appearance: none;
}

/* Three vertical dots that morph into an X */
.nav-trigger__dots,
.nav-trigger__dots::before,
.nav-trigger__dots::after {
  position: absolute;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: var(--color-green);
}

.nav-trigger__dots {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.nav-trigger__dots::before,
.nav-trigger__dots::after {
  content: '';
  left: 0;
}

.nav-trigger__dots::before {
  top: -9px;
}

.nav-trigger__dots::after {
  bottom: -9px;
}

.nav-trigger.open {
  background-color: transparent;
}

.nav-trigger.open .nav-trigger__dots {
  background-color: transparent;
}

.nav-trigger.open .nav-trigger__dots::before,
.nav-trigger.open .nav-trigger__dots::after {
  left: -8px;
  width: 20px;
  height: 3px;
  border-radius: 0;
}

.nav-trigger.open .nav-trigger__dots::before {
  top: 1px;
  transform: rotate(45deg);
}

.nav-trigger.open .nav-trigger__dots::after {
  bottom: 0;
  transform: rotate(135deg);
}

.nav-trigger:focus-visible {
  outline: 2px solid var(--color-green);
  outline-offset: 2px;
}

/* ---------- Medium+ screens: dot rail on the right edge ---------- */

@media (min-width: 768px) {
  .nav-trigger {
    display: none;
  }

  .nav {
    top: 0;
    right: 0;
    bottom: auto;
    display: flex;
    align-items: center;
    width: 90px;
    height: 100vh;
    max-width: none;
    max-height: none;
    overflow: visible;
    background-color: transparent;
    transform: none;
    visibility: visible;
  }

  /* Dark backdrop that slides in on hover */
  .nav::before {
    content: '';
    position: absolute;
    inset: 0;
    background: rgb(32 32 32 / 0.8);
    transform: translateX(100%);
    transition: transform 0.4s;
  }

  ul {
    position: relative;
    width: 100%;
    text-align: center;
  }

  a {
    position: relative;
    margin: 1.4em auto;
    padding: 3em 0 0;
    border-bottom: none;
    font-size: 1.2rem;
  }

  /* The dot */
  a::before {
    --offset: 0;
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: var(--color-white);
    transform: translateX(-50%) translateY(var(--offset)) scale(0.25);
    transition:
      transform 0.4s,
      background-color 0.3s;
  }

  /* At rest the dots huddle together near the middle */
  li:nth-of-type(1) a::before {
    --offset: 4.5em;
  }
  li:nth-of-type(2) a::before {
    --offset: 1.5em;
  }
  li:nth-of-type(3) a::before {
    --offset: -1.5em;
  }
  li:nth-of-type(4) a::before {
    --offset: -4.5em;
  }

  a.active::before {
    background-color: var(--color-green);
  }

  .nav__label {
    display: block;
    transform: translateX(100%);
    transition: transform 0.4s;
  }
}

/* Expanded rail: on hover for mouse users, always on touch devices */
@media (min-width: 768px) and (hover: hover) {
  .nav:is(:hover, :focus-within)::before {
    transform: none;
  }

  .nav:is(:hover, :focus-within) a::before {
    transform: translateX(-50%) scale(1);
  }

  a:hover::before {
    background-color: var(--color-green);
  }

  .nav:is(:hover, :focus-within) .nav__label {
    transform: none;
  }
}

@media (min-width: 768px) and (hover: none) {
  .nav::before {
    transform: none;
  }

  a::before {
    transform: translateX(-50%) scale(1);
  }

  .nav__label {
    transform: none;
  }
}
</style>
