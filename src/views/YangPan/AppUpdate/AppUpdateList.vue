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
            <el-option :value="0" label="是" />
            <el-option :value="1" label="否" />
          </el-select>
        </el-form-item>
        <el-form-item label="使用状态" placeholder="选择使用状态">
          <el-select v-model="QuerySelect.IsCurrentUse" clearable style="width:150px">
            <el-option :value="true" label="使用中" />
            <el-option :value="false" label="停用中" />
          </el-select>
        </el-form-item>
        <el-form-item label="发布时间">
          <el-date-picker v-model="listQuery.publishBeginTime" style="width: 150px;" clearable type="date" />
          -
          <el-date-picker v-model="listQuery.publishEndTime" style="width: 150px;" clearable type="date" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSelect">查询</el-button>
          <el-button type="default" icon="el-icon-reset" @click="onReset">重置</el-button>
        </el-form-item>
        <el-form-item style="display:block;margin:0"><el-button class="filter-item" type="primary" @click="onAddVersion">新增版本</el-button></el-form-item>
      </el-form>
    </div>

    <!-- 指定当前使用的版本 -->
    <el-row type="flex" class="row-bg" justify="start" align="middle" :gutter="10">
      <el-col :span="2"><div>Android版本</div></el-col>
      <el-col :span="4">
        <el-select v-model="CurrentUse_And" placeholder="当前使用的版本,慎重操作" style="padding: 10px 0; float: right;" @change="onSelCurrUse_And">
          <el-option v-for="(i, j) in lists.filter(item => item.Os == 'Android')" :key="j" :label="i.Version" :value="i._id" />
        </el-select>
      </el-col>
      <el-col :span="2"><div>IOS版本</div></el-col>
      <el-col :span="4">
        <el-select v-model="CurrentUse_IOS" placeholder="当前使用的版本,慎重操作" style="padding: 10px 0; float: right;" @change="onSelCurrUse_IOS">
          <el-option v-for="(i, j) in lists.filter(item => item.Os == 'IOS')" :key="CurrentUse_IOS.length + j" :label="i.Version" :value="i._id" />
        </el-select>
      </el-col>
    </el-row>
    <!-- 添加编辑的dialog -->
    <add-dialog :isshow-dialogs.sync="isshowDialogs" :info-list.sync="infoList" @updateList="getLists" />
    <!-- 表格 -->
    <tables :list="DataList" :list-loading.sync="listLoading" />
    <!-- 分页器 -->
    <div class="pagination-container">
      <el-pagination
        background
        :current-page="listQuery.pageNum"
        :page-sizes="[10, 20]"
        :page-size="listQuery.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
// import { getAppList, delApps, selAppList, delApp, SetCurrentUse, getCurrentUse, CheckUpdate } from '@/api/app'
// import { parseTime, checkDateRange } from '@/utils'
// import Detail from './components/appDetail'
// import dialogs from './dialogs.vue'
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
      infoList: '', // 查看详情传给弹窗的数据

      listLoading: false,
      listQuery: {},
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
      total: null, // 分页器总数
      isshowDialogs: false, // 是否显示发布弹窗
      DataList: [] // 表格数据
    }
  },
  created() {
    // this.listQuery = Object.assign({}, this.temp)
    // this.handleReset();
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

    getList() {
      if (!checkDateRange(this.listQuery.beginTime, this.listQuery.endTime) || !checkDateRange(this.listQuery.publishBeginTime, this.listQuery.publishEndTime)) {
        this.$message({
          type: 'error',
          message: this.i18n.Error.DateRange
        })
        return false
      }
      this.listLoading = true
      const query = Object.assign({}, this.listQuery)
      // if (typeof query.forceUpdate !== 'undefined') {
      //   query.forceUpdate = parseInt(query.forceUpdate)
      // }
      // if (typeof query.auditState !== 'undefined') {
      //   query.auditState = parseInt(query.auditState)
      // }
      query.beginTime && (query.beginTime = parseTime(query.beginTime, '{y}-{m}-{d} 0:0:0'))
      query.endTime && (query.endTime = parseTime(query.endTime, '{y}-{m}-{d} 23:59:59'))
      query.publishBeginTime && (query.publishBeginTime = parseTime(query.publishBeginTime, '{y}-{m}-{d} 0:0:0'))
      query.publishEndTime && (query.publishEndTime = parseTime(query.publishEndTime, '{y}-{m}-{d} 23:59:59'))
      // getAppList(query).then(response => {
      // 	if (response.data.code === 200) {
      // 		this.list = response.data.data.list;
      // 		this.total = response.data.data.total;
      // 		this.list.filter((e, i) => {
      // 			e.i = (query.pageNum - 1) * query.pageSize + i + 1;
      // 			e.createTime && (e.createTime = parseTime(e.createTime, '{y}-{m}-{d} {h}:{i}:{s}'));
      // 			if (e.auditState === 0 && e.auditTime) {
      // 				e.auditTimeDisplay = parseTime(e.auditTime, '{y}-{m}-{d} {h}:{i}:{s}');
      // 			} else {
      // 				e.auditTimeDisplay = '';
      // 			}
      // 		});
      // 	}
      // 	this.listLoading = false;
      // });
    },
    async getLists(json) {
      json = json || { pageNum: this.QuerySelect.pageNum, pageSize: this.QuerySelect.pageSize }
      try {
        this.listLoading = true
        const { code, msg, total, data } = await API$UpdateVersionList(json)
        console.log(code, msg, total)
        for (let i = 0, item; (item = data[i]); i++) {
          item['i'] = i + 1
        }
        this.DataList = data
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
    // 选择当前使用的版本  andorid
    async onSelCurrUse_And(e) {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      const res = await SetCurrentUse({ _id: e, Os: 'Android' })
      loading.close()
      this.$message({
        type: 'success',
        message: res.data.msg
      })
      this.getLists()
    },
    // 选择当前使用的版本  IOS
    async onSelCurrUse_IOS(e) {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      const res = await SetCurrentUse({ _id: e, Os: 'IOS' })
      loading.close()
      this.$message({
        type: 'success',
        message: res.data.msg
      })
      this.getLists()
    },

    onAddVersion() {
      this.isshowDialogs = true
    },
    handleDel(row) {
      this.$confirm('确认删除该版本?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        try {
          const res = await delApps({ _id: row._id })
          if (res.data.code == 200) {
            this.$message.success(res.data.msg)
            this.getLists()
          }
        } catch (err) {
          this.$message.error(err)
        } finally {
        }
      })
    },
    handleDetail(obj) {
      this.isshowDialogs = true
      this.infoList = Object.assign({ progress_wid: '100%', licenseImageUrl: [{ name: '占位' }] }, obj)
      // this.$router.push('./' + obj.id)
      // this.$refs.detail.show(obj, 'info');
    }
  }
}
</script>
