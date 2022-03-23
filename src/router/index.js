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
