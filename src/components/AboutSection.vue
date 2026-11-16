<script setup lang="ts">
import aboutImage from '@/assets/img/me2.jpg'

/** Whole years elapsed since the given date (month is 1-12). */
function yearsSince(year: number, month: number, day: number): number {
  const today = new Date()
  const hadBirthday =
    today.getMonth() + 1 > month || (today.getMonth() + 1 === month && today.getDate() >= day)
  return today.getFullYear() - year - (hadBirthday ? 0 : 1)
}

const daughterAge = yearsSince(2012, 6, 20)
const sonAge = yearsSince(2016, 11, 23)
</script>

<template>
  <section id="about" class="panel about">
    <h2 class="ribbon">I currently spend time contracting</h2>
    <img class="about__image" :src="aboutImage" alt="Chad Sorensen" loading="lazy" decoding="async" />
    <div class="inner-wrap about__columns">
      <div>
        <h3>Who I am</h3>
        <p>
          As a native Oregonian, I love being outside: be it on the mountain, in the woods or in the
          ocean. As a Portlander, I love being inside: be it playing pinball, rolling bowling balls
          or watching Star Wars with my {{ daughterAge }} year old daughter and chasing my
          {{ sonAge }} year old son around the soccer field.
        </p>
      </div>
      <div>
        <h3>What I do</h3>
        <p>
          As a frontend developer, I love being in code: be it building component systems, shipping
          mobile apps or wiring up APIs. These days I spend most of my time in TypeScript across
          React, React Native and Vue. I've been contracting since 2011, so I'm just as comfortable
          dropping into an existing team as I am owning a project end to end.
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.about__image {
  width: 100%;
}

.about__columns {
  display: grid;
  gap: 2em;
  margin-block: 4em;
  padding-inline: 2em;
}

@media (min-width: 768px) {
  .about__columns {
    grid-template-columns: 1fr 1fr;
    gap: 4em;
    padding-inline: 0;
  }
}

h3 {
  margin: 0;
  color: var(--color-white);
  font-size: 3rem;
}

p {
  color: var(--color-white);
}
</style>
