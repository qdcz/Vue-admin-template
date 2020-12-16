import request from '@/utils/request'

// 添加路由配置表到后端
export const AddRouter = (data) => {
  const R = Object.assign({ type: 'AddRouter' }, data)
  return request({
    url: '/YangPanAdmin',
    method: 'post',
    data: R
  })
}

// 获取角色信息
export const GetRoleInfo = (data) => {
  const R = Object.assign({ type: 'GetRoleInfo' }, data)
  return request({
    url: '/YangPanAdmin',
    method: 'post',
    data: R
  })
}



// 获取文章列表
export const getRoutes = (data) => {
  const R = Object.assign({ type: 'SelArticleList' }, data)
  return request({
    url: '/YangPanAdmin',
    method: 'post',
    data: R
  })
}

export const getRoles = (data) => {
  const R = Object.assign({ type: 'SelArticleList' }, data)
  return request({
    url: '/YangPanAdmin',
    method: 'post',
    data: R
  })
}

export const addRole = (data) => {
  const R = Object.assign({ type: 'SelArticleList' }, data)
  return request({
    url: '/YangPanAdmin',
    method: 'post',
    data: R
  })
}

export const deleteRole = (data) => {
  const R = Object.assign({ type: 'SelArticleList' }, data)
  return request({
    url: '/YangPanAdmin',
    method: 'post',
    data: R
  })
}

export const updateRole = (data) => {
  const R = Object.assign({ type: 'SelArticleList' }, data)
  return request({
    url: '/YangPanAdmin',
    method: 'post',
    data: R
  })
}
