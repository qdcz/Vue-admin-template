<template>
  <div class="dialogs">
    <el-dialog title="添加app版本" :visible.sync="isshowDialogs" width="60%" center @close="dialogClose">
      <el-form ref="form" :model="form" class="el-form" :rules="rules" label-width="80px" label-position="left">
        <!-- 操作系统 -->
        <el-form-item label="Os" prop="Os">
          <el-select v-model="form.Os" placeholder="请输入要上传操作系统">
            <el-option label="Android" value="Android" />
            <el-option label="IOS" value="IOS" />
          </el-select>
        </el-form-item>
        <!-- 强制更新 -->
        <el-form-item label="强制更新" prop="forceUpdate">
          <el-select v-model="form.forceUpdate" placeholder="请选择是否强制更新">
            <el-option label="YES" value="YES" />
            <el-option label="NO" value="NO" />
          </el-select>
        </el-form-item>

        <!-- 版本 -->
        <el-form-item label="版本" prop="Version"><el-input v-model="form.Version" placeholder="请输入要上传的版本,示例1.1.0" /></el-form-item>

        <!-- APPId -->
        <el-form-item label="APPId" prop="AppId"><el-input v-model="form.AppId" placeholder="请输入要上传APPId" /></el-form-item>

        <!-- 更新内容 -->
        <el-form-item label="更新内容" prop="content"><el-input v-model="form.content" :rows="10" type="textarea" placeholder="请输入要更新的内容,分点要换行隔开" /></el-form-item>

        <!-- 文件上传 -->
        <el-form-item label="安装包" prop="licenseImageUrl">
          <el-upload class="wid1p" drag action="#666" :on-change="singleFileChange" :file-list="licenseImageUrl" :limit="1" :auto-upload="false" :show-file-list="false">
            <i class="el-icon-upload" />
            <div class="el-upload__text">
              将文件拖到此处，或
              <em>点击上传</em>
            </div>
            <div slot="tip" class="el-upload__tip" style="padding:0 10px;">只能上传单个文件，且不超过100MB</div>
          </el-upload>
        </el-form-item>

        <div v-if="licenseImageUrl.length >= 1" class="down-list">
          <div class="first-line">
            <div style="display: flex; align-items: center;">
              <!-- <i class="el-icon-tickets" /> -->
              <div>{{ up_filename }}</div>
            </div>
            <div v-if="progress_wid != '100%'">{{ progress_wid }}</div>
            <i v-else class="el-icon-delete" @click="file_cancel" />
          </div>
          <div class="second-line"><div class="progress" :style="{ width: progress_wid }" /></div>
        </div>
        <el-button class="submit-bth" type="primary" @click="onSubmit('form')">{{ infoList._id ? '更新' : '发布' }}</el-button>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
