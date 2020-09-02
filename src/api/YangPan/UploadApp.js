import request from '@/utils/request'
// 添加版本
export const API$AddUpdateVersion = (data) => {
  const R = Object.assign({ type: 'AddVersion' }, data)
  return request({
    url: '/YangPanAdmin',
    method: 'post',
    data: R
  })
}

// 获取版本列表
export const API$UpdateVersionList = (data) => {
  const R = Object.assign({ type: 'SelVersionList' }, data)
  return request({
    url: '/YangPanAdmin',
    method: 'post',
    data: R
  })
}

// 删除版本
export const API$DeketeVersiont = (data) => {
  const R = Object.assign({ type: 'DelVersion' }, data)
  return request({
    url: '/YangPanAdmin',
    method: 'post',
    data: R
  })
}

// 更新版本
export const API$UpdVersiont = (data) => {
  const R = Object.assign({ type: 'UpdVersion' }, data)
  return request({
    url: '/YangPanAdmin',
    method: 'post',
    data: R
  })
}

// 指定当前使用的版本
export const API$UpdCurrentUse = (data) => {
  const R = Object.assign({ type: 'UpdCurrentUse' }, data)
  return request({
    url: '/YangPanAdmin',
    method: 'post',
    data: R
  })
}
