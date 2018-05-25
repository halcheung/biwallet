// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import MuseUI from 'muse-ui'
import 'muse-ui/dist/muse-ui.css'
import 'muse-ui/dist/theme-dark.css'
import router from './router'
import global from './components/global'
import bus_ from './assets/eventBus'

Vue.config.productionTip = false
Vue.use(MuseUI)
Vue.prototype._G = global
Vue.prototype._BUS = bus_

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
