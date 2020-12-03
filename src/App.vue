<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
  import {
    getToken,
    removeToken,
    removeSts,
    removeUserInfo
  } from '@/utils/auth'
  export default {
    name: 'App',
    mounted() {
      let a = 'background: #606060; color: #fff; border-radius: 3px 0 0 3px;'
      let b = 'background: #1475B2; color: #fff; border-radius: 0 3px 3px 0;'
      console.log(`%c Token是否过期: %c ${getToken()} `, a, b)
      if (getToken()) {
        setInterval(() => {
          // 刷新Sts
          this.$store.dispatch('user/getSts', {
            expiration: '3600'
          });
        }, 1000 * 60 * 58);
      } else {
        removeToken()
        removeSts()
        removeUserInfo()
      }
    }
  }
</script>
<style lang="less">
  @import url('./Static/Css/pub.less');

  .yp {
    padding: 20px;
  }
</style>
