import {request} from "./request";

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


