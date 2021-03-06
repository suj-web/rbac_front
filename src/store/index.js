import Vue from 'vue'
import Vuex from 'vuex'
import {getRequest} from "../network/api";
import {putRequest} from "../network/api";
import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
import {Notification} from "element-ui";

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    routes: [],
    actions: [],
    sessions: {},
    admins: [],
    currentAdmin: JSON.parse(window.sessionStorage.getItem('user')),
    currentSession: null,
    filterKey:'',
    stomp: null,
    isDot: {},
    message: "暂无公告"
  },
  mutations: {
    initRoutes(state, data){
      state.routes = data;
    },
    initActions(state, data) {
      state.actions = data;
    },
    initCircleSysMsgs(state, data) {
      state.message = data;
    },
    initAdmin(state,admin){
      state.currentAdmin = admin;
    },
    changeCurrentSession (state,currentSession) {
      state.currentSession = currentSession;
      if(currentSession) {
        // Vue.set(state.isDot,state.currentAdmin.username+'#'+state.currentSession.username,false);
        Vue.set(state.isDot, state.currentAdmin.username+'$'+state.currentSession.username, 0);
      }
    },
    addMessage (state,msg) {//{'zhangsan#lis:[{},{}]'}
      let mss = state.sessions[state.currentAdmin.username+'$'+msg.to];
      if(!mss){
        // state.sessions[state.currentAdmin.username+'#'+msg.to] = [];
        Vue.set(state.sessions,state.currentAdmin.username+'$'+msg.to,[]);
      }
      state.sessions[state.currentAdmin.username+'$'+msg.to].push({
        content:msg.content,
        date: new Date(),
        self: !msg.notSelf
      })

      if(msg.notSelf && state.currentSession.username === msg.to) {
        Vue.set(state.isDot, state.currentAdmin.username+'$'+state.currentSession.username, 0);
        putRequest('/chat/message/?chatObj='+state.currentAdmin.username+'$'+msg.to);
      }
    },
    INIT_DATA (state) {
      //浏览器本地的历史聊天记录
      // let data = localStorage.getItem('vue-chat-session');
      getRequest('/chat/contents').then(res=>{
        if (res) {
          state.sessions = res;
        }
      })
      //初始化未读信息数量
      getRequest('/chat/unread/count').then(res=>{
        if(res) {
          for(let key in res) {
            Vue.set(state.isDot, key, res[key]);
          }
        }
      })
    },
    INIT_ADMINS(state, data){
      state.admins = data;
    }
  },
  actions: {
    connect(context){
      context.state.stomp = Stomp.over(new SockJS('/ws/ep'));
      let token = window.sessionStorage.getItem('tokenStr');
      context.state.stomp.connect({'Auth-Token':token},success=>{
        context.state.stomp.subscribe('/user/queue/chat',msg=>{
          console.log('==============')
          let receiveMsg = JSON.parse(msg.body);

          if(!context.state.currentSession || receiveMsg.from !== context.state.currentSession.username){
            Notification.info({
              title: '【'+receiveMsg.fromNickName+'】发来一条消息',
              message: receiveMsg.content.length>0?receiveMsg.content.substr(0,10):receiveMsg.content,
              position: 'bottom-right'
            })
            // Vue.set(context.state.isDot,context.state.currentAdmin.username+'#'+receiveMsg.from,true);
            let msgNums = context.state.isDot[context.state.currentAdmin.username+'$'+receiveMsg.from];
            if(!msgNums) {
              msgNums = 0;
            }
            Vue.set(context.state.isDot, context.state.currentAdmin.username+'$'+receiveMsg.from, msgNums + 1);
          }
          receiveMsg.notSelf = true;
          receiveMsg.to = receiveMsg.from;
          context.commit('addMessage',receiveMsg);
        })
      },error=>{

      })
    },
    initData (context) {
      context.commit('INIT_DATA');
      getRequest('/chat/admin?keywords='+context.state.filterKey).then(res=>{
        if(res){
          context.commit('INIT_ADMINS',res);
        }
      })
    }
  },
  getters: {
    checkPermissionFlag(state) {
      return function (flag) {
        for(let i = 0; i < state.actions.length; i++) {
          if(state.actions[i] === flag) {
            return true;
          }
        }
        return false;
      }
    }
  },
  modules: {

  }
})

store.watch(function (state) {
  return state.sessions;
},function (val) {
  console.log('CHANGE: ', val);
  localStorage.setItem('vue-chat-session', JSON.stringify(val));
},{
  deep:true/*这个貌似是开启watch监测的判断,官方说明也比较模糊*/
})

export default store;
