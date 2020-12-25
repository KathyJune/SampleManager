<template>
  <div class="res-table">
    <div class="table-title">
      检索结果
      <svg t="1600829712581" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3247" width="16" height="16"><path d="M722.19 731.04c-8.85 0-17.75-3.05-24.98-9.27L276.79 360.41c-16.07-13.81-17.89-38.03-4.09-54.09 13.81-16.06 38.02-17.9 54.09-4.09l420.42 361.36c16.07 13.81 17.89 38.03 4.09 54.09-7.59 8.83-18.32 13.36-29.11 13.36z" p-id="3248" fill="#ffffff"></path><path d="M301.81 731.04c-10.79 0-21.52-4.53-29.11-13.35-13.81-16.07-11.98-40.28 4.09-54.09l420.42-361.36c16.07-13.81 40.28-11.98 54.09 4.09 13.81 16.06 11.98 40.28-4.09 54.09L326.79 721.77a38.192 38.192 0 0 1-24.98 9.27z" p-id="3249" fill="#ffffff"></path></svg>
    </div>
    <div class="content-table">
      <el-table highlight-current-row class="" :data="listData.data.content" size="mini" style="width: 100%" stripe @current-change="handleCurrentChange">
        <el-table-column label="id" width="80">
          <template slot-scope="scope">
            <span>{{ cutString(scope.row.id, 3) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="classType" label="分类体系" width="50"></el-table-column>
        <el-table-column label="数据来源" width="80">
          <template slot-scope="scope">
            <span>{{ cutString(scope.row.source, 3) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="生产日期">
          <template slot-scope="scope">
            <span>{{ getDate(scope.row.produceTime) }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="block">
      <el-pagination
        layout="prev, pager, next"
        :pager-count="5"
        :page-size="20"
        :total="listData.data.totalElements"
        @current-change="handleCurrentPageChange"
        @prev-click="pageUp()"
        @next-click="pageDown()">
      </el-pagination>
    </div>
    <div class="element-count" style="padding-left: 20px;">共 {{listData.data.totalElements}} 条数据</div>
    <el-button type="success" @click="ZoomToCurrentList">缩放到当前列表</el-button>
  </div>
</template>

<script>
export default {
  name: 'res-list',
  components: {
  },
  props: {
    listData: {
      required: true
    }
  },
  data () {
    return {
      currentPage: 0
    }
  },
  mounted () {
    console.log(this.listData)
  },
  methods: {
    handleCurrentChange (val) {
      this.$emit('SelectedGeojsonChange', val)
    },
    cutString (str, len) {
      if (str.length <= len * 2) {
        return str
      } else {
        // debugger
        let a = str.split('')
        a.splice(len, a.length - 2 * len, '..')
        a = a.join('')
        return a
      }
    },
    getDate (str) {
      let reg = /\d{2}-\d{2}-\d{2}/
      return str.match(reg)[0]
    },
    handleCurrentPageChange (val) {
      this.currentPage = val
      this.pageChange(val)
    },
    ZoomToCurrentList () {
      this.$emit('ZoomToCurrentList')
    },
    pageUp () {
      this.currentPage = this.currentPage - 1
      this.pageChange(this.currentPage)
    },
    pageDown () {
      this.currentPage = this.currentPage + 1
      this.pageChange(this.currentPage)
    },
    pageChange (val) {
      this.$emit('pageChange', val)
    }
  }
}
</script>

<style scoped>

</style>
