<!-- 该组件重写了el-button组件，支持el-button所有用法 -->
<!-- 1、增加了导出excel的功能：父组件通过传递book参数，将表格数据传递给本组件，由本组件负责导出为excel -->
<template>
  <button
      class="el-button"
      @click="handleClick"
      :disabled="buttonDisabled || loading"
      :autofocus="autofocus"
      :type="nativeType"
      :class="[
      type ? 'el-button--' + type : '',
      buttonSize ? 'el-button--' + buttonSize : '',
      {
        'is-disabled': buttonDisabled,
        'is-loading': loading,
        'is-plain': plain,
        'is-round': round,
        'is-circle': circle
      }
    ]"
  >
    <i class="el-icon-loading" v-if="loading"></i>
    <i :class="icon" v-if="icon && !loading"></i>
    <span v-if="$slots.default"><slot></slot></span>
  </button>
</template>

<script setup>
import {
  ref,
  computed,
} from "vue";
import ExcelJS from 'exceljs';
import FileSaver from 'file-saver';
import {
  ElMessage
} from 'element-plus';

const props = defineProps({
  type: {
    type: String,
    default: 'default',
  },
  size: String,
  icon: {
    type: String,
    default: '',
  },
  nativeType: {
    type: String,
    default: 'button',
  },
  loading: Boolean,
  disabled: Boolean,
  plain: Boolean,
  autofocus: Boolean,
  round: Boolean,
  circle: Boolean,
  book: {
    type: Object,
    default() {
      return {
        fileName: '',
        sheets: [
          {
            sheetName: '',
            sheetData: [[], [], []],
          },
        ],
      };
    },
  },
})
const emit = defineEmits(['click'])
const buttonSize = computed(() => {
  return props.size;
})
const buttonDisabled = computed(() => {
  return props.disabled
})
const workbook = ref({})

// el-button原生方法
const handleClick = (evt) => {
  emit('click', evt); // 将click事件传给父组件
  exportToExcel(); // 导出excel
}

// excel导出相关方法
const exportToExcel = () => {
  // 1.创建工作簿
  createWorkBook();
  // 2.创建工作表
  const promise = [];
  props.book.sheets.forEach((sheet) => {
    promise.push(createWorkSheet(sheet.sheetName, sheet.sheetData));
  });
  Promise.all(promise);
  // 3.下载excel表格
  downloadExcel();
}

const createWorkBook = () => {
  workbook.value = new ExcelJS.Workbook();
  workbook.value.created = new Date();
  workbook.value.modified = new Date();
  workbook.value.lastPrinted = new Date();
}

// 设置换行样式
const wrapTextAlignment = {
  vertical: 'middle',
  // horizontal: 'center',
  // 将单元格设置为自动换行
  wrapText: true,
};
const createWorkSheet = (sheetName, sheetData) => {
  const workSheet = workbook.value.addWorksheet(sheetName);
  workSheet.defaultColWidth = 100
  // 将数据添加到工作表中
  sheetData.forEach((rowData) => {
    const row = workSheet.addRow(rowData);
    console.log(row)
    row.eachCell({includeEmpty: true}, (cell) => {
      cell.alignment = wrapTextAlignment;
      // 设置宽度
      // const column = worksheet.getColumn(colIndex + 1);
      // column.width = 20;
    });
  });
  // workSheet.addRows(sheetData);
}
const downloadExcel = async () => {
  try {
    let buffer = await workbook.value.xlsx.writeBuffer()
    FileSaver.saveAs(new Blob([buffer]), `${props.book.fileName}_${Date.now()}.xlsx`);
  } catch (err) {
    ElMessage.error(`excel导出失败，原因为：${err}`);
  }
}
</script>

<style scoped>

</style>
