<template>
<div class="message-manage">
  <div style="margin-top:15px"></div>
  <b-row>
    <b-col sm="12" lg="12">
      <el-table
        ref="userTable"
        :data="record"
        stripe
        highlight-current-row
        style="width: 100%">
        <el-table-column
          type="index"
          width="70">
        </el-table-column>
        <el-table-column
          label="操作"
          min-width="120">
          <template slot-scope="scope">
            <el-button @click.stop="handleAdd(scope.row)" size="small">查看</el-button>
            <el-button @click.stop="delRecord(scope.row)" size="small">删除</el-button>
          </template>
        </el-table-column>
        <el-table-column
          property="foid"
          label="foid"
          min-width="70">
        </el-table-column>
        <el-table-column
          property="type"
          label="消息类型"
          :filters="[{text: '影像发布成功', value: '影像发布成功'}, {text: '切图完成成功', value: '切图完成成功'}, {text: '影像下载成功', value: '影像下载成功'}, {text: '重采样完成成功', value: '重采样完成成功'}, {text: '影像分析成功', value: '影像分析成功'}]"
          :filter-method="filterType"
          min-width="100">
        </el-table-column>
        <el-table-column
          property="content"
          show-overflow-tooltip
          label="内容"
          min-width="250">
        </el-table-column>
        <el-table-column
          property="state"
          label="状态"
          :filters="[{text: '未读', value: 1}, {text: '已读', value: 2}]"
          :filter-method="filterState"
          min-width="60">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.state === 1 ? 'primary' : 'info'"
              disable-transitions>{{scope.row.state === 1 ? '未读': '已读'}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          property="createtime"
          label="消息时间"
          min-width="120">
        </el-table-column>
      </el-table>
    </b-col>
  </b-row>
  <el-dialog :width="'800'" :visible.sync="vizShow">
    <div class="chart-content" v-loading="chartLoad">
      <div id="chart"></div>
    </div>
  </el-dialog>
  <el-dialog title="影像下载成功" :visible.sync="downShow">
    <el-form>
      <el-form-item label="下载地址：" :label-width="formLabelWidth" class="input-panel">
        <el-input v-model="form.url" autocomplete="off" disabled="disabled"></el-input>
        <el-button v-clipboard:copy="form.url" size="mini" type="primary"><i class="fa fa-clipboard"></i>复制</el-button>
      </el-form-item>
      <el-form-item label="消息内容：" :label-width="formLabelWidth">
        <el-input
          type="textarea"
          :row="4"
          placeholder="请输入内容"
          v-model="form.content" disabled="disabled">
        </el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="downShow = false">取 消</el-button>
      <el-button type="primary" @click="downShow = false">确 定</el-button>
    </div>
  </el-dialog>
</div>
</template>

<script>
import eChart from 'echarts'
import { parseJson } from '../utils/factory'
import { getUserId } from '@/libs/util'
export default {
  name: 'message',
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.api = this.$api.message
      this.getSearch()
      this.userid = getUserId()
      const _t = this
      this.$bus.$on('syncMessage', content => {
        content === 'sync' && _t.getSearch()
      })
    },
    closeViz () {
      this.vizShow = false
    },
    getSearch () {
      let url = this.api.list
      const _this = this
      let option = {
        userid: this.userid
      }
      this.$http.post(url, option).then((response) => {
        if (response && response.data.code === 1) {
          _this.record = response.data.data.rows
        } else {
          _this.$notify.error({title: '错误', message: response.data.msg})
        }
      }).catch((response) => {
        // console.log(response)
      })
    },
    vizOpen () {
      const _ = this
      this.chartLoad = true
      setTimeout(() => {
        _.renderChart(_.vizData)
      }, 1000)
    },
    refreshMessage () {
      this.$bus.$emit('refreshMessage', 'refresh')
    },
    handleAdd (item) {
      try {
        const _this = this
        if (item.state === 1) {
          let url = this.api.save + '?id=' + item.id
          this.$http.get(url).then((response) => {
            if (response && response.data.code === 1) {
              _this.refreshMessage()
              _this.getSearch()
              if (item.type === '影像发布成功') {
                // let pattern = /\d+/g
                let id = item.foid
                let url = window.location.origin + '/data/mapView/' + id
                window.open(url, '_blank')
              } else if (item.type === '影像分析成功') {
                _this.vizData = parseJson(item.statistic)
                _this.vizShow = true
              } else if (item.type === '影像下载成功') {
                _this.showDownLoad(item)
              }
            } else {
              // _this.$notify.error({title: '错误', message: response.message})
            }
          }).catch((response) => {
            console.log(response)
          })
        } else {
          if (item.type === '影像发布成功') {
            // let pattern = /\d+/g
            let id = item.foid
            let url = window.location.origin + '/data/mapView/' + id
            window.open(url, '_blank')
          } else if (item.type === '影像分析成功') {
            _this.vizData = parseJson(item.statistic)
            _this.vizShow = true
            _this.vizOpen()
          } else if (item.type === '影像下载成功') {
            _this.showDownLoad(item)
          }
        }
      } catch (e) {
        console.log(e)
      }
    },
    showDownLoad (item) {
      this.downShow = true
      this.form = item
      this.form.url = '\\\\' + item.content.substring(item.content.indexOf('172'))
    },
    renderChart (response) {
      this.dom = document.querySelector('#chart')
      let dataAxis = []
      let data = []
      for (let x in response) {
        dataAxis.push(x)
        data.push(response[x])
      }
      let yMax = Math.max.apply(Math, data)
      yMax = Math.floor(yMax * 1.5 / 100) * 100
      let dataShadow = []
      for (var i = 0; i < data.length; i++) {
        dataShadow.push(yMax)
      }
      this.option = {
        xAxis: {
          data: dataAxis,
          axisLabel: {
            inside: true,
            textStyle: {
              color: '#fff'
            }
          },
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          z: 10
        },
        yAxis: {
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            textStyle: {
              color: '#999'
            }
          }
        },
        dataZoom: [
          {
            type: 'inside'
          }
        ],
        series: [
          { // For shadow
            type: 'bar',
            itemStyle: {
              normal: {color: 'rgba(0,0,0,0.05)'}
            },
            barGap: '-100%',
            barCategoryGap: '40%',
            data: dataShadow,
            animation: false
          },
          {
            type: 'bar',
            itemStyle: {
              normal: {
                color: new eChart.graphic.LinearGradient(
                  0, 0, 0, 1,
                  [
                    {offset: 0, color: '#83bff6'},
                    {offset: 0.5, color: '#188df0'},
                    {offset: 1, color: '#188df0'}
                  ]
                )
              },
              emphasis: {
                color: new eChart.graphic.LinearGradient(
                  0, 0, 0, 1,
                  [
                    {offset: 0, color: '#2378f7'},
                    {offset: 0.7, color: '#2378f7'},
                    {offset: 1, color: '#83bff6'}
                  ]
                )
              }
            },
            data: data
          }
        ]
      }
      this.chart = eChart.init(this.dom, this.theme)
      this.chart.setOption(this.option)
      this.chartLoad = false
    },
    delRecord (row) {
      const _this = this
      let url = this.api.remove + '?id=' + row.id
      this.$http.get(url).then((response) => {
        if (response && response.data.code === 1) {
          _this.getSearch()
        }
      }).catch((response) => {
        // console.log(response)
      })
    },
    filterState (value, row) {
      return row.state === value
    },
    filterType (value, row) {
      return row.type === value
    }
  },
  data () {
    return {
      record: [],
      option: {},
      api: {},
      form: {},
      userid: 11,
      vizData: [],
      vizShow: false,
      downShow: false,
      formLabelWidth: '120px',
      chart: undefined,
      dom: undefined,
      chartLoad: false
    }
  }
}
</script>
<style lang="css">
  .chart-content {
    width: 800px;
    height: 600px;
  }
  #chart{
    width: 100%;
    height: 100%;
  }
  .input-panel .el-form-item__content{
    display: flex;
  }
  .input-panel .el-input {
    margin-right: 10px;
  }
</style>
