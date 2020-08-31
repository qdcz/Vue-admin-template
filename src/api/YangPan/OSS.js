import request from '@/utils/request'
// 获取Sts
export const API$GetSts = (data) => {
  const R = Object.assign({ type: 'APIFreshSts' }, data)
  return request({
    url: '/YangPan',
    method: 'post',
    data: R
  })
}
