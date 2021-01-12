<template>
<div class="basic-set">
  <div class="flex-row">
    <el-card class="geo-picker"></el-card>
    <div class="top-right-group">
      <el-card id="chart" class="card-2">
      </el-card>
      <el-card class="card-3">
        <el-date-picker
          v-model="queryFactor.startTime"
          type="datetime"
          placeholder="选择日期时间">
        </el-date-picker>
        <el-date-picker
          v-model="queryFactor.endTime"
          type="datetime"
          placeholder="选择日期时间">
        </el-date-picker>
        <el-radio v-model="queryFactor.type" label="1">地物提取</el-radio>
        <el-radio v-model="queryFactor.type" label="2">变化监测</el-radio>
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
            <el-button class="button" @click="handleClick(item)" >管理</el-button>
          </div>
        </div>
      </el-card>
    </el-card>
  </div>
  <!--<VuePerfectScrollbar class="scroll-area" :settings="psSettings">-->
    <!--<div class="data-card">-->
      <!--<ul>-->
        <!--<li v-for="item in setList" :key="item.id">-->
          <!--<el-card class="box-card">-->
            <!--<img src="/img/project.png" draggable="false" style="width: 256px; height: 256px;" class="box-card-image">-->
            <!--<div style="padding: 10px;">-->
              <!--<p v-html="item.name" class="box-card-title"></p>-->
              <!--<div class="box-card-bottom clearfix">-->
                <!--<el-button class="button" @click="handleClick(item)" >管理</el-button>-->
              <!--</div>-->
            <!--</div>-->
          <!--</el-card>-->
        <!--</li>-->
      <!--</ul>-->
    <!--</div>-->
  <!--</VuePerfectScrollbar>-->
</div>
</template>

<script>
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import { sampleStatus, setList } from './sampleData'
import echarts from 'echarts'
export default {
  name: 'basicSet',
  components: {
    VuePerfectScrollbar
  },
  data () {
    return {
      queryFactor: {
        startTime: false,
        endTime: false,
        geoCode: '',
        type: 0
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
  @import "layout";
  @import "basicSet";
</style>
