<template>
  <div class="basic-detail query sample animated fadeIn">
    <div class="query-bar">
      <AppSidebar fixed style="color: #000;">
        <div class="tool-expand">
          <button class="sidebar-minimizer" type="button" @click="toggleLeftBar()"></button>
        </div>
        <nav class="sidebar-nav">
          <VuePerfectScrollbar class="scroll-area" :settings="psSettings">
            <div class="title-2">数据集名称</div>
            <div class="retract-text large-text regular-vertical-padding">{{setInfo.name}}</div>
            <div class="title-2">数据集描述</div>
            <div class="retract-text large-text regular-vertical-padding">{{setInfo.desc}}</div>
            <div class="title-2">数据采集时间</div>
            <div class="retract-text large-text regular-vertical-padding bright-blue-text">{{setInfo.time}}</div>
            <div class="title-2">分类体系统计</div>
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
import { sampleDistributionOption } from '../sampleData'
import echarts from 'echarts'
import 'leaflet.vectorgrid/dist/Leaflet.VectorGrid.bundled.js'
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
      this.setId = this.$route.params.id
      console.log(this.setId)
      this.getSetDetail()
      // this.initMap()
    },
    // TODO: 获取基础样本集的信息包括：名称（name, desc, time, classDis(类别分布), tileUrl(矢量瓦片地址).
    getSetDetail () {
      this.setInfo.classDis = sampleDistributionOption
      let url = this.$api.sample + '/sp/basic/sampleset/' + this.setId
      this.$http.get(url).then((response) => {
        if (response && response.status === 200) {
          this.setInfo.name = response.data.data.name
          this.setInfo.desc = response.data.data.desc
          this.setInfo.vectorTile = response.data.data.vectorTile
          this.setInfo.classDis.yAxis.data = response.data.data.classTypeGroupSum.map((o) => o.type)
          this.setInfo.classDis.series.data = response.data.data.classTypeGroupSum.map((o) => o.count)
          // this.setInfo.time =
          this.initChart()
          this.initMap()
        } else {
          this.$notify.error({ title: '错误', message: response.message })
        }
      }).catch((response) => {
        console.log(response)
      })
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
          // -86.21315,32.392138
          center: [32.392138, -86.21315],
          zoom: 15,
          zoomControl: false
        })
        let osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        let osm = new L.TileLayer(osmUrl, { minZoom: 5, maxZoom: 18 })
        _this.map.addLayer(osm)
        let url = this.setInfo.vectorTile
        console.log(url)
        // L.esri.basemapLayer('Imagery').addTo(this.map) // 定义basemapLayer并将其加载到地图容器中
        L.vectorGrid.protobuf(url).addTo(_this.map)
      } catch (e) {
        console.log(e)
      }
    }
  },
  data () {
    return {
      setId: false,
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
      }
    }
  }
}
</script>
<style>
  @import "../../../node_modules/leaflet.pm/dist/leaflet.pm.css";
</style>
<style lang="scss">
  @import "../sampleManager";
  @import "../sampleSetManager/sampleSetManager";
  @import "basicSetDetail";
  @import "../layout";
</style>
