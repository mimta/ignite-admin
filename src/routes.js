import Vue from 'vue'
import Router from 'vue-router'
import EventBus, { Event } from './utils/EventBus'
import App from './App.vue'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: App,
      children: [
        {
          path: '',
          name: 'index',
          component: () => import('./views/Index'),
        },
        {
          path: 'about',
          name: 'about',
          component: () => import('./views/About'),
        },
        {
          path: 'code',
          name: 'code',
          component: () => import('./views/Code'),
        },
        {
          path: 'status',
          name: 'status',
          component: () => import('./views/Status'),
        },
      ],
    },
  ],
})

router.afterEach((to, from) => {
  EventBus.$emit(Event.ROUTE_CHANGE, to.name)
})

export default router
