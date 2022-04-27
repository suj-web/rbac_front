import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'font-awesome/css/font-awesome.css'
import {postRequest} from "./network/api";
import {postRequest2} from "./network/api";
import {putRequest} from "./network/api"
import {getRequest} from "./network/api";
import {deleteRequest} from "./network/api";
import {initMenu} from "@/network/menu";
import {downloadRequest} from "@/network/api";
import moment from 'vue-moment';
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import iconPicker from 'vue-fontawesome-elementui-icon-picker';
import * as echarts from "echarts";
import Plugin from 'v-fit-columns';

Vue.config.productionTip = false

Vue.use(ElementUI,{size: 'small'})
Vue.use(moment);//格式化时间
Vue.use(mavonEditor);//注册富文本框
Vue.use(iconPicker);//注册图标选择器
Vue.use(Plugin);//el-table-column宽带自适应

Vue.prototype.$postRequest = postRequest;
Vue.prototype.$postRequest2 = postRequest2;
Vue.prototype.$getRequest = getRequest;
Vue.prototype.$putRequest = putRequest;
Vue.prototype.$deleteRequest = deleteRequest;
Vue.prototype.$downloadRequest = downloadRequest;
Vue.prototype.$echarts = echarts;

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
