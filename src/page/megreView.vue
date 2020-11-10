<template>
<div class="container-fluid megre-view">
  <div class="animated fadeIn megre-map">
    <b-row>
      <b-col sm="12">
        <div class="map" id='map'>
        </div>
      </b-col>
    </b-row>
    <div class="lat-lng">
      <p>
        <label>Z:</label>
        <span v-html="zoom"></span>
      </p>
      <p>
        <label>X:</label>
        <span v-html="lat"></span>
      </p>
      <p>
        <label>Y:</label>
        <span v-html="lng"></span>
      </p>
    </div>
  </div>
</div>
</template>

<script>
import { parseJson } from '../utils/factory'
const L = window.L
export default {
  name: 'megre-view',
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.api = this.$api.search
      this.initMegreMap()
    },
    initMap (data) {
      let layer = data.fOid
      const TileLayer = L.tileLayer
      let zoom = data.zoom.split(',')
      let WRJURL = this.$api.serverUrl + ':10081/Service/' + layer
      if (data.bands > 1) {
        WRJURL = this.$api.serverUrl + ':10080/Service/' + layer
      }
      let WRJ = new TileLayer(WRJURL + '/{z}/{x}/{y}', {maxNativeZoom: ~~zoom[0], maxZoom: ~~zoom[0]})

      WRJ.addTo(this.map)
    },
    getRecord () {
      let _record = localStorage.getItem('megre')
      this.record = parseJson(_record)
      const _this = this
      this.map = L.map('map', {
        center: [28.06, 112.6],
        zoom: 15,
        zoomControl: false
      })
      let _zoomMax = []
      let _zoomMin = []
      let _lan = []
      let _lat = []
      let lan, lat
      lan = 0
      lat = 0
      this.record.map((item) => {
        _this.initMap(item)
        let zoom = item.zoom.split(',')
        let center = item.centerpoint.replace('(', '').replace(')', '').split(',')
        _zoomMax.push(~~zoom[0])
        _zoomMin.push(~~zoom[1])
        _lat.push(parseFloat(center[1], 10))
        _lan.push(parseFloat(center[0], 10))
        lat += parseFloat(center[1], 10)
        lan += parseFloat(center[0], 10)
      })
      // let zoomMax = Math.min.apply(Math, _zoomMax)
      let zoomMin = Math.max.apply(Math, _zoomMin)
      lat = lat / _lat.length
      lan = lan / _lan.length
      // map.setView([parseFloat(center[1], 10), parseFloat(center[0], 10)], ~~zoom[1])
      this.map.setView([lat, lan], zoomMin)
    },
    initMegreMap () {
      let _record = localStorage.getItem('megre')
      this.record = parseJson(_record)
      this.map = L.map('map', {
        center: [28.06, 112.6],
        zoom: 15
      })
      let _zoomMax = []
      let _zoomMin = []
      let _lan = []
      let _lat = []
      let lan, lat
      lan = 0
      lat = 0
      let layer = ''
      let bands
      this.record.map((item) => {
        // _this.initMap(item)
        let zoom = item.zoom.split(',')
        let center = item.centerpoint.replace('(', '').replace(')', '').split(',')
        _zoomMax.push(~~zoom[0])
        _zoomMin.push(~~zoom[1])
        _lat.push(parseFloat(center[1], 10))
        _lan.push(parseFloat(center[0], 10))
        lat += parseFloat(center[1], 10)
        lan += parseFloat(center[0], 10)
        layer += item.fOid + ','
        bands = item.bands
      })
      let zoomMax = Math.min.apply(Math, _zoomMax)
      let zoomMin = Math.max.apply(Math, _zoomMin)
      lat = lat / _lat.length
      lan = lan / _lan.length
      // map.setView([parseFloat(center[1], 10), parseFloat(center[0], 10)], ~~zoom[1])
      this.map.setView([lat, lan], zoomMin)
      this.zoom = zoomMin
      this.lat = lat
      this.lng = lan
      layer = layer.substring(0, layer.length - 1)
      const TileLayer = L.tileLayer
      let WRJURL = this.$api.serverUrl + ':10081/Service/' + layer
      if (bands > 1) {
        WRJURL = this.$api.serverUrl + ':10080/Service/' + layer
      }
      let WRJ = new TileLayer(WRJURL + '/{z}/{x}/{y}', {maxNativeZoom: zoomMax, maxZoom: zoomMax})
      WRJ.addTo(this.map)
      const _this = this
      this.map.attributionControl.setPrefix('')
      this.map.on('mousemove', (e) => {
        // let _text = 'lat:' + e.latlng.lat + ',lng:' + e.latlng.lng
        // console.log(e)
        _this.lat = e.latlng.lat
        _this.lng = e.latlng.lng
        _this.zoom = _this.map.getZoom()
        // _this.map.attributionControl.addAttribution(_text)
      })
    }
  },
  data () {
    return {
      map: {},
      record: [],
      api: {},
      image: '',
      lat: '',
      lng: '',
      zoom: ''
    }
  }
}
</script>
<style>
  .megre-view #map {
    width: 100%;
    height: 100vh;
  }
  .lat-lng {
    position: absolute;
    top:30px;
    right: 30px;
    display: flex;
    flex-direction: column;
    color: #ffffff;
    z-index: 1999;
  }
  .lat-lng label {
    margin-right: 10px;
    font-size: 16px;
    font-weight: bold;
  }
  .lat-lng span {
    margin-right: 10px;
  }
  .megre-map {
    position: relative;
  }
</style>
