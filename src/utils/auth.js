import Cookies from 'js-cookie'

const TokenKey = 'YangPanAdmin_key'
const StsKey = 'StsKey'
const UserInfo = 'UserInfo'



// toekn
export function getToken() {
  return Cookies.get(TokenKey)
}
export function setToken(token) {
  return Cookies.set(TokenKey, token,{expires:new Date((new Date().getTime() + 30*60*1000))})
}
export function removeToken() {
  return Cookies.remove(TokenKey)
}



// STs
export function getSts(){
  return JSON.parse(localStorage.getItem(StsKey)) 
}
export function setSts(Sts) {
  return localStorage.setItem(StsKey,JSON.stringify(Sts))
}
export function removeSts() {
  return localStorage.removeItem(StsKey)
}



// userinfo
export function getUserInfo(){
  return localStorage.getItem(UserInfo)
}
export function setUserInfo(info) {
  return localStorage.setItem(UserInfo,JSON.stringify(info))
}
export function removeUserInfo() {
  return localStorage.removeItem(UserInfo)
}
