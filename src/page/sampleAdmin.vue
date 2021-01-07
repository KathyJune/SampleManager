<template>
  <div class="query sample animated fadeIn">
    <sample-bar @query="getRecord" @space-query="spaceQuery" @menu-query="menuQuery" ref="queryBar"
               @tab-handle="tabSelect" @show-wkt="showWtk" @draw="drawOpt" @startQuery="startQuery">
    </sample-bar>
    <div class="map-tool-bar">
      <ul>
        <li :class= "{'active': drawType === 'Rectangle'}" @click="drawOpt('Rectangle')">
          <svg class="svg-icon">
            <use xlink:href="#icon-map-tool-draw-rectangle"></use>
          </svg>
        </li>
        <li :class= "{'active': drawType === 'Polygon'}" @click="drawOpt('Polygon')">
          <svg class="svg-icon">
            <use xlink:href="#icon-map-tool-draw-polygon"></use>
          </svg>
        </li>
        <li @click="clearLayer">
          <svg class="svg-icon">
            <use xlink:href="#icon-map-tool-clear"></use>
          </svg>
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
import SampleBar from 'src/components/samplebar/samplebar'
import { BListGroup, BListGroupItem } from 'bootstrap-vue/src/components/list-group'
import 'leaflet.pm'
// import defaultIconUrl from 'leaflet/dist/images/marker-icon.png'
import defaultIconUrl from '@/assets/img/avatars/admin.png'
import omnivore from 'leaflet-omnivore'
import { on, off } from 'src/utils/dom'
import { thousandFomart, parseJson, formatPoint } from '../utils/factory'
import { getUserId } from '@/libs/util'
import TimeLine from 'src/components/timeline/timeline'
// import * as esri from 'esri-leaflet'
const L = window.L
const acessToken = 'ade4530538c006d4b4a3ac8b9138499f'
const colors = [
  '#2B1E3E',
  '#383C65',
  '#3E5F7E',
  '#49838A',
  '#5EA28D',
  '#82BB92',
  '#AECEA1',
  '#D6DEBF'
]
export default {
  name: 'sampleAdmin',
  components: {
    BListGroupItem,
    BListGroup,
    SampleBar,
    TimeLine
  },
  mounted () {
    this.init()
  },
  computed: {
    totalText: function () {
      return '总共' + this.total + '条记录'
    },
    timerText: function () {
      return this.timerSecond + 's'
    },
    colnums: function () {
      return this.fields.filter((item) => {
        return item.show === true
      })
    }
  },
  methods: {
    startQuery () {
      let url00 = this.$api.rootUrlXiaoliang + '/mlsample/query'
      let option00 = {
        'classType': 1,
        'geom': this.resultLayer
      }
      this.$http.post(url00, option00).then((response) => {

      }).catch((response) => {
        // console.log(response)
      })
      let resData = []
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
      this.getCollect()
      document.body.onclick = function () {
        _this.showColList = false
      }
    },
    initMap () {
      const _this = this
      // let WMTS = L.TileLayer.WMTS
      try {
        this.map = L.map('map', {
          center: [31.59, 120.29],
          zoom: 6,
          zoomControl: false
        })
        // L.tileLayer.chinaProvider('TianDiTu.Normal.Map', { maxZoom: 18, minZoom: 5 }).addTo(this.map)
        // L.tileLayer.chinaProvider('TianDiTu.Normal.Annotion', { maxZoom: 18, minZoom: 5 }).addTo(this.map)
        // let layerIGNScanStd = 'vmap'
        // // 影像
        // let baseUrl = this.$api.mapBase + '/mapserver/vmap/WMTS/1.0.0/zjvmap/tdt_biaozhunyangshi_2017'
        // // 地名标注
        // let nameUrl = this.$api.mapBase + '/mapserver/label/WMTS/1.0.0/zjvmap/tdt_biaozhunyangshi_2017'
        // let matrixIds = [
        //   {
        //     'identifier': '1',
        //     'scaleDenominator': 295829355.4545656,
        //     'topLeftCorner': {
        //       'lat': 90,
        //       'lng': -180
        //     }
        //   },
        //   {
        //     'identifier': '2',
        //     'scaleDenominator': 147914677.7272828,
        //     'topLeftCorner': {
        //       'lat': 90,
        //       'lng': -180
        //     }
        //   },
        //   {
        //     'identifier': '3',
        //     'scaleDenominator': 73957338.8636414,
        //     'topLeftCorner': {
        //       'lat': 90,
        //       'lng': -180
        //     }
        //   },
        //   {
        //     'identifier': '4',
        //     'scaleDenominator': 36978669.4318207,
        //     'topLeftCorner': {
        //       'lat': 90,
        //       'lng': -180
        //     }
        //   },
        //   {
        //     'identifier': '5',
        //     'scaleDenominator': 18489334.71591035,
        //     'topLeftCorner': {
        //       'lat': 90,
        //       'lng': -180
        //     }
        //   },
        //   {
        //     'identifier': '6',
        //     'scaleDenominator': 9244667.357955175,
        //     'topLeftCorner': {
        //       'lat': 90,
        //       'lng': -180
        //     }
        //   },
        //   {
        //     'identifier': '7',
        //     'scaleDenominator': 4622333.678977587,
        //     'topLeftCorner': {
        //       'lat': 90,
        //       'lng': -180
        //     }
        //   },
        //   {
        //     'identifier': '8',
        //     'scaleDenominator': 2311166.8394887936,
        //     'topLeftCorner': {
        //       'lat': 90,
        //       'lng': -180
        //     }
        //   },
        //   {
        //     'identifier': '9',
        //     'scaleDenominator': 1155583.4197443968,
        //     'topLeftCorner': {
        //       'lat': 90,
        //       'lng': -180
        //     }
        //   },
        //   {
        //     'identifier': '10',
        //     'scaleDenominator': 577791.7098721984,
        //     'topLeftCorner': {
        //       'lat': 90,
        //       'lng': -180
        //     }
        //   },
        //   {
        //     'identifier': '11',
        //     'scaleDenominator': 288895.8549360992,
        //     'topLeftCorner': {
        //       'lat': 90,
        //       'lng': -180
        //     }
        //   },
        //   {
        //     'identifier': '12',
        //     'scaleDenominator': 144447.9274680496,
        //     'topLeftCorner': {
        //       'lat': 90,
        //       'lng': -180
        //     }
        //   },
        //   {
        //     'identifier': '13',
        //     'scaleDenominator': 72223.9637340248,
        //     'topLeftCorner': {
        //       'lat': 90,
        //       'lng': -180
        //     }
        //   },
        //   {
        //     'identifier': '14',
        //     'scaleDenominator': 36111.9818670124,
        //     'topLeftCorner': {
        //       'lat': 90,
        //       'lng': -180
        //     }
        //   },
        //   {
        //     'identifier': '15',
        //     'scaleDenominator': 18055.9909335062,
        //     'topLeftCorner': {
        //       'lat': 90,
        //       'lng': -180
        //     }
        //   },
        //   {
        //     'identifier': '16',
        //     'scaleDenominator': 9027.9954667531,
        //     'topLeftCorner': {
        //       'lat': 90,
        //       'lng': -180
        //     }
        //   },
        //   {
        //     'identifier': '17',
        //     'scaleDenominator': 4513.99773337655,
        //     'topLeftCorner': {
        //       'lat': 90,
        //       'lng': -180
        //     }
        //   },
        //   {
        //     'identifier': '18',
        //     'scaleDenominator': 2256.998866688275,
        //     'topLeftCorner': {
        //       'lat': 90,
        //       'lng': -180
        //     }
        //   }
        // ]
        // let southWest = new L.LatLng(27.142375, 118.022475)
        // let northEest = new L.LatLng(31.182625, 122.993275)
        // let option = {
        //   tileSize: 256,
        //   layer: layerIGNScanStd,
        //   style: 'normal',
        //   tilematrixSet: 'default028mm',
        //   format: 'image/png',
        //   matrixIds: matrixIds,
        //   fullExtent: new L.LatLngBounds(southWest, northEest)
        // }
        // let ign = new WMTS(baseUrl, option)
        // map.addLayer(ign)
        // let nameWmts = new WMTS(nameUrl, option)
        // map.addLayer(nameWmts)
        let editableLayers = new L.FeatureGroup()
        // var layer = esri.basemapLayer('Imagery').addTo(this.map);  //定义basemapLayer并将其加载到地图容器中
        this.map.addLayer(editableLayers)
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
          // let a  = e.layer.toGeoJSON()
          // let cd = a.geometry
          // let url00 = this.$api.rootUrlXiaoliang + '/mlsample/query'
          // let option00 = {
          //   "classType": 1,
          //   "geom": cd
          // }
          // this.$http.post(url00, option00).then((response) => {
          // }).catch((response) => {
          //   // console.log(response)
          // })
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
    tabSelect (name) {
      // console.log(name)
      if (name !== 'space') {
        this.clearMapLayer()
      }
    },
    getPoint (layer) {
      let retVal = ''
      layer.map(function (n) {
        if (retVal) {
          retVal += ','
        }
        retVal += '('
        retVal += n.lat + ',' + n.lng + ')'
      })
      return retVal
    },
    onClick () {
      this.isCollapsed = !this.isCollapsed
      // document.querySelector('.query .data-bar').classList.toggle('collapsed')
    },
    getRowCount (items) {
      return items.length
    },
    getBadge (status) {
      return status === '公开' ? 'success' : 'secondary'
    },
    getRecord (option) {
      let url = this.api.list
      this.loading = true
      this.option = option
      option.limit = this.perPage === 1000000 ? 'ALL' : this.perPage
      option.page = this.currentPage
      option.userid = this.userid
      if (this.resultLayer.pm && (this.drawType === 'Polygon' || this.drawType === 'Rectangle')) {
        let latlngs = this.resultLayer._latlngs[0]
        latlngs = latlngs.concat(latlngs[0])
        let bound = 'POLYGON(('
        for (let i = 0; i < latlngs.length; i++) {
          bound += latlngs[i].lng + ' ' + latlngs[i].lat + ','
        }
        bound = bound.substr(0, bound.length - 1)
        bound += '))'
        option.bound = bound
      }
      const _this = this
      this.clearMapLayer()
      this.clearGeoJson()
      this.isCollapsed = false
      this.$http.post(url, option).then((response) => {
        if (response && response.data.code === 1) {
          option.bound = null
          _this.$refs['queryBar'].clearBound()
          _this.record = response.data.data.rows
          _this.total = response.data.data.total
          _this.layerList = response.data.layerList
          _this.getTeposition(_this.record)
          _this.disableAllMode()
          if (_this.record.length > 0) _this.showGeoJson(_this.record)
          _this.loading = false
        } else {
          _this.$notify.error({title: '错误', message: response.data.msg})
          _this.loading = false
        }
      }).catch((response) => {
        _this.record = []
        _this.total = 0
        _this.loading = false
      })
    },
    clearMapLayer () {
      // 清除地图上wkt
      this.wkt && this.wkt.remove()
      // 清除地图上 标记
      this.marker && this.marker.remove()
      // 清楚图片
      this.clearImage()
      // 清除地图上自定义框选范围
      this.clearLayer()
      // this.resultLayer.pm && this.resultLayer.remove()
    },
    pageChange (val) {
      this.currentPage = val
      this.refreshRecord()
    },
    pageSizeChange (val) {
      if (val === 'All') {
        this.perPage = 1000000
      } else {
        this.perPage = val
      }
      this.currentPage = 1
      this.refreshRecord()
    },
    showGeoJson (record) {
      try {
        let style = {
          'color': '#6293ff',
          'weight': 5,
          'opacity': 0.6,
          'fill': false
        }
        const _this = this
        _this.clearGeoJson()
        _this.clearImage()
        let _zoomMax = []
        let _zoomMin = []
        let _top = []
        let _left = []
        let _right = []
        let _bottom = []
        // let lan, lat
        // lan = 0
        // lat = 0
        record.map((item, i) => {
          let geoJson = JSON.parse(item.boundaryjson)
          let layerGeo
          let color = this.tepositions.find((o) => {
            return o.value === _this.getYear(item)
          })
          if (color) style.color = color.color
          layerGeo = L.geoJSON(geoJson, {
            style: style
          }).addTo(_this.map)
          layerGeo.on('click', function (e) {
            _this.$refs.picTable.setCurrentRow(item)
          })
          _this.layers.set(item.fOid, layerGeo)
          let zoom = item.zoom.split(',')
          let leftbottom = formatPoint(item.leftbottom)
          let righttop = formatPoint(item.righttop)
          // console.log(leftbottom, righttop)
          _zoomMax.push(~~zoom[0])
          _zoomMin.push(~~zoom[1])
          _top.push(parseFloat(righttop[1], 10))
          _left.push(parseFloat(leftbottom[0], 10))
          _right.push(parseFloat(righttop[0], 10))
          _bottom.push(parseFloat(leftbottom[1], 10))
          // lat += parseFloat(center[1], 10)
          // lan += parseFloat(center[0], 10)
        })
        // let zoomMin = Math.max.apply(Math, _zoomMin) - 4
        let top, left, right, bottom
        top = Math.max.apply(Math, _top)
        left = Math.min.apply(Math, _left)
        right = Math.max.apply(Math, _right)
        bottom = Math.min.apply(Math, _bottom)
        // let lan = (left + right) / 2
        // let lat = (top + bottom) / 2
        // this.map.setView([lat, lan], zoomMin)
        this.map.flyToBounds([
          [bottom, left],
          [top, right]
        ])
        // console.log(this.resultLayer.remove)
        // this.map.addLayer(this.resultLayer)
      } catch (e) {
        console.log(e.message)
      }
    },
    // showGeoJsonD3 (record) {
    //   try {
    //     const _this = this
    //     let projectPoint = function (x, y) {
    //       let point = _this.map.latLngToLayerPoint(new L.LatLng(y, x))
    //       this.stream.point(point.x, point.y)
    //     }
    //     let transform = d3.geoTransform({point: projectPoint})
    //     let _zoomMax = []
    //     let _zoomMin = []
    //     let _lan = []
    //     let _lat = []
    //     let lan, lat
    //     lan = 0
    //     lat = 0
    //     let _geoJsonArray = []
    //     record.map((item, i) => {
    //       let geoJson = JSON.parse(item.boundaryjson)
    //       let _geoJson = {
    //         type: 'Feature',
    //         geometry: geoJson
    //       }
    //       _geoJsonArray.push(_geoJson)
    //       // layerGeo.on('click', function (e) {
    //       //   _this.$refs.picTable.setCurrentRow(item)
    //       // })
    //       let zoom = item.zoom.split(',')
    //       let center = item.centerpoint.replace('(', '').replace(')', '').split(',')
    //       _zoomMax.push(~~zoom[0])
    //       _zoomMin.push(~~zoom[1])
    //       _lat.push(parseFloat(center[1], 10))
    //       _lan.push(parseFloat(center[0], 10))
    //       lat += parseFloat(center[1], 10)
    //       lan += parseFloat(center[0], 10)
    //     })
    //     _this.clearImage()
    //     _this.plotLayer.selectAll('path').remove()
    //     this.feature = _this.plotLayer.selectAll('path')
    //       .data(_geoJsonArray)
    //       .enter()
    //       .append('path')
    //       .attr('stroke', '#6293ff')
    //       .attr('stroke-width', 3)
    //       .attr('stroke-opacity', 0.6)
    //       .attr('d', d3.geoPath())
    //       .style('fill', '#6293ff')
    //       .style('fill-opacity', 0.2)
    //     let zoomMin = Math.max.apply(Math, _zoomMin) - 4
    //     lat = lat / _lat.length
    //     lan = lan / _lan.length
    //     this.map.setView([lat, lan], zoomMin)
    //     let drawAndUpdate = function () {
    //       _this.feature.attr('d', d3.geoPath().projection(transform))
    //     }
    //     drawAndUpdate()
    //     this.map.on('zoom', (e) => {
    //       drawAndUpdate()
    //     })
    //   } catch (e) {
    //     console.log(e.message)
    //   }
    // },`
    clearGeoJson () {
      const _this = this
      this.layers.forEach(function (value, key) {
        _this.map.removeLayer(value)
      })
      this.wkt && this.wkt.remove()
      this.marker && this.marker.remove()
    },
    clearImage () {
      try {
        for (let key in this.imageLayer) {
          let _Overlay = this.imageLayer[key]
          _Overlay.Overlay.remove()
        }
      } catch (e) {
        // todo
      }
      this.imageLayer = {}
    },
    show (geoJson) {
      // 渲染方法
      // let geoJson = {}
      let layerGeo = L.geoJSON(geoJson).addTo(this.map)
      // 添加点击事件
      layerGeo.on('click', function (e) {
        // console.log(e.layer.feature.properties.name) // 当前点击的物体的名称
      })
    },
    push (data) {
      let url = this.$api.batchPush
      let postData = {
        imagearray: [data.fOid],
        userid: this.userid
      }
      // let url = this.$api.publishImage + '?id=' + data.fOid + '&userid=' + this.userid // + '&url=' + data.hdfsurl
      const _this = this
      this.$http.post(url, postData).then((response) => {
        if (response && response.data.code === 1) {
          data.publishstate = 1
          _this.$notify({title: '提示', message: '启动发布服务, 请等待!', type: 'success'})
        } else {
          _this.$notify.error({title: '错误', message: response.data.msg})
        }
      }).catch((response) => {
        // console.log(response)
      })
    },
    batchPush () {
      // 批量发布
      let url = this.$api.batchPush
      let _batchPush = this.multipleSelection.filter((item) => {
        return item.publishstate !== 2
      })
      if (_batchPush.length === 0) {
        this.$notify.warning({title: '警告', message: '请选择未发布图像进行图层操作！'})
        return false
      }
      let imagearray = _batchPush.map((value) => {
        return value.fOid
      })
      let postData = {
        imagearray: imagearray,
        userid: this.userid
      }
      const _this = this
      this.$http.post(url, postData).then((response) => {
        if (response && response.data.code === 1) {
          _this.$notify({title: '提示', message: '图像批量发布服务已启动,请等待!', type: 'success'})
        } else {
          _this.$notify.error({title: '错误', message: response.data.msg})
        }
      }).catch((response) => {
        // console.log(response)
      })
    },
    cancleBatchPush () {
      // 取消批量发布
      let url = this.$api.cancelBatchPush
      let imagearray = this.multipleSelection.map((item) => {
        return item.fOid
      })
      if (!imagearray.length) {
        this.$notify.warning({ title: '警告', message: '您还未选中数据！' })
        return false
      }
      const _this = this
      let postData = {
        imagearray: imagearray,
        userid: this.userid
      }
      let _text = []
      let confirmText = '此操作将永久删除已选中发布图像数据, 是否继续?'
      for (let i = 0; i < this.multipleSelection.length; i++) {
        let _data = this.multipleSelection[i]
        let _layer = this.layerList.filter((item) => {
          return item.foid === _data.fOid
        })
        console.log(_layer)
        if (_layer.length > 0) _text.push('图像【' + _data.iddataname + '】已经被图层引用')
      }
      if (_text.length > 0) {
        confirmText = _text.toString() + ',此操作将该永久删除选中发布图像并删除相关图层关联, 是否继续?'
      }
      this.$confirm(confirmText, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.post(url, postData).then((response) => {
          if (response && response.data.code === 1) {
            _this.$notify({title: '提示', message: '图像批量取消发布成功!', type: 'success'})
          } else {
            _this.$notify.error({title: '错误', message: response.data.msg})
          }
        }).catch((response) => {
          // console.log(response)
        })
      }).catch(() => {
        //
      })
    },
    deletePush (data) {
      let url = this.$api.cancelBatchPush
      let imagearray = [data.fOid]
      let postData = {
        imagearray: imagearray,
        userid: this.userid
      }
      let _layer = this.layerList.map((item) => {
        return item.foid === data.fOid
      })
      const _this = this
      let confirmText = '此操作将该条件永久中删除发布图像数据, 是否继续?'
      if (_layer.length > 0) {
        confirmText = '图像数据【' + data.iddataname + '】已经被图层引用,此操作将该条件永久中删除发布图像并删除相关图层关联, 是否继续?'
      }
      this.$confirm(confirmText, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        _this.$http.post(url, postData).then((response) => {
          if (response && response.data.code === 1) {
            _this.$notify({title: '提示', message: '图像取消发布成功!', type: 'success'})
          } else {
            _this.$notify.error({title: '错误', message: response.data.msg})
          }
        }).catch((response) => {
          // console.log(response)
        })
      }).catch(() => {
        //
      })
    },
    addImage (data) {
      // const _this = this
      try {
        let _Overlay = this.imageLayer[data.fOid]
        if (!_Overlay) {
          let leftbottom = data.leftbottom.replace('(', '').replace(')', '').split(',')
          let righttop = data.righttop.replace('(', '').replace(')', '').split(',')
          let bounds = [[parseFloat(leftbottom[1], 10), parseFloat(leftbottom[0], 10)], [parseFloat(righttop[1], 10), parseFloat(righttop[0], 10)]]
          let url = this.$api.search.get + '?fOid=' + data.fOid
          this.imageLayer[data.fOid] = {}
          this.imageLayer[data.fOid].Overlay = L.imageOverlay(url, bounds).addTo(this.map)
          this.imageLayer[data.fOid].OverlayShow = true
          let zoom = data.zoom.split(',')
          let center = data.centerpoint.replace('(', '').replace(')', '').split(',')
          this.map.setView([parseFloat(center[1], 10), parseFloat(center[0], 10)], ~~zoom[1])
        } else {
          _Overlay.Overlay.remove()
          _Overlay.OverlayShow = false
          delete this.imageLayer[data.fOid]
        }
      } catch (e) {
        console.log(e)
      }
    },
    isShow (row) {
      return this.imageLayer[row.fOid] && this.imageLayer[row.fOid].OverlayShow
    },
    view (data) {
      this.dialogView = true
      this.selectRow = data
      // let router = this.$router.resolve({
      //   name: 'mapView',
      //   params: {
      //     id: data.fOid
      //   }
      // })
      // window.open(router.href, '_blank')
    },
    refresh () {
      this.getRecord(this.option)
    },
    showCol () {
      this.showColList = true
    },
    refreshCol (item) {
      let _class = !item.show ? 'col-show' : 'col-hide'
      this.$set(item, 'class', _class)
      // console.log(item.show)
      // document.querySelectorAll('.' + item.class).forEach(function (d, i) {
      //   d.style.display = item.show ? 'table-cell' : 'none'
      // })
    },
    stopClick () {
      return false
    },
    Collection (item) {
      console.log(item)
    },
    analysis (item) {
      let router = this.$router.resolve({
        name: 'analysisbyId',
        params: {
          id: item.fOid
        }
      })
      window.open(router.href, '_blank')
      // this.$router.push({name: 'analysisbyId', params: {id: item.fOid}})
    },
    getCollect () {
      const _this = this
      let url = this.$api.folder.getTree + '?userid=' + this.userid
      this.$http.get(url).then((response) => {
        if (response && response.data.code === 1) {
          _this.collectItem = response.data.data
        } else {
          this.$notify.error({title: '错误', message: response.data.msg})
        }
      }).catch((response) => {
        // console.log(response)
      })
    },
    handleSubmenuShow (vm, placement) {
      // console.log(vm, placement)
    },
    rowClick (row, event, column) {
      this.row = row
    },
    handleClick (data, event) {
      let url
      let option = {
        folderid: data.id,
        userid: this.userid
      }
      // 单个收藏
      if (this.collectType === 2) {
        url = this.$api.folder.saveData
        option.dataid = this.row.fOid
      } else {
        // 批量收藏 batch collection
        url = this.$api.folder.batchSaveData
        if (!this.multipleSelection.length) {
          this.$notify.warning({title: '警告', message: '您还未选择图像进行批量收藏！'})
          return false
        }
        let imagearray = this.multipleSelection.map((value) => {
          return value.fOid
        })
        option.dataids = imagearray.toString()
      }
      this.collection(url, option)
    },
    collection (url, option) {
      const _this = this
      this.$http.post(url, option).then((response) => {
        if (response && response.data.code === 1) {
          _this.$notify({title: '提示', message: '收藏操作成功!', type: 'success'})
          // _this.getRecord()
        } else {
          _this.$notify.error({title: '错误', message: response.data.msg})
        }
      }).catch((response) => {
        // console.log(response)
      })
    },
    contentChoose (type) {
      this.collectType = type
    },
    refreshRecord () {
      switch (this.queryType) {
        case 'default':
          this.getRecord(this.option)
          break
        case 'spaceQuery':
          this.getRecordSpace()
          break
        case 'menuQuery':
          this.menuQuery(this.menuOption)
          break
      }
    },

    spaceQuery (option) {
      if (option.dateRange) {
        this.optionSpace.beginDate = option.dateRange.start
        this.optionSpace.endDate = option.dateRange.end
      }
      this.queryType = 'spaceQuery'
      this.currentPage = 1
      if (this.resultLayer.pm && (this.drawType === 'Polygon' || this.drawType === 'Rectangle')) {
        let latlngs = this.resultLayer._latlngs[0]
        latlngs = latlngs.concat(latlngs[0])
        let bound = 'POLYGON(('
        for (let i = 0; i < latlngs.length; i++) {
          bound += latlngs[i].lng + ' ' + latlngs[i].lat + ','
        }
        bound = bound.substr(0, bound.length - 1)
        bound += '))'
        this.optionSpace.bound = bound
        this.getRecordSpace()
      } else if (this.drawType === 'Division' && option.bound) {
        this.optionSpace.bound = option.bound
        this.getRecordSpace()
      }
    },
    getRecordSpace () {
      let url = this.api.place
      this.loading = true
      let option = this.optionSpace
      option.limit = this.perPage
      option.page = this.currentPage
      option.userid = this.userid
      const _this = this
      this.isCollapsed = false
      this.clearGeoJson()
      // this.clearLayer()
      this.$http.post(url, option).then((response) => {
        if (response && response.data.code === 1) {
          _this.record = response.data.data.rows
          _this.total = response.data.data.total
          _this.layerList = response.data.layerList
          _this.getTeposition(_this.record)
          _this.disableAllMode()
          if (_this.total > 0) _this.showGeoJson(_this.record)
          // _this.setRefresh()
          _this.loading = false
        } else {
          _this.$notify.error({title: '错误', message: response.data.msg})
          _this.record = []
          _this.total = 0
          _this.loading = false
        }
      }).catch((response) => {
        _this.record = []
        _this.total = 0
        _this.loading = false
      })
    },
    checkSpaceView () {
      if (this.multipleSelection.length < 2) {
        this.$notify.warning({title: '警告', message: '请选择2个以上图层进行时序展示！'})
        return false
      }
      let _state = this.multipleSelection.findIndex((item) => {
        return item.publishstate !== 2
      })
      if (_state !== -1) {
        this.$notify.warning({title: '警告', message: '请选择发布成功图像进行时序展示！'})
        return false
      }
      // let _image = this.multipleSelection[0]
      // let _index = this.multipleSelection.findIndex((item) => {
      //   return item.bands !== _image.bands
      // })
      // if (_index !== -1) {
      //   this.$notify.warning({title: '警告', message: '请选择同一个波段数图像进行合并！'})
      //   return false
      // }
      return true
    },
    imageView (view) {
      if (!this.checkSpaceView()) return false
      let _spaceData = this.multipleSelection.map((o) => {
        return {
          fOid: o.fOid,
          zoom: o.zoom,
          centerpoint: o.centerpoint,
          bands: o.bands,
          teposition: o.teposition
        }
      })
      localStorage.setItem('spaceView', JSON.stringify(_spaceData))
      let url = window.location.origin + '/spaceView'
      window.open(url, '_blank')
    },
    megrePush () {
      if (this.multipleSelection.length < 2) {
        this.$notify.warning({ title: '警告', message: '请选择2个以上图层进行合并发布！' })
        return false
      }
      let _state = this.multipleSelection.findIndex((item) => {
        return item.publishstate !== 2
      })
      if (!_state) {
        this.$notify.warning({title: '警告', message: '请选择成功发布图层进行合并！'})
        return false
      }
      let _image = this.multipleSelection[0]
      let _index = this.multipleSelection.findIndex((item) => {
        return item.bands !== _image.bands
      })
      if (_index !== -1) {
        this.$notify.warning({title: '警告', message: '请选择同一个波段数图层进行合并！'})
        return false
      }
      localStorage.setItem('megre', JSON.stringify(this.multipleSelection))
      let url = window.location.origin + '/megreView'
      window.open(url, '_blank')
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
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
          // shadowUrl: import('leaflet/dist/images/marker-shadow.png')
        })
        this.marker = L.marker([data.location.lat, data.location.lon], {icon: defaultIcon}).addTo(this.map)
          .bindPopup(data.address || data.name)
          .openPopup()
        this.map.setView([data.location.lat, data.location.lon], 14)
      }
      // this.getRecordSpace()
    },
    getColor (data) {
      let _class = ''
      switch (data.level1) {
        case '脱密变形后影像成果库':
          _class = 'green'
          break
        case '脱密未变形影像成果库':
          _class = 'yellow'
          break
        case '未脱密变形影像成果库':
          _class = 'red'
          break
      }
      return _class
    },
    getTooltip (data) {
      let _content = ''
      switch (data.level1) {
        case '脱密变形后影像成果库':
          _content = '脱密变形'
          break
        case '脱密未变形影像成果库':
          _content = '脱密未变形'
          break
        case '未脱密变形影像成果库':
          _content = '未脱密变形'
          break
      }
      return _content
    },
    handleMousedown (e) {
      this.initOffset = e.pageX
      this.isMoving = true
      let _card = document.querySelector('.query .data-bar')
      this.defaultWidth = _card.offsetWidth
      on(document, 'mousemove', this.handleMove)
      on(document, 'mouseup', this.handleUp)
    },
    handleMove (e) {
      let pageOffset = e.pageX
      let offset = pageOffset - this.initOffset
      let width = this.defaultWidth - offset
      if (width < 400 || width > 1200) {
        this.handleUp(e)
        return
      }
      let tableWidth = width
      this.tableWidth = tableWidth < 800 ? 800 : tableWidth
      // this.offWidth = width + 'px'
      let _card = document.querySelector('.query .data-bar')
      _card.setAttribute('style', 'width:' + width + 'px')
    },
    handleUp (e) {
      off(document, 'mousemove', this.handleMove)
      off(document, 'mouseup', this.handleUp)
      this.isMoving = false
      // this.$emit('on-move-end')
    },
    format (row, column, cellValue, index) {
      return thousandFomart(cellValue)
    },
    menuQuery (data) {
      this.currentPage = 1
      this.menuOption = data
      this.getRecordMenu(data)
    },
    getRecordMenu (data) {
      let url = this.api.menu
      this.loading = true
      let option = data
      option.limit = this.perPage
      option.page = this.currentPage
      option.userid = this.userid
      const _this = this
      this.isCollapsed = false
      this.clearGeoJson()
      this.queryType = 'menuQuery'
      this.$http.post(url, option).then((response) => {
        if (response && response.data.code === 1) {
          _this.record = response.data.data.rows
          _this.total = response.data.data.total
          _this.layerList = response.data.layerList
          _this.getTeposition(_this.record)
          if (_this.total > 0) _this.showGeoJson(_this.record)
          _this.loading = false
        } else {
          _this.$notify.error({title: '错误', message: response.data.msg})
          _this.record = []
          _this.total = 0
          _this.loading = false
        }
      }).catch((response) => {
        _this.record = []
        _this.total = 0
        _this.loading = false
      })
    },
    publishFilter (value, row) {
      return row.publishstate === value
    },
    getPublishstate (row, column, cellValue, index) {
      let text = '未发布'
      switch (cellValue) {
        case 0:
          text = '未发布'
          break
        case 1:
          text = '发布中'
          break
        case 2:
          text = '发布成功'
          break
        case 3:
          text = '发布失败'
          break
      }
      return text
    },
    remove (item) {
      // 删除影像
      let imagearray = [item.fOid]
      this.imageDelete(imagearray)
    },
    batchRemove () {
      // 批量删除影像
      let imagearray = this.multipleSelection.map((item) => {
        return item.fOid
      })
      if (!imagearray.length) {
        this.$notify.warning({title: '警告', message: '您还未选中数据！'})
        return false
      }
      this.imageDelete(imagearray)
    },
    imageDelete (imagearray) {
      let url = this.$api.imageRemove
      const _this = this
      let postData = {
        foids: imagearray,
        userid: this.userid
      }
      let _text = []
      let confirmText = '此操作将永久删除已选中图像数据, 是否继续?'
      for (let i = 0; i < imagearray.length; i++) {
        let _data = imagearray[i]
        let _layer = this.layerList.filter((item) => {
          return item.foid === _data
        })
        if (_layer.length > 0) _text.push('图像【' + _data.iddataname + '】已经被图层引用')
      }
      if (_text.length > 0) {
        confirmText = _text.toString() + ',此操作将该永久删除选中图像数据, 是否继续?'
      }
      this.$confirm(confirmText, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        _this.$http.post(url, postData).then((response) => {
          if (response && response.data.code === 1) {
            _this.$notify({title: '提示', message: '图像删除操作成功!', type: 'success'})
            _this.refreshRecord()
          } else {
            _this.$notify.error({title: '错误', message: response.data.msg})
          }
        }).catch((response) => {
          // console.log(response)
        })
      }).catch(() => {
        //
      })
    },
    getTeposition (data) {
      this.originalRecord = data
      this.tepositions = []
      let month = {}
      data.map((o) => {
        let _month = this.getYear(o)
        if (!month[_month]) {
          month[_month] = _month
        }
      })
      let index = 0
      for (let o in month) {
        this.tepositions.push({
          value: month[o],
          label: (o === '1900' ? '未知' : o),
          color: colors[index]
        })
        index++
      }
    },
    getYear (record) {
      let year = ''
      try {
        year = record.teposition ? record.teposition.substring(0, 4) : '1900'
      } catch (e) {
        console.log(e)
        year = '1900'
      }
      return year
    },
    timelineChange (item) {
      this.changeTepositon(item.value)
    },
    changeTepositon (val) {
      const _this = this
      if (!val) {
        this.record = this.originalRecord.slice(0)
        this.showGeoJson(this.record)
        return false
      }
      this.record = this.originalRecord.filter((o) => {
        return _this.getYear(o) === val
      })
      this.showGeoJson(this.record)
    },
    clearData () {
      this.record = []
      this.total = 0
      this.clearMapLayer()
      this.clearGeoJson()
    },
    showMap () {
      try {
        let data = this.selectRow
        let layer = data.fOid
        const TileLayer = L.tileLayer
        let zoom = data.zoom.split(',')
        let WRJURL = this.$api.serverUrl + ':10081/Service/' + layer
        if (data.bands > 1) {
          WRJURL = this.$api.serverUrl + ':10080/Service/' + layer
        }
        let center = data.centerpoint.replace('(', '').replace(')', '').split(',')
        this.$nextTick(() => {
          if (!this.viewMap) {
            this.viewMap = L.map('mapView', {
              zoom: 15,
              zoomControl: false
            })
            this.viewTitleLayer = new TileLayer(WRJURL + '/{z}/{x}/{y}', {maxNativeZoom: ~~zoom[0], maxZoom: ~~zoom[0]})
            this.viewTitleLayer.addTo(this.viewMap)
          } else {
            this.viewTitleLayer.setUrl(WRJURL + '/{z}/{x}/{y}')
          }
          this.viewMap.setView([parseFloat(center[1], 10), parseFloat(center[0], 10)], ~~zoom[1])
        })
      } catch (e) {
        console.log(e)
      }
    }
  },
  data () {
    return {
      nav: {},
      map: {},
      record: [],
      fields: [
        {key: 'iddataname', label: '编号', class: 'col-show-0', show: true},
        {key: 'fOid', label: 'fOid', class: 'col-show-0', show: false},
        {key: 'teposition', label: '时间', class: 'col-show-2', show: true},
        {key: 'idgroudresolution', label: '分辨率', class: 'col-show-1', show: true},
        {key: 'idformatname', label: '类型', class: 'col-show-1', show: false},
        {key: 'secclass', label: '保密状态', class: 'col-show-4', show: true},
        {key: 'secrecy', label: '保密类型', class: 'col-show', show: true},
        {key: 'idownentity', label: '所属机构', class: 'col-show-3', show: false},
        {key: 'imagesize', label: '影像大小(M)', class: 'col-show-0', show: true, formatter: this.format},
        {key: 'bands', label: '波段', class: 'col-show-0', show: true},
        {key: 'idcoordunit', label: '单位', class: 'col-show', show: false},
        {key: 'tiffhdfsurl', label: 'tiff路径', class: 'col-show', show: false},
        {key: 'diskurl', label: '源文件地址', class: 'col-show', show: false}
        // {key: 'opt', label: '操作'}
      ],
      publishState: [{
        text: '未发布',
        value: 0
      }, {
        text: '发布中',
        value: 1
      }, {
        text: '发布成功',
        value: 2
      }, {
        text: '发布失败',
        value: 3
      }],
      currentPage: 1,
      queryType: 'default',
      perPage: 50,
      total: 0,
      wkt: undefined,
      pageSize: [25, 50, 75, 100, 'All'],
      option: {},
      showColList: false,
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
      optionSpace: {},
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
      dialogView: true,
      selectRow: {},
      viewMap: undefined,
      viewTitleLayer: undefined
    }
  }
}
</script>
<style>
  @import "~leaflet.pm/dist/leaflet.pm.css";

  .leaflet-popup {
    margin-bottom: 0;
    margin-left: 15px;
  }

  #map {
    width: 100vw;
    height: calc(100vh - 55px);
  }
  #mapView {
    width: 100%;
    height: 100%;
  }
  #map .leaflet-left {
    left: 215px;
  }

  .query {
    position: relative;
  }

  .query .data-bar {
    position: fixed;
    right: 0;
    top: 55px;
    z-index: 1000;
    width: 30vw;
  }

  .data-bar .table-responsive-sm {
    font-size: 12px;
  }

  .query .row {
    margin-right: -30px;
    margin-left: -30px;
  }

  .data-tool .btn-light {
    padding: 0 10px;
    border: 1px solid #c8ced3;
  }

  .query .data-bar .card-body {
    width: 100%;
    height: calc(100vh - 145px);
    overflow-y: auto;
  }

  .data-bar .pagination.b-pagination {
    flex: 1;
  }

  .data-bar .card-body {
    padding: 0;
  }

  .data-bar .el-table {
    font-size: 12px;
  }

  .data-bar .el-table td,
  .data-bar .el-table th {
    padding: 0.5rem;
  }

  .leaflet-draw-toolbar {
    display: flex;
  }

  .leaflet-right {
    right: calc(60vw - 55px);
  }

  .leaflet-control {
    display: flex;
  }

  .leaflet-draw-toolbar {
    margin-top: 0;
  }

  .leaflet-draw-actions {
    top: 30px !important;
  }

  .leaflet-control-attribution {
    display: none;
  }

  .v-contextmenu .v-contextmenu-item {
    padding: 8px 14px;
  }

  .el-button--text.image-defult {
    color: #bbbbbb;
  }

  .el-button--text.image-show {
    color: #409EFF;
  }

  .imageSrc {
    position: absolute;
    top: 0;
    right: 0;
  }

  .query .el-button {
    padding: 7px 8px;
  }

  .query .el-table .cell {
    padding-left: 0;
    padding-right: 0;
  }

  .query .leaflet-image-layer {
    z-index: 200 !important;
  }

  /*.data-bar .el-table__row.current-row {*/
  /*background-color: #8bb72d;*/
  /*}*/
  .query .el-table--striped .el-table__body tr.el-table__row--striped.current-row td,
  .query .el-table__body tr.current-row > td {
    /*.el-table__body tr.hover-row.current-row>td,*/
    /*.el-table__body tr.hover-row.el-table__row--striped.current-row>td,*/
    /*.el-table__body tr.hover-row.el-table__row--striped>td,*/
    /*.el-table__body tr.hover-row>td {*/
    background-color: #d0e6d5;
  }

  .query .el-popover {
    padding: 12px auto;
    width: 100px;
    cursor: pointer;
  }

  .split-trigger {
    border: 1px solid #dcdee2
  }

  .split-trigger-vertical {
    border-bottom: none;
    border-top: none;
    background: #f8f8f9;
    box-shadow: 0 0 4px 0 rgba(28, 36, 56, .4);
    cursor: col-resize;
    height: 100%;
    width: 6px;
    position: relative;
  }

  .split-trigger-bar-con.vertical {
    height: 32px;
    left: 1px;
    top: 50%;
    transform: translateY(-50%);
    position: absolute;
  }

  .split-trigger-bar {
    background: rgba(23, 35, 61, .25);
    float: left;
    height: 1px;
    margin-top: 3px;
    width: 4px;
  }

  .data-bar {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  .no-select .split-overlay {
    display: block;
  }

  .split-overlay {
    display: none;
    height: 100%;
    width: 100%;
    opacity: 0.3;
    position: absolute;
    top: 0;
    left: 0;
    background-color: #bbbbbb;
    z-index: 100
  }

  .filter-tepositon {
    width: 120px;
    margin-left: 15px;
  }
  #icon-map-tool-home .cls-1{fill:#e3effb;stroke:#194485;stroke-miterlimit:10;}
  #icon-map-tool-home .cls-2{fill:#194485;}
  #icon-map-tool-draw-rectangle .cls-1{fill:#e3effb;stroke:#194485;stroke-miterlimit:10;}
  #icon-map-tool-draw-polygon .cls-1{fill:#e3effb;stroke:#194485;stroke-miterlimit:10;}
  #icon-map-tool-clear .cls-1{fill:#194485;}
  .map-tool-bar {
    position: absolute;
    top: 8px;
    left: 338px;
    z-index: 1999;
  }
  .map-tool-bar li{
    margin: 0 2px;
    padding: 1px;
    display: inline-block;
    cursor: pointer;
    width: 30px;
    height: 30px;
    text-align: center;
    background: hsla(0,0%,100%,.92);
    -webkit-box-shadow: 0 0 4px 0 rgba(0,0,0,.25);
    box-shadow: 0 0 4px 0 rgba(0,0,0,.25);
    border-radius: 4px;
  }
  .map-tool-bar li.active,
  .map-tool-bar li:active,
  .map-tool-bar li:focus {
    background: #eeeeee;
  }
  .map-year-tool {
    position: absolute;
    bottom: 8px;
    padding-left: 328px;
    z-index: 1999;
  }
  .svg-icon {
    height: 28px;
    width: 28px;
  }
  .query-bar.collapsed +.map-tool-bar {
    left: 8px;
  }
  /*.query-bar.collapsed +.map-year-tool {*/
  /*  left: 128px*/
  /*}*/
  /*.map-year-tool .el-tag {*/
  /*  color: #ffffff;*/
  /*  margin-right: 10px;*/
  /*}*/
</style>
