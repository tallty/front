export default [
  {
    path: '/permit/admin/route_settings',
    name: 'permitAdminRouteSettingsIndex',
    component: () =>
      import(
        /* webpackChunkName: "permitAdminRouteSettingsIndex" */ '@/engines/permit/views/permit/admin/route_settings/Index.vue'
      ),
    meta: {
      title: '路由导入配置',
    },
  }
];
