// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
// import VueRouter from 'vue-router'
import router from './router'
import App from './App'
import { AlertPlugin, ToastPlugin, DatetimePlugin,WechatPlugin,LoadingPlugin,ConfirmPlugin  } from 'vux'
// import { DatetimePlugin,WechatPlugin } from 'vux'
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(VueAxios,axios)


Vue.use(AlertPlugin)
Vue.use(ToastPlugin)
Vue.use(LoadingPlugin)
Vue.use(DatetimePlugin)
Vue.use(WechatPlugin)
Vue.use(ConfirmPlugin)

// import Home from './components/HelloFromVux'

// Vue.use(router)

// const routes = [{
//   path: '/',
//   component: Home
// }]

// const router = new VueRouter({
//   routes
// })

FastClick.attach(document.body)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  router,
  render: h => h(App)
}).$mount('#app-box')
