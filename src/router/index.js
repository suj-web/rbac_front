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
      },
      {
        path: '/codeGenerator',
        name: '代码生成器',
        component: () => import('../views/CodeGenerator')
      },
      {
        path: '/online',
        name: '在线用户',
        component: () => import('../views/home/OnlineUser')
      },
      {
        path: '/contract',
        name: '合同到期',
        component: () => import('../views/home/ContractExpired')
      },
      {
        path: '/birthday',
        name: '员工生日',
        component: () => import('../views/home/EmpBirthday')
      },
      {
        path: '/conversion',
        name: '员工转正',
        component: () => import('../views/home/Conversion')
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
