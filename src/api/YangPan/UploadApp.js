import request from '@/utils/request'
// 获取Sts
export const API$AddUpdateVersion = (data) => {
  const R = Object.assign({ type: 'AddUpdateVersion' }, data)
  return request({
    url: '/YangPanAdmin',
    method: 'post',
    data: R
  })
}

// 获取更新列表
export const API$UpdateVersionList = (data) => {
  const R = Object.assign({ type: 'UpdateVersionList' }, data)
  return request({
    url: '/YangPanAdmin',
    method: 'post',
    data: R
  })
}
