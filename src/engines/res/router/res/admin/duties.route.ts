export default [
  {
    path: '/res/admin/members',
    name: 'resAdminMembersIndex',
    component: () =>
      import(
        /* webpackChunkName: "resAdminMembersIndex" */ '@/engines/res/views/res/admin/members/Index.vue'
      ),
    meta: {
      title: '人员管理',
      role: 'admin',
    },
  },
];
