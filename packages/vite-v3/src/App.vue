<template>
  <router-view></router-view>
</template>

<script>
export default {
  name: 'App'
}
</script>
<style>

</style>
<style scoped>
/*https://juejin.cn/post/7160445097388179487#comment*/
/* .red 选择器将作用于全局 */
/*全局选择器*/
/*:global(.red) {
  color: red;
}
!*插槽选择器*!
 !* .red 选择器将作用于 <slot /> 渲染出来的内容 *!
:slotted(.red) {
  color: red;
}*/
</style>
