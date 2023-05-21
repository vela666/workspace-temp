import {
  reactive,
} from 'vue'
import {useRoute} from "vue-router";
import {isFunction} from '@/utils/types'
import {
  delNullProperty,
} from '@/utils'

export default function usePaginationState() {
  let $route = useRoute()
  const initVal = () => {
    return {
      dataList: [],
      // 分页器配置
      pagingConfig: {
        page: 1, // 当前页码
        page_size: 15, // 每页数量
      },
      total: 0 // 总数
    }
  }
  const paginationState = reactive(initVal())

  // 重置参数
  const resetPaginationState = () => {
    Object.assign(paginationState, initVal())
  }

  /**
   * @param params 携带的参数
   * @param getPagingData 获取表格数据的方法
   */
  let cancel = null

  async function getPagingData(params = {}, getData = false, UNIQUE_REQ = true) {
    if (!isFunction(getData)) {
      throw new Error(`请传入获取数据方法:组件：${$route.name}`);
      return
    }
    try {
      paginationState.dataList = []
      // delNullProperty去除空值
      let {data} = await getData({
        ...paginationState.pagingConfig,
        ...delNullProperty(params),
        // 频繁请求
        UNIQUE_REQ
      })
      paginationState.dataList = data.list ?? []
      paginationState.total = data.page_info.total_number ?? 0
      return data
    } catch (e) {
      paginationState.dataList = []
      return Promise.reject(e)
    }
  }

  return {
    paginationState,
    getPagingData,
    resetPaginationState,
  }
}
