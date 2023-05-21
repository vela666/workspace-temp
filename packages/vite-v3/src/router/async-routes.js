// import Layout from "@layout";
import Layout from "@/layout/index.vue";

export default [
/*  {
    path: "/",
    name: "Home",
    meta: {
      title: "首页",
      keepAlive: true,
      menu_id: "0da4b12d84e64764ad3a34d297f799063",
      parentId: []
    },
    component: Layout,
    // redirect: "/md",
    redirect: {
      name: 'Md'
    },
    children: [{
      path: "/md",
      name: "Md",
      meta: {
        title: "md转vue组件",
        keepAlive: true,
        menu_id: "7e79440386a0416d8e80d03c794b3a355",
        parentId: ["0da4b12d84e64764ad3a34d297f799063"]
      },
      component: () => import(/!* webpackChunkName: "md" *!/ '@/views/md转vue组件'),
    }]
  },*/
  {
    path: "/",
    name: "Func",
    meta: {
      title: "常见功能",
      keepAlive: true,
      menu_id: "0da4b12d84e64764ad3a34d22",
      parentId: []
    },
    component: Layout,
    redirect: {
      name: "LimitTableChoices"
    },
    children: [
      {
        path: "/limit-table-choices",
        name: "LimitTableChoices",
        meta: {
          title: "表格选择数量限制",
          keepAlive: true,
          menu_id: "7e79440386a0416d8e80d03tt",
          parentId: ["0da4b12d84e64764ad3a34d22"]
        },
        component: () => import(/* webpackChunkName: "LimitTableChoices" */ '@/views/func/LimitTableChoices'),
      },
      {
        path: "/select-across-pages1",
        name: "SelectAcrossPages",
        meta: {
          title: "表格跨页选择",
          keepAlive: true,
          menu_id: "7e79440386a0416d8e80d053tt",
          parentId: ["0da4b12d84e64764ad3a34d22"]
        },
        component: () => import(/* webpackChunkName: "SelectAcrossPages1" */ '@/views/func/SelectAcrossPages1'),
      },
      {
        path: "/select-across-pages2",
        name: "SelectAcrossPages2",
        meta: {
          title: "跨页选择2",
          keepAlive: true,
          menu_id: "7e79440386a0416d8e80d053hh",
          parentId: ["0da4b12d84e64764ad3a34d22"]
        },
        component: () => import(/* webpackChunkName: "SelectAcrossPages2" */ '@/views/func/SelectAcrossPages2'),
      },
      {
        path: "/export-to-excel",
        name: "ExportToExcel",
        meta: {
          title: "导出excel",
          keepAlive: true,
          menu_id: "7e79440386a0416d8e80d03y",
          parentId: ["0da4b12d84e64764ad3a34d22"]
        },
        component: () => import(/* webpackChunkName: "ExportToExcel" */ '@/views/func/ExportToExcel'),
      },
      {
        path: "/side-nav-bar",
        name: "SideNavBar",
        meta: {
          title: "页面侧边导航栏",
          keepAlive: true,
          menu_id: "7e79440386a0416d8e80d03rtty",
          parentId: ["0da4b12d84e64764ad3a34d22"]
        },
        component: () => import(/* webpackChunkName: "SideNavBar" */ '@/views/func/SideNavBar'),
      },
    ]
  },
];
