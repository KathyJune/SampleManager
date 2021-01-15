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
      this.setId = this.$route.params.setId
      console.log(this.setId)
      this.getSetDetail()
      this.initMap()
    },
    // TODO: 获取基础样本集的信息包括：名称（name, desc, time, classDis(类别分布), tileUrl(矢量瓦片地址).
    getSetDetail () {
      // this.setInfo.classDis = sampleDistributionOption
      let url = this.$api.sample + '/sp/basic/sampleset/' + this.setId
      this.$http.get(url).then((response) => {
        if (response && response.status === 200) {
          this.setInfo.name = response.data.data.name
          this.setInfo.desc = response.data.data.desc
          // this.setInfo.time =
          this.setInfo.classDis = response.data.data.classTypeGroupSum
          this.initChart()
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
      console.log(this.setInfo.classDis)
      myChart.setOption(this.setInfo.classDis)
    },
    initMap () {
      const _this = this
      try {
        let crs = new L.Proj.CRS('EPSG:4326',
          '+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
          {
            resolutions: [
              4096, 2048, 1024, 512, 256, 128, 64, 32, 16, 8
            ],
            origin: [ -1200000.000000, 8500000.000000 ],
            bounds: L.bounds([-1200000.000000, 8500000.000000], [4305696.000000, 2994304.000000])
          })
        _this.map = L.map('map', {
          // -86.21315,32.392138
          // crs: crs,
          center: [-32.392138, -86.21315],
          zoom: 13,
          zoomControl: false
        })
        let features = []
        let url = '/vectorTile/data/Alabama/{z}/{x}/{-y}.pbf'
        let vectorTileOptions = {
          layerURL: url,
          rendererFactory: L.canvas.tile,
          tms: true,
          vectorTileLayerStyles: function () {
            return {
              color: '#778899',
              width: 1,
              fillColor: 'yellow',
              fill: true
            }
          },
          interactive: true, // 开启VectorGrid触发mouse/pointer事件
          getFeatureId: function (f) {
            features.push(f)
            if (f.properties.Handle === '1127C1') {
              console.log(f)
            }
            return f.properties.Handle
          }
        }
        L.esri.basemapLayer('Imagery').addTo(this.map) // 定义basemapLayer并将其加载到地图容器中
        L.vectorGrid.protobuf(url, vectorTileOptions).addTo(_this.map)
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
