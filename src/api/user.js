import request from '@/utils/request'

// 登录接口(admin)
export function login(data) {
  const R = Object.assign({ type: 'Login' }, data)
  return request({
    url: '/YangPanAdmin',
    method: 'post',
    data: R
  })
}
// 注册接口(admin)
export function Register(data) {
  const R = Object.assign({ type: 'Register' }, data)
  return request({
    url: '/YangPanAdmin',
    method: 'post',
    data: R
  })
}

// 获取用户信息接口(admin)
export function GetUserInfo(data) {
  const R = Object.assign({ type: 'GetUserInfo' }, data)
  return request({
    url: '/YangPanAdmin',
    method: 'post',
    data: R
  })
}

// 获取临时Sts权限(admin)
export function GetSts(data) {
  const R = Object.assign({ type: 'GetSts' }, data)
  return request({
    url: '/YangPanAdmin',
    method: 'post',
    data: R
  })
}

// 获取用户列表接口(admin)
export function GetUserList(data) {
  const R = Object.assign({ type: 'admin_SelUserList' }, data)
  return request({
    url: '/YangPanAdmin',
    method: 'post',
    data: R
  })
}

// 更新用户信息接口(admin)
export function UpdUser(data) {
  const R = Object.assign({ type: 'admin_UpdlUser' }, data)
  return request({
    url: '/YangPanAdmin',
    method: 'post',
    data: R
  })
}

// 获删除用户接口(admin)
export function DelUser(data) {
  const R = Object.assign({ type: 'admin_DelUser' }, data)
  return request({
    url: '/YangPanAdmin',
    method: 'post',
    data: R
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}
