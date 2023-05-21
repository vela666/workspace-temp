<template>
  <el-dialog
    v-model="show"
    :close-on-click-modal="closeModel"
    :class="['add-or-upd-dialog',className].join(' ')"
    :title="title"
    :width="width"
    append-to-body
    destroy-on-close
    @close="$emit('close')"
    @open="opened"
  >
    <slot v-if="isSlow"></slot>
    <div v-else>正在加载数据中,请稍等 <i class="el-icon-loading"></i></div>
    <template v-if="showBtn" #footer>
      <div class="dialog-footer-l">
        <slot name="footer"></slot>
      </div>
      <div class="dialog-footer-r">
        <el-button
          class="dialog-btn1"
          @click="$emit('update:modelValue',false)">
          取消
        </el-button>
        <el-button
          @click="submit"
          :disabled="!isSlow" class="dialog-btn1"
          type="primary">
          {{ submitTxt }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>


<script>
export default {
  name: 'AddOrUpdDialog'
}
</script>
<script setup>
import {
  computed,
} from 'vue'
import {debounce} from 'lodash-es'

const props = defineProps({
  // 点击其他地方关闭对话框
  closeModel: {
    type: Boolean,
    default: false
  },
  className: {
    type: String,
    default: ''
  },
  width: {
    type: [String, Number],
    default: '546px'
  },
  title: {
    type: [String],
    default: '操作'
  },
  // 解决嵌套某些内容渲染时很慢 导致对话框有卡顿问题
  // 需要则设置为false
  isSlow: {
    type: Boolean,
    default: true
  },
  // 是否显示按钮
  showBtn: {
    type: Boolean,
    default: true
  },
  // v-model = dialogVisible 等于 vue2的 .sync
  modelValue: {
    type: Boolean,
    default: false
  },
  submitTxt: {
    type: [String, Number],
    default: '确定'
  }
})
// close:对话框关闭：重置表单  submit：提交：验证表单
const emit = defineEmits(['update:modelValue', 'update:isSlow', 'submit', 'close', 'open'])
const show = computed({
    get() {
      return props.modelValue
    },
    set(val) {
      emit('update:modelValue', val)
    }
})

// 解决嵌套某些内容渲染时很慢 导致对话框有卡顿问题
const opened = () => {
  let setId = setTimeout(() => {
    emit('open')
    emit('update:isSlow', true)
    clearTimeout(setId)
    setId = null
  })
}
const submit = debounce(() => {
  emit('submit')
}, 300)
</script>
<style>

</style>
<style lang="scss">
.add-or-upd-dialog {
  display: flex;
  flex-direction: column;
  max-height: 80%;

  .el-dialog__body {
    padding-bottom: 0;
  }

  .el-dialog__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

</style>
<style lang="scss" scoped>
.dialog-footer-l {
  font-size: 14px;
  color: #616161;
}

.dialog-footer-r {
  display: flex;
  align-items: center;
}

.add-or-upd-dialog-sub {
  width: 191px;
  border: none;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 100%;
  height: 46px;

  &:hover {
    border-color: transparent;
    color: transparent;
    background-color: transparent;
  }
}
</style>
