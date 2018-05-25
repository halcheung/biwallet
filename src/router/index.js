import Vue from 'vue'
import Router from 'vue-router'
import Start from '@/components/Start'
import MineMachines from '@/components/MineMachines'
import Wallet from '@/components/Wallet'

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
    },
    {
      path: '/Wallet',
      name: 'Wallet',
      component: Wallet
    }
  ]
})
