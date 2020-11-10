/**
 * Created by 9I
 * @Date 2019/11/7
 * @description
 */
// eslint-disable-next-line no-unused-vars
import Vue from 'vue'
import ElementUI from 'element-ui'
import io from 'socket.io-client'
import { getToken } from '@/libs/util'

class WebSocket {
  constructor () {
    this.socket = ''
    this.token = getToken()
    if (this.token) this.open(this.token)
  }
  open (token) {
    if (token) {
      this.token = token
      if (this.socket === '') {
        this.socket = io('http://192.168.1.130:7001/io/', {
          query: { token },
          transports: ['websocket'],
          reconnection: true,
          autoConnect: false
        })
      }
      if (!this.socket.connected) {
        this.socket.open()
        this.init()
      }
    }
    return this
  }

  close () {
    this.socket.close()
    this.socket.off('notice', this.notice)
    this.socket.off('connect')
  }

  init () {
    this.socket.on('connect', () => {
      console.log('socket connected')
    })
    this.socket.on('notice', this.notice)

    this.socket.on('reconnect', () => {
      console.log('reconnect')
    })
  }
  notice (data) {
    if (window.location.pathname.indexOf('login') > -1) return false
    ElementUI.Notification.success({ title: '通知', message: data })
  }
}
const socket = new WebSocket()
export default socket
