import {request} from "./request";
import {download} from "./download";
import {request2} from "./request2";

export const postRequest2 = (url, params)=>{
  return request2({
    url: `${url}`,
    method: 'post',
    data: params
  })
}

export const downloadRequest = (url, params)=>{
  return download({
    url: `${url}`,
    method: 'get',
    data: params
  })
}

export const postRequest = (url, params)=>{
  return request({
    url: `${url}`,
    method: 'post',
    data: params
  })
}

export const getRequest = (url, params)=>{
  return request({
    url: `${url}`,
    method: 'get',
    data: params
  })
}

export const putRequest = (url, params)=>{
  return request({
    url: `${url}`,
    method: 'put',
    data: params
  })
}

export const deleteRequest = (url, params)=>{
  return request({
    url: `${url}`,
    method: 'delete',
    data: params
  })
}


