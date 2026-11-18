<script setup lang="ts">
import { email, stackGroups } from '@/data/profile'
</script>

<template>
  <section id="top" class="intro" aria-label="Introduction">
    <div class="hero">
      <p class="label tagline">
        <span>Senior Frontend Engineer</span>
        <span>Portland, Oregon</span>
        <span>Shipping since 2011</span>
      </p>
      <h1 class="hero__title">Interfaces that feel <span class="hero__accent">obvious</span>, built to last.</h1>
      <p class="hero__lede">
        Fifteen-plus years of component systems, mobile apps and the APIs that hold them
        together.
      </p>
    </div>

    <div class="side">
      <div class="tile tile--accent">
        <p class="label status"><span class="status__dot" aria-hidden="true" />Available</p>
        <p class="big">Open to full-time &amp; contract roles</p>
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
    </div>

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
  grid-template-columns: minmax(0, 1fr) minmax(300px, 380px);
  gap: var(--gap) 48px;
}

/* Headline sits on the page itself, not in a tile */
.hero {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 32px;
  padding: 48px 4px;
}

.tagline {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 0;
}

.tagline span {
  white-space: nowrap;
}

.tagline span:not(:last-child)::after {
  content: '·';
  margin: 0 0.6em;
}

.hero__title {
  max-width: 11ch;
  font-size: clamp(3rem, 6.4vw, 6rem);
  font-weight: 500;
  line-height: 0.96;
  letter-spacing: -0.045em;
}

.hero__accent {
  color: var(--accent);
}

.hero__lede {
  max-width: 34rem;
  color: var(--text-2);
  font-size: 1.1875rem;
}

.side {
  display: grid;
  grid-template-rows: 1fr 1fr;
  gap: var(--gap);
}

.side .tile {
  min-height: 220px;
}

.status {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Green "available" light; the dark ring keeps it visible on the accent */
.status__dot {
  width: 10px;
  height: 10px;
  border: 2px solid var(--on-accent);
  border-radius: 50%;
  background: #22c55e;
}

.big {
  font-size: 1.875rem;
  font-weight: 500;
  line-height: 1.05;
  letter-spacing: -0.02em;
}

.cta {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 12px;
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
  margin-top: 40px;
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

@media (max-width: 860px) {
  .intro {
    grid-template-columns: minmax(0, 1fr);
  }

  .hero {
    padding: 32px 4px 16px;
  }

  .side {
    grid-template-rows: none;
  }

  .side .tile {
    min-height: 160px;
  }

  .tools {
    margin-top: 24px;
  }
}
</style>
