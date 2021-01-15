<template>
<div class="basic-set">
  <div class="flex-row">
    <div class="geo-picker">
      <el-card>
        <map-selector @selectArea="selectArea"></map-selector>
      </el-card>
    </div>
    <div class="top-right-group">
      <el-card id="chart" class="card-2">
      </el-card>
      <el-card class="card-3">
        <div class="title-1">条件过滤</div>
        <div>
          <el-date-picker
            v-model="queryFactor.startTime"
            type="date"
            size="mini"
            placeholder="起始时间">
          </el-date-picker>
          <el-date-picker
            v-model="queryFactor.endTime"
            type="date"
            size="mini"
            placeholder="截止时间">
          </el-date-picker>
          <div class="radios">
            <el-radio v-model="queryFactor.type" label="0">地物提取</el-radio>
            <el-radio v-model="queryFactor.type" label="1">变化监测</el-radio>
          </div>
          <div>
            <el-button @click="getSetList" size="mini" type="primary">检索</el-button>
            <el-button @click="createSet" size="mini" type="primary">创建样本集</el-button>
          </div>
        </div>
        <div>
        </div>
      </el-card>
    </div>
  </div>
  <div class="flex-row">
    <el-card class="set-card">
      <el-card class="set-item" v-for="item in setList" :key="item.id">
        <img src="/img/project.png" draggable="false" class="box-card-image">
        <div style="padding: 10px;">
          <p v-html="item.name" class="box-card-title"></p>
          <div class="box-card-bottom clearfix">
            <el-button type="primary" size="mini" class="button" @click="inspectSet(item)" >查看</el-button>
          </div>
        </div>
      </el-card>
    </el-card>
  </div>
</div>
</template>

<script>
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import { sampleStatus, setList } from '../sampleData'
import { getBasicList, getBasicDetail } from 'src/api/sample'
import echarts from 'echarts'
import MapSelector from 'src/components/mapSelector/index'
export default {
  name: 'basicSet',
  components: {
    VuePerfectScrollbar,
    MapSelector
  },
  data () {
    return {
      queryFactor: {
        startTime: '2020/1/10',
        endTime: '2021/01/11',
        zoneCode: '',
        type: '0',
        page: 0,
        size: 20
      },
      psSettings: {
        maxScrollbarLength: 200,
        minScrollbarLength: 40,
        suppressScrollX: true,
        wheelPropagation: false,
        interceptRailY: styles => ({ ...styles, height: 0 })
      },
      setList: false,
      sampleStatus: false
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.setList = setList
      this.sampleStatus = sampleStatus
      this.renderChart()
      this.getSetList()
    },
    // 选中行政级别（国家/省）
    selectArea (item) {
      // debugger
      // 之后需要换成code
      this.queryFactor.zoneCode = item.name || item.NAME
    },
    getSetList () {
      let url = this.$api.sample + '/sp/basic/sampleset/list'
      this.queryFactor.startTime = new Date(this.queryFactor.startTime)
      this.queryFactor.endTime = new Date(this.queryFactor.endTime)
      this.queryFactor.type = parseInt(this.queryFactor.type)
      this.$http.post(url, this.queryFactor).then((response) => {
        if (response && response.status === 200) {
          this.setList = response.data.data.list
          this.renderChart()
          this.queryFactor.type = this.queryFactor.type.toString()
        } else {
          this.$notify.error({ title: '错误', message: response.message })
        }
      }).catch((response) => {
        console.log(response)
      })
    },
    createSet () {
      this.$router.push({ name: 'SetCreator', params: { queryFactor: this.queryFactor } })
    },
    inspectSet (item) {
      this.$router.push({ name: 'basicSetDetail', params: { setId: item.id } })
    },
    renderChart () {
      this.sampleStatus.yAxis.data = this.setList.map((o) => o.name)
      this.sampleStatus.series[0].data = this.setList.map((o) => o.count)
      console.log(this.sampleStatus)
      let myChart = echarts.init(document.getElementById('chart'))
      myChart.setOption(this.sampleStatus)
    }
  }
}
</script>

<style lang="scss">
  @import "../layout";
  @import "basicSet";
</style>
