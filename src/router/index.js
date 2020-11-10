import Vue from 'vue'
import Router from 'vue-router'
import spaceView from 'src/page/spaceView'
import megreView from 'src/page/megreView'
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
      redirect: '/login'
    },
    {
      path: '/home',
      redirect: '/dashboard',
      name: 'Home',
      meta: { label: '首页' },
      component: () => import(/* webpackChunkName: "page" */ 'src/components/containers/DefaultContainer'),
      children: [
        {
          path: '/data',
          component: {
            render (c) {
              return c('router-view')
            }
          },
          children: [
            {
              path: 'sampleAdmin',
              name: 'sampleAdmin',
              meta: { label: '样本管理' },
              component: () => import(/* webpackChunkName: "page" */ 'src/page/sampleAdmin'),
              beforeLeave: (to, from, next) => {
                console.log(to, this)
                this.refreshTimer = undefined
                next()
              }
            },
            {
              path: 'sampleManager',
              name: 'sampleManager',
              meta: { label: '样本管理1' },
              component: () => import(/* webpackChunkName: "page" */ 'src/page/sampleManager'),
              beforeLeave: (to, from, next) => {
                console.log(to, this)
                this.refreshTimer = undefined
                next()
              }
            }
          ]
        },
        {
          path: '/sys',
          component: () => import(/* webpackChunkName: "sys" */ 'src/page/sys'),
          children: [
            {
              path: 'upload',
              name: 'upload',
              meta: { label: '上传记录' },
              component: () => import(/* webpackChunkName: "sys" */ 'src/page/upload')
            },
            {
              path: 'messageManage',
              name: 'messageManage',
              meta: { label: '消息管理' },
              component: () => import(/* webpackChunkName: "sys" */ 'src/page/message')
            },
            {
              path: 'publishManage',
              name: 'publishManage',
              meta: { label: '发布管理' },
              component: () => import(/* webpackChunkName: "sys" */ 'src/page/publishManage')
            },
            {
              path: 'deleteManage',
              name: 'deleteManage',
              meta: { label: '删除管理' },
              component: () => import(/* webpackChunkName: "sys" */ 'src/page/deleteManage')
            }
          ]
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
          component: () => import(/* webpackChunkName: "page" */ 'src/components/auth/login')
        },
        {
          path: '500',
          name: 'Page500',
          component: () => import(/* webpackChunkName: "page" */ 'src/components/auth/login')
        },
        {
          path: '/login',
          name: 'Login',
          component: () => import(/* webpackChunkName: "page" */ 'src/components/auth/login')
        },
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
        {
          path: '/spaceView/:id',
          name: 'spaceView',
          component: spaceView
        },
        {
          path: '/megreView',
          name: 'megreView',
          component: megreView
        }
      ]
    }
  ]
})
const LOGIN_PAGE_NAME = 'Login'
const turnTo = (to, access, next) => {
  if (canTurnTo(to.name, access, router.options.routes)) next() // 有权限，可访问
  else next({ replace: true, name: 'Page404' }) // 无权限，重定向到401页面
}
router.beforeEach((to, from, next) => {
  const token = 'kasjfiwe' // getToken()
  if (!token && to.name !== LOGIN_PAGE_NAME) {
    // 未登录且要跳转的页面不是登录页
    next({
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
    turnTo(to, [], next)
  }
})

router.afterEach(to => {
  window.scrollTo(0, 0)
})

export default router
