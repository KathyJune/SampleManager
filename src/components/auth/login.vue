<template>
  <div class="login">
    <div class="sys-title">
      <img class="navbar-brand-full" :src="maxLogo"  alt="Logo">遥感影像分布式管理平台
    </div>
    <div class="login-con">
      <el-card icon="log-in" header="欢迎登录" :bordered="false" shadow="always">
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit"></login-form>
          <p class="login-tip">输入用户名和密码即可</p>
        </div>
      </el-card>
    </div>
  </div>
</template>
<style lang="less">
  @import './login.less';
</style>
<script type="text/ecmascript-6">
import LoginForm from '_c/auth/login-form'
import { setToken, localSave } from '@/libs/util'
import maxLogo from '@/assets/img/brand/logo-white.svg'
export default {
  name: 'login',
  mounted: function () {
    this.init()
  },
  components: {
    LoginForm
  },
  methods: {
    init () {
      this.apiUrl = this.$api
    },
    handleSubmit (login) {
      // this.$router.push({name: 'Home'})
      let vm = this
      // if (!vm.validate()) {
      //   vm.createCode()
      //   vm.$message({
      //     title: '错误',
      //     message: '验证码错误!',
      //     type: 'danger',
      //     delay: 2000
      //   })
      //   return false
      // }
      let uri = vm.apiUrl.auth.login
      vm.$http.request({
        url: uri,
        method: 'post',
        data: {
          username: login.userName,
          password: login.password
        }
      }).then((response) => {
        if (response && response.data.token) {
          let token = response.data.token
          setToken(token)
          localSave('user', JSON.stringify(response.data.data))
          localSave('role', JSON.stringify(response.data.role))
          this.redirectTo()
          // this.$socket.emit('login', {
          //   token,
          //   user: login.userName
          // })
        } else {
          // vm.createCode()
          this.$notify.error({ title: '错误', message: response.data.msg })
        }
      }).catch((response) => {
        // console.log(response)
      })
    },
    createCode () {
      this.code = ''
      const codeLength = 4
      const selectChar = [1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', ' E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
      for (let i = 0; i < codeLength; i++) {
        let charIndex = Math.floor(Math.random() * 60)
        this.code += selectChar[charIndex]
      }
      if (this.code.length !== codeLength) {
        this.createCode()
      }
      this.showCheck(this.code)
    },
    showCheck (a) {
      const c = document.getElementById('myCanvas')
      c.height = 46
      c.width = 150
      const ctx = c.getContext('2d')
      ctx.clearRect(0, 0, 1000, 1000)
      ctx.font = '30px Microsoft Yahei'
      ctx.fillText(a, 40, 30)
      ctx.fillStyle = '#000'
    },
    validate () {
      if (this.from.captcha.toUpperCase() !== this.code.toUpperCase()) {
        return false
      }
      return true
    },
    redirectTo () {
      let redirect = decodeURIComponent(this.$route.query.redirect || '/')
      if (redirect !== '/') {
        this.$router.push({ path: redirect })
      } else {
        this.$router.push('/home')
      }
    }
  },
  data () {
    return {
      organizations: [],
      remember: ['记住密码'],
      captchaUri: '',
      apiUrl: '/api/',
      code: '',
      maxLogo
    }
  }
}
</script>
