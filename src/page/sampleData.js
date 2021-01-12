/**
 * Created by Kathy
 * @Date 1/11/21
 * @description
 */
export const sampleDistributionOption = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  grid: {
    top: '3%',
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    // show: false,
    type: 'value',
    boundaryGap: [0, 0.01],
    axisLabel: {
      interval: 1 // 代表显示所有x轴标签显示
      // rotate: 45 // 代表逆时针旋转45度
    }
  },
  yAxis: {
    type: 'category',
    data: []
  },
  series: [
    {
      name: '加州数据集',
      type: 'bar',
      data: []
    }
  ]
}
export const sampleStatus = {
  title: {
    text: '数据集样本数量统计',
    x: 'center',
    padding: [15, 0, 0, 0]
  },
  grid: {
    top: '50',
    left: '8%',
    right: '5%',
    bottom: '5%',
    containLabel: true
  },
  xAxis: {
    type: 'value'
  },
  yAxis: {
    type: 'category',
    data: []
  },
  series: [{
    data: [],
    type: 'bar'
  }]
}
export const setList = [
  {
    id: 1,
    name: '加州数据集',
    count: 435
  },
  {
    id: 2,
    name: '加州数据集',
    count: 555
  },
  {
    id: 3,
    name: '加州数据集',
    count: 901
  },
  {
    id: 4,
    name: '加州数据集',
    count: 534
  },
  {
    id: 5,
    name: '加州数据集',
    count: 134
  },
  {
    id: 6,
    name: '加州数据集',
    count: 1134
  },
  {
    id: 7,
    name: '加州数据集',
    count: 994
  },
  {
    id: 8,
    name: '加州数据集',
    count: 434
  },
  {
    id: 9,
    name: '加州数据集',
    count: 834
  }
]
