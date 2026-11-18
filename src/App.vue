<script setup lang="ts">
import SiteHeader from './components/SiteHeader.vue'
import IntroGrid from './components/IntroGrid.vue'
import WorkSection from './components/WorkSection.vue'
import AboutSection from './components/AboutSection.vue'
import ContactSection from './components/ContactSection.vue'
</script>

<template>
  <div class="page">
    <SiteHeader />
    <main>
      <IntroGrid />
      <WorkSection />
      <AboutSection />
    </main>
    <ContactSection />
  </div>
</template>
