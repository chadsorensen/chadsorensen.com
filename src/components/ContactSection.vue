<script setup lang="ts">
import { email, links } from '@/data/profile'

const year = new Date().getFullYear()
</script>

<template>
  <footer id="contact" class="section">
    <h2 class="visually-hidden">Contact</h2>
    <div class="contact">
      <a class="tile tile--accent contact__email" :href="`mailto:${email}`">
        <span class="label">Contact</span>
        <span class="contact__address">{{ email }}</span>
      </a>
      <a class="tile" :href="links.github" target="_blank" rel="noopener">
        <span class="label">GitHub</span>
        <span class="contact__handle">@chadsorensen ↗<span class="visually-hidden"> (opens in a new tab)</span></span>
      </a>
      <a class="tile" :href="links.linkedin" target="_blank" rel="noopener">
        <span class="label">LinkedIn</span>
        <span class="contact__handle">chadsorensen ↗<span class="visually-hidden"> (opens in a new tab)</span></span>
      </a>
    </div>
    <p class="label colophon">© {{ year }} Chad Sorensen · Portland, OR</p>
  </footer>
</template>

<style scoped>
.contact {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: var(--gap);
}

.contact .tile {
  transition: border-color 0.2s ease;
}

.contact .tile:not(.tile--accent):hover {
  border-color: #5a5a52;
}

.contact__email {
  grid-column: span 2;
  min-height: 240px;
  padding: 40px;
}

.contact__address {
  font-size: clamp(1.5rem, 2.6vw, 2.375rem);
  font-weight: 500;
  letter-spacing: -0.035em;
  overflow-wrap: anywhere;
}

.contact__handle {
  font-size: 1.625rem;
  font-weight: 500;
}

.colophon {
  padding: 8px 4px 0;
}

@media (max-width: 760px) {
  .contact__email {
    grid-column: auto;
    padding: 28px;
  }
}
</style>
