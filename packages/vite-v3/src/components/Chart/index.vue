<template>
  <div class="drawer-chart">
    <h3 class="desc-keyword">时间趋势</h3>
    <div class="data-trend">
      <div class="data-trend-s">
        <DrawerDataTrend
            v-model:currentSelect="changeCharts.indicator"
            :dataTrend="chartIndicatorsLists"
            :isStyle="true"
            :limit="2"
            :multiple="true"
            @change="changeChartIndicator"
        />
      </div>
      <!--      暂时不做  -->
      <!--      <div class="data-trend-s">
              <DrawerDataTrend
                v-model:currentSelect="changeCharts.dateSelcte"
                :dataTrend="dateLists"
                @change="timeshareChange"/>
            </div>-->
    </div>
    <div class="drawer-chart-r">
      <!-- 图表-->
      <DrawerChart
          v-if="tableChartData.day_indicator_value.length" ref="chartRef"
          :options="chartData"/>
      <div v-else class="no-data">暂无数据</div>
    </div>
  </div>
</template>

<script>
import {
  computed,
  defineAsyncComponent,
  reactive,
  toRefs,
  inject,
  ref,
  onMounted,
  watch,
} from "vue";
import chartDataJson from './chartData.json'
import {cloneDeep} from 'lodash-es'
import echartsOptions from "./hooks/echartsOptions";

const DrawerDataTrend = defineAsyncComponent(() => import('./DrawerDataTrend.vue'))
const DrawerChart = defineAsyncComponent(() => import('./DrawerChart.vue'))

export default {
  name: 'Chart',
  components: {
    DrawerDataTrend,
    DrawerChart
  },
  setup() {
    // 当前已选中指标
    const state = reactive({
      // 图表数据
      chartData: {},
      // 图表实例
      chartRef: null,
      indicatorRef: null,
    })
    // 数据页面表格及图表数据
    const tableChartData = ref({
      day_indicator_value: [],
      indicator_value: {}
    })
    // 更改图表的下拉框记录值
    // 分时/日  暂时不做
    const changeCharts = ref({
      dateSelcte: '2',
      // 默认要Data组件显示的指标
      indicator: ['cost', 'convert_cost']
    })
    // 图表指标可选范围
    const chartIndicatorsLists = [
      {
        prop: 'cost',
        label: '消耗'
      },
      {
        prop: 'show',
        label: '展示数'
      },
      {
        prop: 'avg_show_cost',
        label: '平均千次展现费用'
      },
      {
        prop: 'click',
        label: '点击数'
      },
      {
        prop: 'ctr',
        label: '点击率'
      },
      {
        prop: 'avg_click_cost',
        label: '平均点击单价'
      },
      {
        prop: 'convert',
        label: '转化数'
      },
      {
        prop: 'convert_rate',
        label: '转化率'
      },
      {
        prop: 'convert_cost',
        label: '转化成本'
      },
      {
        prop: 'active',
        label: '激活数'
      },
      {
        prop: 'register',
        label: '注册数'
      },
      {
        prop: 'game_addiction',
        label: '关键行为数'
      },
      {
        prop: 'share',
        label: '分享数'
      },
      {
        prop: 'like',
        label: '点赞数'
      },
      {
        prop: 'follow',
        label: '新增关注数'
      },
      {
        prop: 'home_visited',
        label: '主页访问量'
      },
      {
        prop: 'comment',
        label: '评论数',
      }
    ]
    // 已选指标图表对应中文
    let mappingChinese = chartIndicatorsLists.reduce((p, c) => {
      p[c.prop] = c.label
      return p
    }, {})
    // areaStyle关键代码颜色 和hexToRgba方法 转换16进制颜色 图表
    const {options} = echartsOptions({mappingChinese})
    onMounted(() => {
      tableChartData.value = chartDataJson.data
    })
    watch(tableChartData, () => {
      mappingChartData()
    })
    // 格式化图表数据
    const mappingChartData = () => {
      let data = {}
      const reqData = tableChartData.value.day_indicator_value
      data.dimensions = reqData.length ? ['stat_date', ...changeCharts.value.indicator] : []
      data.source = reqData.map(item => {
        // 带百分比符号数据
        ['convert_rate', 'ctr'].forEach(key => {
          item[key] = parseFloat(item[key])
        })
        return item
      })
      // ['ctr','convert_rate']
      state.chartData = cloneDeep(options)
      // 保存百分比值的下标
      let percentage = changeCharts.value.indicator.reduce((p, c, i) => {
        if (['ctr', 'convert_rate'].includes(c)) {
          p.push(i)
        }
        return p
      }, [])
      percentage.forEach(i => {
        state.chartData.series[i].yAxisIndex = 1
      })
      // 不截取日期 动态改变显示线条颜色
      state.chartData.series = data.dimensions.slice(1).reduce((p, c, i) => {
        p.push(state.chartData.series[i])
        return p
      }, [])
      state.chartData.dataset = data
    }
    // 图表(分时/日)选择范围
    const dateLists = [
      {
        value: '1',
        label: '分时'
      },
      {
        value: '2',
        label: '分日'
      }
    ]
    // 图表指标改变
    const changeChartIndicator = (val) => {
      mappingChartData()
    }
    return {
      ...toRefs(state),
      tableChartData,
      changeCharts,
      chartIndicatorsLists,
      dateLists,
      changeChartIndicator,
    }
  }

}
</script>

<style lang="scss" scoped>
.data-indicator {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .desc-keyword {
    border-bottom: 0;
  }
}

.drawer-chart {
  display: flex;
  flex-direction: column;
  height: 480px;
  width: 100vw;
}

.drawer-chart-r {
  flex: 1;
  position: relative;
  margin-top: 20px;
  height: 100%;
  width: 100%;
  overflow: hidden;

  .no-data {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}

.data-trend {
  padding: 0 20px;

  .data-trend-s {
    :deep(.el-select) {
      margin: 0 !important;
    }
  }
}
</style>
