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
      <el-table-column width="100" align="center" label="版本" show-overflow-tooltip sortable prop="Os">
        <template slot-scope="scope">
          <span>{{ scope.row.Os }}</span>
        </template>
      </el-table-column>
      <el-table-column width="200" align="center" label="是否强制更新" show-overflow-tooltip sortable prop="forceUpdate">
        <template slot-scope="scope">
          <span>{{ scope.row.forceUpdate }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="160" align="center" label="版本内容" show-overflow-tooltip sortable prop="content">
        <template slot-scope="scope">
          <span>{{ scope.row.content }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="160" align="center" label="发布时间" sortable prop="auditTimeDisplay">
        <template slot-scope="scope">
          <span>{{ scope.row.publishTime }}</span>
        </template>
      </el-table-column>
      <el-table-column width="100" align="center" label="状态" sortable prop="auditState">
        <template slot-scope="scope">
          <span>{{ scope.row.IsCurrentUse ? '启用中' : '停用中' }}</span>
        </template>
      </el-table-column>
      <el-table-column width="220" align="center" label="操作" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button class="filter-item" size="mini" type="primary" @click="handleDetail(scope.row)">查看</el-button>
          <el-button class="filter-item" size="mini" type="danger" @click="handleDel(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
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
    }
  },
  data() {
    return {
    }
  }
}
</script>

<style>
</style>
