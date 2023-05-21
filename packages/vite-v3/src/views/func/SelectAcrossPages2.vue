<template>
  <p>前端分页-跨页选择保留-form表单动态验证</p>
  <div class="drawer-content">
    <div class="drawer-content-t">
      <el-input
        v-model="state.search"
        class="w220 mr20"
        placeholder="请输入落地页名称"/>
    </div>
    <template v-if="state.listData.length || state.checkedLists.length">
      <div class="drawer-content-c">
        <div v-eventDelegation="{fn: previewOrclearFn, target: '.preview'}"
             class="drawer-content-c-l">
          <el-checkbox
            v-if="state.listData.length"
            v-model="state.checkAll"
            @change="handleCheckAllChange"
          >全选
          </el-checkbox>
          <el-checkbox-group
            v-model="state.checkedLists"
          >
            <el-checkbox
              v-for="item of state.listData"
              :key="item.site_id"
              :label="item.site_id"
            >
              <span v-showTips class="tips"> {{ item.name }}</span>
              <el-button :data-name="item.name" :data-thumbnail="item.thumbnail" class="preview"
                         text>预览
              </el-button>
            </el-checkbox>
          </el-checkbox-group>
        </div>
        <div class="drawer-content-c-c">
          <PreviewImg
            v-if="state.previewData.name"
            :data="state.previewData"
            :isNoMask="true"
          />
          <span v-else style="font-size: 16px;">落地页预览区</span>
        </div>
        <div
          v-eventDelegation="{fn: previewOrclearFn, target: '.preview'}"
          class="drawer-content-c-r">
          <div v-show="state.checkedLists.length" class="desc">
            <span>已选 <i style="color: #5473e8">{{ state.checkedLists.length }}</i> 个落地页</span>
            <el-button text @click="clearAll">清空</el-button>
          </div>
          <el-form
            ref="formRef"
            :model="rSelectData"
            class="demo-dynamic"
            label-width="100px"
          >
            <div
              v-for="(item,index) of rSelectData.showSelecte"
              :key="item.site_id"
              class="select-list">
              <div class="select-list-name">
                <span v-showTips class="tips">{{ item.name }}</span>
                <el-button
                  :data-name="item.name"
                  :data-thumbnail="item.thumbnail"
                  class="preview"
                  text>预览
                </el-button>
                <span :data-id="item.site_id"
                      class="close preview"
                      data-clear="true">X</span>
              </div>
              <!--    动态验证写法          -->
              <el-form-item
                :prop="`showSelecte.${index}.project_id`"
                :rules="[ { required: true, message: '请选择项目', trigger: 'change' } ]"
              >
                <el-select
                  v-model="item.project_id"
                  placeholder="请选择项目">
                  <el-option
                    v-for="item in projectLists"
                    :key="item.project_id"
                    :label="item.project_name"
                    :value="item.project_id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                :prop="`showSelecte.${index}.name_alias`"
                :rules="[{ required: true, message: '请输入模板名称', trigger: 'blur' }]"
              >
                <div class="name-input">
                  <span>模板名称：</span>
                  <el-input
                    v-model="item.name_alias"
                    maxlength="50"
                    placeholder="请输入模板名称"
                    show-word-limit>
                  </el-input>
                </div>
              </el-form-item>
            </div>
          </el-form>
        </div>
      </div>
      <div class="drawer-content-b">
        <Pagination2
          v-model:limit="state.pageConfig.page_size"
          v-model:page="state.pageConfig.page"
          :total="state.total"
        />
        <div>
          <el-button class="dialog-btn1" @click="close">取消</el-button>
          <el-button class="dialog-btn1" type="primary" @click="submit">保存</el-button>
        </div>
      </div>
    </template>
    <span
      v-else
      v-loading="state.loading"
      class="no-select"
      element-loading-text="获取数据中...">
          {{ state.loading ? null : '暂无数据' }}
        </span>
  </div>
</template>

<script setup>
import {
  computed,
  watch,
  reactive,
  ref,
  toRefs,
  nextTick,
  defineAsyncComponent,
} from 'vue'
import {
  ElMessage
} from 'element-plus'
import {uniqBy, debounce, cloneDeep} from 'lodash-es'
// 导入分页hooks
import selectDataJson from './data/select-across-pages2.json'

const PreviewImg = defineAsyncComponent(() => import('./components/PreviewImg'))
// 父组件的父组件状态
const projectLists = ref([{
  project_id: "42e263dc13814915918a9b4360d847c78",
  project_name: "002",
  apply_list: [],
  product_list: [],
  user_list: [
    {
      user_id: "5fd931f3cd484b58a034458a97cc4c6c8",
      user_name: "周紫薇"
    }
  ],
  is_manger: true,
  audit_material: 0,
  folder_auth: true
}])

const initVal = () => {
  const dataList = []
  for (let i = 0; i < 200; i++) {
    dataList.push({
      status: `status${i}`,
      name: `name${i}`,
      site_id: `site_id${i}`,
      thumbnail: "https://sf1-ttcdn-tos.pstatp.com/obj/oneshot/2022102411412855331d065a1670434b02"
    },)
  }
  return {
    isSlowReq: true,
    loading: false,
    // 当前预览的数据
    previewData: {
      src: '',
      name: ''
    },
    checkAll: false,
    // 已选择的复选框
    checkedLists: [],
    search: '',
    advertiser_id: '111111',
    // 列表数据
    dataList,
    listData: computed(() => {
      let newArr = state.dataList.filter(item => item.name.includes(state.search))
      let index = (state.pageConfig.page - 1) * state.pageConfig.page_size;
      newArr = newArr.slice(index, (state.pageConfig.page * state.pageConfig.page_size))
      return newArr
    }),
    // 分页器配置
    pageConfig: {
      page: 1, // 当前页码
      page_size: 15, // 每页数量
    },
    // 总数
    total: dataList.length,
    // 实例
    formRef: null
  }
}
const state = reactive(initVal())

