import {login,Register,logout,GetUserInfo} from '@/api/user'
import {getToken,setToken,removeToken} from '@/utils/auth'
import { resetRouter} from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: ''
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
  }
}

const actions = {
  // 用户登录
  login({commit}, userInfo) {
    const {account,pwd} = userInfo
    return new Promise((resolve, reject) => {
      login({ account: account.trim(), pwd}).then(response => {
        const { Token } = response
        commit('SET_TOKEN', Token)
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
        resolve(result)
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
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
