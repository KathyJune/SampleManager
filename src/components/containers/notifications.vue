<template>
  <AppHeaderDropdown right no-caret>
    <template slot="header">
      <i class="fa fa-bell-o"></i>
      <b-badge pill variant="danger" v-html="total"></b-badge>
    </template>
    <template slot="dropdown">
      <b-dropdown-header tag="div" class="text-center"><strong>您有 <span v-html="total"></span> 通知</strong></b-dropdown-header>
      <b-dropdown-item v-for="item in record" :key="item.id" class="message-content">
        <i class="fa text-success" :class="getClass(item)"></i>
        <span class="message-text" v-html="getContent(item.content)"></span>
        <el-button @click.native.prevent="handleClick(item)" type="primary" size="mini" v-if="item.type==='影像发布成功'">查看</el-button>
      </b-dropdown-item>
      <b-dropdown-item class="text-center" v-if="total>8">
        <a v-html="'查看更多消息'" href="/sys/message"></a>
      </b-dropdown-item>
    </template>
  </AppHeaderDropdown>
</template>

<script>
import { HeaderDropdown as AppHeaderDropdown } from '@coreui/vue'
import { parseJson } from '../../utils/factory'

export default {
  name: 'notification',
  components: {
    AppHeaderDropdown
  },
  // computed: {
  //   total: function () {
  //     return this.record.length
  //   }
  // },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.api = this.$api.message
      this.getNotification()
      // this.socketStart()
      const _t = this
      this.$bus.$on('refreshMessage', content => {
        content === 'refresh' && _t.getNotification()
      })
    },
    getNotification (isShowMessage) {
      let url = this.api.list
      const _this = this
      let option = {
        userid: this.userid,
        state: 1,
        limit: 8
      }
      this.$http.post(url, option).then((response) => {
        if (response && response.data.code === 1) {
          _this.record = response.data.data.rows
          _this.total = response.data.data.total
          let _msg = _this.record[0]
          if (isShowMessage && _msg.type) {
            _this.$notify.success({title: _msg.type, message: _msg.content})
          }
        } else {
          // _this.$notify.error({title: '错误', message: response.message})
        }
      }).catch((response) => {
        // console.log(response)
      })
    },
    getClass (item) {
      // todo
      return 'fa-bell'
    },
    handleClick (item) {
      const _this = this
      // let pattern = /\d+/g
      let id = item.foid
      let url = this.api.save + '?id=' + item.id
      this.$http.get(url).then((response) => {
        if (response && response.data.code === 1) {
          _this.sendMessage()
          _this.getNotification()
          if (item.type === '影像发布成功') {
            let url = window.location.origin + '/data/mapView/' + id
            window.open(url, '_blank')
          }
        } else {
          // _this.$notify.error({title: '错误', message: response.message})
        }
      }).catch((response) => {
        // console.log(response)
      })
    },
    socketStart () {
      let url = this.$api.socket
      const _this = this
      this.webSocket = new WebSocket(url)
      // 连接发生错误的回调方法
      this.webSocket.onerror = function (e) {
        console.log('error', e)
      }

      // 连接成功建立的回调方法
      this.webSocket.onopen = function (event) {
        // console.log('open', event)
      }
      // 接收到消息的回调方法
      this.webSocket.onmessage = function (event) {
        let rs = parseJson(event.data)
        if (rs.code === 1) {
          _this.getNotification(true)
          _this.sendMessage()
        }
      }
      this.webSocket.ondisconnect = function (event) {
        console.log('message', event.data)
      }
      // this.webSocket.on('connect', () => {
      //   console.log('websocket connect')
      // })
      // this.webSocket.on('disconnect', () => {
      //   console.log('websocket connect')
      // })
      // this.webSocket.on('error', (error) => {
      //   console.log(error)
      // })
      // this.webSocket.on('message', (data) => {
      //   console.log(data)
      // })
    },
    sendMessage () {
      this.$bus.$emit('syncMessage', 'sync')
    },
    getContent (content) {
      return content.length > 40 ? content.substring(0, 40) + '...' : content
    }
  },
  data: () => {
    return {
      record: [],
      api: {},
      userid: 11,
      total: 0
    }
  }
}
</script>

<style>
  .message-content{
    display: flex;
    width: 400px;
    line-height: 1.5;
    overflow: hidden;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }
  .message-text {
    flex: 1;
  }
</style>
