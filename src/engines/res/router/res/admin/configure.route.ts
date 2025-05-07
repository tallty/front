export default [
  {
    path: '/res/admin/configure',
    name: 'resAdminConfigureIndex',
    component: () =>
      import(
        /* webpackChunkName: "resAdminConfigureIndex" */ '@/engines/res/views/res/admin/configure/Index.vue'
      ),
    meta: {
      title: '类型配置',
      role: 'admin',
    },
  },
];
