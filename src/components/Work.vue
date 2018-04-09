<template>
  <section id="work" class="cd-work cd-template cd-main-content">
    <h2 class="ribbon">These are some things I've done</h2>
    <div>
      <div class="wrapper">
        <div v-for="work in works" class="item animate-up" :class="work.animateUp">
          <figure class="effect-honey">
            <img :src="loadImg(work.image)" alt="">
            <figcaption>
              <h2>{{ work.title }}</h2>
              <p>{{ work.skills }}</p>
              <a target="_blank" :href="work.url"></a>
            </figcaption>
          </figure>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  var works = require('../assets/api/works.json')
  export default {
    data () {
      return {
        works
      }
    },
    methods: {
      loadImg: function (image) {
         return require("../assets/img/"+image);
      },
      scrollMagic: function() {
        var controller = new this.$scrollmagic.Controller;
        new this.$scrollmagic.Scene({
          triggerElement: '#work'
        }).setClassToggle('#work', 'active').addTo(controller);
      }
    },
    mounted () {
      this.$nextTick(this.scrollMagic)
    }
  }
</script>
