<template>
  <div id="app">
    <app-nav></app-nav>
    <router-view/>
    <app-footer></app-footer>
  </div>
</template>

<script>
import Navigation from './components/Nav'
import Footer from './components/Footer'
export default {
  components: {
    'app-nav': Navigation,
    'app-footer': Footer
  },
  data () {
    return {
    }
  }
}
</script>

<style lang="scss">
   @import 'assets/scss/application.scss'
</style>
