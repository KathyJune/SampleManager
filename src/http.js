/**
 * Created by 9I
 * @Date 2018/8/14
 * @description
 */
import router from './router'
import axios from 'axios'
import { getToken } from '@/libs/util'
// http 拦截器
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  if (!config.headers.common['Authorization']) config.headers.common['Authorization'] = 'Bearer ' + getToken()
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})
// http response 拦截器
axios.interceptors.response.use(
  response => {
    switch (response.data.code) {
      case 401:
        // 返回 401 清除token信息并跳转到登录页面
        localStorage.removeItem('login')
        if (router.currentRoute.name !== 'login') {
          router.replace({
            path: '/login',
            query: { redirect: router.currentRoute.fullPath }
          })
        }
        break
    }
    return response
  },
  error => {
    if (error.response) {
      switch (error.response.data.code) {
        case 401:
          // 返回 401 清除token信息并跳转到登录页面
          localStorage.removeItem('login')
          if (router.currentRoute.name !== 'login') {
            router.replace({
              path: '/login',
              query: { redirect: router.currentRoute.fullPath }
            })
          }
      }
    }
    return Promise.reject(error.response.data) // 返回接口返回的错误信息
  })

axios.jsonp = function (uri, cb) {
  let getXmlHttpRequest = function () {
    if (window.XMLHttpRequest) {
      // 主流浏览器提供了XMLHttpRequest对象
      return new XMLHttpRequest()
    } else if (window.ActiveXObject) {
      // 低版本的IE浏览器没有提供XMLHttpRequest对象
      // 所以必须使用IE浏览器的特定实现ActiveXObject
      return new window.ActiveXObject('Microsoft.XMLHttpRequest')
    }
  }
  let xhr = getXmlHttpRequest()
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      // 获取成功后执行操作
      // 数据在xhr.responseText
      let resJson = JSON.parse(xhr.responseText)
      cb(resJson)
    }
  }
  xhr.open('get', uri, true)
  xhr.setRequestHeader('Access-Control-Allow-Origin', '*')
  xhr.send(null)
}

export default axios
