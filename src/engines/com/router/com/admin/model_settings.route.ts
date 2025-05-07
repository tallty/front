export default [
  {
    path: '/com/admin/model_settings',
    name: 'comAdminModelSettingsIndex',
    component: () =>
      import(
        /* webpackChunkName: "comAdminModelSettingsIndex" */ '@/engines/com/views/com/admin/model_settings/Index.vue'
      ),
    meta: {
      title: '业务模型配置',
      role: 'admin',
    },
  },
];
