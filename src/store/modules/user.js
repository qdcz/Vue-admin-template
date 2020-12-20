import {login,Register,logout,GetUserInfo,GetSts} from '@/api/user'
import {getToken,setToken,removeToken,
        getSts,setSts,removeSts,
        getUserInfo,setUserInfo,removeUserInfo} from '@/utils/auth'
import { resetRouter } from '@/router'
import router from '@/router'

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
        const {name,avatar,role} = result
        commit('SET_NAME', name?name:"暂未设置")
        commit('SET_AVATAR', avatar?avatar:"https://cdnforspeed.oss-cn-beijing.aliyuncs.com/Img/YangPanAdmin/testImg.jpg")
        setUserInfo(result)
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
      removeSts()
      removeUserInfo()
      resolve()
      // router.router.
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
  },

  // 改变路由（后端的路由状态数据处理）
  ChangeRouter({commit},data){
    return new Promise(resolve => {
      let {ServerRouter,LocalRouter} = data

      // 这边做个数据处理，首先根节点的_id肯定是一个哈希值，然后他的子节点我是用日期命名的，所以
      let filterData = ServerRouter.RouterList.filter((i)=>!(/^[0-9]*$/g).test(i._id))

      // 数据先扁平化下
      let flatArr = []
      LocalRouter.forEach(iii=>{
        let digui = (obj)=>{
          flatArr.push({name:obj.name,component:obj.component})
          if(obj.children && obj.children.length>0){
            obj.children.forEach(jjj=>{
              digui(jjj)
            })
          }
        }
        digui(iii)
      })

      // 进行数据处理
      filterData.forEach(iii=>{
        let digui = (obj)=>{
          flatArr.forEach(i=>{
            if(i.name===obj.name){obj.component=i.component}
          })
          if(obj.children && obj.children.length>0){
            obj.children.forEach(jjj=>{
              digui(jjj)
            })
          }
        }
        digui(iii)
      })
      resolve({asyncRoutes:filterData})
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
