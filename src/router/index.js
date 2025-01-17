import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
常用的路由配置表，无需配置权限显示与否
 */
export const constantRoutes = [{
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: {
        title: 'Dashboard',
        icon: 'dashboard'
      }
    }]
  }, {
    path: '/form',
    component: Layout,
    children: [{
      path: 'index',
      name: 'Form',
      component: () => import('@/views/form/index'),
      meta: {
        title: 'Form',
        icon: 'form'
      }
    }]
  },

  {
    path: '/nested',
    component: Layout,
    redirect: '/nested/menu1',
    name: 'Nested',
    meta: {
      title: 'Nested',
      icon: 'nested'
    },
    children: [{
        path: 'menu1',
        component: () => import('@/views/nested/menu1/index'), // Parent router-view
        name: 'Menu1',
        meta: {
          title: 'Menu1'
        },
        children: [{
            path: 'menu1-1',
            component: () => import('@/views/nested/menu1/menu1-1'),
            name: 'Menu1-1',
            meta: {
              title: 'Menu1-1'
            }
          },
          {
            path: 'menu1-2',
            component: () => import('@/views/nested/menu1/menu1-2'),
            name: 'Menu1-2',
            meta: {
              title: 'Menu1-2'
            },
            children: [{
                path: 'menu1-2-1',
                component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
                name: 'Menu1-2-1',
                meta: {
                  title: 'Menu1-2-1'
                }
              },
              {
                path: 'menu1-2-2',
                component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
                name: 'Menu1-2-2',
                meta: {
                  title: 'Menu1-2-2'
                }
              }
            ]
          },
          {
            path: 'menu1-3',
            component: () => import('@/views/nested/menu1/menu1-3'),
            name: 'Menu1-3',
            meta: {
              title: 'Menu1-3'
            }
          }
        ]
      },
      {
        path: 'menu2',
        component: () => import('@/views/nested/menu2/index'),
        name: 'Menu2',
        meta: {
          title: 'menu2'
        }
      }
    ]
  },

  {
    path: 'external-link',
    component: Layout,
    children: [{
      path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
      meta: {
        title: 'External Link',
        icon: 'link'
      }
    }]
  },

  // 404 page must be placed at the end !!!
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]


//  动态路由--用来按权限分配显示的路由
export const asyncRoutes = [
  /** ************************************************WebGl部分******************************************************************************/
  {
    path: '/WebGL',
    component: Layout,
    redirect: '/WebGL/ModelList',
    name: 'WebGL',
    meta: {
      title: 'WebGL',
      icon: '3D'
    },
    children: [{
        path: '/WebGL/ModelList',
        name: 'ModelList',
        component: () => import('@/views/WebGl/ModelList'),
        meta: {
          title: '模型列表',
          icon: 'table'
        }
      },
      {
        path: '/WebGl/ModelShow',
        name: 'ModelShow',
        component: () => import('@/views/WebGl/ModelShow'),
        meta: {
          title: '模型展示',
          icon: 'UploadImg'
        }
      }
    ]
  },

  /** ************************************************快速模板部分******************************************************************************/
  {
    path: '/fastTemplate',
    component: Layout,
    redirect: '/fastTemplate/index',
    name: 'fastTemplate',
    meta: {
      title: '快速模板',
      icon: 'quick'
    },
    children: [{
        path: '/fastTemplate/index',
        name: 'fastTemplate-index',
        component: () => import('@/views/fastTemplate/index'),
        meta: {
          title: 'fastTemplate-index',
          icon: 'table'
        }
      },
      {
        path: '/fastTemplate/ImgUpload',
        name: 'fastTemplate-ImgUpload',
        component: () => import('@/views/fastTemplate/ImgUpload/index'),
        meta: {
          title: '图片上传',
          icon: 'UploadImg'
        }
      },
      {
        path: '/fastTemplate/formValidate',
        name: 'fastTemplate-formValidate',
        component: () => import('@/views/fastTemplate/formValidate/index'),
        meta: {
          title: '表单验证',
          icon: 'formValidate'
        }
      },
      {
        path: '/fastTemplate/Table',
        name: 'fastTemplate-Table',
        component: () => import('@/views/fastTemplate/Table/index'),
        meta: {
          title: '表格',
          icon: 'table'
        }
      }
    ]
  },

  /** ************************************************洋网盘后端部分******************************************************************************/
  {
    path: '/YangPan',
    component: Layout,
    redirect: '/YangPan/AppUpdate/AppUpdateList',
    name: 'YangPan',
    meta: {
      title: '洋盘',
      icon: 'YangPan'
    },
    children: [{
      path: '/YangPan/AppUpdate/AppUpdateList',
      name: 'AppUpdateList',
      component: () => import('@/views/YangPan/AppUpdate/AppUpdateList'),
      meta: {
        title: 'APP版本管理',
        icon: 'Version'
      }
    }, {
      path: '/YangPan/UserManager/UserList',
      name: 'UserManager',
      component: () => import('@/views/YangPan/UserManager/UserList'),
      meta: {
        title: '洋盘用户管理',
        icon: 'Users'
      }
    }, {
      path: '/YangPan/ArticleManager/ArticleList',
      name: 'ArticleManager',
      component: () => import('@/views/YangPan/ArticleManager/ArticleList'),
      meta: {
        title: '文章管理',
        icon: 'Article'
      }
    }, {
      path: '/YangPan/AdminUserManager/UserList',
      name: 'AdminUserManager',
      component: () => import('@/views/YangPan/AdminUserManager/UserList'),
      meta: {
        title: 'admin用户管理',
        icon: 'Users'
      }
    }, {
      path: '/YangPan/AuthorityManager/AuthorityManager',
      name: 'AuthorityManager',
      component: () => import('@/views/YangPan/AuthorityManager/AuthorityManager'),
      meta: {
        title: '权限管理',
        icon: 'Article'
      }
    }, {
      path: '/YangPan/AuthorityManager/RouterList',
      name: 'RouterList',
      component: () => import('@/views/YangPan/AuthorityManager/RouterList'),
      meta: {
        title: '路由管理',
        icon: 'Article'
      }
    }]
  }
]



const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({
    y: 0
  }),
  // routes: constantRoutes.concat(asyncRoutes)
  routes: constantRoutes
})

const router = createRouter()
// router.prototype.$asyncRoutes = asyncRoutes
// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default {
  router,asyncRoutes
}
