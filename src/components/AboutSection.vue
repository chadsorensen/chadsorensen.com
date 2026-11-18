<script setup lang="ts">
import portrait from '@/assets/img/chadsorensen.jpg'
</script>

<template>
  <section id="about" class="section about" aria-labelledby="about-h">
    <div class="about__photo">
      <img :src="portrait" alt="Chad bowling at a Portland alley" width="960" height="317" loading="lazy" decoding="async" />
    </div>
    <div class="tile about__text">
      <h2 id="about-h" class="label">About</h2>
      <p class="about__lead">
        I’m a frontend engineer who’s spent fifteen-plus years making the web feel right —
        component systems, mobile apps, and the APIs that hold them together.
      </p>
      <p class="about__body">
        I’ve worked across agencies, startups and contract teams since 2011, so I’m as comfortable
        dropping into an existing team as I am owning a project end to end. These days that’s mostly TypeScript across React, React Native
        and Vue.
      </p>
      <p class="about__body">
        Native Oregonian. Outside, that means the mountain, the woods or the coast. Inside, it
        means pinball, bowling, gymnastics with my daughter and soccer sidelines with my son.
      </p>
    </div>
  </section>
</template>

<style scoped>
.about {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 520px), 1fr));
  gap: var(--gap);
}

.about__photo {
  min-height: 320px;
  overflow: hidden;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--surface);
}

.about__photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(1);
}

.about__text {
  justify-content: flex-start;
  gap: 20px;
  padding: 36px;
}

.about__lead {
  font-size: 1.5rem;
  line-height: 1.3;
  letter-spacing: -0.015em;
}

.about__body {
  color: var(--text-2);
  line-height: 1.6;
}
</style>
