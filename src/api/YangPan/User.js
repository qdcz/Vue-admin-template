import request from '@/utils/request'

// 获取用户列表
export const API$SelUserListt = (data) => {
  const R = Object.assign({ type: 'SelUserList' }, data)
  return request({
    url: '/YangPanAdmin',
    method: 'post',
    data: R
  })
}
