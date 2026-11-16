<script setup lang="ts">
import SiteNav from './components/SiteNav.vue'
import HelloSection from './components/HelloSection.vue'
import WorkSection from './components/WorkSection.vue'
import AboutSection from './components/AboutSection.vue'
import ContactSection from './components/ContactSection.vue'
</script>

<template>
  <SiteNav />
  <main>
    <HelloSection />
    <WorkSection />
    <AboutSection />
  </main>
  <ContactSection />
</template>
