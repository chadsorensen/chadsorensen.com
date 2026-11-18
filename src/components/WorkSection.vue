<script setup lang="ts">
import { clientWork, engagements, sideProjects } from '@/data/works'

const pad = (n: number) => String(n).padStart(2, '0')
</script>

<template>
  <div id="work">
    <section class="section" aria-labelledby="engagements-h">
      <div class="section-head">
        <h2 id="engagements-h" class="section-title">
          Featured engagements <span class="count">({{ pad(engagements.length) }})</span>
        </h2>
        <p class="label">Private platforms · details on request</p>
      </div>
      <ul class="engagements">
        <li v-for="e in engagements" :key="e.name">
          <article class="engagement">
            <div class="browser">
              <div class="browser__bar">
                <span class="browser__dot" aria-hidden="true" />
                <span class="browser__dot" aria-hidden="true" />
                <span class="browser__dot" aria-hidden="true" />
                <span class="browser__url">{{ e.domain }}</span>
              </div>
              <img :src="e.image" :alt="`${e.name} homepage`" width="800" height="470" loading="lazy" decoding="async" />
            </div>
            <div class="engagement__body">
              <div class="engagement__head">
                <div>
                  <h3 class="engagement__name">{{ e.name }}</h3>
                  <p class="engagement__what">{{ e.what }}</p>
                </div>
                <span v-if="e.via" class="pill">{{ e.via }}</span>
              </div>
              <p class="engagement__summary">{{ e.summary }}</p>
              <div class="engagement__foot">
                <p class="label">{{ e.role }}</p>
                <ul class="chips">
                  <li v-for="s in e.stack" :key="s" class="chip chip--sm">{{ s }}</li>
                </ul>
              </div>
            </div>
          </article>
        </li>
      </ul>
    </section>

    <section class="section section--tight" aria-labelledby="clients-h">
      <div class="section-head">
        <h2 id="clients-h" class="section-title section-title--sm">
          Client work <span class="count">({{ pad(clientWork.length) }})</span>
        </h2>
        <p class="label">Brands and agencies, 2011 onward</p>
      </div>
      <ul class="cards">
        <li v-for="(w, i) in clientWork" :key="w.title">
          <a class="card" :href="w.url" target="_blank" rel="noopener">
            <div class="card__image zoom">
              <img :src="w.image" alt="" width="500" height="375" loading="lazy" decoding="async" />
            </div>
            <div class="card__caption">
              <h3 class="card__title">
                {{ w.title }}<span class="visually-hidden"> (opens in a new tab)</span>
              </h3>
              <span class="label">{{ pad(i + 1) }}</span>
            </div>
          </a>
        </li>
      </ul>
    </section>

    <section class="section section--tight" aria-labelledby="side-h">
      <div class="section-head">
        <h2 id="side-h" class="section-title section-title--sm">
          Independent projects <span class="count">({{ pad(sideProjects.length) }})</span>
        </h2>
        <p class="label">Pro-bono and personal builds on a modern stack</p>
      </div>
      <ul class="side">
        <li v-for="w in sideProjects" :key="w.title">
          <a class="side__item" :href="w.url" target="_blank" rel="noopener">
            <div class="side__thumb zoom">
              <img :src="w.image" alt="" width="88" height="88" loading="lazy" decoding="async" />
            </div>
            <div class="side__text">
              <h3 class="side__title">
                {{ w.title }}<span class="visually-hidden"> (opens in a new tab)</span>
              </h3>
              <p class="label">{{ w.stack?.join(' · ') }}</p>
            </div>
          </a>
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.section--tight {
  padding-top: 56px;
}

/* Featured engagements */

.engagements {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 380px), 1fr));
  gap: var(--gap);
}

.engagement {
  display: flex;
  flex-direction: column;
  gap: 28px;
  height: 100%;
  padding: 14px 14px 32px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--surface);
}

.browser {
  overflow: hidden;
  border: 1px solid var(--border);
  border-radius: 14px;
  background: var(--bg);
}

.browser__bar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 12px;
  background: var(--surface-2);
}

.browser__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #4a4a44;
}

.browser__url {
  margin-left: 10px;
  color: var(--muted);
  font-family: var(--font-mono);
  font-size: 0.6875rem;
}

.browser img {
  width: 100%;
  height: auto;
  aspect-ratio: 800 / 470;
  object-fit: cover;
  object-position: top;
}

.engagement__body {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  gap: 28px;
  padding: 0 22px;
}

.engagement__head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}

.engagement__name {
  font-size: 2.375rem;
  font-weight: 500;
  letter-spacing: -0.04em;
  line-height: 1;
}

.engagement__what {
  margin-top: 8px;
  color: var(--text-2);
}

.pill {
  padding: 5px 12px;
  border-radius: 999px;
  background: var(--accent);
  color: var(--on-accent);
  font-family: var(--font-mono);
  font-size: 0.75rem;
  white-space: nowrap;
}

.engagement__summary {
  flex-grow: 1;
  font-size: 1.0625rem;
}

.engagement__foot {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-top: 20px;
  border-top: 1px solid var(--border);
}

.chip--sm {
  padding: 6px 12px;
  font-size: 0.875rem;
}

/* Client work */

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 340px), 1fr));
  gap: var(--gap);
}

.card {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--surface);
  transition: border-color 0.2s ease;
}

.card:hover {
  border-color: #5a5a52;
}

.card__image {
  aspect-ratio: 4 / 3;
}

.card__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card__caption {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 20px 22px 22px;
}

.card__title {
  font-size: 1.25rem;
  font-weight: 500;
  letter-spacing: -0.02em;
}

/* Independent projects */

.side {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: var(--gap);
}

.side__item {
  display: flex;
  align-items: center;
  gap: 18px;
  height: 100%;
  padding: 12px;
  border: 1px solid var(--border);
  border-radius: 20px;
  background: var(--surface);
  transition: border-color 0.2s ease;
}

.side__item:hover {
  border-color: #5a5a52;
}

.side__thumb {
  flex: none;
  width: 88px;
  height: 88px;
  border-radius: 12px;
}

.side__thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.side__text {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.side__title {
  font-size: 1.1875rem;
  font-weight: 500;
  letter-spacing: -0.02em;
}

@media (max-width: 760px) {
  .section-title {
    font-size: 2rem;
  }

  .engagement__body {
    padding: 0 8px;
  }
}
</style>
