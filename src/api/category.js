/**
 * Created by Kathy
 * @Date 1/12/21
 * @description
 */
import axios from '@/libs/api.request'
import config from './config'

export const getCategory = (id) => {
  return axios.request({
    url: config.baseUrl1 + module + '/list/' + id,
    method: 'get'
  })
}
export const getCategoryList = (params) => {
  console.log(config.ApiUrl)
  params = Object.assign({}, config.Pagination, params)
  return axios.request({
    url: config.baseUrl1 + 'category/list',
    data: params,
    method: 'post'
  })
}

export const getCategoryById = (id) => {
  return axios.request({
    url: ApiUrl + module + '/getById/' + id,
    method: 'get'
  })
}

export const addCategory = (params) => {
  return axios.request({
    url: baseUrl1 + 'category',
    data: params,
    method: 'post'
  })
}
export const putCategory = (params) => {
  return axios.request({
    url: baseUrl1 + 'category/batch',
    data: params,
    method: 'put'
  })
}

export const delCategory = (id) => {
  return axios.request({
    url: baseUrl + 'category/delete/' + id,
    method: 'delete'
  })
}
