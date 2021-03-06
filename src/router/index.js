// 引入vue
import Vue from 'vue'
// 引入vue-router
import VueRouter from 'vue-router'

// 引入登陆组件
import Login from '@/views/login.vue'
import Home from '@/views/home.vue'
import Welcome from '@/views/welcome.vue'
import Users from '@/views/users/user.vue'
import Rights from '@/views/right/rights.vue'
import Roles from '@/views/right/roles.vue'
// 使用
Vue.use(VueRouter)
// 创建路由对象
var router = new VueRouter({
  routes: [
    { name: 'default',
      path: '/',
      redirect: { name: 'login' }
    },
    {
      name: 'login',
      path: '/login',
      component: Login
    },

    {
      name: 'home',
      path: '/home',
      component: Home,
      redirect: { name: 'welcome' },
      children: [
        {
          name: 'welcome',
          path: '/welcome',
          component: Welcome
        },
        {
          name: 'users',
          path: 'users',
          component: Users
        },
        {
          name: 'rights',
          path: 'rights',
          component: Rights
        },
        {
          name: 'roles',
          path: 'roles',
          component: Roles
        }
      ]
    }

  ]
})

// 暴露路由
export default router
