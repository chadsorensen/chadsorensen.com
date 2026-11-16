<script setup lang="ts">
import { works } from '@/data/works'
</script>

<template>
  <section id="work" class="panel work">
    <h2 class="ribbon">These are some things I've done</h2>
    <ul class="work__grid">
      <li v-for="work in works" :key="work.title">
        <a class="card" :href="work.url" target="_blank" rel="noopener">
          <figure>
            <img :src="work.image" width="500" height="500" alt="" loading="lazy" decoding="async" />
            <figcaption>
              <h3>{{ work.title }}<span class="visually-hidden"> (opens in a new tab)</span></h3>
              <p>{{ work.skills.join(', ') }}</p>
            </figcaption>
          </figure>
        </a>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.work {
  background: var(--color-white);
}

.work__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  margin: 0;
  padding: 0;
  list-style: none;
}

@media (min-width: 1280px) {
  .work__grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.card {
  display: block;
  height: 100%;
}

figure {
  position: relative;
  height: 100%;
  margin: 0;
  overflow: hidden;
  background: #000;
}

img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.35s;
}

figcaption {
  position: absolute;
  inset: 0;
  padding: 2em;
  color: var(--color-white);
  font-size: 1.25em;
  text-transform: uppercase;
  pointer-events: none;
}

/* White bar that slides up along the bottom edge */
figcaption::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 10px;
  background: var(--color-white);
  transform: translateY(10px);
}

h3,
p {
  position: absolute;
  left: 0;
  width: 100%;
  margin: 0;
  color: var(--color-white);
  text-align: left;
  opacity: 0;
}

h3 {
  top: 5%;
  padding: 1em 0.75em;
  font-size: 3rem;
  font-weight: 400;
  word-spacing: -0.15em;
  transform: translateY(-30px);
}

p {
  top: 20%;
  max-width: none;
  padding: 1em 1.75em;
  font-size: 68.5%;
  letter-spacing: 1px;
  transform: translateY(30px);
}

figcaption::before,
h3,
p {
  transition:
    transform 0.35s,
    opacity 0.35s;
}

.card:is(:hover, :focus-visible) img {
  opacity: 0.25;
}

.card:is(:hover, :focus-visible) figcaption::before,
.card:is(:hover, :focus-visible) :is(h3, p) {
  opacity: 1;
  transform: none;
}

.card:focus-visible {
  outline: 3px solid var(--color-green);
  outline-offset: -3px;
}
</style>
