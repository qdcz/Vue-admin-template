import request from '@/utils/request'

// 同步路由配置表到后端
export const SyncRouter = (data) => {
  const R = Object.assign({ type: 'SyncRouter' }, data)
  return request({
    url: '/YangPanAdmin',
    method: 'post',
    data: R
  })
}

// 查询路由的全部信息
export const SelRouter = (data) => {
  const R = Object.assign({ type: 'SelRouter' }, data)
  return request({
    url: '/YangPanAdmin',
    method: 'post',
    data: R
  })
}

// 添加角色信息
export const AddRole = (data) => {
  const R = Object.assign({ type: 'AddRole' }, data)
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

// 修改角色信息
export const UpdRole = (data) => {
  const R = Object.assign({ type: 'UpdRole' }, data)
  return request({
    url: '/YangPanAdmin',
    method: 'post',
    data: R
  })
}

// 删除角色
export const DelRole = (data) => {
  const R = Object.assign({ type: 'DelRole' }, data)
  return request({
    url: '/YangPanAdmin',
    method: 'post',
    data: R
  })
}