export default [
  {
    path: '/forms/admin/templates',
    name: 'formsAdminTemplatesIndex',
    component: () =>
      import(
        /* webpackChunkName: "formsAdminTemplatesIndex" */ '@/engines/com/views/forms/admin/templates/Index.vue'
      ),
    meta: {
      title: '表单配置',
    },
  },
];
