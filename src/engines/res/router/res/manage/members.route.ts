export default [
  {
    path: '/res/manage/member_identities/:memberIdentityId/members',
    name: 'resManageMemberIndex',
    component: () =>
      import(
        /* webpackChunkName: "resManageMemberIndex" */ '@/engines/res/views/res/manage/members/Index.vue'
      ),
    meta: {
      title: '人员管理',
    },
  },
];
