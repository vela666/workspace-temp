<template>
  <!--  <AddOrUpdDialog
      v-model="state.dialogVisible"
      :title="`账户授权(${dataLength})`"
      width="858px"
      @close="close"
      @submit="submit"
    >
      <div>
        <div class="flex-center">
          <el-radio-group
            v-model="state.radioType">
            <el-radio-button
              v-for="item of radioLists"
              :key="item"
              :label="item.id"> {{ item.label }}
            </el-radio-button>
          </el-radio-group>
          <el-input class="w220 mlr20" clearable placeholder="按账户名称/ID搜索"
                    v-model="state.search"/>
          <el-checkbox v-model="state.isAuthorized">仅显示可选择数据</el-checkbox>
        </div>
        <el-table
          class="mt20"
          ref="tableRef"
          v-loading="state.tableLoading"
          :data="filterData"
          :tooltip-effect="'light'"
          border
          height="100%"
          style="width: 100%"
          @select-all="selectAllHandler"
          @select="selectHandler"
        >
          <el-table-column
            :selectable="selectInit"
            label="全选"
            type="selection"
            width="90"
          ></el-table-column>
          <el-table-column
            v-for="item of tableColumnLists"
            :key="item.prop"
            :label="item.label"
            show-overflow-tooltip>
            <template #default="{row}">
              {{ row[item.prop] || '&#45;&#45;' }}
            </template>
          </el-table-column>
        </el-table>
      </div>
    </AddOrUpdDialog>-->
  <div class="flex-center">
    <el-radio-group
      v-model="state.radioType">
      <el-radio-button
        v-for="item of radioLists"
        :key="item"
        :label="item.id"> {{ item.label }}
      </el-radio-button>
    </el-radio-group>
    当前数据数量-{{ dataLength }}
    <el-input class="w220 mlr20" clearable placeholder="按账户名称/ID搜索"
              v-model="state.search"/>
    <el-checkbox v-model="state.isAuthorized">仅显示可选择数据</el-checkbox>
  </div>
  <el-table
    class="mt20"
    ref="tableRef"
    v-loading="state.tableLoading"
    :data="filterData"
    :tooltip-effect="'light'"
    border
    height="100%"
    style="width: 100%"
    @select-all="selectAllHandler"
    @select="selectHandler"
  >
    <el-table-column
      :selectable="selectInit"
      label="全选"
      type="selection"
      width="90"
    ></el-table-column>
    <el-table-column
      v-for="item of tableColumnLists"
      :key="item.prop"
      :label="item.label"
      show-overflow-tooltip>
      <template #default="{row}">
        {{ row[item.prop] || '--' }}
      </template>
    </el-table-column>
  </el-table>
  <el-button @click="submit">提交</el-button>
</template>

<script>
export default {
  name: 'AuthorizationDialog'
}
</script>
<script setup>
import {
  ref,
  reactive,
  computed,
  nextTick,
  watch,
} from 'vue'
import {
  ElMessage
} from 'element-plus'
import {uniqBy, debounce} from 'lodash-es';
import selectDataJson from './data/select-across-pages1.json'

const props = defineProps({
  radioDefaultType: {
    type: [String, Number],
    default: 1,
  },
})
const emit = defineEmits(['getData'])
const initVal = () => {
  return {
    radioType: props.radioDefaultType,
    search: '',
    isAuthorized: false,
    tableLoading: false,
    dialogVisible: false,
    authorizationList: [],
    selectedLists: [],
    code: ''
  }
}
const state = reactive(initVal())
const tableRef = ref(null)

