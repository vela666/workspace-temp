// 自动加载全局组件
// const modules = import.meta.glob('./*.vue')
// const modules = import.meta.glob('../views/**/**.vue')
// const modules = import.meta.glob('./**/index.vue')
const modules = import.meta.glob('./**/index.vue', {eager: true})
export default function (vm) {
    for (let key in modules) {
        /*  modules[key]().then((mod) => {
            vm.component(componentConfig.default.name, componentConfig.default)
            console.log(mod.default.name)
          })*/
        const componentConfig = modules[key]
      console.log(componentConfig.default.name)
        vm.component(componentConfig.default.name, componentConfig.default)
    }
}
