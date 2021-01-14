// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import BootstrapVue from 'bootstrap-vue'
import * as factory from './utils/factory'
import VueI18n from 'vue-i18n'
import zh from 'src/lang/zh'
import Api from './api/config'
import socket from './api/socket'
// import socket from './api/socket'
import axios from './http'
import VueClipboard from 'vue-clipboard2'
// import io from 'socket.io-client'
import ElementUI from 'element-ui'
import config from '@/config'

import Bus from 'src/bus'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(BootstrapVue)
Vue.use(ElementUI)
Vue.use(VueI18n)
Vue.use(VueClipboard)
// set lang
const i18n = new VueI18n({
  locale: 'CN', // 语言标识
  messages: {
    'CN': zh, // 中文语言包
    'EN': {} // 英文语言包
  }
})

Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.api = Vue.prototype.$api = Api
// Vue.prototype.$socket = socket
Vue.factory = Vue.prototype.$factory = factory
Vue.prototype.$L = window.L
Vue.prototype.$bus = Bus
Vue.prototype.$socket = socket
Vue.prototype.$config = config

Vue.filter('parseJson', function (content) {
  let retVal = []
  try {
    retVal = JSON.parse(content)
  } catch (e) {
    // console.log(e)
  }
  return retVal
})
/* eslint-disable no-new */
new Vue({
  i18n,
  router,
  render: h => h(App)
}).$mount('#app')
// new Vue({
//   el: '#app',
//   i18n,
//   router,
//   components: { App },
//   template: '<App/>'
// })