const filterData = computed(() => {
  let val = state.search.trim()
  // 过滤
  let data = state.authorizationList.filter(item => {
    return +item.advertiser_role === +state.radioType
  })
  data = data.filter(item => {
    // 仅显示可选择数据
    return state.isAuthorized ? !item.isAuthorized : true
  })
  // 搜索账户
  if (val) {
    return data.filter(item => {
      return item.advertiser_name.toLowerCase().includes(val.toLowerCase()) || item.advertiser_id.includes(val)
    })
  }
  console.log(data)
  return data
})
const dataLength = computed(() => {
  let data = state.authorizationList.filter(item => {
    return +item.advertiser_role === +state.radioType
  })
  return data.length
})
const radioLists = [
  {
    id: 1,
    label: '广告账户'
  },
  {
    id: 2,
    label: '经理账户'
  },
]
const tableColumnLists = [
  {
    prop: 'advertiser_name',
    label: '账户名称',
  },
  {
    prop: 'advertiser_id',
    label: '账户ID',
  },
  {
    prop: 'belong_project_name',
    label: '账户已归属项目',
  },
  {
    prop: 'belong_user_name',
    label: '账户已归属人员',
  },
]
let elMsg = null
watch([() => state.search, () => state.radioType, () => state.isAuthorized], debounce(val => {
  nextTick(() => {
    let data = state.selectedLists.filter(item => {
      return +item.advertiser_role === +state.radioType
    })
    let tmp = state.authorizationList.filter(item => item.isAuthorized);
    let checklist = uniqBy([...data, ...tmp], 'newId')
    checklist.forEach(row => {
      tableRef.value.toggleRowSelection(row, true);
    });
  })
}, 300))

const asyncGetGgAuthorizationList = async code => {
  try {
    state.tableLoading = true
    let data = selectDataJson.data
    if (!Object.keys(data).length) {
      elMsg && elMsg.close()
      elMsg = ElMessage.warning('没有可选择的数据')
      history.replaceState(history.state, '', location.origin + location.pathname)
      return
    }
    state.authorizationList = Array.isArray(data) ? data.map(item => {
      return {
        ...item,
        newId: item.advertiser_id + '&' + item.advertiser_role,
      }
    }).sort((a, b) => a.isAuthorized - b.isAuthorized) : []
    state.dialogVisible = true;
    nextTick(() => {
      let tmp = state.authorizationList.filter(item => item.isAuthorized)
      tmp.forEach(row => {
        tableRef.value.toggleRowSelection(row, true);
      });
    })
  } catch (e) {
    console.log(e)
  } finally {
    state.tableLoading = false
  }
}

/*const getAuthorizationCallbackParams = _ => {
  let params = new URLSearchParams(location.search);
  let code = params.get('code');
  if (code) {
    state.code = code
    asyncGetGgAuthorizationList(code)
  }
}*/

// 表格全选
const selectAllHandler = val => {
  if (!val.filter(item => !item.isAuthorized).length) {
    state.selectedLists = state.selectedLists.filter(item => {
      return +state.radioType !== +item.advertiser_role
    })
  }
  state.selectedLists.push(...val)
  state.selectedLists = uniqBy(state.selectedLists, 'newId')
}
// 表格单选
const selectHandler = (val, row) => {
  let bool = val.some(item => item.advertiser_id === row.advertiser_id)
  // 取消选择为true
  if (!bool) {
    state.selectedLists = state.selectedLists.filter(item => {
      return item.advertiser_id !== row.advertiser_id
    })
  } else {
    state.selectedLists.push(row)
  }
  state.selectedLists = uniqBy(state.selectedLists, 'newId')
}

// 如果没权限禁用复选框
const selectInit = (row) => {
  // fasle 不可勾选
  return !row.isAuthorized
}

const close = () => {
  Object.assign(state, initVal())
  history.replaceState(history.state, '', location.origin + location.pathname)
  emit('getData')
}

let isReq = true
const submit = async () => {
  if (!isReq) return
  // 获取当前选择的数据
  console.log(tableRef.value.store.states)
  let data = uniqBy([...state.selectedLists, ...tableRef.value.store.states.selection.value], 'newId')
  if (!data.length) {
    ElMessage.warning('请选择账户')
    return
  }
  /*let params = {
    advertisers: data.map(item => {
      return {
        advertiser_id: item.advertiser_id,
        advertiser_role: item.advertiser_role,
      }
    }),
    code: state.code
  }
  elMsg = ElMessage.success({
    message: '授权中,请稍等...',
    duration: 0,
    showClose: true,
  })*/
  // isReq = false
  console.log(data)
  /*let {message} = await fn(params).finally(_ => {
    elMsg && elMsg.close()
    isReq = true
  })
  ElMessage.success(message)
  state.dialogVisible = false*/
}

// getAuthorizationCallbackParams()
asyncGetGgAuthorizationList()
</script>

<style scoped>
:deep(.el-table__body-wrapper) {
  max-height: 400px;
}
</style>
