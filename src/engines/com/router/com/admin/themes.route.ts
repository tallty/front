export default [
  {
    path: '/com/admin/apps/:appId/themes',
    name: 'comAdminThemesIndex',
    component: () =>
      import(
        /* webpackChunkName: "comAdminThemesIndex" */ '@/engines/com/views/com/admin/themes/Index.vue'
      ),
    meta: {
      title: 'comAdminThemesIndex',
      role: 'admin',
    },
  },
  {
    path: '/com/admin/apps/:appId/themes/:themeId',
    name: 'comAdminThemesShow',
    component: () =>
      import(
        /* webpackChunkName: "comAdminThemesShow" */ '@/engines/com/views/com/admin/themes/Show.vue'
      ),
    meta: {
      title: 'comAdminThemesShow',
      role: 'admin',
    },
  },
];
