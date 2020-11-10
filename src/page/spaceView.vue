<template>
  <div>
    <div id="container">
      <div class="map-container" v-if="spaceList.length" v-show="displayMode === 'side-by-side'">
        <div class="map" id="map"></div>
        <span class="time-text left-time" v-html="spaceList[0].teposition"></span>
        <span class="time-text right-time" v-html="spaceList[1].teposition"></span>
      </div>
      <div class="map-container" v-show="displayMode === 'stack'">
        <div class="map" id="viewport"></div>
      </div>
      <div class="map-container" v-show="displayMode === 'default'">
        <div v-for="(item,index) in spaceList" :key="item.fOid" :id="getId(item)" :class="className">
          <button class="map-fullcree-button" @click="fullScreen(index)">全屏</button>
          <span class="time-text" v-html="item.teposition"></span>
        </div>
      </div>
    </div>
    <div id="full-screen">
      <button class="map-back-button" @click="back">返回</button>
    </div>
    <div class="map-tool">
      <el-radio-group v-model="displayMode" size="small" @change="displayModeChange">
        <el-radio-button label="default">常规布局</el-radio-button>
        <el-radio-button label="side-by-side" :disabled="spaceList.length!==2">卷帘布局</el-radio-button>
        <el-radio-button label="stack">层叠</el-radio-button>
      </el-radio-group>
    </div>
  </div>
</template>

