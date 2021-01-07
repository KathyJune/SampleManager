/**
 * Created by 9I
 * @Date 2019/11/7
 * @description
 */
// eslint-disable-next-line no-unused-vars
import io from 'socket.io-client'
import { getToken } from '@/libs/util'
const log = (s) => {
  console.log(s)
}
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
        this.socket = io('http://192.168.1.120:7001/io/', {
          query: { token },
          transports: ['websocket'],
          reconnection: false,
          autoConnect: true
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
    this.socket.off('connect')
    this.socket.off('reconnect')
    this.socket.off('disconnecting')
    this.socket.off('error')
  }

  init () {
    this.socket.on('connect', () => {
      console.log('reconnect')
    })
    this.socket.once('reconnect', () => {
      console.log('reconnect')
    })
    this.socket.on('disconnecting', () => {
      log('#disconnecting')
    })

    this.socket.on('error', () => {
      log('#error')
    })
  }
}
const socket = new WebSocket()
window.socket = socket
window.onbeforeunload = function () {
  try {
    window.socket.socket.close()
  } catch (e) {
    window.localStorage.setItem('err', JSON.stringify(e))
  }
}
export default socket
