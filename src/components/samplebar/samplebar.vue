<template>
<div class="query-bar">
  <side-nav
    :classifySys="classifySys"
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
        <el-table :data="tableData1" size="mini" style="width: 100%" stripe >
          <el-table-column prop="id" label="id" width="180"></el-table-column>
          <el-table-column prop="src" label="数据源" width="180"></el-table-column>
          <el-table-column prop="resolution" label="分辨率"></el-table-column>
          <el-table-column prop="sat" label="卫星"></el-table-column>
        </el-table>
      </div>
      <div class="res-right">
        <div class="sat res-card">
          <img src="../../assets/img/tiff03.png"/>
          <p>影像</p>
        </div>
        <div class="label res-card">
          <img src="../../assets/img/tiff03.png"/>
          <p>标签</p>
        </div>
      </div>
    </div>
  </div>
  <new-cat></new-cat>
</div>
</template>
<script>
import sideNav from 'src/components/samplebar/side-nav'
import newCat from 'src/components/samplebar/new-cat'
// import SidebarMinimizer from 'src/components/sidebar/SidebarMinimizer'
// import navItem from '@/_query'
// import _area from '@/_area'
import { json } from 'd3-fetch'

export default {
  name: 'query-bar',
  components: {
    // SidebarMinimizer,
    sideNav,
    newCat
  },
  data () {
    return {
      classifySys: [],
      props: { multiple: true },
      ShowAppendDialog: false,
      ShowCreateDialog: false,
      showTable: false,
      linking: false,
      tableData1: [{
        id: '923475',
        src: '天地图',
        resolution: '1m',
        sat: '高分1号'
      }, {
        id: '923475',
        src: '天地图',
        resolution: '1m',
        sat: '高分1号'
      }, {
        id: '923475',
        src: '天地图',
        resolution: '1m',
        sat: '高分1号'
      }, {
        id: '923475',
        src: '天地图',
        resolution: '1m',
        sat: '高分1号'
      }],
      option: {
        user: 11
      },
      api: {},
      rootApi: '',
      province: '',
      city: '',
      county: '',
      boundJson: {}
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    linkable (node, data) {
      if (!this.linking || node.disabled) {
        return false
      }
      if (node.childNodes.length !== 0) {
        return false
      }
      return true
    },
    createSampleSet () {
      this.ShowCreateDialog = true
      this.ShowAppendDialog = false
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
      // for(let item in this.data1){
      //   this.setDataStatus(item, checkedKeys)
      // }
      // console.log(this.$refs.tree.getCheckedNodes())
    },
    init () {
      this.api = this.$api.search
      this.rootApi = this.$api.root1
      const _this = this
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
            let option = { mainId: item.id }
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
          _this.$notify.error({ title: '错误', message: response.message })
        }
      }).catch((response) => {
        // console.log(response)
      })

      // test api

      let url = this.$api.root1 + '/sp/base/taxonomy/main/list'
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
            let option = { mainId: item.id }
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
          _this.$notify.error({ title: '错误', message: response.message })
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
        this.$emit('show-wkt', data)
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
      this.$emit('show-wkt', data)
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
      this.$emit('startQuery')
    }
  }
}
</script>

<style lang="scss">
@import 'samplebar.scss';
@import 'src/assets/scss/page/_date.scss';
@import 'src/assets/scss/page/loading.scss';
</style>
