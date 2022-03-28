import axios from "axios";
import {Message} from "element-ui";
import router from "../router";
import { Loading } from 'element-ui';
import {postRequest} from "@/network/api";
import store from "@/store";

export function request(config)
{
  const instance = axios.create({
      baseURL: "/api",
      timeout: 5000
    });

  // let loadingInstance = null;

  //响应拦截器
  instance.interceptors.response.use(success => {//调用后端接口成功,返回响应码200
    //业务逻辑错误
    if(success.status && success.status === 200){
      if(success.data.code===500 || success.data.code===401 || success.data.code===403 || success.data.code===402 || success.data.code===406){
        Message.error({message: success.data.message});
        // loadingInstance.close();
        if(success.data.code === 402 || success.data.code===406) { //该账户第二次登录,会强制退出
          //清空用户信息
          window.sessionStorage.removeItem('tokenStr');
          window.sessionStorage.removeItem('user');
          //清空菜单
          store.commit('initRoutes', []);
          //跳转登录页面
          router.replace('/');
        }
        return;
      }
      if(success.data.message){
        Message.success({message: success.data.message})
      }
    }
    // loadingInstance.close();
    return success.data;
  }, error => {
    if(error.response && error.response.code != null){
      if(error.response.code===504 || error.response.code===404){
        Message.error({message: '服务器被吃了≡(▔﹏▔)≡'});
      }else if(error.response.code===403){
        Message.error({message: '权限不足,请联系管理员'});
      } else if(error.response.code===401){
        Message.error({message: '尚未登录,请登录'});
        router.replace("/");
      } else{
        if(error.response.data.message){
          Message.error({message: error.response.data.message});
        } else{
          Message.error({message: '未知错误'});
        }
      }
    }
    // loadingInstance.close();
    // router.replace('/error');
  });

  //请求拦截器
  instance.interceptors.request.use(config=>{
    //如果存在token,请求携带这个token
    if(window.sessionStorage.getItem("tokenStr")){
      config.headers.Authorization = window.sessionStorage.getItem("tokenStr");
    }
    // loadingInstance = Loading.service({
    //   text:"拼命加载中..."
    // });
    return config;
  },error => {
    console.log(error);
    // router.replace('/error');
  })
  return instance(config)
}



