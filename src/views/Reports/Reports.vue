<template>
  <div id="reports">
    <el-card>
      <div class="main"></div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { getReports } from '@/network/reports'

export default {
  name: 'reports',
  data() {
    return {
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  methods: {
    showReports() {
      var myChart = echarts.init(document.querySelector('.main'))
      getReports().then((res) => {
        const reportData = { ...this.options, ...res.data }
        myChart.setOption(reportData)
      })
    }
  },
  mounted() {
    this.showReports()
  }
}
</script>

<style>
.main {
  width: 100%;
  height: 600px;
}
</style>