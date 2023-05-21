<template>
  <ExportToExcelButton
    type="primary"
    :book="book"
  >
    导出excel
  </ExportToExcelButton>
</template>

<script setup>
import {
  ref
} from 'vue';
import ExportToExcelButton from './components/ExportToExcelButton'
const book = ref({
  fileName: 'Demo',
  sheets: [
    {
      sheetName: 'sheet1',
      sheetData: [
        ['2023-05-21\n2023-05-28', 'A2', 'A3'],
        ['A2', 'B2'],
        ['A3', 'B3', 'C3'],
      ],
    },
    {
      sheetName: 'sheet2',
      sheetData: [
        ['A1', 'B1', 'C1'],
        ['A2', 'B2'],
        ['A3'],
      ],
    },
  ],
})

</script>

<style scoped>

</style>
