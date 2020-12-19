import request from '@/utils/request'

// 获取用户列表(app)
export const API$SelUserListt = (data) => {
  const R = Object.assign({ type: 'SelUserList' }, data)
  return request({
    url: '/YangPanAdmin',
    method: 'post',
    data: R
  })
}

// 更新用户信息(app)
export const API$UpdUser = (data) => {
  const R = Object.assign({ type: 'UpdUser' }, data)
  return request({
    url: '/YangPanAdmin',
    method: 'post',
    data: R
  })
}

// 删除用户信息(app)
export const c = (data) => {
  const R = Object.assign({ type: 'DelUser' }, data)
  return request({
    url: '/YangPanAdmin',
    method: 'post',
    data: R
  })
}
