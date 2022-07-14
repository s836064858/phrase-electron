import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
/* axios异步请求 */
import axios from './api/axios'
Vue.prototype.$axios = axios

Vue.config.productionTip = false

Vue.use(ElementUI)

new Vue({
  router,
  render: (h) => h(App)
}).$mount('#app')
