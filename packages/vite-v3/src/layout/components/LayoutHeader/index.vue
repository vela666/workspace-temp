<template>
  <header class="layout-header" :name="$route.name">
    <LayoutHeaderNav />
<!--    <LayoutHeaderMenu />-->
  </header>
</template>

<script>
import { defineComponent } from 'vue';
import LayoutHeaderNav from '../LayoutHeaderNav';
// import LayoutHeaderMenu from '../LayoutHeaderMenu';

export default defineComponent({
  name: 'LayoutHeader',
  components: {
    LayoutHeaderNav,
    // LayoutHeaderMenu,
  },
});
</script>

<style scoped lang="scss">
.layout-header {
  flex-shrink: 0;
}
</style>
