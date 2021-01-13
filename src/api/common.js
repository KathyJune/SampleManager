/**
 * Created by 9I
 * @Date 2019/7/10
 * @description 通用api 接口
 */
import axios from '@/libs/api.request'
import { Pagination, baseUrl, imageUrl } from './config'
/**
 * 获取列表数据 -- get
* */
export const getList = (url, image) => {
  let fix = !image ? baseUrl : imageUrl
  return axios.request({
    url: fix + url,
    method: 'get'
  })
}

/**
 * 根据id获取单个数据 -- get
 * */
export const getById = (url, id) => {
  return axios.request({
    url: baseUrl + url + '/' + id,
    method: 'get'
  })
}
/**
 * 并发执行多个get
 * */
export const sendAll = (url) => {
  return axios.sendAll(url)
}
/**
 * 获取列表数据 -- post
 * 默认带分页参数
 * */
export const queryList = (url, params) => {
  params = Object.assign({}, Pagination, params)
  let fix = !params.imageUrl ? baseUrl : imageUrl
  delete params.imageUrl
  return axios.request({
    url: fix + url,
    data: params,
    method: 'post'
  })
}

/**
 * 向数据新增数据 -- post
 * */
export const add = (url, params) => {
  let fix = !params.imageUrl ? baseUrl : imageUrl
  delete params.url
  delete params.imageUrl
  return axios.request({
    url: fix + url,
    data: params,
    method: 'post'
  })
}

/**
 * 向数据数据 提交数据更新-- put
 * */
export const edit = (url, params) => {
  let fix = !params.imageUrl ? baseUrl : imageUrl
  delete params.url
  delete params.imageUrl
  return axios.request({
    url: fix + url,
    data: params,
    method: 'put'
  })
}

/**
 * 向数据数据 提交数据删除-- delete
 * */
export const remove = (url, id) => {
  return axios.request({
    url: baseUrl + url + '/' + id,
    method: 'delete'
  })
}
