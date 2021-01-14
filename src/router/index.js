import Vue from 'vue'
import Router from 'vue-router'
import { getToken, canTurnTo } from '@/libs/util'
import config from '@/config'
Vue.use(Router)
const { homeName } = config
const router = new Router({
  mode: 'history',
  linkActiveClass: 'open active',
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      redirect: '/home/sampleManager',
      name: 'Home',
      meta: {
        access: ['admin'],
        label: '首页'
      },
      component: () => import(/* webpackChunkName: "page" */ 'src/components/containers/DefaultContainer'),
      children: [
        {
          path: 'basicSet',
          name: 'basicSet',
          meta: {
            access: ['admin'],
            label: '基础样本集'
          },
          component: () => import(/* webpackChunkName: "page" */ 'src/page/basicSet'),
          beforeLeave: (to, from, next) => {
            this.refreshTimer = undefined
            next()
          }
        },
        {
          path: 'basicSetDetail',
          name: 'basicSetDetail',
          meta: {
            access: ['admin'],
            label: '基础样本集详情'
          },
          component: () => import(/* webpackChunkName: "page" */ 'src/page/basicSetDetail'),
          beforeLeave: (to, from, next) => {
            this.refreshTimer = undefined
            next()
          }
        },
        {
          path: 'sampleManager',
          name: 'sampleManager',
          meta: {
            access: ['admin'],
            label: '样本管理'
          },
          component: () => import(/* webpackChunkName: "page" */ 'src/page/sampleManager'),
          beforeLeave: (to, from, next) => {
            this.refreshTimer = undefined
            next()
          }
        },
        {
          path: 'sampleSetManager',
          name: 'sampleSetManager',
          meta: {
            access: ['admin'],
            label: '样本集管理'
          },
          component: () => import(/* webpackChunkName: "page" */ 'src/page/sampleSetManager'),
          beforeLeave: (to, from, next) => {
            this.refreshTimer = undefined
            next()
          }
        }
        ,
        {
          path: 'SetCreator',
          name: 'SetCreator',
          meta: {
            access: ['admin'],
            label: '样本集创建'
          },
          component: () => import(/* webpackChunkName: "page" */ 'src/page/createSet'),
          beforeLeave: (to, from, next) => {
            this.refreshTimer = undefined
            next()
          }
        }
      ]
    },
    {
      path: '/pages',
      redirect: '/pages/404',
      name: 'Pages',
      component: {
        render (c) { return c('router-view') }
      },
      children: [
        {
          path: '404',
          name: 'Page404',
          component: () => import(/* webpackChunkName: "page" */ 'src/page/error-page/404.vue')
        },
        {
          path: '500',
          name: 'Page500',
          component: () => import(/* webpackChunkName: "page" */ 'src/page/error-page/500.vue')
        },
        {
          path: '401',
          name: 'Page401',
          component: () => import(/* webpackChunkName: "page" */ 'src/page/error-page/401.vue')
        }
        // {
        //   path: 'register',
        //   name: 'Register',
        //   component: () => import(/* webpackChunkName: "page" */ 'src/components/auth/signUp')
        // },
        // {
        //   path: '/spaceView',
        //   name: 'spaceView',
        //   component: spaceView
        // },
      ]
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import(/* webpackChunkName: "page" */ 'src/components/auth/login')
    },
    {
      path: '/map-test',
      name: 'MapTest',
      component: () => import(/* webpackChunkName: "page" */ 'src/page/test')
    }
  ]
})
const LOGIN_PAGE_NAME = 'Login'
const turnTo = (to, access, next) => {
  if (canTurnTo(to.name, access, router.options.routes)) next() // 有权限，可访问
  else next({ replace: true, name: 'Page401' }) // 无权限，重定向到401页面
}
router.beforeEach((to, from, next) => {
  // const token = getToken()
  let token = true
  if (!token && to.name !== LOGIN_PAGE_NAME) {
    // 未登录且要跳转的页面不是登录页
    next({
      // name: homeName
      name: LOGIN_PAGE_NAME // 跳转到登录页
    })
  } else if (!token && to.name === LOGIN_PAGE_NAME) {
    // 未登陆且要跳转的页面是登录页
    next() // 跳转
  } else if (token && to.name === LOGIN_PAGE_NAME) {
    // 已登录且要跳转的页面是登录页
    next({
      name: homeName // 跳转到homeName页
    })
  } else {
    turnTo(to, ['admin'], next)
  }
})

router.afterEach(to => {
  window.scrollTo(0, 0)
})

export default router
