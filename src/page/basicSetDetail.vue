<template>
  <div class="basic-detail query sample animated fadeIn">
    <div class="query-bar">
      <AppSidebar fixed style="color: #000;">
        <div class="tool-expand">
          <button class="sidebar-minimizer" type="button" @click="toggleLeftBar()"></button>
        </div>
        <nav class="sidebar-nav">
          <VuePerfectScrollbar class="scroll-area" :settings="psSettings">
            <div class="x-large-bold regular-vertical-padding">{{setInfo.name}}</div>
            <div class="desc regular-vertical-padding">{{setInfo.desc}}</div>
            <div class="small">采集时间：<span class="small-bold bright-blue-text">{{setInfo.time}}</span></div>
            <div class="chart" id="chart"></div>
          </VuePerfectScrollbar>
        </nav>
      </AppSidebar>
    </div>
    <b-row>
      <div class="map" id='map' style="height: calc(100vh - 101px);"></div>
    </b-row>
  </div>
</template>
<script>
import { Sidebar as AppSidebar } from '@coreui/vue'
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import 'leaflet.pm'
import { sampleDistributionOption } from './sampleData'
import echarts from 'echarts'
const L = window.L
export default {
  name: 'basicSetDetail',
  components: {
    AppSidebar,
    VuePerfectScrollbar
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.getSetDetail()
      this.initMap()
    },
    // TODO: 获取基础样本集的信息包括：名称（name, desc, time, classDis(类别分布), tileUrl(矢量瓦片地址).
    getSetDetail () {
      this.setInfo.classDis = sampleDistributionOption
      this.initChart()
    },
    // TODO: 加载后台返回的矢量瓦片地址
    renderTileUrl () {
    },
    initChart () {
      let myChart = echarts.init(document.getElementById('chart'))
      myChart.setOption(this.setInfo.classDis)
    },
    initMap () {
      const _this = this
      try {
        _this.map = L.map('map', {
          center: [28.095001, 112.93808],
          zoom: 13,
          zoomControl: false
        })
        L.esri.basemapLayer('Imagery').addTo(this.map) // 定义basemapLayer并将其加载到地图容器中
      } catch (e) {
        console.log(e)
      }
    },
  },
  data () {
    return {
      setInfo: {
        name: '谷歌美国加州数据集',
        desc: '本样本集创建于2021-01-03，包含美国加州所有地物的信息，地物信息采集于2018年',
        time: '2018/01/03 -- 2019/01/01',
        classDis: false
      },
      psSettings: {
        maxScrollbarLength: 200,
        minScrollbarLength: 40,
        suppressScrollX: true,
        wheelPropagation: false,
        interceptRailY: styles => ({ ...styles, height: 0 })
      },
    }
  }
}
</script>
<style>
  @import "../../node_modules/leaflet.pm/dist/leaflet.pm.css";
</style>
<style lang="scss">
  @import "sampleManager.scss";
  @import "sampleSetManager.scss";
  @import "basicSetDetail";
  @import "layout";
</style>
