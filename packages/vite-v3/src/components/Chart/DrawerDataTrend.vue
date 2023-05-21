<template>
  <el-select
    v-model="current"
    :class="{'no-stlye':isStyle}"
    :multiple="multiple"
    :multiple-limit="limit"
    :style="style"
    filterable
    placeholder="请选择"
    style="margin-bottom:20px"
    @change="selectChange">
    <el-option
      v-for="item of dataTrend"
      :key="item.prop"
      :label="item.label"
      :value="item.prop">
    </el-option>
  </el-select>
</template>

<script>
import {
  computed
} from 'vue'

export default {
  name: 'DrawerDataTrend',
  props: {
    isStyle: {
      type: Boolean,
      default: false
    },
    style: {
      type: String,
      default: 'width: 270px;'
    },
    multiple: {
      type: Boolean,
      default: false
    },
    limit: {
      type: Number,
      default: 0
    },
    currentSelect: {
      type: [String, Array, Number],
      default: ''
    },
    dataTrend: {
      type: Array,
      default: []
    }
  },
  emits: ['change', 'update:currentSelect'],
  setup(props, {emit, attrs}) {
    let current = computed({
      get() {
        return props.currentSelect
      },
      set(val) {
        emit('update:currentSelect', val)
      }
    })
    const selectChange = val => {
      emit('change', val)
    }
    return {
      current,
      selectChange
    }
  }
}
</script>

<style lang="scss" scoped>
.no-stlye {
  :deep(.el-select__tags) {
    .el-tag {
      color: #616161;
      background: transparent;
    }

    .el-icon-close {
      display: none;
    }
  }
}

// 下拉框
:deep(.el-input--suffix .el-input__inner) {
  border: none;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &:hover {
    color: #5473e8;

    ~ .el-input__suffix .el-select__caret {
      color: #5473e8;
    }
  }
}

:deep(.el-select) {
  // width: 129px;
  margin-bottom: 0 !important;
}

</style>
