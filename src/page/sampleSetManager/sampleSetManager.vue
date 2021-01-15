<template>
  <div class="sample-set query sample animated fadeIn">
    <div class="query-bar">
      <set-list
        :sampleSets="sampleSets"
        :classifySys="classifySys"
        :sampleSources="sampleSources"
        :page="page"
        @setMaking="setMaking"
        @showSamples="showSamples"
        @setPageChange="setPageChange"
        @deleteSet="deleteSet">
      </set-list>
    </div>
    <sample-list
      @handleSampleChange="handleSampleChange"
      @sampleListPageChange="sampleListPageChange"
      :slices="slices"></sample-list>
    <b-row>
      <div class="map" id='map'></div>
    </b-row>
  </div>
</template>
<script>
import setList from 'src/components/sampleset/setlist'
import sampleList from 'src/components/sampleset/sample-list'
import newCat from 'src/components/samplebar/new-cat'
import 'leaflet.pm'
import { getUserId } from '@/libs/util'
const L = window.L
export default {
  name: 'sampleSetManager',
  components: {
    setList,
    sampleList
  },
  mounted () {
    this.init()
    // this.openSocket()
  },
  methods: {
    // 样本列表page改变
    sampleListPageChange (page) {
      this.getGrids(page)
    },
    // 被选中的样本改变之后
    handleSampleChange (item) {
      console.log(item)
      let layer = L.geoJSON(JSON.parse(item.geoJson))
      this.map.flyToBounds(layer.getBounds())
      // // 测试 把瓦片内部的所有矢量也显示出来
      // let idList = item.features.split(',')
      // console.log(idList)
      // let url = this.$api.sampleDetail + '/mlsample/samples'
      // this.$http.post(url, idList).then((response) => {
      //   if (response && response.status === 200) {
      //     this.rendertags(response.data.data)
      //     // this.map.removeLayer(this.listPtLayer)
      //     // let polygon = JSON.parse(response.data.data[0].spatial)
      //     // if (this.detailLayer) {
      //     //   this.map.removeLayer(this.detailLayer)
      //     // }
      //     // this.detailLayer = L.geoJSON(polygon).addTo(this.map)
      //     // this.map.flyToBounds(this.detailLayer.getBounds())
      //   } else {
      //     this.$notify.error({ title: '错误', message: response.message })
      //   }
      // }).catch((response) => {
      //   console.log(response)
      // })
    },
    rendertags (tags) {
      let recs = {
        type: 'FeatureCollection',
        features: []
      }
      for (let item of tags) {
        recs.features.push({ geometry: JSON.parse(item.spatial), type: 'Feature' })
      }
      console.log(recs)
      L.geoJSON(recs).addTo(this.map)
      // this.map.flyToBounds(rectsLayer.getBounds())
    },
    setMaking (item) {
      let option = {
        command: 1, // 1表示开始制作，0表示终止制作
        setId: item.id
      }
      let url = this.$api.sampleSets + '/sp/sampleset/operation'
      this.$http.post(url, option).then((response) => {
        if (response && response.status === 200) {
          // this.openSocket()
        }
      })
    },
    deleteSet (item) {
      let url = this.$api.sampleSets + '/sp/sampleset/' + item.id
      this.$http.delete(url).then((response) => {
        if (response && response.status === 200) {
          this.slices = response.data.data
          this.renderSlices()
        }
      })
      this.getSets()
    },
    getGrids (page) {
      let url2 = this.$api.sampleSets + '/sp/sampleset/grids'
      let option2 = {
        page: page,
        setId: this.selectedSetId,
        size: 10
      }
      this.$http.post(url2, option2).then((response) => {
        if (response && response.status === 200) {
          this.slices = response.data.data
          this.renderSlices()
        }
      })
    },
    showSamples (item) {
      this.selectedSetId = item.id
      this.getGrids(0)
    },
    renderSlices () {
      console.log(this.slices)
      let recs = {
        type: 'FeatureCollection',
        features: []
      }
      for (let item of this.slices.list) {
        recs.features.push({ geometry: JSON.parse(item.geoJson), type: 'Feature' })
      }
      console.log(recs)
      if (this.rectanglesLayer) this.map.removeLayer(this.rectanglesLayer)
      this.rectanglesLayer = L.geoJSON(recs).addTo(this.map)
      this.map.flyToBounds(this.rectanglesLayer.getBounds())
    },
    pageChange (pageNo) {
      console.log(pageNo)
      this.currentPage = pageNo
      this.startQuery()
    },
    pageUp () {
      this.currentPage = this.currentPage - 1
      this.startQuery()
    },
    pageDown () {
      this.currentPage = this.currentPage + 1
      this.startQuery()
    },
    handleCurrentPageChange (val) {
      this.currentPage = val
      this.startQuery()
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
    /***
       * 根据检索条件分页查询样本数据列表
       ***/
    startQuery () {
      // this.showTable = true
      let url00 = this.$api.samplePreview + '/samples/query?size=' + this.perPage + '&page=' + this.currentPage
      // let option00 = {
      //   'classType': [1],
      //   'source': ['DistrictofColumbia'],
      //   'geom': JSON.stringify(this.resultLayer.toGeoJSON().geometry)
      //   // 'temporal': '1604372920918',
      // }
      this.$http.post(url00, this.query).then((response) => {
        if (response && response.status === 200) {
          this.renderList(response.data)
        } else {
          this.$notify.error({ title: '错误', message: response.message })
        }
      }).catch((response) => {
        console.log(response)
      })
      // let resData = []
    },
    renderList (data) {
      console.log('aaaaaaaaaaa')
      this.listData = data
      this.showTable = true
      this.resTableList = data.data.content
      this.totalPages = data.data.totalPages
      this.totalElements = data.data.totalElements
      let listPtsJson = {
        'type': 'FeatureCollection',
        'features': []
      }
      for (let pt of this.resTableList) {
        let ptLayer = {}
        ptLayer.type = 'Feature'
        ptLayer.geometry = {
          type: 'Point',
          coordinates: [pt.geom.lon, pt.geom.lat]
        }
        ptLayer.properties = {
          featureId: pt.id
        }
        listPtsJson.features.push(ptLayer)
      }
      let geojsonMarkerOptions = {
        radius: 8,
        fillColor: '#ff7800',
        color: '#000',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      }
      if (this.listPtLayer) {
        this.map.removeLayer(this.listPtLayer)
      }
      let that = this
      that.listPtLayer = L.geoJSON(listPtsJson,
        {
          pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, geojsonMarkerOptions)
          },
          onEachFeature: function (feature, layer) {
            // layer.bindPopup('点击进入详情')
            layer.on('click', function () {
              console.log(feature, layer)
              that.SelectedGeojsonChange({ id: feature.properties.featureId })
            })
          }
        }).addTo(that.map)
      that.map.flyToBounds(that.listPtLayer.getBounds())
    },
    init () {
      this.api = this.$api.search
      this.layers = new Map()
      this.imageLayer = {}
      this.boundLayers = L.layerGroup()
      const _this = this
      this.$nextTick(function () {
        _this.maxHeight = document.body.clientHeight - 160
      })
      this.userid = getUserId()
      this.initMap()
      this.getSets()
    },
    getSets () {
      let url = this.$api.sampleSets + '/sp/sampleset/list?size=' + this.page.perPage + '&page=' + this.page.currentPage
      this.$http.post(url, {}).then((response) => {
        if (response && response.status === 200) {
          this.sampleSets = response.data.data.list
          this.page.total = response.data.data.total
        }
      })
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
    setPageChange (currentPage) {
      this.page.currentPage = currentPage
      this.getSets()
    }
  },
  data () {
    return {
      page: {
        perPage: 10,
        currentPage: 1,
        total: 0
      },
      rectanglesLayer: false,
      slices: false,
      sampleSets: [],
      listData: {},
      listPtLayer: false,
      currentPage: 0,
      total: 0,
      drawOptions: {},
      maxHeight: 0,
      multipleSelection: [],
      resultLayer: {},
      menuOption: {},
      imageSrc: '',
      layers: undefined,
      imageLayer: undefined,
      row: undefined,
      loading: false,
      drawType: undefined,
      SVG: {},
      api: {},
      boundLayers: undefined,
      polygon: undefined,
      // samplebar data
      classifySys: [],
      showTable: true,
      option: {
        user: 11
      },
      city: '',
      resTableList: [{
        classType: 1,
        geom: { lat: 38.8797775, lon: -76.98851150000002 },
        id: '7c7028ac36724a599760c550c1a1de0c',
        produceTime: '2020-11-03T03:08:40.831+00:00',
        source: 'DistrictofColumbia'
      }],
      sampleSources: [],
      optionSpace: {},
      query: {},
      selectedSetId: -1
    }
  }
}
</script>
<style>
  @import "../../../node_modules/leaflet.pm/dist/leaflet.pm.css";
</style>
<style lang="scss">
  @import "../sampleManager";
  @import "sampleSetManager";
</style>
