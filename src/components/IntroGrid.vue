<script setup lang="ts">
import { email, stackGroups } from '@/data/profile'
import { useLocalTime } from '@/composables/useLocalTime'

const { time, zone } = useLocalTime('America/Los_Angeles')
</script>

<template>
  <section id="top" class="intro" aria-label="Introduction">
    <div class="tile hero">
      <p class="label">Frontend Engineer · Portland, Oregon</p>
      <h1 class="hero__title">Interfaces that feel <span class="hero__accent">obvious</span>, built to last.</h1>
      <p class="hero__lede">
        Independent frontend engineer. Fifteen-plus years of component systems, mobile apps and
        the APIs that hold them together.
      </p>
    </div>

    <div class="tile tile--accent">
      <p class="label status"><span class="status__dot" aria-hidden="true" />Status</p>
      <p class="big">Taking on contract work</p>
    </div>

    <div class="tile">
      <p class="label">Portland, OR</p>
      <p class="clock">
        <span class="clock__time">{{ time }}</span>
        <span class="label">{{ zone }} · local time</span>
      </p>
    </div>

    <div class="tile">
      <p class="label">Contracting since</p>
      <p class="year">2011</p>
    </div>

    <a class="tile tile--light" :href="`mailto:${email}`">
      <span class="label">Contact</span>
      <span class="big cta">
        Get in touch
        <svg aria-hidden="true" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M7 17L17 7M9 7h8v8" />
        </svg>
      </span>
    </a>

    <div class="tile tools">
      <h2 class="label">Tools</h2>
      <div class="tools__groups">
        <div v-for="group in stackGroups" :key="group.label" class="tools__group">
          <h3 class="tools__heading">{{ group.label }}</h3>
          <ul class="chips">
            <li v-for="item in group.items" :key="item" class="chip">{{ item }}</li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.intro {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  grid-auto-rows: minmax(200px, auto);
  gap: var(--gap);
}

.hero {
  grid-column: span 2;
  grid-row: span 2;
  gap: 40px;
  padding: 40px;
}

.hero__title {
  font-size: clamp(2.75rem, 5.2vw, 4.75rem);
  font-weight: 500;
  line-height: 0.98;
  letter-spacing: -0.04em;
}

.hero__accent {
  color: var(--accent);
}

.hero__lede {
  max-width: 30rem;
  color: var(--text-2);
  font-size: 1.0625rem;
}

.status {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
}

.big {
  font-size: 1.875rem;
  font-weight: 500;
  line-height: 1.05;
  letter-spacing: -0.02em;
}

.clock {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.clock__time {
  font-size: 2.75rem;
  font-weight: 500;
  letter-spacing: -0.03em;
  font-variant-numeric: tabular-nums;
  line-height: 1.1;
}

.year {
  font-size: 4.5rem;
  font-weight: 500;
  letter-spacing: -0.05em;
  line-height: 0.9;
}

.cta {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 12px;
  font-size: 1.625rem;
}

.cta svg {
  flex: none;
  transition: transform 0.2s ease;
}

.tile--light:hover .cta svg {
  transform: translate(3px, -3px);
}

.tools {
  grid-column: 1 / -1;
  justify-content: flex-start;
  gap: 22px;
}

.tools__groups {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
}

.tools__group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.tools__heading {
  font-size: 1.0625rem;
  font-weight: 500;
}

@media (max-width: 760px) {
  .intro {
    grid-auto-rows: auto;
  }

  .tile {
    min-height: 150px;
  }

  .hero {
    grid-column: auto;
    grid-row: auto;
    padding: 28px;
  }
}
</style>
