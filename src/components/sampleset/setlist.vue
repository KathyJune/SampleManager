<template>
  <div>
    <AppSidebar fixed>
      <div class="tool-expand">
        <button class="sidebar-minimizer" type="button" @click="toggleLeftBar()"></button>
      </div>
      <nav class="sidebar-nav">
        <VuePerfectScrollbar class="scroll-area" :settings="psSettings">
          <el-tabs type="card" v-model="activeName">
            <el-tab-pane label="地物提取" name="data">
              <div class="pane-content">
                <div class="section">
                  <el-collapse v-model="activeSets">
                    <el-collapse-item class="set-record" v-for="item in sampleSets" :key="item.id" :name="item.id">
                      <template slot="title">
                        <div class="line-1">
                          <div class="set-title">{{item.id}}</div>
                          <div class="actions">
                            <div v-if="item.state === 0"><el-button @click="setMaking(item)" size="mini">开始创建</el-button></div>
                            <div v-if="item.state === 100"><el-button size="mini">查看样本</el-button></div>
                          </div>
                        </div>
                      </template>
                      <div class="line-2">
                        创建人id：{{item.userId}}
                      </div>
                      <div class="line-3">
                        创建时间：{{item.createdTime}}
                      </div>
                      <div class="line-4">
                        状态：
                        <div class="status">
                          <div v-if="item.state === 0">待创建</div>
                          <div v-else-if="item.state === 100">已创建</div>
                          <div v-else><el-progress :percentage="item.state"></el-progress></div>
                        </div>
                      </div>
                    </el-collapse-item>
                  </el-collapse>
                </div>
                <div class="section">
                  <el-pagination
                    layout="prev, pager, next"
                    @current-change="pageChange"
                    :total="page.total">
                  </el-pagination>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="变化检测" name="menu">
              <ul class="nav">
              </ul>
            </el-tab-pane>
          </el-tabs>
        </VuePerfectScrollbar>
      </nav>
    </AppSidebar>
  </div>
</template>
<script>
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import { Sidebar as AppSidebar } from '@coreui/vue'
export default {
  name: 'set-list',
  components: {
    AppSidebar,
    VuePerfectScrollbar
  },
  props: {
    classifySys: {
      type: Array,
      required: true
    },
    sampleSources: {
      // type: Array,
      required: true
    },
    sampleSets: {
      required: true
    },
    page: {
      required: true
    }
  },
  data () {
    return {
      activeSets: [],
      setList: [{
        id: 1,
        name: '湖南省水系数据集',
        status: -1,
        createdBy: 'Kathy',
        createdTime: '2020-12-01'
      }, {
        id: 2,
        name: '湖南省水系数据集',
        status: 30,
        createdBy: 'Kathy',
        createdTime: '2020-12-01'
      }, {
        id: 3,
        name: '湖南省水系数据集',
        status: 70,
        createdBy: 'Kathy',
        createdTime: '2020-12-01'
      }, {
        id: 4,
        name: '湖南省水系数据集',
        status: 100,
        createdBy: 'Kathy',
        createdTime: '2020-12-01'
      }],
      dataSourceCheck: [],
      dateRange: '',
      disabledTree: [],
      newSetName: '',
      newSetCommit: '',
      props: { multiple: true },
      ShowAppendDialog: false,
      ShowCreateDialog: false,
      showTable: false,
      data: [{
        id: 1,
        name: '我的分类体系',
        place: [0],
        disabled: true,
        children: [{
          id: 2,
          name: '林地',
          count: '瓦片：346777,  图斑：2898347',
          place: [0, 0],
          children: [{
            id: 3,
            name: '乔木林地',
            count: '瓦片：121777,  图斑：128347',
            place: [0, 0, 0]
          }]
        }]
      }],
      spatialQuerryMethod: '自定义勾画',
      activeNames: ['2'],
      psSettings: {
        maxScrollbarLength: 200,
        minScrollbarLength: 40,
        suppressScrollX: true,
        wheelPropagation: false,
        interceptRailY: styles => ({ ...styles, height: 0 })
      },
      option: {
        user: 11
      },
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      querySpace: {
        space: 0
      },
      menuTree: [],
      treeList: [],
      activeName: 'data',
      api: {},
      province: '',
      provinceList: [],
      city: '',
      cityList: [],
      county: '',
      countyList: [],
      fileList: []
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    pageChange (currentPage) {
      this.$emit('setPageChange', currentPage)
    },
    init () {
    },
    setMaking (item) {
      this.$emit('setMaking', item)
    }
  }
}
</script>
<style lang="scss">
</style>
