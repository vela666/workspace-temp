import {
  createRouter,
  createWebHistory,
  // createWebHashHistory
} from 'vue-router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import asyncRoutes from './async-routes';
import constantRoutes from './constant-routes';

const router = createRouter({
  // history: createWebHistory(process.env.VUE_APP_PUBLIC_PATH),
  history: createWebHistory(),
  routes: [...asyncRoutes, ...constantRoutes],
});

// const WHITE_LIST = ['/login', '/share']; // 路由白名单

router.beforeEach(async (to, from, next) => {
  NProgress.start();
  console.log({
    to,
    from
  })
  next();
});

router.afterEach((to) => {
  NProgress.done();
  // document.title = `${to.meta.title} | ${process.env.VUE_APP_META_TITLE}`;
  document.title = `${to.meta.title}`;
});

export default router;
