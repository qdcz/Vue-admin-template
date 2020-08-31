<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="listQuery" size="mini">
        <el-form-item label="强制更新">
          <el-select v-model="listQuery.forceUpdate" clearable style="width:150px">
            <el-option :value="0" label="是" />
            <el-option :value="1" label="否" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="listQuery.auditState" clearable style="width:150px">
            <el-option :value="2" label="待审核" />
            <el-option :value="0" label="已发布" />
            <el-option :value="1" label="被拒绝" />
          </el-select>
        </el-form-item>
        <el-form-item label="申请日期">
          <el-date-picker v-model="listQuery.beginTime" style="width: 150px;" clearable type="date" />
          -
          <el-date-picker v-model="listQuery.endTime" style="width: 150px;" clearable type="date" />
        </el-form-item>
        <el-form-item label="发布日期">
          <el-date-picker v-model="listQuery.publishBeginTime" style="width: 150px;" clearable type="date" />
          -
          <el-date-picker v-model="listQuery.publishEndTime" style="width: 150px;" clearable type="date" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
          <el-button type="default" icon="el-icon-reset" @click="handleReset">重置</el-button>
        </el-form-item>
        <el-form-item style="display:block;margin:0"><el-button class="filter-item" type="primary" @click="onAddVersion">新增版本</el-button></el-form-item>
      </el-form>
    </div>
    <!--    <el-table :data="list" v-loading="listLoading" element-loading-text="Loading..." border fit highlight-current-row
      style="width: 100%">
      <el-table-column width="80" align="center" label="序号" sortable prop="i">
        <template slot-scope="scope">
          <span>{{scope.row.i}}</span>
        </template>
      </el-table-column>
      <el-table-column width="100" align="center" label="版本号" show-overflow-tooltip sortable prop="versionCode">
        <template slot-scope="scope">
          <span>{{scope.row.versionCode}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="160" align="center" label="版本名称" show-overflow-tooltip sortable prop="versionName">
        <template slot-scope="scope">
          <span>{{scope.row.versionName}}</span>
        </template>
      </el-table-column>
      <el-table-column width="110" align="center" label="强制更新" sortable prop="forceUpdate">
        <template slot-scope="scope">
          <span>{{scope.row.forceUpdate ? '否' : '是'}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="160" align="center" label="申请时间" sortable prop="createTime">
        <template slot-scope="scope">
          <span>{{scope.row.createTime}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="160" align="center" label="发布时间" sortable prop="auditTimeDisplay">
        <template slot-scope="scope">
          <span>{{scope.row.auditTimeDisplay}}</span>
        </template>
      </el-table-column>
      <el-table-column width="100" align="center" label="状态" sortable prop="auditState">
        <template slot-scope="scope">
          <span>{{scope.row.auditState | formatAuditState}}</span>
        </template>
      </el-table-column>
      <el-table-column width="220" align="center" label="操作" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button class="filter-item" size="mini" type="primary" @click="handleDetail(scope.row)">查看</el-button>
          <el-button :style="'visibility:' + (scope.row.auditState ? 'visible' : 'hidden')" class="filter-item" size="mini" type="danger" @click="handleDel(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table> -->

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
    <!-- unicloud更新 -->
    <tables />

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
    <!-- <Detail ref="detail" @change="getList" /> -->
  </div>
</template>

<script>
// import { getAppList, delApps, selAppList, delApp, SetCurrentUse, getCurrentUse, CheckUpdate } from '@/api/app'
// import { parseTime, checkDateRange } from '@/utils'
// import Detail from './components/appDetail'
// import dialogs from './dialogs.vue'

import tables from './components/Tables.vue'
import addDialog from './components/dialogs.vue'
export default {
  components: { tables, addDialog },
  data() {
    return {
      list: null,
      lists: [], // unicloud
      isshowDialogs: false, // 是否显示发布弹窗
      CurrentUse_IOS: '', // 当前选择使用的IOS版本
      CurrentUse_And: '',
      infoList: '', // 查看详情传给弹窗的数据
      total: null,
      listLoading: false,
      listQuery: {},
      // auditDateObj: null,
      // publishDateObj: null,
      temp: {
        pageNum: 1,
        pageSize: 10,
        forceUpdate: undefined,
        auditState: undefined,
        beginTime: undefined,
        endTime: undefined,
        publishBeginTime: undefined,
        publishEndTime: undefined
      }
    }
  },
  created() {
    // this.listQuery = Object.assign({}, this.temp)
    // this.handleReset();
    this.getLists()
  },
  methods: {
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
    async getLists() {
      this.listLoading = true
      let res = await selAppList()
      this.lists = res.data.data
      res = await getCurrentUse({ Os: 'IOS' })
      this.CurrentUse_IOS = res.data.data.Version
      res = await getCurrentUse({ Os: 'Android' })
      this.CurrentUse_And = res.data.data.Version
      // await CheckUpdate({Os: 'Android'})
      this.listLoading = false
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
    handleFilter() {
      this.listQuery.pageNum = 1
      // this.getList();
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      // this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val
      // this.getList();
    },
    handleReset() {
      this.listQuery = Object.assign({}, this.temp)
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
