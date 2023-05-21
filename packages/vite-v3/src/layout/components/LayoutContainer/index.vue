<template>
  <section class="layout-container" :name="$route.name">
    <router-view #default="{ Component, route }">
<!--      {{fun(Component, route)}}-->
      <keep-alive v-if="$route.meta.keepAlive">
        <component :is="Component" :key="route.path"/>
      </keep-alive>
      <component
        v-else
        :is="Component"
        :key="route.path"/>
    </router-view>
  </section>
</template>

<script>
export default {
  name: 'LayoutContainer',
  setup(){
    const fun = (Component, route) => {
      console.log({
        Component, route
      })
    }
    return {
      fun
    }
  }
}
</script>

<style lang="scss" scoped>
.layout-container {
  flex-grow: 1;
  overflow: hidden;
  padding: 10px $layout-spacing-x $layout-spacing-y;
}
</style>
