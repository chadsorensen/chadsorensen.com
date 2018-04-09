<template>
  <div>
    <nav class="cd-vertical-nav">
      <ul>
        <li v-for="navItem in navItems">
          <a :href="'#'+navItem.link" :title="navItem.link"><span class="label">{{ navItem.link }}</span></a>
        </li>
      </ul>
    </nav>

    <button class="cd-nav-trigger cd-image-replace">Open navigation<span aria-hidden="true"></span></button>    
  </div>
</template>

<script>
  var navItems = require('../assets/api/navigation.json')
  export default {
    data () {
      return {
        navItems
      }
    },
    methods: {

    }
  }
</script>