const COS = require('cos-js-sdk-v5')
const OSS = require('ali-oss')
import { API$GetSts } from '../../../../api/YangPan/OSS.js'
// import { getSts, addAppOne, UpdUpdate } from '../../api/app.js';
export default {
  props: ['isshowDialogs', 'infoList'],
  data() {
    return {
      tengxun_cos: '',
      licenseImageUrl: [],
      progress_wid: '0%',
      up_filename: '',
      form: {
        Os: 'Android',
        forceUpdate: 'NO',
        Version: '',
        AppId: '',
        content: '1.填写更新内容分点的时候\n2.一定要换行隔开',
        DownUrl: ''
      },
      rules: {
        Os: [{ required: true, message: '操作系统不能为空', trigger: 'change' }],
        forceUpdate: [{ required: true, message: '是否强制更新不能为空', trigger: 'change' }],
        Version: [{ required: true, message: '版本号不能为空', trigger: 'change' }],
        AppId: [{ required: true, message: 'AppId不能为空', trigger: 'change' }],
        content: [{ required: true, message: '更新的内容不能为空', trigger: 'change' }],
        DownUrl: [{ required: true, message: '未上传文件~', trigger: 'change' }]
      }
    }
  },
  watch: {
    infoList() {
      const { Os, forceUpdate, Version, content, DownUrl } = this.infoList
      this.form = { Os, forceUpdate, Version, content, DownUrl }
      this.progress_wid = this.infoList.progress_wid
      this.up_filename = DownUrl
      this.licenseImageUrl = this.infoList.licenseImageUrl
    }
  },
  async created() {
    this.GetOssSts()
    // API$GetSts()
    //   .then(res => {
    //     this.tengxun_cos = new COS({
    //       SecretId: res.data.data.credentials.tmpSecretId,
    //       SecretKey: res.data.data.credentials.tmpSecretKey,
    //       XCosSecurityToken: res.data.data.credentials.sessionToken
    //     })
    //   })
    //   .catch(function(error) {
    //     console.log(error)
    //   })
  },
  methods: {
    async GetOssSts() {
      const res = await API$GetSts()
      console.warn(res)
    },

    // 表单验证
    verify() {
      let toastText = null
      for (const [i] of Object.entries(this.form_verify)) {
        if (this.form[i] === '' || this.form[i] === false || this.form[i] === undefined) {
          toastText = this.form_verify[i]
          break
        }
      }
      return toastText
    },
    // 提交信息
    async onSubmit(formName) {
      console.log(111111111111111)
      this.$refs[formName].validate(async valid => {
        if (valid) {
          let loading = null
          try {
            loading = this.$loading({
              lock: true,
              text: 'Loading',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            })
            // this.$refs.demoRuleForm.resetField()
            this.clearRuleForm()
            console.log('这是传给后端的数据哦：', this.ruleForm)
          } catch (e) {
            this.$message.error(e)
          } finally {
            loading.close()
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })

      // if (this.form.Version.split('.').length !== 3) {
      //   return this.$message({
      //     message: '版本号格式错误~',
      //     type: 'warning'
      //   })
      // }
      // this.infoList._id ? this.UpdAPI() : this.AddAPI();
    },
    // 添加更新数据，接口
    async AddAPI() {
      try {
        const res = await addAppOne(this.form)
        if (res.data.code == 200) {
          this.$message(res.data.msg)
          this.dialogClose()
          this.$emit('updateList')
        }
      } catch (err) {
        this.$message.error(err)
      } finally {
        this.clear_form()
      }

      // addAppOne(this.form)
      // 	.then(response => {
      // 		clear_form();
      // 		this.$message(response.data.msg);
      // 		this.dialogClose();
      // 		this.$emit('updateList');
      // 		console.log(response);
      // 	})
      // 	.catch(function(error) {
      // 		clear_form();
      // 		console.log(error);
      // 	});

      const clear_form = () => {
        this.form = {
          Os: '',
          forceUpdate: '',
          Version: '',
          AppId: '',
          content: '1.填写更新内容分点的时候\n2.一定要换行隔开',
          DownUrl: ''
        }
        this.file_cancel()
      }
    },
    // 更新 更新信息接口口
    async UpdAPI() {
      const json = Object.assign({ _id: this.infoList._id }, this.form)
      try {
        const res = await UpdUpdate(json)
        if (res.data.code == 200) {
          this.$message(res.data.msg)
          this.dialogClose()
          this.$emit('updateList')
        }
      } catch (err) {
        this.$message.error(err)
      } finally {
        this.clear_form()
      }

      // UpdUpdate(json)
      // 	.then(response => {
      // 		clear_form();
      // 		this.$message(response.data.msg);
      // 		this.dialogClose();
      // 		this.$emit('updateList');
      // 		console.log(response);
      // 	})
      // 	.catch(function(error) {
      // 		clear_form();
      // 		console.log(error);
      // 	});
    },
    // 重写上传文件选择时回调 直接上传
    async singleFileChange(file, fileList) {
      const name = file.name.slice(0, file.name.match(/[^\.]\w*$/).index - 1)
      const type = file.name.match(/[^\.]\w*$/)[0]
      const that = this
      if (!['apk', 'wgt'].includes(type)) {
        this.licenseImageUrl = []
        this.$message.error('上传文件格式不支持!,只支持apk和wgt文件')
        return
      }
      if (!(file.size / 1024 / 1024 < 100)) {
        this.licenseImageUrl = []
        return this.$message.error('上传文件大小不能超过 100MB!')
      }

      const copyFile = new File([file.raw], `${name}_${new Date().getTime()}.${type}`)
      that.up_filename = file.name
      // 占位
      that.licenseImageUrl = [
        {
          status: 'success',
          url: "url + '?' + res.data",
          logo: 'url'
        }
      ]
      const loading = this.$loading({
        lock: true,
        text: '上传中，请耐心等待',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.5)'
      })
      // 文件上传api
      this.tengxun_cos.putObject(
        {
          Bucket: 'updateplug-1300539522' /* 必须 */,
          Region: 'ap-guangzhou' /* 存储桶所在地域，必须字段 */,
          Key: `${name}_${new Date().getTime()}.${type}` /* 必须 */,
          Body: copyFile, // 上传文件对象
          onProgress: progressData => {
            this.progress_wid = progressData.percent * 100 + '%'
            console.log(JSON.stringify(progressData))
          }
        },
        function(err, data) {
          loading.close()
          console.log(err || data.statusCode)
          if (err) that.file_cancel()
          err ? that.$message.error('上传失败,' + err) : that.$message({ message: '恭喜你，上传成功~', type: 'success' })
          if (!err && data.statusCode === 200) that.form.DownUrl = data.Location
        }
      )
    },
    // 删除上传的文件
    // TODO  后期校验把桶的数据删了
    file_cancel() {
      this.licenseImageUrl = []
    },
    dialogClose() {
      this.$emit('update:isshowDialogs', false)
      this.$emit('update:infoList', {
        licenseImageUrl: [],
        progress_wid: '0%'
      })
    },
    clear_form() {
      this.form = {
        Os: '',
        forceUpdate: '',
        Version: '',
        AppId: '',
        content: '1.填写更新内容分点的时候\n2.一定要换行隔开',
        DownUrl: ''
      }
      this.file_cancel()
    }
  }
}
</script>

<style lang="scss" scoped>
.yp {
  padding: 20px;

  .el-row {
    // padding: 10px 0;
  }
  .submit-bth {
    width: 100%;
  }
}
.down-list {
  color: gray;
  font-size: 14px;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  .first-line {
    width: inherit;
    box-sizing: border-box;
    padding: 0 10px;
    display: flex;
    justify-content: space-between;
    margin: 10px 0 0 0;
  }
  .second-line {
    position: relative;
    background-color: #e4dfdf;
    width: 100%;
    height: 4px;
    border-radius: 50px;
    margin: 4px 0 10px 0;
    .progress {
      height: inherit;
      border-radius: 50px;
      position: absolute;
      background-color: skyblue;
    }
  }
}
</style>
