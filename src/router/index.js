import Vue from 'vue'
import Router from 'vue-router'
import Home from '../views/Home'
require('../assets/js/modernizr-custom.js')
require('../assets/js/application.js')

Vue.use(Router)

export default new Router({
  mode: "history",
  routes: [
    {
      path: '/',
      component: Home
    }
  ]
})
