export default [
  {
    path: '/permit/admin/users',
    name: 'permitAdminUsersIndex',
    component: () =>
      import(
        /* webpackChunkName: "permitAdminUsersIndex" */ '@/engines/permit/views/permit/admin/users/Index.vue'
      ),
    meta: {
      title: '用户权限',
      role: 'admin',
    },
  },
];
