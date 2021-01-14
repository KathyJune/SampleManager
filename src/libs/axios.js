import axios from 'axios'
import { getToken } from '@/libs/util'
// import { Spin } from 'iview'

class HttpRequest {
  constructor (baseUrl) {
    this.baseUrl = baseUrl
    this.token = getToken()
    this.headers = {
      common: {}
    }
    this.instance = undefined
    this.queue = {}
  }
  getInsideConfig () {
    const config = {
      baseURL: this.baseUrl,
      headers: this.headers,
      withCredentials: false
    }
    return config
  }
  destroy (url) {
    delete this.queue[url]
    if (!Object.keys(this.queue).length) {
      // Spin.hide()
    }
  }
  interceptors (instance, url) {
    // 请求拦截
    instance.interceptors.request.use(config => {
      // 添加全局的loading...
      if (!Object.keys(this.queue).length) {
        // Spin.show() // 不建议开启，因为界面不友好
      }
      this.queue[url] = true
      return config
    }, error => {
      return Promise.reject(error)
    })
    // 响应拦截
    instance.interceptors.response.use(res => {
      this.destroy(url)
      const { data, status } = res
      return { data, status }
    }, error => {
      this.destroy(url)
      return Promise.reject(error)
    })
  }
  request (options) {
    const instance = axios.create()
    this.token && (instance.defaults.headers.common['Authorization'] = 'Bearer ' + this.token)
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url)
    return instance(options)
  }
  setToken (token) {
    this.token = token
  }
  sendAll (arr) {
    if (Array.isArray(arr)) {
      return axios.all(arr).then(axios.spread(function (...res) {
        // 请求全部都执行完成
        return Promise.resolve(res)
      }))
    } else {
      throw new Error('参数错误！')
    }
  }
}
export default HttpRequest
