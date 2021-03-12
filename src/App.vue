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
  @import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;700&display=swap');
  @import 'assets/scss/application.scss'
</style>
