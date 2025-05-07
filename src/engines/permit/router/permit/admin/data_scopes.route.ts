export default [
  {
    path: '/permit/admin/data_scopes',
    name: 'permitAdminDataScopesIndex',
    component: () =>
      import(
        /* webpackChunkName: "permitAdminDataScopesIndex" */ '@/engines/permit/views/permit/admin/data_scopes/Index.vue'
      ),
    meta: {
      title: '数据权限',
    },
  },
  {
    path: '/permit/admin/data_scopes/:data_scopeId',
    name: 'permitAdminDataScopesShow',
    component: () =>
      import(
        /* webpackChunkName: "permitAdminDataScopesShow" */ '@/engines/permit/views/permit/admin/data_scopes/Show.vue'
      ),
    meta: {
      title: 'permitAdminDataScopesShow',
    },
  },
];