<script>
import SideBySide from 'leaflet-side-by-side'
import { parseJson } from '../utils/factory'
const L = window.L
const clay = window.clay
const maptalks = window.maptalks
export default {
  name: 'space-view',
  data () {
    return {
      mapUrls: [],
      mapList: [],
      spaceList: [],
      tileLayerList: [],
      displayMode: 'default',
      api: {},
      isModelInit: {
        default: false,
        sidebyside: false,
        stack: false
      }
    }
  },
  mounted () {
    this.init()
  },
  computed: {
    className: function () {
      let num = this.spaceList.length
      return this.getClassName(num)
    }
  },
  methods: {
    init () {
      this.api = this.$api.search
      this.mapUrls = []
      // 大地图初始化
      this.fullScreenMap = L.map('full-screen')
      this.fullScreenLayer = null
      // let num = ~~this.$router.currentRoute.params.id || 6
      // num = num > 0 ? num : 6
      this.getData()
    },
    getData () {
      let _record = localStorage.getItem('spaceView')
      _record = parseJson(_record)
      this.spaceList = _record.sort((o, i) => o.teposition.replace(/-/g, '') - i.teposition.replace(/-/g, ''))
      let num = this.spaceList.length
      const _this = this
      if (num === 2) {
        this.$alert('', '请选择布局方式：', {
          confirmButtonText: '卷帘布局',
          cancelButtonText: '常规布局',
          showCancelButton: true,
          center: true,
          callback: action => {
            if (action === 'confirm') {
              _this.displayMode = 'side-by-side'
              _this.$nextTick(function () {
                _this.initMapSideBySide()
              })
            } else {
              _this.$nextTick(function () {
                _this.initMap(num)
              })
            }
          }
        })
      } else {
        _this.$nextTick(function () {
          _this.initMap(num)
        })
      }
    },
    // 卷帘布局 side-by-side
    initMapSideBySide () {
      // const _this = this
      const TileLayer = L.tileLayer
      let map = L.map('map')
      for (let i = 0; i < this.spaceList.length; i++) {
        // create div and set height
        let data = this.spaceList[i]
        let leyer = data.fOid
        let zoom = data.zoom.split(',')
        let WRJURL = this.$api.serverUrl + ':10081/Service/' + leyer + '/{z}/{x}/{y}'
        if (data.bands > 1) {
          WRJURL = this.$api.serverUrl + ':10080/Service/' + leyer + '/{z}/{x}/{y}'
        }
        // let WRJ = new TileLayer(WRJURL + '/{z}/{x}/{y}', {maxNativeZoom: ~~zoom[0], maxZoom: ~~zoom[0]})
        // create map and set layer
        let center = data.centerpoint.replace('(', '').replace(')', '').split(',')
        // let eleId = this.getId(data)
        map.setView([parseFloat(center[1], 10), parseFloat(center[0], 10)], ~~zoom[1])
        // this.mapList.push(map)
        let layer = TileLayer(WRJURL, {}).addTo(map)
        this.tileLayerList.push(layer)
      }
      // 联动
      // let maplink = function (e) {
      //   let _map = this
      //   _this.mapList.map(function (t, i) {
      //     t.setView(_map.getCenter(), _map.getZoom())
      //   })
      // }
      // // 绑定
      // this.mapList.map(function (t) {
      //   t.on({drag: maplink, zoom: maplink})
      // })
      // 卷帘效果
      // let _layer = TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {}).addTo(map)
      new SideBySide(this.tileLayerList[0], this.tileLayerList[1]).addTo(map)
      this.isModelInit.sidebyside = true
    },
    // 常规布局
    initMap (num) {
      const _this = this
      const TileLayer = L.tileLayer
      // get height
      // let viewHeight = window.innerHeight
      for (let i = 0; i < this.spaceList.length; i++) {
        // create div and set height
        let data = this.spaceList[i]
        let leyer = data.fOid
        let zoom = data.zoom.split(',')
        let WRJURL = this.$api.serverUrl + ':10081/Service/' + leyer + '/{z}/{x}/{y}'
        if (data.bands > 1) {
          WRJURL = this.$api.serverUrl + ':10080/Service/' + leyer + '/{z}/{x}/{y}'
        }
        this.mapUrls.push(WRJURL)
        // let WRJ = new TileLayer(WRJURL + '/{z}/{x}/{y}', {maxNativeZoom: ~~zoom[0], maxZoom: ~~zoom[0]})
        // create map and set layer
        let center = data.centerpoint.replace('(', '').replace(')', '').split(',')
        let eleId = this.getId(data)
        let map = L.map(eleId).setView([parseFloat(center[1], 10), parseFloat(center[0], 10)], ~~zoom[1])
        this.mapList.push(map)
        TileLayer(WRJURL, {}).addTo(map)
      }
      // 联动
      let maplink = function (e) {
        let _map = this
        _this.mapList.map(function (t, i) {
          t.setView(_map.getCenter(), _map.getZoom())
        })
      }
      // 绑定
      this.mapList.map(function (t) {
        t.on({drag: maplink, zoom: maplink})
      })
      this.isModelInit.default = true
    },
    fullScreen (i) {
      let mapList = this.mapList
      let fullScreenMap = this.fullScreenMap
      let fullScreenLayer = this.fullScreenLayer
      let currentMap = mapList[i]
      fullScreenMap.setView(currentMap.getCenter(), currentMap.getZoom())
      fullScreenLayer && fullScreenMap.removeLayer(fullScreenLayer)
      fullScreenLayer = L.tileLayer(this.mapUrls[i], {})
      fullScreenMap.addLayer(fullScreenLayer)
      document.getElementById('full-screen').style.display = 'block'
      fullScreenMap.invalidateSize(true)
    },
    back () {
      document.getElementById('full-screen').style.display = 'none'
    },
    // 特殊情况（2个和4个）
    getClassName (num) {
      let _class = ''
      switch (num) {
        case 1:
          _class = 'map-item-1'
          break
        case 2:
          _class = 'map-item-2'
          break
        case 4:
          _class = 'map-item-4'
          break
        default:
          _class = 'map-item'
          break
      }
      return _class
    },
    getId (item) {
      return 'map' + item.fOid
    },
    displayModeChange (value) {
      let num = this.spaceList.length
      switch (value) {
        case 'default':
          if (!this.isModelInit.default) this.initMap(num)
          break
        case 'side-by-side':
          if (num === 2 && !this.isModelInit.sidebyside) {
            this.initMapSideBySide()
          }
          break
        case 'stack': {
          if (!this.isModelInit.stack) this.mapStack()
          break
        }
      }
    },
    createMap (app, data) {
      let canvas = document.createElement('canvas')
      canvas.width = 2048
      canvas.height = 2048

      let layer = data.fOid
      let zoom = data.zoom.split(',')
      let center = data.centerpoint.replace('(', '').replace(')', '').split(',')
      let WRJURL = '/singleService/' + layer
      if (data.bands > 1) {
        WRJURL = '/Service/' + layer
      }
      // let map = new maptalks.Map(canvas, {
      //   center: [parseFloat(center[0], 10), parseFloat(center[1], 10)],
      //   zoom: ~~zoom[1],
      //   maxZoom: ~~zoom[0],
      //   baseLayer: new TileLayer('base', {
      //     'urlTemplate': WRJURL + '/{z}/{x}/{y}'
      //   })
      // })

      let map = new maptalks.Map(canvas, {
        center: [parseFloat(center[0], 10), parseFloat(center[1], 10)],
        zoom: ~~zoom[0] - 2,
        baseLayer: new maptalks.TileLayer('base', {
          urlTemplate: WRJURL + '/{z}/{x}/{y}',
          subdomains: ['a', 'b', 'c', 'd']
          // urlTemplate: 'http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
          // subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
        })
      })

      canvas.style.cssText = 'position:absolute;right:5px;bottom:5px;width:256px;height:256px;border:2px solid #fff'
      app.container.appendChild(canvas)

      return map
    },
    mapStack () {
      let length = this.spaceList.length
      const _this = this
      clay.application.create('#viewport', {
        graphic: {
          shadow: true
          // linear: true,
          // tonemapping: true
        },
        event: true,
        init: function (app) {
          let planes = []
          for (let i = 0; i < length; i++) {
            let map = _this.createMap(app, _this.spaceList[i])
            let diffuseMap = new clay.Texture2D({
              dynamic: true,
              anisotropic: 8,
              image: map.getContainer()
            })
            let plane = app.createPlane({
              diffuseMap: diffuseMap
            })
            planes.push(plane)
            plane.rotation.rotateX(-Math.PI / 2)
            let y = (i - 5) / 10 - 0.5 + i * i * 0.4
            plane.position.set(0, y, 0)

            // let y = plane.position.y + i * i * 400
            // app.timeline.animate(plane.position, {loop: true})
            //   .then(1000 - i * 100, { // Delay
            //     y: plane.position.y
            //   }).then(1000, { // Up
            //     y: y
            //   }, 'cubicOut').then(i * 100, { // Wait
            //     y: y
            //   }).then(i * 100, { // Delay
            //     y: y
            //   }).then(1000, { // Drop
            //     y: plane.position.y
            //   }, 'cubicOut').then(1000 - i * 100, {
            //     y: plane.position.y // Wait
            //   }).start()
          }

          app.createCamera([4, 4 * Math.sqrt(2), 4], [0, 0, 0], 'orthographic', [4, 4, 20])

          let light = app.createDirectionalLight([-1, -2, -0.5], '#fff', 0.6)
          light.shadowResolution = 1024
          app.createAmbientLight('#fff', 0.5)

          app.container.style.background = 'linear-gradient(rgb(218, 210, 153), rgb(176, 218, 185))'
        },

        loop: function (app) {
        }
      })
      this.isModelInit.stack = true
    }
  }
}
</script>

