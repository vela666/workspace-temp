export default [
  /*  {
      path: '/401',
      name: 'Exception401',
      meta: {
        title: '401 Unauthorized',
        parentId: [],
      },
      component: () => import(/!* webpackChunkName: "exception" *!/ '@views/exception/401'),
    },
    {
      path: '/403',
      name: 'Exception403',
      meta: {
        title: '403 Forbidden',
        parentId: [],
      },
      component: () => import(/!* webpackChunkName: "exception" *!/ '@views/exception/403'),
    },*/
  {
    path: '/404',
    name: 'error404',
    replace: false,
    meta: {
      title: '页面不存在',
    },
    component: () => import(/* webpackChunkName: "error404" */ '@/views/404'),
  },
  /*{
    path: '/500',
    name: 'Exception500',
    meta: {
      title: '500 Server Error',
      parentId: [],
    },
    component: () => import(/!* webpackChunkName: "exception" *!/ '@views/exception/500'),
  },*/
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    redirect: '/404',
  },
];
