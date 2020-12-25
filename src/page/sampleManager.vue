<template>
  <div class="query sample animated fadeIn">
    <div class="query-bar">
      <side-nav
        :classifySys="classifySys"
        :sampleSources="sampleSources"
        :query-res-list="queryResList"
        :queryResFocusIdx="queryResFocusIdx"
        @setQuery="setQuery"
        @createSampleSet="createSampleSet"
        @provinceChange="provinceChange"
        @cityChange="cityChange"
        @countyChange="countyChange"
        @viewResTable="viewResTable"
        @deleteQueryRes="deleteQueryRes">
      </side-nav>
    </div>
    <res-list
      v-if="showTable"
      :listData="listData"
      :currentPage="currentPage"
      @SelectedGeojsonChange="SelectedGeojsonChange"
      @pageChange="pageChange"
      @ZoomToCurrentList="ZoomToCurrentList"
    ></res-list>
    <new-cat ref="sampleDialog"
             :tree="disabledTree"
             :ShowCreateDialog="renderDialog"
             @closeDialog="closeDialog"
             @createSet="createSet">
    </new-cat>
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
import resList from 'src/components/samplebar/res-list'
import { json } from 'd3-fetch'
import 'leaflet.pm'
// import defaultIconUrl from 'leaflet/dist/images/marker-icon.png'
import defaultIconUrl from '@/assets/img/avatars/admin.png'
import omnivore from 'leaflet-omnivore'
import { getUserId } from '@/libs/util'
// import * as esri from 'esri-leaflet'

