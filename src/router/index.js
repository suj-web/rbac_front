import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Login',
    component: () => import("../views/Login"),
    hidden: true
  },
  {
    path: '/error',
    name: 'Error',
    component: () => import('../views/Error'),
    hidden: true
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('../views/Home'),
    children: [
      {
        path: '/chat',
        name: '在线聊天',
        component: () => import('../views/chat/FriendChat')
      },
      {
        path: '/userinfo',
        name: '个人中心',
        component: () => import('../views/AdminInfo')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

//push
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

//replace
const originalReplace = VueRouter.prototype.replace
VueRouter.prototype.replace = function replace (location, onResolve, onReject) {
  return originalReplace.call(this, location).catch(err => err)
}

export default router
