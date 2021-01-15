<template>
  <div class="map-container">
    <el-button class="map-back" size="small" @click.stop="returnBack" v-if="mapType==='country'">退回</el-button>
    <div class="map-selector" id="selector-map"></div>
    <div class="map-selector-tips">
      <label>当前选择：</label> <label v-html="currentArea.name || currentArea.NAME"></label>
    </div>
  </div>

</template>

<script>
import { json } from 'd3-fetch'
import { defaultPolyStyle, selectedPolyStyle } from './styleConfig.json'
const L = window.L
// const resolutions = [
//   156367.7919628329, 78183.89598141646, 39091.94799070823, 19545.973995354114, 9772.986997677057, 4886.4934988385285,
//   2443.2467494192642, 1221.6233747096321, 610.8116873548161, 305.40584367740803, 152.70292183870401,
//   76.35146091935201, 38.175730459676004, 19.087865229838002, 9.543932614919001, 4.7719663074595005, 2.3859831537297502, 1.1929915768648751, 0.5964957884324376, 0.2982478942162188
// ]
export default {
  name: '',
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.$nextTick(() => {
        this.initMap()
      })
    },
    initMap (data) {
      this.map = L.map('selector-map', {
        center: [29.99232721748346, 13.957024812698366],
        zoom: 1
      })
      this.resultLayers = L.layerGroup()
      this.selectedLayers = L.layerGroup()
      this.loadGeoJson()
      // L.Proj.geoJson(data, {
      //   style: {
      //     'color': '#ff0000',
      //     'weight': 2,
      //     'opacity': 0.65
      //   }
      // }).addTo(this.map)
    },
    loadGeoJson () {
      const _this = this
      json('/static/world.json').then((data, err) => {
        if (err) {
          return false
        }
        _this.clearLayer()
        _this.mapType = 'world'
        _this.rendGeoJson(data)
      })
    },
    rendGeoJson (geojson) {
      const _this = this
      if (geojson.features.length === 0) return false
      for (let poly of geojson.features) {
        // let coords = []
        if (!poly.geometry) continue
        // for (let ring of poly.geometry.coordinates) {
        //   if (!ring.map) continue
        //   ring.map((coord) => {
        //     if (Array.isArray(coord[0])) {
        //       coord.map((o) => {
        //         coords.push([o[1], o[0]])
        //       })
        //     } else {
        //       coords.push([coord[1], coord[0]])
        //     }
        //   })
        // }
        // const polygonLayer = L.polygon(coords).addTo(this.map)
        const polygonLayer = L.Proj.geoJson(poly).addTo(this.map)
        this.addProps(polygonLayer, poly.properties) // 为新增的图层增加属性
        polygonLayer.setStyle(defaultPolyStyle)
        polygonLayer.on('click', (e) => {
          if (_this.selectedLayer && _this.selectedLayer.setStyle) _this.selectedLayer.setStyle(defaultPolyStyle)
          _this.selectedLayer = e.layer
          _this.currentArea = e.layer.feature.properties
          _this.$emit('selectArea', _this.currentArea)
          _this.selectedLayer.setStyle(selectedPolyStyle)
        })
        polygonLayer.on('dblclick', (e) => {
          let properties = e.layer.feature.properties
          if (properties.name === 'China' || properties.name === 'America') {
            _this.loadCountry(properties)
          }
        })
        this.resultLayers.addLayer(polygonLayer)
      }
    },
    // 点击中国或者美国加载响应国家geojson
    loadCountry (properties) {
      const _this = this
      let name = properties.name
      console.log(name)
      json(`/static/${name}.json`).then((data, err) => {
        if (err) {
          return false
        }
        _this.clearLayer()
        _this.mapType = 'country'
        _this.rendGeoJson(data)
      })
    },
    addProps (layer, props) {
      layer.properties = layer.properties || {}
      if (props) {
        for (let key in props) {
          if (props.hasOwnProperty(key)) {
            layer.properties[key] = props[key]
          }
        }
      }
    },
    clearLayer () {
      let layers = this.resultLayers.getLayers()
      if (layers.length > 0) {
        // 清除地图上框，如果不执行图层清除是会有缓存
        this.resultLayers.eachLayer(function (layer) {
          layer.remove()
        })
        this.selectedLayer = undefined
        // 清除地图Group里面缓存
        this.resultLayers.clearLayers()
      }
    },
    returnBack () {
      //
      this.loadGeoJson()
    }
  },
  data () {
    return {
      defaultPolyStyle: defaultPolyStyle,
      selectedPolyStyle: selectedPolyStyle,
      resultLayers: undefined,
      selectedLayers: undefined,
      selectedLayer: undefined,
      mapType: 'world',
      currentArea: {}
    }
  }
}
</script>
<style lang="scss">
  .map-container {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;

    .map-selector {
      width: 100%;
      height: 100%;
    }

    .map-back {
      right: 15px;
      top: 15px;
      position: absolute;
      z-index: 19;
    }
    .map-selector-tips {
      position: absolute;
      bottom: 10px;
      left: 10px;
      display: flex;
      align-items: center;
    }
  }
</style>
