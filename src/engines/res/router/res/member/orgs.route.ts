export default [
  {
    path: '/res/member/orgs',
    name: 'resMemberOrgsIndex',
    component: () =>
      import(
        /* webpackChunkName: "resMemberOrgsIndex" */ '@/engines/res/views/res/member/orgs/Index.vue'
      ),
    meta: {
      title: '组织结构',
    },
  },
  {
    path: '/res/member/orgs/:orgId',
    name: 'resMemberOrgsShow',
    component: () =>
      import(
        /* webpackChunkName: "resMemberOrgsShow" */ '@/engines/res/views/res/member/orgs/Show.vue'
      ),
    meta: {
      title: '组织详情',
      menuKey: '/res/member/orgs',
    },
  },
];
