<template>
  <div class="yz padd40">
    <tables class="mt20" :list="DataList" :list-loading.sync="listLoading" :isshow-dialogs.sync="isshowDialogs" :dialog-info.sync="DialogInfo" @updateList="getLists" />
  </div>
</template>

<script>
import { API$UpdateVersionList } from '../../../api/YangPan/UploadApp.js'
import tables from './table.vue'
export default {
  name: 'Tables',
  components: { tables },
  data() {
    return {
      QuerySelect: {
        // 条件查询参数
        pageNum: 0,
        pageSize: 10,
        forceUpdate: '',
        APPID: '',
        Version: '',
        content: '',
        IsCurrentUse: '',
        begin_createTime: '',
        end_createTime: ''
      },

      listLoading: false,
      DataList: [], // 表格数据
      isshowDialogs: false, // 是否显示发布弹窗
      DialogInfo: '', // 表格内查看编辑带给dialog的数据
      total: 0 // 分页器总数
    }
  },
  created() {
    this.getLists()
  },
  methods: {
    async getLists(json) {
      json = json || { pageNum: this.QuerySelect.pageNum, pageSize: this.QuerySelect.pageSize }
      try {
        this.listLoading = true
        const { code, msg, total, data } = await API$UpdateVersionList(json)
        if (code === 200) {
          this.$message({
            message: msg,
            type: 'success'
          })
          for (let i = 0, item; (item = data[i]); i++) {
            item['i'] = i + 1
          }
          this.total = total
          this.DataList = data
        }
      } catch (e) {
        console.log(e)
      } finally {
        this.listLoading = false
      }
    }
  }
}
</script>

<style lang="less" scoped="scoped"></style>
