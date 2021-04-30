<template>
  <main>
    <app-hello></app-hello>
    <app-work></app-work>
    <app-about></app-about>
  </main>
</template>
<script>
  import Hello from '../components/Hello'
  import Work from '../components/Work'
  import About from '../components/About'
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
