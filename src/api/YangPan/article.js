import request from '@/utils/request'

// 获取文章列表
export const API$SelArticleList = (data) => {
  const R = Object.assign({ type: 'SelArticleList' }, data)
  return request({
    url: '/YangPanAdmin',
    method: 'post',
    data: R
  })
}

// 修改文章信息
export const API$UpdArticle = (data) => {
  const R = Object.assign({ type: 'UpdArticle' }, data)
  return request({
    url: '/YangPanAdmin',
    method: 'post',
    data: R
  })
}

// 修改文章信息
export const API$DelArticle = (data) => {
  const R = Object.assign({ type: 'DelArticle' }, data)
  return request({
    url: '/YangPanAdmin',
    method: 'post',
    data: R
  })
}
