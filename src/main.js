import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'font-awesome/css/font-awesome.css'
import {postRequest} from "./network/api";
import {putRequest} from "./network/api"
import {getRequest} from "./network/api";
import {deleteRequest} from "./network/api";
import {initMenu} from "@/network/menu";
import {downloadRequest} from "@/network/download";
import moment from 'vue-moment';

Vue.use(moment);

Vue.config.productionTip = false

Vue.use(ElementUI,{size: 'small'})

Vue.prototype.$postRequest = postRequest;
Vue.prototype.$getRequest = getRequest;
Vue.prototype.$putRequest = putRequest;
Vue.prototype.$deleteRequest = deleteRequest;
Vue.prototype.$downloadRequest = downloadRequest;

router.beforeEach((to, from, next) => {
  if(window.sessionStorage.getItem('tokenStr')) {
    initMenu(router, store);
    if(to.path === '/') {//用户已登录,直接挑转到home页面
      next('/home');
    }
    if(from.path === '/chat') {
      store.commit('changeCurrentSession',null);
      next();
    }
    next();
  } else {
    if(to.path === '/' || to.path === '/error') {
      next();
    } else {
      next('/?redirect='+to.path);
    }
  }
})

new Vue({
  router,
  store,
  render: function (h) { return h(App) }
}).$mount('#app')
