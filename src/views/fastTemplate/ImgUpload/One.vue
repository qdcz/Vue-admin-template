<template>
  <div class="padd20">
    <h1>上传单张图片</h1>
    <el-upload
      ref="upload"
      class="avatar-uploader"
      list-type="picture-card"
      :action="UploadImgUrl"
      :auto-upload="true"
      :limit="1"
      :before-upload="beforeImgUpload"
      :on-exceed="cover_handleExceed"
      :on-success="ImgUploadSuccess"
      :on-remove="RemoveImgUpload"
      :on-preview="ImgPreview"
    >
      <img v-if="imageUrl" :src="imageUrl" class="avatar">
      <i v-else class="el-icon-plus avatar-uploader-icon" />
    </el-upload>

    <!-- 图片查看 -->
    <el-dialog :visible.sync="ImgDialog.Visible">
      <img width="100%" :src="ImgDialog.ImageUrl" alt="">
    </el-dialog>

    <el-button class="mt20" type="primary" @click="clearAllImg">清空所有图片</el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      UploadImgUrl: 'http://101.37.68.84:8080/daoyi-app/Image/upload',
      imageUrl: '', // 传给后端的数据
      ImgDialog: {
        ImageUrl: '',
        Visible: false
      }
    }
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
    // 移除图片
    RemoveImgUpload() {
      this.imageUrl = ''
    },
    // 图片上传成功~
    ImgUploadSuccess(file, fileList) {
      this.imgUrl = fileList.response.data
      // URL.createObjectURL(file.raw);
    },
    // 图片预览
    ImgPreview(file) {
      this.ImgDialog.ImageUrl = file.url
      this.ImgDialog.Visible = true
    },
    // 清空所有图片
    clearAllImg() {
      // 清空已上传的文件列表
      this.$refs.upload.clearFiles()
    }
  }
}
</script>

<style scoped="scoped"></style>
