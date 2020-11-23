<template>
  <div>
    <AppSidebar fixed>
      <div class="tool-expand">
        <button class="sidebar-minimizer" type="button" @click="toggleLeftBar()"></button>
      </div>
      <nav class="sidebar-nav">
          <VuePerfectScrollbar class="scroll-area" :settings="psSettings" @ps-scroll-y="scrollHandle">
            <el-tabs type="card" v-model="activeName" @tab-click="handleClick">
              <el-tab-pane label="地物提取" name="data">
                <div class="pane-content">
                  <div class="section">
                    <div class="section-header">
                      检索
                    </div>
                    <div class="filter-item cato-filter">
                      <div class="filter-title">
                        <div class="bullet"></div>
                        样本类别
                      </div>
                      <div class="filter-body cat-filter">
                        <div class="diy-cat1">
                          <el-tree
                            ref="tree"
                            :data="classifySys"
                            show-checkbox
                            node-key="id"
                            default-expand-all
                            :expand-on-click-node="false"
                            :render-content="renderContent">
                          </el-tree>
                        </div>
                        <div class="existing-cat">
                        </div>
                      </div>
                    </div>
                    <div class="filter-item spatial-filter">
                      <div class="filter-title">
                        <div class="bullet"></div>
                        空间范围
                        <div class="spatial-selector">
                          <el-select size="small" v-model="spatialQuerryMethod" placeholder="请选择">
                            <el-option
                              v-for="item in [{value:'行政区划',label:'行政区划'},{value:'shapefile',label:'shapefile'},{value:'自定义勾画',label:'自定义勾画'}]"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value">
                            </el-option>
                          </el-select>
                        </div>
                      </div>
                      <div v-if="spatialQuerryMethod === '行政区划'" class="filter-body">
                        <div class="query-block">
                          <label class="query-block-lable">省/市/自治区</label>
                          <div class="query-block-body">
                            <el-select v-model="province" placeholder="省/市/自治区" size="small" @change="provinceChange">
                              <el-option value="" label=""></el-option>
                              <el-option
                                v-for="o in provinceList"
                                :key="o.adcode"
                                :label="o.name"
                                :value="o.adcode">
                              </el-option>
                            </el-select>
                          </div>
                        </div>
                        <div class="query-block">
                          <label class="query-block-lable">地级市/州/盟</label>
                          <div class="query-block-body">
                            <el-select v-model="city" placeholder="地级市/州/盟" size="small" @change="cityChange">
                              <el-option value="" label=""></el-option>
                              <el-option
                                v-for="o in cityList"
                                :key="o.adcode"
                                :label="o.name"
                                :value="o.adcode">
                              </el-option>
                            </el-select>
                          </div>
                        </div>
                        <div class="query-block">
                          <label class="query-block-lable">区/县级市/县</label>
                          <div class="query-block-body">
                            <el-select v-model="county" placeholder="区/县级市/县" size="small" @change="countyChange">
                              <el-option value="" label=""></el-option>
                              <el-option
                                v-for="o in countyList"
                                :key="o.adcode"
                                :label="o.name"
                                :value="o.adcode">
                              </el-option>
                            </el-select>
                          </div>
                        </div>
                      </div>
                      <div class="filter-body" v-if="spatialQuerryMethod === 'shapefile'">
                        <el-upload
                          class="upload-demo"
                          action="https://jsonplaceholder.typicode.com/posts/"
                          :on-preview="handlePreview"
                          :on-remove="handleRemove"
                          :before-remove="beforeRemove"
                          multiple
                          :limit="3"
                          :on-exceed="handleExceed"
                          :file-list="fileList">
                          <el-button size="small" type="primary">点击上传</el-button>
                          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                        </el-upload>
                      </div>
                    </div>
                    <div class="filter-item spatial-filter">
                      <div class="filter-title">
                        <div class="bullet"></div>
                        时间范围
                      </div>
                      <div class="filter-body">
                        <div class="date-selector">
                          <el-date-picker v-model="dateRange" type="daterange" size="mini" style="width: 280px;" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                          </el-date-picker>
                        </div>
                        <div class="existing-cat">
                        </div>
                      </div>
                    </div>
                    <div class="filter-item spatial-filter">
                      <div class="filter-title">
                        <div class="bullet"></div>
                        数据来源
                      </div>
                      <div class="filter-body">
                        <div class="date-selector">
                          <el-checkbox-group v-model="dataSourceCheck" v-for="item in sampleSources" :key="item">
                            <el-checkbox :label="item"></el-checkbox>
                          </el-checkbox-group>
                        </div>
                        <div class="existing-cat">
                        </div>
                      </div>
                    </div>
                    <div class="start-query">
                      <el-button type="success" @click="setQuery">开始检索</el-button>
                    </div>
                  </div>
                  <div class="section">
                    <div class="section-header">
                      检索结果
                    </div>
                    <div class="sample-sets section-content">
                      <div class="sample-set">
                        <div class="set-header">
                          <div class="bullet"></div>
                          <div class="set-name">检索结果1
                            <svg t="1600310034527" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6969" width="18" height="18"><path d="M689.621 512l-328.832-328.832-60.331 60.331 268.501 268.501-268.501 268.501 60.331 60.331z" p-id="6970" fill="#A0A7B4"></path></svg>
                          </div>
                          <div class="header-op">
                            <!-- <svg @click="createSampleSet" t="1600830073994" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4822" width="18" height="18"><path d="M496.512 185.088H217.152v653.12h589.696V486.912H896v440.768H128v-832h368.512v89.408z m177.024 41.856V96h89.152v130.944h130.56v89.408h-130.56V447.36h-89.152V316.352h-130.56V226.944h130.56z" fill="#999999" p-id="4823"></path></svg> -->
                            <svg @click="appendSampleSet" t="1600310161449" class="icon" viewBox="0 0 1124 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7239" width="18" height="18"><path d="M921.6 819.2h-102.4v-102.4h102.4V102.4H307.2v102.4H204.8V102.4c0-56.32 46.08-102.4 102.4-102.4h614.4c56.32 0 102.4 46.08 102.4 102.4v614.4c0 56.32-46.08 102.4-102.4 102.4z" p-id="7240" fill="#999999"></path><path d="M716.8 307.2v614.4H102.4V307.2h614.4m0-102.4H102.4C46.08 204.8 0 250.88 0 307.2v614.4c0 56.32 46.08 102.4 102.4 102.4h614.4c56.32 0 102.4-46.08 102.4-102.4V307.2c0-56.32-46.08-102.4-102.4-102.4z" p-id="7241" fill="#999999"></path><path d="M409.6 409.6c-25.6 0-51.2 25.6-51.2 51.2v102.4H256c-25.6 0-51.2 25.6-51.2 51.2s25.6 51.2 51.2 51.2h102.4v102.4c0 25.6 25.6 51.2 51.2 51.2s51.2-25.6 51.2-51.2v-102.4h102.4c25.6 0 51.2-25.6 51.2-51.2s-25.6-51.2-51.2-51.2H460.8V460.8c0-25.6-25.6-51.2-51.2-51.2z" p-id="7242" fill="#999999"></path></svg>
                            <svg t="1600310272271" class="icon" viewBox="-100 0 1139 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9070" width="17" height="16"><path d="M0.244023 394.046187h317.658598v258.092532H0.244023z m403.879057 344.881835h329.198v284.421871H404.12308z m0-344.719308h329.198v258.092532H404.12308z m415.824776 344.719308H1137.931508v284.421871h-317.658599z m-820.028887 0h317.658599v284.421871H0.244023z m0-738.928022h1137.687485v307.581938h-1137.687485z m820.35394 394.046187H1137.931508v258.092532h-317.658599z" p-id="9071" fill="#999999"></path></svg>
                            <svg t="1600310317350" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10651" width="20" height="20"><path d="M857.728 269.781333H702.72C692.650667 189.013333 619.434667 128 532.394667 128S372.053333 188.970667 362.026667 269.781333H208.938667c-21.12 0-38.272 16.042667-38.272 35.797334 0 19.754667 17.152 35.754667 38.272 35.797333h55.466666v518.826667c0 19.797333 17.152 35.797333 38.314667 35.797333H762.026667c21.162667 0 38.272-16 38.272-35.797333V341.376h57.429333c21.12 0 38.272-16.042667 38.272-35.84 0-19.712-17.152-35.754667-38.272-35.754667z m-325.333333-71.552c45.44 0 84.650667 29.866667 93.738666 71.552H438.613333c9.088-41.642667 48.298667-71.552 93.781334-71.552z m-114.858667 536.746667c0 19.754667-17.109333 35.797333-38.272 35.797333-21.12 0-38.272-16.042667-38.272-35.797333v-286.293333c0-19.754667 17.152-35.754667 38.272-35.754667 21.162667 0 38.272 16 38.272 35.797333v286.250667z m153.130667 0c0 19.754667-17.152 35.797333-38.272 35.797333-21.162667 0-38.314667-16.042667-38.314667-35.797333v-286.293333c0-19.754667 17.152-35.754667 38.314667-35.754667 21.12 0 38.272 16 38.272 35.797333v286.250667z m153.088 0c0 19.754667-17.152 35.797333-38.272 35.797333s-38.272-16.042667-38.272-35.797333v-286.293333c0-19.754667 17.152-35.754667 38.272-35.754667s38.272 16 38.272 35.797333v286.250667z" p-id="10652" fill="#999999"></path></svg>
                            <svg t="1600310423287" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="18015" width="20" height="20"><path d="M512 93.672727c192.791273 0 349.090909 157.742545 349.090909 352.302546 0 126.650182-110.941091 298.728727-332.8 516.189091a23.272727 23.272727 0 0 1-32.581818 0l-10.472727-10.309819C270.359273 739.258182 162.909091 570.647273 162.909091 445.975273c0-194.56 156.299636-352.302545 349.090909-352.302546zM512 302.545455a116.363636 116.363636 0 1 0 0 232.727272 116.363636 116.363636 0 0 0 0-232.727272z" p-id="18016" fill="#999999"></path></svg>
                          </div>
                        </div>
                        <div class="sample-count">282371 rows</div>
                      </div>
                      <div class="add-set" @click="createSampleSet">
                        <el-button type="success">
                          <svg t="1600311516853" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="18975" width="12" height="12"><path d="M590.769231 571.076923h324.923077c15.753846 0 29.538462-13.784615 29.538461-29.538461v-59.076924c0-15.753846-13.784615-29.538462-29.538461-29.538461H590.769231c-11.815385 0-19.692308-7.876923-19.692308-19.692308V108.307692c0-15.753846-13.784615-29.538462-29.538461-29.538461h-59.076924c-15.753846 0-29.538462 13.784615-29.538461 29.538461V433.230769c0 11.815385-7.876923 19.692308-19.692308 19.692308H108.307692c-15.753846 0-29.538462 13.784615-29.538461 29.538461v59.076924c0 15.753846 13.784615 29.538462 29.538461 29.538461H433.230769c11.815385 0 19.692308 7.876923 19.692308 19.692308v324.923077c0 15.753846 13.784615 29.538462 29.538461 29.538461h59.076924c15.753846 0 29.538462-13.784615 29.538461-29.538461V590.769231c0-11.815385 7.876923-19.692308 19.692308-19.692308z" p-id="18976" fill="#ffffff"></path></svg>
                          新建样本集
                        </el-button>
                      </div>
                    </div>
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
import { json } from 'd3-fetch'
export default {
  name: 'side-nav',
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
    }
  },
  data () {
    return {
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
    init () {
      this.api = this.$api.search
      this.getProvince()
    },
    handleRemove (file, fileList) {
      console.log(file, fileList)
    },
    handlePreview (file) {
      console.log(file)
    },
    handleExceed (files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove (file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    scrollHandle (evt) {
      // console.log(evt)
    },
    handleClick (tab, event) {
      this.querySpace.space = 0
      this.$emit('tab-handle', tab.name)
    },
    renderContent (h, { node, data, store }) {
      // debugger
      return (
        <span class="custom-tree-node">
          <span>{data.name ? data.name : data.taonomyName}</span>
          <span class="cat-count">
            {data.code ? 'CODE ' + data.code : ''}
          </span>
        </span>)
    },
    provinceChange (value) {
      if (!value) return false
      this.$emit('provinceChange', value)
      let url = this.$api.divisionUrl + 'csv/' + value + '_city.json?order=asc&_=1572436659743'
      // this.getAreaBound(value)
      json(url).then((data, error) => {
        if (error) return false
        this.cityList = data.rows
      }).catch((response) => {
        // console.log(response)
      })
    },
    cityChange (value) {
      if (!value) {
        return false
      }
      this.$emit('cityChange', value)
      // this.getAreaBound(value)
      let url = this.$api.divisionUrl + 'csv/' + value + '_district.json?order=asc&_=1572436659743'
      json(url).then((data, error) => {
        if (error) return false
        this.countyList = data.rows
      }).catch((response) => {
        // console.log(response)
      })
    },
    countyChange (value) {
      if (!value) {
        return false
      }
      this.$emit('countyChange', value)
      // this.getAreaBound(value)
    },
    loadCity (node, resolve) {
      // let _this = this
      if (node.level === 0) {
        return
      }
      if (node.data.CODE && node.level > 3) {
        return resolve([])
      }
      let scriptDom = document.createElement('script')
      scriptDom.type = 'text/javascript'
      scriptDom.id = 'scriptId'
      let url = this.$api.divisionUrl + 'withgeometry=false&withparents=true&fullname=' + node.data.FULLNAME + '&callback=getChildCity'
      scriptDom.src = url
      document.body.appendChild(scriptDom)
      window.getChildCity = function (response) {
        if (response.success === 'true') {
          // _this.treeData = [response.result]
          resolve(response.result.children)
        }
      }
      scriptDom.remove()
    },
    setQuery () {
      let option = {}
      let nodes = this.$refs.tree.getCheckedNodes()
      if(nodes.length !== 0) {
        nodes = nodes.map(function (item) {
          return item.id
        })
        option.classType = nodes
      }
      if (this.dateRange.length !== 0){
        option.startTemporal = this.dateRange[0].getTime()
        option.endTemporal = this.dateRange[1].getTime()
      }
      if (this.dataSourceCheck.length !== 0) option.source = this.dataSourceCheck
      this.$emit('setQuery', option)
      // this.showTable = true
    },
    getSelectedTree () {
      this.disabledTree = JSON.parse(JSON.stringify(this.classifySys))
      let a = this.$refs.tree.getCheckedKeys()
      for (let item of this.disabledTree) {
        this.treeSearch(item, a)
      }
    },
    treeSearch (node, list) {
      // debugger
      node.label = node.name || node.taonomyName
      if (!node.children) {
        if (list.indexOf(node.id) !== -1) {
          node.disabled = false
          return true
        } else {
          node.disabled = true
          return false
        }
      }
      node.disabled = true
      for (let item of node.children) {
        if (this.treeSearch(item, list)) {
          node.disabled = false
        }
      }
      if (node.disabled === false) {
        return true
      } else {
        return false
      }
    },
    appendSampleSet () {
      this.ShowCreateDialog = false
      this.ShowAppendDialog = true
    },
    createSampleSet () {
      this.getSelectedTree()
      this.$emit('createSampleSet', this.disabledTree)
    },
    getProvince () {
      let url = this.$api.divisionUrl + 'csv/100000_province.json?order=asc&_=1572436659740'
      json(url).then((data, error) => {
        if (error) return false
        this.provinceList = data.rows
      }).catch((response) => {
        // console.log(response)
      })
    }
  }
}
</script>
<style lang="scss">
</style>