let isMessage = null

// 右侧已选列表
const rSelectData = ref({
  showSelecte: []
})
// 添加已选择数据
const filterSelectData = () => {
  rSelectData.value.showSelecte.push(...state.listData.filter(v => {
    v.advertiser_id = state.advertiser_id
    v.name_alias = v.name
    v.project_id = projectLists.value[0]?.project_id ?? ''
    return state.checkedLists.includes(v.site_id)
  }))
  // 去重并过滤数据
  rSelectData.value.showSelecte = uniqBy(rSelectData.value.showSelecte, 'site_id').filter(item => state.checkedLists.includes(item.site_id))
  console.log(rSelectData.value)
  checkedGroup()
}
watch(() => state.listData, filterSelectData)
watch(() => state.checkedLists, filterSelectData, {deep: true})

// 全选事件
const handleCheckAllChange = (val) => {
  if (val) {
    state.checkedLists.push(...state.listData.map(item => item.site_id))
    state.checkedLists = [...new Set(state.checkedLists)]
  } else {
    // 根据获取的数据过滤
    state.checkedLists = state.checkedLists.filter(item => !state.listData.some(v => +v.site_id === +item))
  }
}
// 单个复选框
const checkedGroup = () => {
  state.checkAll = state.listData.every(item => state.checkedLists.includes(item.site_id))
}
const clearAll = () => {
  state.checkedLists = []
}
const close = (mark = true) => {
  Object.assign(state, initVal())
}
const submit = () => {
  state.formRef.validate(async (valid) => {
    if (!valid) return
    let params = rSelectData.value.showSelecte.map(v => {
      return {
        project_id: v.project_id,
        name_alias: v.name,
        ...v
      }
    })
    console.log(params)
  })
}

// 预览和单个删除
const previewOrclearFn = (val) => {
  let {thumbnail, name, clear, id} = val.dataset
  if (clear) {
    state.checkedLists = state.checkedLists.filter(item => item !== id)
  } else {
    state.previewData.src = thumbnail
    state.previewData.name = name
  }
}
</script>

<style lang="scss">
.landing-page-drawer {
  min-width: 1068px;

  .el-drawer__body {
    padding: 10px;
  }
}
</style>
<style lang="scss" scoped>
:deep(.el-form) {
  flex: 1;
  overflow: overlay;
}

:deep(.el-form-item__content) {
  margin: 0 !important;
}

.no-select {
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

.name-input {
  display: flex;

  & + :deep(.el-form-item__error) {
    left: 70px;
  }

  > span {
    white-space: nowrap;
  }
}

.drawer-content {
  display: flex;
  flex-direction: column;
  background: #fff;
  width: 100%;
  height: 600px;
}

.drawer-content-t {
  display: flex;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid $border-color-base;
}

.drawer-content-c {
  display: flex;
  justify-content: center;
  overflow: hidden;
  border-bottom: 1px solid $border-color-base;

  .desc {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .tips {
    flex: 1;
  }

  > div {
    flex: 1;
    padding: 20px;
    border-right: 1px solid $border-color-base;

    &:last-of-type {
      border: none;
      padding: 10px;
    }
  }

  .drawer-content-c-l {
    overflow: overlay;

    &:last-of-type {
      border: none;
    }

    :deep(.el-checkbox-group) {
      display: flex;
      flex-direction: column;

      .el-checkbox {
        display: flex;
        align-items: center;
        padding-left: 5px;
        background: #ecf0fd;
        border-radius: 2px;
        margin: 10px 0;
        overflow: hidden;

        .el-checkbox__label {
          display: flex;
          align-items: center;
          flex: 1;
          overflow: hidden;

          .el-button {
            margin: 0 15px;
          }
        }
      }
    }
  }

  .drawer-content-c-c {
    display: flex;
    justify-content: center;
    overflow-y: overlay;
    padding: 50px 20px;
    margin-bottom: 20px;
  }

  .drawer-content-c-r {
    display: flex;
    flex-direction: column;

    .select-list {
      margin-top: -1px;
      padding: 15px 15px 0 15px;
      border-top: 1px solid $border-color-base;
      border-bottom: 1px solid $border-color-base;

      :deep(.el-select) {
        width: 100%;
      }

      .select-list-name {
        display: flex;
        padding: 0 10px;
        align-items: center;
        background: #ecf0fd;
        border-radius: 2px;
        margin-bottom: 18px;
        overflow: hidden;
      }

      .el-button {
        margin: 0 24px;
      }

      .close {
        cursor: pointer;
        color: #8a8a8a;
        font-size: 12px;
      }
    }
  }
}

.drawer-content-b {
  //display: flex;
  //align-items: center;
  //justify-content: space-between;
  padding: 20px;

  > div {
    &:first-of-type {
      float: left;
    }

    &:last-of-type {
      float: right;
    }
  }
}

</style>
