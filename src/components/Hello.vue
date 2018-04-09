<template>
  <section id="hello" class="cd-index cd-main-content" :class="active">
    <div class="scroll-hide-wrapper">
      <div class="scroll-hide-container">
        <h1 class="animate-left">Hello, I'm Chad</h1>
        <h2 class="animate-right">I'm a frontend developer in Portland, Oregon</h2>
        <a class="animate-up cd-btn" href="#work">View Work</a>
        <a class="animate-up2 cd-btn" href="#about">About Me</a>
        <a class="animate-up3 cd-btn" href="#contact">Contact Me</a>
      </div>
    </div>
  </section>    
</template>

<script>
  var $ = require("jquery");
  export default {
    data () {
      return {
        active: false
      }
    },
    methods: {
      loadHello: function () {
        window.setTimeout(
          this.active = true, 
          2000
        );
      }
    },
    mounted () {
      this.$nextTick(this.loadHello)
    }
  }
</script>
