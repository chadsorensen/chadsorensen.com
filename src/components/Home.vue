<template>
  <main>
    <app-hello></app-hello>
    <app-work></app-work>
    <app-about></app-about>
  </main>
</template>
<script>
  import Hello from './Hello'
  import Work from './Work'
  import About from './About'
  // var helloData = require('../assets/api/helloData.json')
  export default {
    data () {
      return {
      }
    },
    components: {
      'app-hello': Hello,
      'app-work': Work,
      'app-about': About
    }
  }
</script>
