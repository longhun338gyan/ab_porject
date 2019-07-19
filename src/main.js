import Vue from 'vue'
import App from './App.vue'
// 引入element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 引入公共样式
import '@/styles/index.less'

// 引入路由
import router from '@/router/index.js'

Vue.config.productionTip = false
// 使用element-UI
Vue.use(ElementUI)
new Vue({
  // 注入
  router,
  render: h => h(App)
}).$mount('#app')
