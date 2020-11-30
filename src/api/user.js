import request from '@/utils/request'

// 登录接口
export function login(data) {
  const R = Object.assign({ type: 'Login' }, data)
  return request({
    url: '/YangPanAdmin',
    method: 'post',
    data: R
  })
}
// 注册接口
export function Register(data) {
  const R = Object.assign({ type: 'Register' }, data)
  return request({
    url: '/YangPanAdmin',
    method: 'post',
    data: R
  })
}

// 获取用户信息接口
export function GetUserInfo(data) {
  const R = Object.assign({ type: 'GetUserInfo' }, data)
  return request({
    url: '/YangPanAdmin',
    method: 'post',
    data: R
  })
}

export function getInfo(token) {
  return request({
    url: '/vue-admin-template/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}
