<template>
  <div class="dialogs">
    <el-dialog title="修改文章信息" :visible.sync="isshowDialogs" width="60%" center @close="dialogClose">
      <el-form ref="form" :model="form" class="el-form" :rules="rules" label-width="80px" label-position="left">
        <el-form-item label="发布者" prop="Nickname"><el-input v-model="form.Nickname" size="large" disabled="disabled" /></el-form-item>
        <el-form-item>
          <span style="color: red;">注意这边获取的图片是上传到serverless上的云存储的 这边上传的话要上传到oss上图片分开了</span>
          <span style="color: red;display: block;">图片暂时不写修改 重新上传部分</span>
          <el-upload
            ref="upload"
            action=""
            class="avatar-uploader"
            list-type="picture-card"
            :auto-upload="false"
            :limit="9"
            :file-list="fileList"
            :before-upload="beforeImgUpload"
            :on-exceed="cover_handleExceed"
            :on-success="ImgUploadSuccess"
            :before-remove="BeforeRemoveImgUpload"
            :on-preview="ImgPreview"
            :on-change="singleFileChange"
          >
            <i class="el-icon-plus avatar-uploader-icon" />
          </el-upload>

          <!-- 图片查看 -->
          <el-dialog :visible.sync="ImgDialog.Visible"><img width="100%" :src="ImgDialog.ImageUrl" alt=""></el-dialog>
        </el-form-item>
        <el-form-item label="发布内容" prop="contents">
          <el-input v-model="form.contents" size="large" placeholder="简介" type="textarea" :autosize="{ minRows: 4, maxRows: 10 }" />
        </el-form-item>
        <el-button class="submit-bth" type="primary" @click="onSubmit('form')">{{ dialogInfo._id ? '更新' : '发布' }}</el-button>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
const OSS = require('ali-oss')
import { API$GetSts, API$DelOssFile } from '../../../../api/YangPan/OSS.js'
import { API$UpdArticle } from '../../../../api/YangPan/article.js'
export default {
  props: ['isshowDialogs', 'dialogInfo'],
  data() {
    return {
      ali_oss: '',
      licenseImageUrl: [],
      fileList: [],
      ImgDialog: {
        ImageUrl: '',
        Visible: false
      },
      form: {
        Nickname: '',
        contents: ''
      },
      rules: {
        birth: [{ required: true, message: '生日不能为空', trigger: 'change' }]
      }
    }
  },
  watch: {
    dialogInfo() {
      this.form.Nickname = this.dialogInfo.UserInfo[0].Nickname
      this.form.contents = this.dialogInfo.contents

      for (let i = 0, item; (item = this.dialogInfo.imgList[i]); i++) {
        this.fileList.push({
          name: item.fileid,
          url: item.tempFileURL
        })
      }
    }
  },
  async created() {
    // this.GetOssSts()
  },
  methods: {
    // 上传文件之前的钩子
    beforeImgUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    // 文件超出个数限制时的钩子
    cover_handleExceed() {
      this.$message.warning('最多上传1张图片')
    },
    BeforeRemoveImgUpload() {
      return new Promise((res, rej) => {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.DelOssFile(this.fileList[0].name)
            res()
          })
          .catch(() => {
            rej()
          })
      })
    },
    // 图片上传成功~
    ImgUploadSuccess(file, fileList) {
      this.fileList[0].url = fileList.response.data
    },
    // 图片预览
    ImgPreview(file) {
      this.ImgDialog.ImageUrl = file.url
      this.ImgDialog.Visible = true
    },
    // 提交信息
    async onSubmit(formName) {
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
      // const avatar = this.fileList.length > 0 ? this.fileList[0].url : ''
      const json = Object.assign({ _id: this.dialogInfo._id }, this.form)
      console.warn(json)
      try {
        const { code, msg } = await API$UpdArticle(json)
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
      // if (!['apk', 'wgt'].includes(type)) {
      //   this.licenseImageUrl = []
      //   this.$message.error('上传文件格式不支持!,只支持apk和wgt文件')
      //   return
      // }
      if (!(file.size / 1024 / 1024 < 100)) {
        this.licenseImageUrl = []
        this.fileList = []
        return this.$message.error('上传文件大小不能超过 100MB!')
      }
      const copyFile = new File([file.raw], `${name}_${new Date().getTime()}.${type}`)
      this.up_filename = file.name
      const loading = this.$loading({
        lock: true,
        text: '上传中，请耐心等待',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.5)'
      })

      //  阿里云  文件上传api
      try {
        const res = await this.ali_oss.multipartUpload(`/uploadImg/${this.form.account}/${name}_${new Date().getTime()}.${type}`, copyFile, {
          progress: (p, checkpoint) => {
            const progress_wid = (p * 100).toString().slice(0, 4) + '%'
            if (progress_wid === '100%') {
              this.$message({
                message: '上传成功~',
                type: 'success'
              })
            }
          },
          meta: { year: 2020, people: 'test' }
        })
        if (res.res.status === 200) {
          console.warn(res.res)
          this.fileList = [
            {
              name: res.name, //    /uploadImg/15892023483/05_1599731424799.jpg
              // url: res.res.requestUrls[0] //    "http://qdds666.oss-cn-hangzhou.aliyuncs.com/uploadImg//06_1599731490849.jpg"
              url: 'http://qdds666.oss-cn-hangzhou.aliyuncs.com/' + res.name
            }
          ]
        }
      } catch (e) {
        console.log(e)
        this.$message.error('上传失败')
      } finally {
        loading.close()
      }
    },

    // 清空表单
    clear_form() {
      this.form = {
        Nickname: '',
        contents: ''
      }
      this.fileList = []
    },
    dialogClose() {
      this.$emit('update:isshowDialogs', false)
      this.$emit('update:DialogInfo', '')
      this.clear_form()
    },
    /** *****************************************************************  OSS处理部分****************************************************/
    // 初始化oss
    async GetOssSts() {
      const {
        code,
        msg,
        Sts: { credentials }
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
    },
    // 删除oss文件
    async DelOssFile(dir) {
      try {
        await API$DelOssFile({ filePath: dir })
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.fileList = []
        this.$refs.upload.clearFiles()
      } catch (e) {
        this.$message.error(e)
      } finally {
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
