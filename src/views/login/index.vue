<template>
  <div class="login-container">

    <video class="bgVideo" src="../../Static/video/BgVideo.mp4" loop="loop" autoplay="autoplay"></video>
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on"
      label-position="left">

      <div class="title-container">
        <h3 class="title">Login Form</h3>
      </div>

      <el-form-item prop="account">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input ref="account" v-model="loginForm.account" placeholder="Username" name="account" type="text" tabindex="1"
          auto-complete="on" />
      </el-form-item>

      <el-form-item prop="pwd">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input :key="passwordType" ref="pwd" v-model="loginForm.pwd" :type="passwordType" placeholder="Password"
          name="pwd" tabindex="2" auto-complete="on" @keyup.enter.native="handleLogin" />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">Login</el-button>
    </el-form>
  </div>
</template>

<script>
  import {
    validUsername
  } from '@/utils/validate'
  import JSEncrypt from 'jsencrypt/bin/jsencrypt'

  export default {
    name: 'Login',
    data() {
      const validateUsername = (rule, value, callback) => {
        if (!validUsername(value)) {
          callback(new Error('Please enter the correct user name'))
        } else {
          callback()
        }
      }
      const validatePassword = (rule, value, callback) => {
        if (value.length < 6) {
          callback(new Error('The password can not be less than 6 digits'))
        } else {
          callback()
        }
      }
      return {
        loginForm: {
          account: '15892023484',
          pwd: '123456'
        },
        loginRules: {
          account: [{
            required: true,
            trigger: 'blur',
            validator: validateUsername
          }],
          pwd: [{
            required: true,
            trigger: 'blur',
            validator: validatePassword
          }]
        },
        loading: false,
        passwordType: 'password',
        redirect: undefined
      }
    },
    watch: {
      $route: {
        handler: function(route) {
          this.redirect = route.query && route.query.redirect
        },
        immediate: true
      }
    },
    created() {
      let pubKey =
        `-----BEGIN PUBLIC KEY-----
    		MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCxaE0pR7Kw/LnRk2QhzN+kkwKT
    		RrimPxO7PqH7TcQ1mp94HtCVj1WVSIosZsS5N1DDJgKDOIbQS04Tq+J47/VpaW9H
    		MAXSjZwQ03euN5Z7a0v/8H/aXw4OJgzdBPillwaahaUAlpQjJXIlGvslIw93f5uE
    		eNRvG9otLKTBlz+tPwIDAQAB
    		-----END PUBLIC KEY-----`
      let $JSEncrypt = new JSEncrypt() // 创建实例
      $JSEncrypt.setPublicKey(pubKey) // 设置公钥
      this.loginForm.account = $JSEncrypt.encrypt(this.loginForm.account)
      this.loginForm.pwd = $JSEncrypt.encrypt(this.loginForm.pwd)

      // this.$store.dispatch('user/register', this.loginForm)
    },
    methods: {
      showPwd() {
        if (this.passwordType === 'password') {
          this.passwordType = ''
        } else {
          this.passwordType = 'password'
        }
        this.$nextTick(() => {
          this.$refs.pwd.focus()
        })
      },
      handleLogin() {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            this.loading = true
            this.$store.dispatch('user/login', this.loginForm).then(() => {
              this.$router.push({
                path: this.redirect || '/'
              })
              this.loading = false
            }).catch(() => {
              this.loading = false
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  /* 修复input 背景不协调 和光标变色 */
  /* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

  $bg:#283443;
  $light_gray:#fff;
  $cursor: #fff;

  @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .login-container .el-input input {
      color: $cursor;
    }
  }

  /* reset element-ui css */
  .login-container {
    .el-input {
      display: inline-block;
      height: 47px;
      width: 85%;

      input {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        color: $light_gray;
        height: 47px;
        caret-color: $cursor;

        &:-webkit-autofill {
          box-shadow: 0 0 0px 1000px $bg inset !important;
          -webkit-text-fill-color: $cursor !important;
        }
      }
    }

    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
    }
  }
</style>

<style lang="scss" scoped>
  $bg:#2d3a4b;
  $dark_gray:#889aa4;
  $light_gray:#eee;

  $graydu:0;

  .login-container {
    min-height: 100%;
    width: 100%;
    // background-color: $bg;
    overflow: hidden;
    position: relative;

    .bgVideo {
      position: fixed;
      left: 0;
      top: -300px;
      min-width: 100%;
      min-height: 100%;
      z-index: -1;
      -webkit-filter: grayscale($graydu); //添加灰度蒙版，如果设定为100%则视频显示为黑白
    }

    .login-form {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate3d(-50%, -50%, 0);
      width: 520px;
      max-width: 100%;
      padding: 20px;
      border-radius: 10px;
      margin: 0 auto;
      overflow: hidden;
      height: 400px;
      z-index: 2;
      border: solid 1px transparent;
      transition: all .8s;
      filter: blur(100px);
      -webkit-filter: blur(100px);
      -moz-filter: blur(100px);
      -ms-filter: blur(100px);
    }

    .login-form::before {
      position: absolute;
      background-color: rgba(0, 0, 0, 0.1);
      padding: 20px;
      height: 400px;
      border-radius: 10px;
      margin: 0 auto;
      content: "";
      z-index: -111;
      top: 0;
      left: 0;
      width: 520px;
      max-width: 100%;
      filter: blur(10px);
      -webkit-filter: blur(10px);
      -moz-filter: blur(10px);
      -ms-filter: blur(10px);
    }

    .login-form:hover {
      filter: blur(0);
      -webkit-filter: blur(0);
      -moz-filter: blur(0);
      -ms-filter: blur(0);
      border: solid 1px rgba(136, 136, 136, 0.5);;

    }

    .tips {
      font-size: 14px;
      color: #fff;
      margin-bottom: 10px;

      span {
        &:first-of-type {
          margin-right: 16px;
        }
      }
    }

    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
    }

    .title-container {
      position: relative;

      .title {
        font-size: 26px;
        color: $light_gray;
        margin: 0px auto 40px auto;
        text-align: center;
        font-weight: bold;
      }
    }

    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select: none;
    }
  }
</style>
