import router from './router'
import store from './store'
import {
  Message
} from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import {
  getToken
} from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({
  showSpinner: false
}) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.router.beforeEach(async (to, from, next) => {
  // 开始进度条
  NProgress.start()

  // 设置页面title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()
  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({path: '/'})
      NProgress.done()
    } else {

      const hasGetUserInfo = store.getters.name
      // console.log(hasGetUserInfo)

      if (hasGetUserInfo) {
        next()
      } else {
        try {
          sessionStorage.setItem("pathName", to.path)
          // 获取用户信息
          let {role,RouterList} = await store.dispatch('user/getInfo')

          // 路由树数据处理
          let {asyncRoutes} = await store.dispatch('user/ChangeRouter',{
            ServerRouter:RouterList,
            LocalRouter:router.asyncRoutes
          })
          // 因为他不是响应式的 所以先在options.routes添加，再使用addRoutes方法
          router.router.addRoutes(asyncRoutes)
          router.router.options.routes = router.router.options.routes.concat(asyncRoutes)

          // 页面手动刷新触发
          if(from.name===null){

            // 解决刷新动态路由页面的404问题
            next({path:to.redirectedFrom})
            return
          }else{
            next()
          }
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
