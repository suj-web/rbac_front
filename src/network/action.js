import {getRequest} from "@/network/api";

export const initAction = (router, store) => {
  if (store.state.actions.length > 0) {
    return;
  }
  getRequest('/system/cfg/action').then(data=>{
    if(data) {
      //将数据存入vuex
      store.commit('initActions', data);
    }
  })
}
