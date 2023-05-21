<template>
  <div class="n-select-url">
    <el-input
      class="w200"
      clearable
      placeholder="请输入监测活动名称"
      v-model="state.search.monitor_name"/>
    <!--      <SelectProject
            v-model="state.search.project_id"
            @change="projectChange"
          />
          <SelectAuthorityApp
            v-model="state.search.apply_id"
            :projectId="state.search.project_id"
          />-->
    <span>可选: <i
      class="c_primary">{{ state.selectedData.length }}</i> / {{ optionalQuantity }} 条
      </span>
  </div>
  <el-table
    class="e-flex"
    ref="tableRef"
    v-loading="state.loading"
    :data="paginationState.dataList"
    :tooltip-effect="'light'"
    border
    height="100%"
    @selection-change="selectionChange"
    style="width: 100%"
  >
    <!--              :selectable="checkboxInit"-->
    <el-table-column
      :selectable="checkboxInit"
      fixed="left"
      label="全选"
      type="selection"
      width="90">
    </el-table-column>
    <el-table-column
      v-for="column of state.tableColumn"
      :key="column.id"
      :fixed="column.fixed"
      :label="column.label"
      :prop="column.prop"
      :show-overflow-tooltip="!column.isBtn"
      :type="column.type"
      :min-width="column.width ?? 140"
    >
      <template #default="{row}">
        {{ row[column.prop] }}
      </template>
    </el-table-column>
  </el-table>
  <Pagination
    style="margin-top: 20px"
    v-model:limit="paginationState.pagingConfig.page_size"
    v-model:page="paginationState.pagingConfig.page"
    :total="paginationState.total"
    @getData="getMonitoringData"
  />
  <el-button @click="save">提交</el-button>
</template>

<script setup>
import {
  ref,
  reactive,
  nextTick,
  watch
} from 'vue'
import {
  ElMessage
} from 'element-plus'
import {debounce} from 'lodash-es'
// 导入分页hooks
import usePaginationState from "@/components/Pagination/hooks";
import limitTableChoicesJson from "./data/limit-table-choices.json";

const props = defineProps({
  optionalQuantity: {
    type: Number,
    default: 10
  },
})

const initVal = () => {
  return {
    tableColumn: [
      {
        label: '监测活动名称',
        prop: 'monitor_name',
      },
      {
        label: '应用',
        prop: 'apply_name',
      },
      {
        label: '应用包名',
        prop: 'package_name',
      },
      {
        label: '下载链接',
        prop: 'download_link',
      },
      {
        label: '操作',
        isBtn: true,
        width: 60
      },
      {
        label: '有效触点(点击) 监测链接',
        prop: 'click_monitor_link',
      },
      {
        label: '展示监测链接',
        prop: 'impression_monitor_link',
      },
      {
        label: '视频播放监测链接',
        prop: 'video_play_monitor_link',
      },
      {
        label: '视频播完监测链接',
        prop: 'video_complete_monitor_link',
      },
      {
        label: '视频有效播放监测链接',
        prop: 'video_effective_monitor_link',
      },
    ],
    selectedData: [],
    // 记录监测活动列表筛选条件
    search: {
      monitor_name: '',
    },
  }
}
const state = reactive(initVal())
// 使用分页组件hooks
const {
  getPagingData,
  paginationState,
  resetPaginationState
} = usePaginationState()

// 实例
const tableRef = ref(null)

const getData = () => {
  return Promise.resolve(limitTableChoicesJson)
}
// 获取监控列表
const getMonitoringData = (mark = false) => {
  // 数据未加载完成表格 显示加载效果
  state.loading = true
  mark && resetPaginationState()
  getPagingData(state.search, getData).finally(_ => {
    state.loading = false
  })
}

// bool = 是否显示操作
const open = (bool = true, params = {}) => {
  state.tableColumn = state.tableColumn.filter(item => item.prop)
  nextTick(() => {
    getMonitoringData()
  })
}
const reset = bool => {
  flag = false
  Object.assign(state, initVal())
}
const save = _ => {
  console.log(state.selectedData)
}

const projectChange = () => {
  state.search.apply_id = ''
}

// 全选
const selectionChange = val => {
  state.selectedData = val
}

// 限制选择数量
const checkboxInit = (row) => {
  // 设置checkbox，选中状态，是否可选
  // 获取当前选择的数据
  let arr = tableRef.value.store.states.selection.value
  const state = arr.some(item => item.monitor_id === row.monitor_id)
  // true 可选
  return arr.length < props.optionalQuantity || state
}

open()
</script>
<style lang="scss">
.n-select-url-dialog {
  min-height: 750px;

  > .el-dialog__body {
    display: flex;
    flex-direction: column;
    align-items: center;

    > div {
      &:not(:last-of-type) {
        margin-bottom: 20px;
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.e-flex {
  flex: 1;
}

.n-select-url {
  margin-bottom: 20px;

  > div {
    margin-right: 20px;
  }
}
</style>
