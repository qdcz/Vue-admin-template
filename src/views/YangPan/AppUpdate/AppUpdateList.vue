<template>
  <div class="app-container">
    <!-- 查询条件 -->
    <div class="filter-container">
      <el-form :inline="true" :model="QuerySelect" size="mini">
        <el-form-item label="APPID"><el-input v-model="QuerySelect.APPID" size="mini" placeholder="请输入APPID" /></el-form-item>
        <el-form-item label="版本号" prop="Version"><el-input v-model="QuerySelect.Version" size="mini" placeholder="请输入版本号" /></el-form-item>
        <el-form-item label="版本更新内容" prop="content"><el-input v-model="QuerySelect.content" clearable size="mini" placeholder="请输入版本更新内容" /></el-form-item>
        <el-form-item label="强制更新">
          <el-select v-model="QuerySelect.forceUpdate" clearable style="width:150px" placeholder="是否强制更新">
            <el-option value="YES" label="是" />
            <el-option value="NO" label="否" />
          </el-select>
        </el-form-item>
        <el-form-item label="使用状态" placeholder="选择使用状态">
          <el-select v-model="QuerySelect.IsCurrentUse" clearable style="width:150px">
            <el-option :value="true" label="使用中" />
            <el-option :value="false" label="停用中" />
          </el-select>
        </el-form-item>
        <el-form-item label="发布时间">
          <el-date-picker v-model="QuerySelect.publishBeginTime" style="width: 150px;" clearable type="date" />
          -
          <el-date-picker v-model="QuerySelect.publishEndTime" style="width: 150px;" clearable type="date" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSelect">查询</el-button>
          <el-button type="default" icon="el-icon-reset" @click="onReset">重置</el-button>
        </el-form-item>
        <el-form-item style="display:block;margin:0"><el-button class="filter-item" type="primary" @click="onAddVersion">新增版本</el-button></el-form-item>
      </el-form>
    </div>

    <!-- 添加编辑的dialog -->
    <add-dialog :isshow-dialogs.sync="isshowDialogs" :dialog-info.sync="DialogInfo" @updateList="getLists" />
    <!-- 表格 -->
    <tables class="mt20" :list="DataList" :list-loading.sync="listLoading" :isshow-dialogs.sync="isshowDialogs" :dialog-info.sync="DialogInfo" @updateList="getLists" />
    <!-- 分页器 -->
    <div class=" mt20">
      <el-pagination
        :current-page="QuerySelect.pageNum"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="QuerySelect.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import { API$UpdateVersionList } from '../../../api/YangPan/UploadApp.js'
import tables from './components/Tables.vue'
import addDialog from './components/dialogs.vue'
export default {
  components: { tables, addDialog },
  data() {
    return {
      list: null,
      lists: [], // unicloud
      CurrentUse_IOS: '', // 当前选择使用的IOS版本
      CurrentUse_And: '',

      listLoading: false,
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
      total: 0, // 分页器总数
      isshowDialogs: false, // 是否显示发布弹窗
      DataList: [], // 表格数据
      DialogInfo: '' // 表格内查看编辑带给dialog的数据
    }
  },
  created() {
    this.getLists()
  },
  methods: {
    // 条件查询按钮
    onSelect() {
      this.getLists(this.QuerySelect)
    },
    // 查询条件重置
    onReset() {
      this.QuerySelect = {
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
      }
    },
    // 分页器 条数发生变化
    handleSizeChange(val) {
      this.QuerySelect.pageSize = val
      this.getLists()
    },
    // 分页器 页数发生变化
    handleCurrentChange(val) {
      this.QuerySelect.pageNum = val - 1
      this.getLists()
    },
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
      // res = await getCurrentUse({ Os: 'IOS' })
      // this.CurrentUse_IOS = res.data.data.Version
      // res = await getCurrentUse({ Os: 'Android' })
      // this.CurrentUse_And = res.data.data.Version
      // await CheckUpdate({Os: 'Android'})
    },

    onAddVersion() {
      this.isshowDialogs = true
    }
  }
}
</script>
