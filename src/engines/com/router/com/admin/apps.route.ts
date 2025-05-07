export default [
  {
    path: '/com/admin/apps',
    name: 'comAdminAppsIndex',
    component: () =>
      import(
        /* webpackChunkName: "comAdminAppsIndex" */ '@/engines/com/views/com/admin/apps/Index.vue'
      ),
    meta: {
      title: '应用管理',
    },
  },
  {
    path: '/com/admin/apps/:appId',
    name: 'comAdminAppsShow',
    component: () =>
      import(
        /* webpackChunkName: "comAdminAppsShow" */ '@/engines/com/views/com/admin/apps/Show.vue'
      ),
    meta: {
      title: '应用详情',
    },
  },
];
