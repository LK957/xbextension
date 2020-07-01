import Vue from 'vue'
import Router from 'vue-router'
import Ordinary from './views/ordinary'
Vue.use(Router)
export default new Router({
  mode: 'history',
  routes: [
    /* {
      path: '/',
      //redirect: '/'
    }, */
    /* {
      path: '/choiceness',
      name: 'choiceness',
      meta: {
        keepAlive: true
      },
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('./views/choiceness')
    } */
  ]
})
