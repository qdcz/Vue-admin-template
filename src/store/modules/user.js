import {login,Register,logout,GetUserInfo,GetSts} from '@/api/user'
import {getToken,setToken,removeToken,
        getSts,setSts,removeSts,
        getUserInfo,setUserInfo,removeUserInfo} from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token:getToken(),
    name: getUserInfo() ? JSON.parse(getUserInfo()).name : '',
    avatar: getUserInfo() ? JSON.parse(getUserInfo()).avatar : '',
    STS:getSts()
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_STS: (state, STS) => {
    state.STS = STS
    setSts(STS)
  }
}

const actions = {
  // 用户登录
  login({commit}, userInfo) {
    const {account,pwd} = userInfo
    return new Promise((resolve, reject) => {
      login({ account: account.trim(), pwd}).then(response => {
        const { Token,Sts } = response
        commit('SET_TOKEN', Token)
        commit('SET_STS', Sts)
        setToken(Token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 用户注册
  register({commit},userInfo){
    const {account,pwd} = userInfo
    return new Promise((resolve, reject) => {
      Register({account: account.trim(), pwd}).then(response => {
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 获取用户信息
  getInfo({commit,state}) {
    return new Promise((resolve, reject) => {
      GetUserInfo().then(response => {
        const {result} = response
        if (!result) {
          return reject('Verification failed, please Login again.')
        }
        const {name,avatar} = result
        commit('SET_NAME', name?name:"暂未设置")
        commit('SET_AVATAR', avatar?avatar:"https://cdnforspeed.oss-cn-beijing.aliyuncs.com/Img/YangPanAdmin/testImg.jpg")
        setUserInfo(result)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 退出登录
  logout({commit,state}) {
    return new Promise((resolve, reject) => {
      removeToken() // must remove  token  first
      resetRouter()
      removeSts()
      removeUserInfo()
      resolve()
    })
  },

  // 移除token
  resetToken({ commit}) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  },

  // 获取Sts临时权限
  getSts({commit},data){
    return new Promise(resolve => {
      GetSts({expiration:data.expiration}).then(response => {
        setSts(response.Sts)
        // console.log( response.Sts )
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
