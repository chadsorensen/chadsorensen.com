<script setup lang="ts">
import { onMounted, ref } from 'vue'

const active = ref(false)

// Wait two frames so the initial (hidden) state paints before animating in.
onMounted(() => requestAnimationFrame(() => requestAnimationFrame(() => (active.value = true))))

const links = [
  { href: '#work', label: 'View Work', delay: '1s' },
  { href: '#about', label: 'About Me', delay: '1.3s' },
  { href: '#contact', label: 'Contact Me', delay: '1.5s' },
]
</script>

<template>
  <section id="hello" class="hello" :class="{ 'is-active': active }">
    <div class="hello__content">
      <div>
        <h1 class="reveal-left" style="--delay: 0.5s">Hello, I'm Chad</h1>
        <h2 class="reveal-right" style="--delay: 0.8s">I'm a frontend developer in Portland, Oregon</h2>
        <a
          v-for="link in links"
          :key="link.href"
          class="btn reveal-up"
          :style="{ '--delay': link.delay }"
          :href="link.href"
        >
          {{ link.label }}
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hello {
  position: relative;
  z-index: 0;
  height: 100vh;
  height: 100svh;
  overflow: hidden;
  background-color: var(--color-green);
}

/* Pinned behind the page so the following sections slide up over it */
.hello__content {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 1rem;
  text-align: center;
}

h1,
h2 {
  color: var(--color-white);
}

h2 {
  margin-bottom: 2em;
  font-size: 1.6rem;
}

.btn {
  display: block;
  width: 90%;
  max-width: 320px;
  margin: 0 auto 2em;
  padding: 1.4em 1.6em;
  border: 1px solid;
  background-color: transparent;
  color: var(--color-white);
  font-size: 1.3rem;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  transition:
    transform 0.7s ease var(--delay, 0s),
    opacity 0.7s ease var(--delay, 0s),
    background-color 0.3s ease,
    border-color 0.3s ease,
    color 0.3s ease;
}

.btn:focus-visible {
  outline: 2px solid var(--color-white);
  outline-offset: 3px;
}

@media (hover: hover) {
  .btn:hover {
    border-color: var(--color-white);
    background-color: var(--color-white);
    color: var(--color-green);
  }
}

@media (min-width: 768px) {
  h2 {
    font-size: 2.2rem;
  }

  .btn {
    display: inline-block;
    width: auto;
    margin-right: 1em;
  }
}
</style>
