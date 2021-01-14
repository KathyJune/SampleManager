/**
 * Created by 9I
 * @Date 2020/11/30
 * @description
 */
import axios from '@/libs/api.request'
import config from './config'

const sampleUrl = config.sampleUrl

export const getBasicList = (params) => {
  let url = sampleUrl + '/sp/basic/sampleset/list'
  this.$http.post(url, {}).then((response) => {
    console.log(response)
    if (response && response.status === 200) {
    }
  })
  // return axios.request({
  //   url: sampleUrl + '/sp/basic/sampleset/list',
  //   data: params,
  //   method: 'post'
  // })
}

export const getBasicDetail = (params) => {
  return axios.request({
    url: sampleUrl + '/sp/basic/sampleset/' + params.id,
    data: params,
    method: 'get'
  })
}

export const getCustomList = (id) => {
  return axios.request({
    url: sampleUrl + 'sampleset/' + id,
    method: 'get'
  })
}

export const getCustomDetail = (id) => {
  return axios.request({
    url: sampleUrl + 'sampleset/' + id,
    method: 'get'
  })
}
