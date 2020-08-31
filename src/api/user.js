import request from '@/utils/request'

export function login(data) {
  const R = Object.assign({ type: 'APILogin' }, data)
  return request({
    url: '/YangPan',
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
