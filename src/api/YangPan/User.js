import request from '@/utils/request'


// 用户登录
export const API$APILogin = (data) => {
  const R = Object.assign({ type: 'APILogin' }, data)
  return request({
    url: '/YangPanAdmin',
    method: 'post',
    data: R
  })
}

// 获取用户列表
export const API$SelUserListt = (data) => {
  const R = Object.assign({ type: 'SelUserList' }, data)
  return request({
    url: '/YangPanAdmin',
    method: 'post',
    data: R
  })
}

// 更新用户信息
export const API$UpdUser = (data) => {
  const R = Object.assign({ type: 'UpdUser' }, data)
  return request({
    url: '/YangPanAdmin',
    method: 'post',
    data: R
  })
}

// 添加用户信息
export const API$AddUser = (data) => {
  const R = Object.assign({ type: 'AddUser' }, data)
  return request({
    url: '/YangPanAdmin',
    method: 'post',
    data: R
  })
}

// 删除用户信息
export const API$DelUser = (data) => {
  const R = Object.assign({ type: 'DelUser' }, data)
  return request({
    url: '/YangPanAdmin',
    method: 'post',
    data: R
  })
}
