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

// 根据文件名字删除-oss文件   （admin删除以用户头像）
export const API$DelOssFile = (data) => {
  const R = Object.assign({ type: 'DelOssFile' }, data)
  return request({
    url: '/YangPanAdmin',
    method: 'post',
    data: R
  })
}