const L = window.L
export default {
  name: 'sampleManager',
  components: {
    sideNav,
    newCat,
    resList
  },
  mounted () {
    this.init()
    this.init1()
  },
  methods: {
    pageChange (pageNo) {
      console.log(pageNo)
      this.currentPage = pageNo
      this.startQuery()
    },
    /***
     * 关闭新建样本集弹窗
     ***/
    closeDialog () {
      this.renderDialog = false
    },
    /***
     * 创建新的样本集请求
     ***/
    createSet (option) {
      let url = this.$api.sampleSets + '/sp/sampleset'
      option.filter.classType = this.query.classType
      option.filter.geom = JSON.stringify(this.resultLayer.toGeoJSON().geometry)
      option.filter = JSON.stringify(option.filter)
      option.taxonomy = JSON.stringify(option.taxonomy)
      this.$http.post(url, option).then((response) => {
        if (response && response.status === 200) {
        }
      })
      this.renderDialog = false
      this.$message({
        showClose: true,
        message: '恭喜你，创建成功，可以前往样本集管理系统查看',
        type: 'success',
        duration: 5000 })
    },
    /***
     *点击表中的记录，请求矢量的详细信息
     ***/
    SelectedGeojsonChange (val) {
      let url = this.$api.sampleDetail + '/mlsample/samples'
      this.$http.post(url, [val.id]).then((response) => {
        if (response && response.status === 200) {
          this.map.removeLayer(this.listPtLayer)
          let polygon = JSON.parse(response.data.data[0].spatial)
          if (this.detailLayer) {
            this.map.removeLayer(this.detailLayer)
          }
          this.detailLayer = L.geoJSON(polygon).addTo(this.map)
          this.map.flyToBounds(this.detailLayer.getBounds())
          // this.detailLayer = L.geoJSON(polygon).addTo(this.map)
        } else {
          this.$notify.error({ title: '错误', message: response.message })
        }
      }).catch((response) => {
        console.log(response)
      })
    },
    cutString (str, len) {
      if (str.length <= len * 2) {
        return str
      } else {
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
    viewResTable (item) {
      this.queryResFocusIdx = item.index
      this.query = item.query
      this.startQuery()
    },
    deleteQueryRes (item) {
      this.queryResList = this.queryResList.filter((n) => {
        return n.index !== item.index
      })
    },
    setQuery (option) {
      this.query = option
      if (this.resultLayer.toGeoJSON) this.query.geom = JSON.stringify(this.resultLayer.toGeoJSON().geometry)
      this.startQuery(true)
    },
    /***
     * 根据检索条件分页查询样本数据列表
     ***/
    startQuery (addQueryRes) {
      // this.showTable = true
      let url00 = this.$api.samplePreview + '/samples/query?size=' + this.perPage + '&page=' + this.currentPage
      this.$http.post(url00, this.query).then((response) => {
        if (response && response.status === 200) {
          if (response.data.data.content.length !== 0) {
            this.renderList(response.data)
            if (addQueryRes) this.addQueryRes()
          } else {
            this.$alert('该检索条件下查不到样本数据,建议您重新设置检索条件', '检索结果为空')
          }
        } else {
          this.$notify.error({ title: '错误', message: response.message })
        }
      }).catch((response) => {
        console.log(response)
      })
    },
    addQueryRes () {
      if (this.queryName === '') {
        this.queryName = '检索结果' + this.queryResIndex
      }
      this.queryResIndex = this.queryResIndex + 1
      let idx = this.queryResIndex - 1
      this.queryResFocusIdx = idx
      this.queryResList.push({ query: this.query, name: this.queryName, index: idx })
      this.queryName = ''
      this.$message({
        showClose: true,
        message: '恭喜你，检索成功',
        type: 'success',
        duration: 5000 })
    },
    /**
     * 渲染查询到的样本列表
     **/
    renderList (data) {
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
        })
      that.map.flyToBounds(that.listPtLayer.getBounds())
      that.listPtLayer.addTo(that.map)
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
          that.$notify.error({ title: '错误', message: response.message })
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
          center: [28.478348688743406, 113.2250976639748],
          zoom: 13,
          zoomControl: false
        })
        L.esri.basemapLayer('Imagery').addTo(this.map) // 定义basemapLayer并将其加载到地图容器中
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
        this.polygon = L.polygon(data.data, { color: 'red' }).addTo(this.map)
      } else {
        if (data.wkt) {
          this.wkt = omnivore.wkt.parse(data.wkt).addTo(this.map)
          this.opiont.bound = data.wkt
        } else {
          this.optionSpace.point = 'POINT(' + data.location.lat + ' ' + data.location.lon + ')'
        }
        let defaultIcon = L.icon({
          iconUrl: defaultIconUrl
          // shadowUrl: import('leaflet/dist/images/marker-shadow.png')
        })
        this.marker = L.marker([data.location.lat, data.location.lon], { icon: defaultIcon }).addTo(this.map)
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
      let checkedKeys = this.$refs.tree.getCheckedKeys()
      let MyKeys = []
      for (let key of checkedKeys) {
        if (MyKeys.indexOf(key) === -1) {
          MyKeys.push(key)
          let temp = key.substring(0, key.length - 2)
          while (temp !== '') {
            if (MyKeys.indexOf(temp) === -1) {
              MyKeys.push(temp)
              temp = temp.substring(0, temp.length - 2)
            } else break
          }
        }
      }
      console.log(MyKeys)
      let data = { children: this.data1 }
      this.setDataStatus(data, MyKeys)
      console.log(this.data1)
    },
    init1 () {
      this.api = this.$api.search
      this.rootApi = this.$api.root1
      let url = this.$api.root1 + '/sp/base/taxonomy/main/list'
      // let url = 'http://192.168.1.177:9983/sp/base/taxonomy/main/list'
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
            item.value = item.id
            let option = { mainId: item.id }
            requests.push(this.$http.post(url2, option))
          }
          let that = this
          that.$http.all(requests).then(function (values) {
            let details = []
            for (let item of values) {
              details.push(item.data.data.list)
              for (let ii of item.data.data.list) {
                ii.value = ii.id
              }
            }
            that.sortCat(catList, details)
          })
          // this.sortCat(response.data.data.list)
        } else {
          this.$notify.error({ title: '错误', message: response.message })
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
    ZoomToCurrentList () {
      this.map.removeLayer(this.detailLayer)
      this.map.flyToBounds(this.listPtLayer.getBounds())
      this.listPtLayer.addTo(this.map)
    }
  },
  data () {
    return {
      queryName: '',
      // 检索结果序号（检索结果1、2、3......）
      queryResIndex: 1,
      // 检索结果列表
      queryResList: [],
      // 被选中的检索结果（查看或者创建样本集的时候focus)
      queryResFocusIdx: -1,
      listData: {},
      listPtLayer: false,
      detailLayer: false,
      renderDialog: false,
      nav: {},
      map: {},
      record: [],
      currentPage: 0,
      queryType: 'default',
      totalPages: 0,
      totalElements: 0,
      perPage: 20,
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
        geom: { lat: 38.8797775, lon: -76.98851150000002 },
        id: '7c7028ac36724a599760c550c1a1de0c',
        produceTime: '2020-11-03T03:08:40.831+00:00',
        source: 'DistrictofColumbia'
      }],
      sampleSources: [],
      optionSpace: {},
      query: {}
    }
  }
}
</script>
<style>
  @import "~leaflet.pm/dist/leaflet.pm.css";
</style>
<style lang="scss">
  @import "sampleManager.scss";
  @import "layout";
</style>
