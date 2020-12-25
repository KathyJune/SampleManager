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
                  <div class="sets">
                    <div class="set" :class="getSetClass(item.state)" v-for="item in sampleSets" :key="item.id">
                      <div class="left">
                        <div class="top">
                          <div class="name">{{item.name}}</div>
                          <div v-if="item.state === 0" class="state">待创建</div>
                          <div v-if="item.state === 2" class="state" v-html="item.pStage"></div>
                          <div v-if="item.state === 3" class="state">已创建</div>
                          <div v-if="item.state === 4" class="state">创建失败</div>
                        </div>
                        <div class="bottom">
                          <div class="desc">Kathy - 2020-12-12</div>
                        </div>
                      </div>
                      <div class="right">
                        <div class="clickable-icon delete right-icon" v-if="item.state !== 2" @click="deleteSet(item)"><svg t="1607328374280" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8688" width="16" height="16"><path d="M913.5 225.8h-241V128c0-34.5-28.3-62.8-62.8-62.8H413.3c-34.5 0-62.8 28.3-62.8 62.8v97.8H111.1c-25.8 0-46.9 21.1-46.9 46.9 0 25.8 21.1 46.9 46.9 46.9h81v590.3c0 25.8 21.1 46.9 46.9 46.9h546.4c25.8 0 46.9-21.1 46.9-46.9 0-1.1-0.1-2.2-0.1-3.3V319.5h81.5c25.8 0 46.9-21.1 46.9-46.9-0.2-25.7-21.3-46.8-47.1-46.8z m-465.4-69.7c0-0.1 0-0.1 0 0l128-0.1s0.1 0 0.1 0.1v69.7h-128v-69.7zM737 863H287V319.5h450V863z" fill="#8a8a8a" p-id="8689"></path><path d="M420.8 767.8c27.4 0 49.8-22.4 49.8-49.8V466c0-27.4-22.4-49.8-49.8-49.8S371 438.6 371 466v252c0 27.4 22.4 49.8 49.8 49.8zM602.9 767.8c27.4 0 49.8-22.4 49.8-49.8V466c0-27.4-22.4-49.8-49.8-49.8s-49.8 22.4-49.8 49.8v252c0 27.4 22.4 49.8 49.8 49.8z" fill="#8a8a8a" p-id="8690"></path></svg></div>
                        <div v-if="item.state === 0" class="clickable-icon right-icon start-icon" @click="setMaking(item)"><svg t="1607333151546" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="14033" width="18" height="18"><path d="M256 287.616c0-65.877333 71.424-106.88 128.341333-73.728l384.64 224.426667c56.448 32.896 56.448 114.474667 0 147.413333l-384.64 224.341333C327.424 843.264 256 802.261333 256 736.426667V287.616zM725.973333 512L341.333333 287.616V736.426667L725.973333 512z" fill="#39c4ac" p-id="14034"></path></svg></div>
                        <div v-if="item.state === 3" class="clickable-icon right-icon" @click="showSamples(item)"><svg t="1607333722480" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="16169" width="18" height="18"><path d="M512 768c-178.6 0-312.9-80.6-397.9-238.7-5.9-11-5.8-24.3 0.3-35.2C202.9 336.4 336.9 256 512 256s309.1 80.4 397.6 238.1c6.1 10.9 6.2 24.2 0.3 35.2C824.9 687.4 690.6 768 512 768z m0-73.1c144.8 0 251.3-60 323.5-182.5C760.3 389.3 653.8 329.1 512 329.1s-248.3 60.2-323.5 183.2C260.7 634.9 367.2 694.9 512 694.9z" fill="#39c4ac" p-id="16170"></path><path d="M512 694.9c-101 0-182.9-81.9-182.9-182.9S411 329.1 512 329.1 694.9 411 694.9 512 613 694.9 512 694.9z m0-73.2c60.6 0 109.7-49.1 109.7-109.7S572.6 402.3 512 402.3 402.3 451.4 402.3 512 451.4 621.7 512 621.7z" fill="#39c4ac" p-id="16171"></path></svg></div>
                        <div v-if="item.state === 2" class="right-icon" v-html="item.percentage + '%'"></div>
                        <div v-if="item.state === 4" class="clickable-icon right-icon"><svg t="1607332964707" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="11405" width="18" height="18"><path d="M790.912 834.858667A425.002667 425.002667 0 0 1 512 938.666667C276.352 938.666667 85.333333 747.648 85.333333 512S276.352 85.333333 512 85.333333s426.666667 191.018667 426.666667 426.666667c0 91.136-28.586667 175.616-77.226667 244.906667L725.333333 512h128a341.333333 341.333333 0 1 0-104.96 246.272l42.538667 76.586667z" p-id="11406" fill="#eb5228"></path></svg></div>
                      </div>
                    </div>
                  </div>
                  <!--<el-collapse v-model="activeSets">-->
                    <!--<el-collapse-item class="set-record" v-for="item in sampleSets" :key="item.id" :name="item.id">-->
                      <!--<template slot="title">-->
                        <!--<div class="line-1">-->
                          <!--<div class="set-title">{{item.id}}</div>-->
                          <!--<div class="actions">-->
                            <!--<div v-if="item.state !== 1"><el-button @click="setMaking(item)" size="mini">开始创建</el-button></div>-->
                            <!--<div v-if="item.state === 1"><el-button @click="showSamples(item)" size="mini">查看样本</el-button></div>-->
                          <!--</div>-->
                        <!--</div>-->
                      <!--</template>-->
                      <!--<div class="line-2">-->
                        <!--创建人id：{{item.name}}-->
                      <!--</div>-->
                      <!--<div class="line-3">-->
                        <!--创建时间：{{item.createdTime}}-->
                      <!--</div>-->
                      <!--<div class="line-4">-->
                        <!--状态：-->
                        <!--<div class="status">-->
                          <!--<div v-if="item.state === 0">待创建</div>-->
                          <!--<div v-else-if="item.state === 100">已创建</div>-->
                          <!--<div v-else><el-progress :percentage="item.state"></el-progress></div>-->
                        <!--</div>-->
                      <!--</div>-->
                    <!--</el-collapse-item>-->
                  <!--</el-collapse>-->
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
            <el-tab-pane label="变化检测" name="menu" v-if="false">
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
    this.openSocket()
  },
  methods: {
    openSocket () {
      console.log('socket opened', this.$socket)
      if (this.$socket.socket.connected) {
        console.log('connected')
        this.$socket.socket.on('percent', this.showPercent)
      }
    },
    showPercent (message) {
      let _percent = JSON.parse(message)
      console.log('show')
      console.log(_percent)
      for (let item of this.sampleSets) {
        if (item.id === _percent.projectId && _percent.percent !== 1) {
          let pp = (_percent.percent * 100).toFixed(2)
          if (_percent.stage === 'gridSplitStage') {
            this.$set(item, 'pStage', '划分网格')
          } else {
            this.$set(item, 'pStage', '样本创建')
          }
          this.$set(item, 'percentage', pp)
          item.state = 2
          // console.log(item.percentage)
        }
        if (item.id === _percent.projectId && _percent.percent === 1 && _percent.stage === 'gridMakeStage') {
          this.$set(item, 'state', 3)
        }
      }
      // {"stage":"test","now":45,"sum":100,"percent":0.0,"projectId":1
      // this.list[0].progress = _percent.percent
    },
    pageChange (currentPage) {
      this.$emit('setPageChange', currentPage)
    },
    init () {
    },
    setMaking (item) {
      this.$emit('setMaking', item)
    },
    showSamples (item) {
      console.log('clicked')
      this.$emit('showSamples', item)
    },
    getSetClass (state) {
      if (state === 0) return 'start'
      else if (state === 3) return 'done'
      else if (state === 4) return 'fail'
      else return 'processing'
    },
    deleteSet (item) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.$emit('deleteSet', item)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>
<style lang="scss">
</style>
