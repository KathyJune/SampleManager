<template>
  <div class="delete-manage animated fadeIn">
    <div style="margin-top:15px"></div>
    <div class="upload-panel">
      <div class="list-panel">
        <b-card>
          <div class="pagination-panel">
            <b-form-select :options='pageSize' @change="pageSizeChange" :value="50"></b-form-select>
            <b-pagination size="sm" :total-rows="totalList" :per-page="perPage" @change="pageChange" v-model="currentPage" first-text='<<' prev-text="<" next-text=">" last-text='>>'/>
          </div>
          <ul class="search-tree">
            <li class="th-header">
              <p>批次号</p>
              <p>操作</p>
            </li>
            <li class="tr" v-for="item in recordList" :key="item.name">
              <p v-html="item.id"></p>
              <p>
                <el-button @click.native.prevent="handleClick(item)" size="mini">查看</el-button>
              </p>
              <!--<p v-html="item.username"></p>-->
            </li>
          </ul>
        </b-card>
      </div>
      <div class="detail-panel">
        <b-card>
          <template slot="header">
            <div class="batch-info">
              <label>批次号:</label><span v-html="info.id"></span>
              <label>用户:</label><span v-html="info.username"></span>
              <label>开始时间:</label><span v-html="info.starttime"></span>
              <label>结束时间:</label><span v-html="info.endtime"></span>
              <label>总计:</label><span class="text-primary" v-html="total"></span>
              <label>成功：</label><span class="text-success" v-html="total - failureTotal - deleteing"></span>
              <label>删除中：</label><span class="text-primary" v-html="deleteing"></span>
              <label>失败：</label><span class="text-danger" v-html="failureTotal"></span>
            </div>
            <div class="batch-info">
              <label>录入参数:</label><span v-html="info.urls"></span>
            </div>
            <div class="batch-info" v-if="info.errormsg">
              <label>失败信息:</label><span class="text-danger" v-html="info.errormsg"></span>
            </div>
          </template>
          <el-table
            ref="userTable"
            :data="record"
            stripe
            highlight-current-row
            style="width: 100%">
            <el-table-column
              type="index"
              width="70">
            </el-table-column>
            <el-table-column
              property="id"
              label="批次号"
              min-width="80">
            </el-table-column>
            <el-table-column
              property="foid"
              label="fOid"
              min-width="90">
            </el-table-column>
            <!--<el-table-column-->
              <!--property="url"-->
              <!--show-overflow-tooltip-->
              <!--label="路径"-->
              <!--min-width="150">-->
            <!--</el-table-column>-->
            <el-table-column
              property="errormsg"
              show-overflow-tooltip
              label="信息"
              min-width="120">
            </el-table-column>
            <el-table-column
              property="state"
              label="状态"
              :filters="[{ text: '成功', value: 1 }, { text: '失败', value: 0 }, { text: '删除中', value: 2 }]"
              :filter-method="filterTag"
              filter-placement="bottom-end"
              min-width="60">
              <template slot-scope="scope">
                <el-tag
                  :type="scope.row.state === 0 ? 'info' : 'primary'"
                  disable-transitions>{{scope.row.state === 1 ? '成功': scope.row.state === 2 ? '删除中' : '失败'}}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column
              property="createtime"
              label="时间"
              min-width="100">
            </el-table-column>
          </el-table>
        </b-card>
      </div>
    </div>
  </div>
</template>

<script>
import { parseJson } from 'src/utils/factory'
export default {
  name: 'delete-manage',
  computed: {
    lastIndex: function () {
      return this.contents.length - 1
    },
    failureTotal: function () {
      let failure = this.record.filter((item) => {
        return item.state === 0
      })
      return failure.length
    },
    deleteing: function () {
      let failure = this.record.filter((item) => {
        return item.state === 2
      })
      return failure.length
    },
    total: function () {
      return this.record.length
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.api = this.$api.upload
      this.getList()
    },
    getList () {
      let url = this.api.list
      const _this = this
      let postData = {
        limit: this.perPage === 1000000 ? 'ALL' : this.perPage,
        page: this.currentPage,
        type: 3
      }
      this.dataRange.start && (postData.starttime = this.dataRange.start)
      this.dataRange.end && (postData.endtime = this.dataRange.end)
      this.$http.post(url, postData).then((response) => {
        if (response && response.data.code === 1) {
          _this.recordList = response.data.data.rows
          _this.totalList = response.data.data.total
        } else {
          _this.$notify.error({title: '错误', message: response.data.msg})
        }
      }).catch((response) => {
        // console.log(response)
      })
    },
    confirm () {
      this.getList()
    },
    handleClick (row) {
      this.info = row
      let url = this.api.detail
      const _this = this
      let postData = {
        batchid: row.id,
        limit: 'ALL'
      }
      this.$http.post(url, postData).then((response) => {
        if (response && response.data.code === 1) {
          _this.record = response.data.data.rows
        } else {
          _this.$notify.error({title: '错误', message: response.data.msg})
        }
      }).catch((response) => {
        // console.log(response)
      })
    },
    toJson (s) {
      return parseJson(s)
    },
    filterTag (value, row) {
      return row.state === value
    },
    pageSizeChange (val) {
      if (val === 'All') {
        this.perPage = 1000000
      } else {
        this.perPage = val
      }
      this.currentPage = 1
      this.getList()
    },
    pageChange (val) {
      this.currentPage = val
      this.getList()
    }
  },
  data () {
    return {
      record: [],
      recordList: [],
      option: {},
      dataRange: {},
      totalList: 0,
      currentPage: 1,
      perPage: 50,
      pageSize: [25, 50, 75, 100, 'All'],
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      treeData: [],
      api: {},
      componentName: '',
      formLabelWidth: '120px',
      info: {}
    }
  }
}
</script>
