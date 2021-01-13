/**
 * Created by 9I
 * @Date 2020/9/7
 * @description
 */
import axios from '@/libs/api.request'
import { Pagination, baseUrl } from './config'
const _baseUrl = baseUrl + 'classify'

export const getClassify = () => {
  return axios.request({
    url: _baseUrl,
    method: 'post'
  })
}
export const getClassifyList = (params) => {
  params = Object.assign({}, Pagination, params)
  return axios.request({
    url: _baseUrl + '/list',
    data: params,
    method: 'post'
  })
}

export const getClassifyById = (id) => {
  return axios.request({
    url: _baseUrl + '/show',
    method: 'get'
  })
}

export const clone = (id) => {
  return axios.request({
    url: _baseUrl + '/clone/' + id,
    method: 'get'
  })
}
export const freeze = (id) => {
  return axios.request({
    url: _baseUrl + '/freeze/' + id,
    method: 'put'
  })
}

export const unfreeze = (id) => {
  return axios.request({
    url: _baseUrl + '/unfreeze/' + id,
    method: 'put'
  })
}

export const addClassify = (params) => {
  return axios.request({
    url: _baseUrl,
    method: 'post',
    data: params
  })
}

export const PutClassify = (params) => {
  const { id } = params
  return axios.request({
    url: _baseUrl + '/' + id,
    method: 'put',
    data: params
  })
}
