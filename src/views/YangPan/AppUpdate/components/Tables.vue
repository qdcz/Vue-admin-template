<template>
  <div class="yz">
    <el-table v-loading="listLoading" :data="list" element-loading-text="Loading..." border fit highlight-current-row style="width: 100%">
      <el-table-column width="80" align="center" label="序号" sortable prop="i">
        <template slot-scope="scope">
          <span>{{ scope.row.i }}</span>
        </template>
      </el-table-column>
      <el-table-column width="100" align="center" label="版本号" show-overflow-tooltip sortable prop="Version">
        <template slot-scope="scope">
          <span>{{ scope.row.Version }}</span>
        </template>
      </el-table-column>
      <el-table-column width="100" align="center" label="版本" show-overflow-tooltip prop="Os">
        <template slot-scope="scope">
          <span>{{ scope.row.Os }}</span>
        </template>
      </el-table-column>
      <el-table-column width="200" align="center" label="AppId" show-overflow-tooltip prop="AppId">
        <template slot-scope="scope">
          <span>{{ scope.row.AppId }}</span>
        </template>
      </el-table-column>
      <el-table-column width="110" align="center" label="是否强制更新" show-overflow-tooltip prop="forceUpdate">
        <template slot-scope="scope">
          <span>{{ scope.row.forceUpdate ==='YES'?'是':'否' }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="160" align="center" label="版本内容" show-overflow-tooltip sortable prop="content">
        <template slot-scope="scope">
          <span>{{ scope.row.content }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发布时间" align="center" prop="createTime" :formatter="formatDate" width="200" />
      <el-table-column width="100" align="center" label="状态" sortable prop="auditState">
        <template slot-scope="scope">
          <span>{{ scope.row.IsCurrentUse ? '启用中' : '停用中' }}</span>
        </template>
      </el-table-column>
      <el-table-column width="260" align="center" label="操作" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button class="filter-item" size="mini" :type="scope.row.IsCurrentUse?'success':''" @click="tableItemUse(scope.row)">启用此版本</el-button>
          <el-button class="filter-item" size="mini" type="primary" @click="tableItemDetail(scope.row)">查看</el-button>
          <el-button class="filter-item" size="mini" type="danger" @click="tableItemDel(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { API$DeketeVersiont, API$UpdCurrentUse } from '../../../../api/YangPan/UploadApp.js'
export default {
  name: 'Tables',
  props: {
    listLoading: {
      type: Boolean,
      default: false
    },
    list: {
      type: Array,
      default: function() {
        return []
      }
    },
    isshowDialogs: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {}
  },
  methods: {
    // 删除按钮
    tableItemDel(e) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.Del(e._id)
      })
    },
    // 查看按钮
    tableItemDetail(e) {
      this.$emit('update:isshowDialogs', true)
      const DialogInfo = Object.assign({ progress_wid: '100%', licenseImageUrl: [{ name: '占位' }] }, e)
      this.$emit('update:dialogInfo', DialogInfo)
    },
    // 启用/禁用按钮
    async tableItemUse(e) {
      let loading = null
      try {
        loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        const { code, msg } = await API$UpdCurrentUse({ Os: e.Os, _id: e._id })
        if (code === 200) {
          this.$message({
            message: msg,
            type: 'success'
          })
          this.$emit('updateList')
        }
      } catch (e) {
        console.log(e)
      } finally {
        loading.close()
      }
    },
    formatDate(row, column) {
      const data = row[column.property]
      const dt = new Date(data)
      return dt.getFullYear() + '-' + (dt.getMonth() + 1) + '-' + dt.getDate() + ' ' + dt.getHours() + ':' + dt.getMinutes() + ':' + dt.getSeconds()
    },
    async Del(e) {
      let loading = null
      try {
        loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        const { code, msg } = await API$DeketeVersiont({ id: e })
        if (code === 200) {
          this.$message({
            message: msg,
            type: 'success'
          })
          this.$emit('updateList')
        }
      } catch (e) {
        console.log(e)
      } finally {
        loading.close()
      }
    }
  }
}
</script>

<style></style>
