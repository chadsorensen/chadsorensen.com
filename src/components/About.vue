<template>
  <section id="about" class="">
    <h2 class="ribbon">I currently spend time contracting</h2>
    <div class="image-holder">
      <img :src="aboutImage" alt="">
    </div>
    <div class="inner-wrap">
      <div class="col-6">
        <h3>Who I am</h3>
        <p>As a native Oregonian, I love being outside: be it on the mountain, in the woods or in the ocean. As a Portlander, I love being inside: be it playing pinball, rolling bowling balls or watching Star Wars with my {{ calculateAge(2016,11,23) }} year old son and {{ calculateAge(2012,5,20) }} year old daughter.</p>
      </div>
      <div class="col-6">
        <h3>What I do</h3>
        <p>As a frontend developer, I love being in code: be it writing semantic markup, lean styles or modular scripts. I work well when paired with a backend developer and am comfortable in a wide array of environments. Lately, I have been digging Vue and CraftCMS.</p>
      </div>
    </div>
  </section>
</template>

<script>
  var aboutImage = require("../assets/img/me2.jpg")
  var $ = require("jquery");
  export default {
    data () {
      return {
        aboutImage: aboutImage,
      }
    },
    methods: {
      calculateAge: function(birthYear, birthMonth, birthDay) {
        let today = new Date()
        let year = today.getFullYear()
        let month = today.getMonth()
        let day = today.getDay()
        year = (month <= birthMonth && day <= birthDay) ? year - 1 : year;
        return year - birthYear;
      }
    },
  }
</script>