<style>
  #container .map-container {
    display: flex;
    flex-wrap: wrap;
  }

  #full-screen {
    width: 100%;
    height: 100vh;
    z-index: 9999;
    position: fixed;
    top: 0;
    left: 0;
    display: none;
  }
  #container .map-container > div {
    display: inline-block;
    border: 2px #ffffff solid;
  }
  .map-item {
    width: 33.1%;
    height: 50vh;
  }
  .map-item-1 {
    width: 100%;
    height: 100vh;
  }
  .map-item-2 {
    width: 50%;
    height: 100vh;
  }
  .map-item-4 {
    width: 50%;
    height: 50vh;
  }
  .map-fullcree-button, .map-back-button {
    position: absolute;
    right: 20px;
    bottom: 20px;
    z-index: 999;
    width: 60px;
    height: 30px;
    background: #44d0ff;
    color: white;
    border-radius: 10px;
    cursor: pointer;
  }
  .map-back-button{
    left: 60px;
    top: 60px;
  }
  .time-text {
    position: absolute;
    bottom: 20px;
    z-index: 999;
    width: auto;
    height: 30px;
    font-size: 20px;
    color: white;
    border-radius: 10px;
    cursor: pointer;
  }
  .time-text.left-time {
    left: 20px;
  }
  .time-text.right-time{
    right: 20px;
  }
  #map, #viewport {
    height: 100vh;
    width: 100vw;
  }
  .map-tool {
    position: absolute;
    right: 10px;
    top: 10px;
    z-index: 1999;
  }
</style>
