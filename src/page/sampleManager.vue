<template>
  <div class="query sample animated fadeIn">
    <div class="query-bar">
      <side-nav
        :classifySys="classifySys"
        :sampleSources="sampleSources"
        @toggleTable="toggleTable"
        @createSampleSet="createSampleSet"
        @provinceChange="provinceChange"
        @cityChange="cityChange"
        @countyChange="countyChange">
      </side-nav>
      <div class="res" v-if="showTable">
        <div class="table-title">
          检索结果
          <svg @click="showTable=false" t="1600829712581" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3247" width="16" height="16"><path d="M722.19 731.04c-8.85 0-17.75-3.05-24.98-9.27L276.79 360.41c-16.07-13.81-17.89-38.03-4.09-54.09 13.81-16.06 38.02-17.9 54.09-4.09l420.42 361.36c16.07 13.81 17.89 38.03 4.09 54.09-7.59 8.83-18.32 13.36-29.11 13.36z" p-id="3248" fill="#ffffff"></path><path d="M301.81 731.04c-10.79 0-21.52-4.53-29.11-13.35-13.81-16.07-11.98-40.28 4.09-54.09l420.42-361.36c16.07-13.81 40.28-11.98 54.09 4.09 13.81 16.06 11.98 40.28-4.09 54.09L326.79 721.77a38.192 38.192 0 0 1-24.98 9.27z" p-id="3249" fill="#ffffff"></path></svg>
        </div>
        <div class="res-table">
          <div class="res-left">
            <el-table :data="resTableList" size="mini" height="30vh" style="width: 100%" stripe @current-change="handleCurrentChange">
              <el-table-column label="id" width="80">
                <template slot-scope="scope">
                  <span>{{ cutString(scope.row.id, 3) }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="classType" label="分类体系" width="90"></el-table-column>
              <el-table-column prop="source" label="数据来源" width="150"></el-table-column>
              <el-table-column label="生产日期">
                <template slot-scope="scope">
                  <span>{{ getDate(scope.row.produceTime) }}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="res-right">
            <div class="res-cards">
              <div class="sat res-card">
                <img src="../assets/img/tiff03.png"/>
                <p>影像</p>
              </div>
              <div class="label res-card">
                <img src="../assets/img/tiff03.png"/>
                <p>标签</p>
              </div>
            </div>
            <el-button-group>
              <el-button type="success" @click="pageUp()" :disabled="currentPage === 0" icon="el-icon-arrow-left">上一页</el-button>
              <el-button type="success" @click="pageDown()">下一页<i class="el-icon-arrow-right el-icon--right"></i></el-button>
            </el-button-group>
          </div>
        </div>
      </div>
      <new-cat ref="sampleDialog"
        :tree="disabledTree"
        v-if="renderDialog"
        @createSet="createSet"></new-cat>
    </div>
    <div class="map-tool-bar">
      <ul>
        <li :class= "{'active': drawType === 'Rectangle'}" @click="drawOpt('Rectangle')">
          <svg class="svg-icon"><use xlink:href="#icon-map-tool-draw-rectangle"></use></svg>
        </li>
        <li :class= "{'active': drawType === 'Polygon'}" @click="drawOpt('Polygon')">
          <svg class="svg-icon"><use xlink:href="#icon-map-tool-draw-polygon"></use></svg>
        </li>
        <li @click="clearLayer">
          <svg class="svg-icon"><use xlink:href="#icon-map-tool-clear"></use></svg>
        </li>
      </ul>
    </div>
    <b-row>
      <div class="map" id='map'></div>
      <el-popover
        ref="popover"
        placement="right-start"
        width="100"
        trigger="click">
        <ul>
          <li @click="clearLayer">清除图层</li>
        </ul>
      </el-popover>
    </b-row>
    <svg xmlns="http://www.w3.org/2000/svg" style="position: absolute; width: 0; height: 0" id="__SVG_SPRITE_NODE__">
      <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" id="icon-map-tool-clear"><defs></defs><rect class="cls-1" x="6" y="14.5" width="18" height="1" rx="0.5" transform="translate(15 36.21) rotate(-135)"></rect><rect class="cls-1" x="6" y="14.5" width="18" height="1" rx="0.5" transform="translate(36.21 15) rotate(135)"></rect></symbol>
      <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" id="icon-map-tool-draw-polygon"><defs></defs><path class="cls-1" d="M23.71,15.29l-8,8a1,1,0,0,1-1.4,0L6.64,16.06a1,1,0,0,1-.3-.91l.79-4.22a1,1,0,0,1,1.12-.8l8.47,1.13a1,1,0,0,0,.75-.2l4.92-3.81A1,1,0,0,1,24,8v6.55A1,1,0,0,1,23.71,15.29Z"></path></symbol>
      <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" id="icon-map-tool-draw-rectangle"><defs></defs><rect class="cls-1" x="6" y="8" width="18" height="14" rx="1"></rect></symbol>
      <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" id="icon-map-tool-home"><defs></defs><circle class="cls-1" cx="13.53" cy="13.53" r="7"></circle><rect class="cls-2" x="19.88" y="16.88" width="2" height="8" rx="1" transform="translate(-8.65 20.88) rotate(-45)"></rect></symbol>
    </svg>
  </div>
</template>
<script>
import sideNav from 'src/components/samplebar/side-nav'
import newCat from 'src/components/samplebar/new-cat'
import { json } from 'd3-fetch'
import 'leaflet.pm'
import defaultIconUrl from 'leaflet/dist/images/marker-icon.png'
import omnivore from 'leaflet-omnivore'
import { getUserId } from '@/libs/util'
import * as esri from 'esri-leaflet'

const L = window.L
export default {
  name: 'sampleManager',
  components: {
    sideNav,
    newCat
  },
  mounted () {
    this.init()
    this.init1()
  },
  methods: {
    pageUp () {
      this.currentPage = this.currentPage - 1
      this.startQuery()
    },
    pageDown () {
      this.currentPage = this.currentPage + 1
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
    getDate (str) {
      let reg = /\d{2}-\d{2}-\d{2}/
      return str.match(reg)[0]
    },
    createSet (option) {
      let url = this.$api.sampleSets + '/sp/sampleset'
      option.filter.classes = ['1']
      option.taxonomy = [
        {
          'mid': 1,
          'parentId': -1,
          'label': '我的分类体系'
        },
        {
          'mid': 2,
          'parentId': 1,
          'label': '林地'
        },
        {
          'mid': 3,
          'parentId': 2,
          'label': '松树林',
          'link': [
            {
              'id': 12,
              'label': '松树林地',
              'code': '0102'
            }
          ]
        }
      ]
      option.filter.spatial = JSON.stringify(this.resultLayer.toGeoJSON().geometry)
      option.filter = JSON.stringify(option.filter)
      option.taxonomy = JSON.stringify(option.taxonomy)
      this.$http.post(url, option).then((response) => {
        debugger
        if (response && response.status === 200) {

        }
      })
    },
    handleCurrentChange (val) {
      let url = this.$api.sampleDetail + '/mlsample/samples'
      this.$http.post(url, [val.id]).then((response) => {
        if (response && response.status === 200) {
          console.log(response)
          let polygon = JSON.parse(response.data.data[0].spatial)
          let Poly = L.geoJSON(polygon).addTo(this.map)
          this.map.flyToBounds(Poly.getBounds())
        } else {
          this.$notify.error({title: '错误', message: response.message})
        }
      }).catch((response) => {
        console.log(response)
      })
    },
    startQuery () {
      let url00 = this.$api.samplePreview + '/samples/query?size=' + this.perPage + '&page=' + this.currentPage
      let option00 = {
        'classType': [1],
        'source': ['DistrictofColumbia']
        // 'geom': JSON.stringify(this.resultLayer.toGeoJSON().geometry),
        // 'temporal': '1604372920918',
      }
      this.$http.post(url00, option00).then((response) => {
        if (response && response.status === 200) {
          console.log(response)
          this.resTableList = response.data.data.content
          this.totalPages = response.data.totalPages
          console.log(this.resTableList)
        } else {
          this.$notify.error({title: '错误', message: response.message})
        }
      }).catch((response) => {
        console.log(response)
      })
      // let resData = []
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
      this.getSampleSourceInfo()
      // this.getCollect()
    },
    getSampleSourceInfo () {
      let that = this
      let url00 = this.$api.samplePreview + '/samples/sources'
      this.$http.get(url00).then((response) => {
        if (response && response.status === 200) {
          that.sampleSources = response.data.data
        } else {
          that.$notify.error({title: '错误', message: response.message})
        }
      }).catch((response) => {
        console.log(response)
      })
    },
    initMap () {
      const _this = this
      // let WMTS = L.TileLayer.WMTS
      try {
        this.map = L.map('map', {
          center: [38.89753, -77.036588],
          zoom: 13,
          zoomControl: false
        })
        var layer = esri.basemapLayer('Imagery').addTo(this.map) // 定义basemapLayer并将其加载到地图容器中
        // this.map.addLayer(editableLayers)
        this.drawOptions = {
          snappable: true,
          snapDistance: 10,
          allowSelfIntersection: false,
          templineStyle: {
            color: '#84FF7B',
            weight: 2
          },
          hintlineStyle: {
            color: '#84FF7B',
            // dashArray: [5, 5],
            weight: 1
          },
          pathOptions: {
            // add leaflet options for polylines/polygons
            color: 'red',
            fillColor: '#3388ff'
          },
          cursorMarker: false,
          finishOn: 'dblclick',
          forever: false // 无尽模式
        }
        this.map.on('pm:create', (e) => {
          _this.resultLayer = e.layer// 增加到结果图层
          _this.resultLayer.on('click', function (e) {
            // 统计
            let left = e.containerPoint.x
            let top = e.containerPoint.y
            let el = document.querySelector('.el-popover')
            el.style.top = top + 'px'
            el.style.left = left + 'px'
            el.style.display = 'block'
            e.stopPropagation()
            return false
          })
        })
        this.map.on('click', (e) => {
          let el = document.querySelector('.el-popover')
          el.style.display = 'none'
        })
      } catch (e) {
        console.log(e)
      }
    },
    // 清除所有模式 和已画图层
    disableAllMode () {
      this.map.pm.disableDraw('Poly')
      this.map.pm.disableDraw('Rectangle')
    },
    showWtk (data) {
      this.wkt && this.wkt.remove()
      this.marker && this.marker.remove()
      this.clearLayer()
      if (data.type && data.type === 'clearPolygon') {
        this.polygon && this.polygon.remove()
      }
      if (data.type && data.type === 'FeatureCollection') {
        const defaultPolyStyle = {
          color: '#ff174d',
          fillColor: 'transparent',
          weight: 2,
          fillOpacity: 0.6
        }
        for (let poly of data.features) {
          let coords = []
          for (let ring of poly.geometry.coordinates) {
            const ringAfter = ring.map((coord) => {
              return [coord[1], coord[0]]
            })
            coords.push(ringAfter)
          }
          const polygonLayer = L.polygon(coords).addTo(this.map)
          polygonLayer.setStyle(defaultPolyStyle)
          this.boundLayers.addLayer(polygonLayer)
        }
        let center = data.features[0].properties.center
        let level = data.features[0].properties.level
        if (level && center) {
          let zoom = 6
          if (level === 'city') {
            zoom = 9
          }
          if (level === 'district') {
            zoom = 11
          }
          this.map.setView([center.lat, center.lng], zoom)
        }
      } else if (data.type && data.type === 'polygon') {
        this.polygon && this.polygon.remove()
        this.polygon = L.polygon(data.data, {color: 'red'}).addTo(this.map)
      } else {
        if (data.wkt) {
          this.wkt = omnivore.wkt.parse(data.wkt).addTo(this.map)
          this.opiont.bound = data.wkt
        } else {
          this.optionSpace.point = 'POINT(' + data.location.lat + ' ' + data.location.lon + ')'
        }
        let defaultIcon = L.icon({
          iconUrl: defaultIconUrl,
          shadowUrl: import('leaflet/dist/images/marker-shadow.png')
        })
        this.marker = L.marker([data.location.lat, data.location.lon], {icon: defaultIcon}).addTo(this.map)
          .bindPopup(data.address || data.name)
          .openPopup()
        this.map.setView([data.location.lat, data.location.lon], 14)
      }
    },
    clearLayer () {
      this.disableAllMode()
      // 取消编辑状态
      if (this.resultLayer.pm) {
        this.resultLayer.remove()
        // 取消选择时高亮的效果
        this.resultLayer.off('click')
        this.resultLayer.off('contextmenu')
        this.resultLayer.off('dblclick')
      }
      let el = document.querySelector('.el-popover')
      el.style.display = 'none'
      this.polygon && this.polygon.remove()
      this.boundLayers.eachLayer((l) => {
        l.remove()
      })
      this.boundLayers.clearLayers()
    },
    // 拉框
    drawRect () {
      this.map.pm.disableDraw('Poly')
      this.map.pm.enableDraw('Rectangle', this.drawOptions)
    },
    // 多边形
    drawPolygon () {
      this.map.pm.disableDraw('Rectangle')
      this.map.pm.enableDraw('Poly', this.drawOptions)
    },
    drawOpt (type) {
      this.drawType = type
      this.clearLayer()
      if (type === 'Rectangle') {
        this.drawRect()
      }
      if (type === 'Polygon') {
        this.drawPolygon()
      }
      if (type !== 'Division') {
        this.optionSpace.bound = ''
      }
    },

    /**
     * samplebar.vue methods */
    linkable (node, data) {
      if (!this.linking || node.disabled) {
        return false
      }
      if (node.childNodes.length !== 0) {
        return false
      }
      return true
    },
    createSampleSet (tree) {
      console.log(tree)
      this.disabledTree = tree
      this.renderDialog = true
    },
    appendSampleSet () {
      this.ShowCreateDialog = false
      this.ShowAppendDialog = true
    },
    startIndexing () {
      this.showTable = true
      let checkedKeys = this.$refs.tree.getCheckedKeys()
      let MyKeys = []
      for (let key of checkedKeys) {
        if (MyKeys.indexOf(key) == -1) {
          MyKeys.push(key)
          let temp = key.substring(0, key.length - 2)
          while (temp != '') {
            if (MyKeys.indexOf(temp) == -1) {
              MyKeys.push(temp)
              temp = temp.substring(0, temp.length - 2)
            } else break
          }
        }
      }
      console.log(MyKeys)
      let data = {children: this.data1}
      this.setDataStatus(data, MyKeys)
      console.log(this.data1)
      // for(let item in this.data1){
      //   this.setDataStatus(item, checkedKeys)
      // }
      // console.log(this.$refs.tree.getCheckedNodes())
    },
    init1 () {
      this.api = this.$api.search
      this.rootApi = this.$api.root1

      // test api
      let url2 = 'http://127.0.0.1:7001/api/v1/common/taxology'
      this.$http.post(url2, {}).then((response) => {
        if (response && response.status === 200) {
          let catList = response.data.data.list
          // 根据分类体系的基本信息查找分类体系的具体信息
          let url2 = this.$api.root1 + '/sp/base/taxonomy/detail/list'
          let requests = []
          for (let i = 0; i < catList.length; i++) {
            let item = catList[i]
            item.place = [i]
            let option = {mainId: item.id}
            requests.push(this.$http.post(url2, option))
          }
          let that = this
          that.$http.all(requests).then(function (values) {
            debugger
            let details = []
            for (let item of values) details.push(item.data.data.list)
            that.sortCat(catList, details)
          })
          // this.sortCat(response.data.data.list)
        } else {
          this.$notify.error({title: '错误', message: response.message})
        }
      }).catch((response) => {
        // console.log(response)
      })

      // test api

      let url = this.$api.root1 + '/sp/base/taxonomy/main/list'
      let details = []
      // 查找分类体系的基本信息
      this.$http.post(url, {}).then((response) => {
        if (response && response.status === 200) {
          let catList = response.data.data.list
          // 根据分类体系的基本信息查找分类体系的具体信息
          let url2 = this.$api.root1 + '/sp/base/taxonomy/detail/list'
          let requests = []
          for (let i = 0; i < catList.length; i++) {
            let item = catList[i]
            item.place = [i]
            let option = {mainId: item.id}
            requests.push(this.$http.post(url2, option))
          }
          let that = this
          that.$http.all(requests).then(function (values) {
            let details = []
            for (let item of values) details.push(item.data.data.list)
            that.sortCat(catList, details)
          })
          // this.sortCat(response.data.data.list)
        } else {
          _this.$notify.error({title: '错误', message: response.message})
        }
      }).catch((response) => {
        // console.log(response)
      })
    },
    sortCat (catList, details) {
      for (let i = 0; i < catList.length; i++) {
        let classSys = this.buildTree(catList[i], details[i])
        this.classifySys.push(classSys)
      }
      console.log(this.classifySys)
    },
    buildTree (parent, children) {
      let place = 0
      for (let index = 0; index < children.length; index++) {
        let child = children[index]
        if (child.mainId === parent.id) {
          child.palce = parent.place.concat([place])
          place = place + 1
          let temp = JSON.parse(JSON.stringify(children))
          temp.splice(index, 1)
          this.buildTree(child, temp)
          typeof parent.children !== 'undefined' ? parent.children.push(child) : parent.children = [child]
        }
      }
      return parent
    },
    getAreaBound (value) {
      if (!value) return false
      let url = this.$api.divisionUrl + 'bound/' + value + '.json'
      json(url).then((data, error) => {
        if (error) return false
        this.boundJson = data
        this.option.bound = this.getPolygon(data)
        // this.$emit('show-wkt', data)
        this.showWtk(data)
      }).catch((response) => {
        // console.log(response)
      })
    },
    provinceChange (value) {
      this.getAreaBound(value)
    },
    cityChange (value) {
      if (!value) return false
      this.getAreaBound(value)
    },
    countyChange (value) {
      if (!value) return false
      this.getAreaBound(value)
    },
    showMaker (data) {
      // this.$emit('show-wkt', data)
      this.showWtk(data)
    },
    getPolygon (data) {
      if (!data.features || data.features.length === 0) return ''
      let poly = data.features[0]
      let bound = 'MULTIPOLYGON(('
      for (let ring of poly.geometry.coordinates) {
        bound += '('
        ring.map((coord) => {
          bound += coord[0] + ' ' + coord[1] + ','
        })
        bound = bound.substr(0, bound.length - 1)
        bound += '),'
      }
      bound = bound.substr(0, bound.length - 1)
      bound += '))'
      return bound
    },
    setDataStatus (item, keys) {
      let that = this
      if (!('children' in item)) {
        return
      }
      for (let i of item.children) {
        if (keys.indexOf(i.code) === -1) {
          i.disabled = true
        } else {
          i.disabled = false
          that.setDataStatus(i, keys)
        }
      }
    },
    toggleTable () {
      this.showTable = true
      this.startQuery()
    }
  },
  data () {
    return {
      renderDialog: false,
      nav: {},
      map: {},
      record: [],
      currentPage: 0,
      queryType: 'default',
      totalPages: 0,
      perPage: 10,
      total: 0,
      wkt: undefined,
      collectItem: [],
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      layerList: [],
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
      offWidth: '30vw',
      defaultWidth: 0,
      initOffset: 0,
      tableWidth: 800,
      isMoving: false,
      isCollapsed: false,
      plotLayer: {},
      SVG: {},
      stream: {},
      api: {},
      collectType: 2,
      tepositions: [],
      filterTeposition: '',
      originalRecord: [],
      boundLayers: undefined,
      polygon: undefined,
      boundGeoJson: undefined,
      selectRow: {},
      viewMap: undefined,
      viewTitleLayer: undefined,

      // samplebar data
      classifySys: [],
      props: { multiple: true },
      ShowAppendDialog: false,
      ShowCreateDialog: false,
      showTable: false,
      linking: false,
      disabledTree: null,
      option: {
        user: 11
      },
      rootApi: '',
      province: '',
      city: '',
      county: '',
      boundJson: {},
      // newly added
      //
      resTableList: [{
        classType: 1,
        geom: {lat: 38.8797775, lon: -76.98851150000002},
        id: '7c7028ac36724a599760c550c1a1de0c',
        produceTime: '2020-11-03T03:08:40.831+00:00',
        source: 'DistrictofColumbia'
      }],
      sampleSources: [],
      optionSpace: {}
    }
  }
}
</script>
<style>
  @import "~leaflet.pm/dist/leaflet.pm.css";
</style>
<style lang="scss">
  @import "sampleManager.scss";
</style>
