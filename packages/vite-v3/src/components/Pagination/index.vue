<template>
  <div v-show="total >= 1" class="pagination-container">
    <el-pagination
      ref="pagination"
      :background="background"
      :current-page="currentPage"
      :layout="layout"
      :page-size="pageSize"
      :page-sizes="pageSizes"
      :small="small"
      :total="total"
      v-bind="$attrs"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    ></el-pagination>
  </div>
</template>

<script>

export default {
  name: 'Pagination',
  props: {
    small: {
      type: Boolean,
      default: false
    },
    total: {
      type: Number,
      default: 0
    },
    page: {
      type: Number,
      default: 1
    },
    limit: {
      type: Number,
      default: 10
    },
    pageSizes: {
      type: Array,
      default() {
        return [10, 15, 20, 30, 50]
      }
    },
    layout: {
      type: String,
      // slot可以添加额外元素
      default: 'total, sizes, prev, pager, next,slot , jumper'
    },
    background: {
      type: Boolean,
      default: true
    },
    autoScroll: {
      type: Boolean,
      default: true
    }
  },
  emits: ['update:limit', 'update:page', 'getData'],
  computed: {
    currentPage: {
      get() {
        return this.page
      },
      set(val) {
        this.$emit('update:page', val)
      }
    },
    pageSize: {
      get() {
        return this.limit
      },
      set(val) {
        this.$emit('update:limit', val)
      }
    }
  },
  methods: {
    handleSizeChange(val) {
      let el = document.querySelector('.el-table .el-table__body-wrapper')
      el && el.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
      this.pageSize = val
      this.$emit('getData')
    },
    handleCurrentChange(val) {
      let el = document.querySelector('.el-table .el-table__body-wrapper')
      el && el.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
      this.currentPage = val
      this.$emit('getData')
    }
  },
}
</script>

<style lang="scss" scoped>
.pagination-container {
  .total {
    display: inline-block;
    margin-left: 17px;
    font-size: 14px;
    font-weight: 400;
    color: #616161;
  }

  :deep(.el-pagination ) {
    display: flex;
    align-items: center;
  }

  :deep(.el-pagination.is-background .el-pager li:not(.disabled)) {
    &:hover {
      color: $color-primary;
      border: 1px solid $color-primary;
    }

    &.active {
      background: $color-primary;
      color: #ffffff;
    }
  }

  /*  :deep(.el-icon) {
      width: auto;
    }*/

  :deep(.el-pager li) {
    border: 1px solid rgba(0, 0, 0, 0.15);
    border-radius: $border-radius-small;
    background: $color-white;
    font-weight: 400;
    outline: none;
    font-size: 14px;
    color: $h2-text-color;
    cursor: pointer;

    &.btn-quickprev, &.btn-quicknext {
      border: none !important;
    }
  }

  :deep(.btn-prev),
  :deep(.btn-next) {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 !important;
    background: $color-white;
    border: 1px solid rgba(0, 0, 0, 0.15);
    border-radius: $border-radius-small;

    &:hover:not([disabled]) {
      border: 1px solid $color-primary;
    }
  }

  .btn-quickprev .el-icon-more {
    //border: none !important;
  }
}
</style>
