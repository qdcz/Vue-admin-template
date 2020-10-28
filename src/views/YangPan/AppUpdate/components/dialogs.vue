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
        <el-form-item label="安装包" prop="DownUrl">
          <el-upload class="wid1p" drag action="#666" :on-change="singleFileChange" :file-list="licenseImageUrl" :limit="1" :auto-upload="false" :show-file-list="false">
            <i class="el-icon-upload" />
            <div class="el-upload__text">
              将文件拖到此处，或
              <em>点击上传</em>
            </div>
            <div slot="tip" class="el-upload__tip" style="padding:10px; line-height: 0;">只能上传单个文件，且不超过100MB</div>

            <div v-if="licenseImageUrl.length >= 1" slot="tip" class="down-list" style="padding:10px 0; line-height: 1;">
              <div class="first-line">
                <div style="display: flex; align-items: center;">
                  <div>{{ up_filename }}</div>
                </div>
                <div v-if="progress_wid != '100%'">{{ progress_wid }}</div>
                <i v-else class="el-icon-delete" @click="file_cancel" />
              </div>
              <div class="second-line"><div class="progress" :style="{ width: progress_wid }" /></div>
            </div>
          </el-upload>
        </el-form-item>
        <el-button class="submit-bth" type="primary" @click="onSubmit('form')">{{ dialogInfo._id ? '更新' : '发布' }}</el-button>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
// const COS = require('cos-js-sdk-v5')
const OSS = require('ali-oss')
import { API$GetSts } from '../../../../api/YangPan/OSS.js'
import { API$AddUpdateVersion, API$UpdVersiont } from '../../../../api/YangPan/UploadApp.js'
export default {
  props: ['isshowDialogs', 'dialogInfo'],
  data() {
    return {
      tengxun_cos: '',
      ali_oss: '',
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
    dialogInfo() {
      const { Os, forceUpdate, Version, content, DownUrl, AppId } = this.dialogInfo
      this.form = { Os, forceUpdate, Version, content, DownUrl, AppId }
      this.progress_wid = this.dialogInfo.progress_wid
      this.up_filename = DownUrl
      this.licenseImageUrl = this.dialogInfo.licenseImageUrl
    }
  },
  async created() {
    this.GetOssSts()
  },
  methods: {
    // 提交信息
    async onSubmit(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          let loading = null
          if (this.form.Version.split('.').length !== 3) {
            return this.$message({
              message: '版本号格式错误~',
              type: 'warning'
            })
          }
          try {
            loading = this.$loading({
              lock: true,
              text: 'Loading',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            })
            this.dialogInfo._id ? this.UpdAPI() : this.AddAPI()
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
    },
    // 添加数据
    async AddAPI() {
      try {
        const { code, msg } = await API$AddUpdateVersion(this.form)
        if (code === 200) {
          this.$message(msg)
          this.dialogClose()
          this.$emit('updateList')
        }
      } catch (err) {
        this.$message.error(err)
      } finally {
        this.clear_form()
      }
    },
    // 更新数据
    async UpdAPI() {
      const json = Object.assign({ _id: this.dialogInfo._id }, this.form)
      try {
        const { code, msg } = await API$UpdVersiont(json)
        if (code === 200) {
          this.$message({
            message: msg,
            type: 'success'
          })
          this.dialogClose()
          this.$emit('updateList')
        }
      } catch (err) {
        this.$message.error(err)
      } finally {
        this.clear_form()
      }
    },
    // 重写上传文件选择时回调 直接上传
    async singleFileChange(file, fileList) {
      const name = file.name.slice(0, file.name.match(/[^\.]\w*$/).index - 1)
      const type = file.name.match(/[^\.]\w*$/)[0]
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
      this.up_filename = file.name
      // // 占位
      this.licenseImageUrl = [
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

      //  阿里云  文件上传api
      try {
        const res = await this.ali_oss.multipartUpload(`/uploadApp/${name}_${new Date().getTime()}.${type}`, copyFile, {
          progress: (p, checkpoint) => {
            this.progress_wid = (p * 100).toString().slice(0, 4) + '%'
            if (this.progress_wid === '100%') {
              this.$message({
                message: '上传成功~',
                type: 'success'
              })
            }
          },
          meta: { year: 2020, people: 'test' }
        })
        if (res.res.status === 200) {
          this.form.DownUrl = res.name
        }
      } catch (e) {
        console.log(e)
        this.$message.error('上传失败')
      } finally {
        loading.close()
      }

      // 腾讯云 上传API
      // this.tengxun_cos.putObject(
      //   {
      //     Bucket: 'updateplug-1300539522' /* 必须 */,
      //     Region: 'ap-guangzhou' /* 存储桶所在地域，必须字段 */,
      //     Key: `${name}_${new Date().getTime()}.${type}` /* 必须 */,
      //     Body: copyFile, // 上传文件对象
      //     onProgress: progressData => {
      //       this.progress_wid = progressData.percent * 100 + '%'
      //       console.log(JSON.stringify(progressData))
      //     }
      //   },
      //   function(err, data) {
      //     loading.close()
      //     console.log(err || data.statusCode)
      //     if (err) that.file_cancel()
      //     err ? that.$message.error('上传失败,' + err) : that.$message({ message: '恭喜你，上传成功~', type: 'success' })
      //     if (!err && data.statusCode === 200) that.form.DownUrl = data.Location
      //   }
      // )
    },
    // 删除上传的文件
    // TODO  后期校验把桶的数据删了
    file_cancel() {
      this.licenseImageUrl = []
      this.form.DownUrl = ''
    },
    dialogClose() {
      this.$emit('update:isshowDialogs', false)
      this.$emit('update:dialogInfo', {
        licenseImageUrl: [],
        progress_wid: '0%'
      })
    },

    // 清空表单
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
    },
    // 初始化oss
    async GetOssSts() {
      const {
        code,
        msg,
        data: { credentials }
      } = await API$GetSts()
      if (code === 200) {
        this.ali_oss = new OSS({
          region: 'oss-cn-hangzhou',
          accessKeyId: credentials.AccessKeyId,
          accessKeySecret: credentials.AccessKeySecret,
          stsToken: credentials.SecurityToken,
          bucket: 'qdds666'
        })
        this.$message({
          message: msg,
          type: 'success'
        })
      }
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
