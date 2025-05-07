export default [
  {
    path: '/res/admin/org_members',
    name: 'resAdminOrgMembersIndex',
    component: () =>
      import(
        /* webpackChunkName: "resAdminOrgMembersIndex" */ '@/engines/res/views/res/admin/org_members/Index.vue'
      ),
    meta: {
      title: '企业认证',
      role: 'admin',
    },
  },
];
