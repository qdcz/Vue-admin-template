<template>
  <div class="yz">
    <el-table v-loading="listLoading" :data="list" element-loading-text="Loading..." border fit highlight-current-row style="width: 100%">
      <el-table-column width="80" align="center" label="序号" sortable prop="i">
        <template slot-scope="scope">
          <span>{{ scope.row.i }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120" align="center" label="发布者" show-overflow-tooltip prop="Nickname">
        <template slot-scope="scope">
          <span>{{ scope.row.UserInfo[0].Nickname }}</span>
        </template>
      </el-table-column>
      <el-table-column width="200" align="center" label="发布者ID" show-overflow-tooltip prop="_id">
        <template slot-scope="scope">
          <span>{{ scope.row.UserInfo[0]._id }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120" align="center" label="观看人数" show-overflow-tooltip sortable prop="viewCount">
        <template slot-scope="scope">
          <span>{{ scope.row.viewCount }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120" align="center" label="评论人数" show-overflow-tooltip sortable prop="CommonList">
        <template slot-scope="scope">
          <span>{{ scope.row.CommonList.length }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120" align="center" label="点赞人数" show-overflow-tooltip sortable prop="likeList">
        <template slot-scope="scope">
          <span>{{ scope.row.likeList.length }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120" align="center" label="分享次数" show-overflow-tooltip sortable prop="shareList">
        <template slot-scope="scope">
          <span>{{ scope.row.shareList.length }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="160" align="center" label="发布内容" show-overflow-tooltip sortable prop="contents">
        <template slot-scope="scope">
          <span>{{ scope.row.contents || '暂无文字' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发布时间" align="center" prop="PublishTime" :formatter="formatDate" width="200" />
      <el-table-column width="100" align="center" label="状态" sortable prop="auditState">
        <template slot-scope="scope">
          <span>{{ scope.row.IsCurrentUse ? '启用中' : '停用中' }}</span>
        </template>
      </el-table-column>
      <el-table-column width="260" align="center" label="操作" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <!-- <el-button class="filter-item" size="mini" :type="scope.row.IsCurrentUse?'success':''" @click="tableItemUse(scope.row)">启用此版本</el-button> -->
          <el-button class="filter-item" size="mini" type="primary" @click="tableItemDetail(scope.row)">查看</el-button>
          <el-button class="filter-item" size="mini" type="danger" @click="tableItemDel(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { API$UpdCurrentUse } from '../../../../api/YangPan/UploadApp.js'
import { API$DelArticle } from '../../../../api/YangPan/article.js'
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
      this.$emit('update:dialogInfo', e)
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
        const { code, msg } = await API$DelArticle({ _id: e })
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
