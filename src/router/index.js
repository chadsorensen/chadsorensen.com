import Vue from 'vue'
import Router from 'vue-router'
import Home from '../components/Home'
import KsVueScrollmagic from 'ks-vue-scrollmagic'
require('../assets/js/modernizr-custom.js')
require('../assets/js/application.js')

Vue.use(Router)
Vue.use(KsVueScrollmagic)

export default new Router({
  mode: "history",
  routes: [
    {
      path: '/',
      component: Home
    }
  ]
})
