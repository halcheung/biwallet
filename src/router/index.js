import Vue from 'vue'
import Router from 'vue-router'
import Start from '@/components/Start'
import MineMachines from '@/components/MineMachines'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Start',
      component: Start
    },
    {
      path: '/MineMachines',
      name: 'MineMachines',
      component: MineMachines
    }
  ]
})
