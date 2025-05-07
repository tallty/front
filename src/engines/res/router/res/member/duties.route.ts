export default [
  {
    path: '/res/member/duties',
    name: 'resMemberDutiesIndex',
    component: () =>
      import(
        /* webpackChunkName: "resMemberDutiesIndex" */ '@/engines/res/views/res/member/duties/Index.vue'
      ),
    meta: {
      title: 'resMemberDutiesIndex',
    },
  },
  {
    path: '/res/member/duties/:dutyId',
    name: 'resMemberDutiesShow',
    component: () =>
      import(
        /* webpackChunkName: "resMemberDutiesShow" */ '@/engines/res/views/res/member/duties/Show.vue'
      ),
    meta: {
      title: 'resMemberDutiesShow',
    },
  },
];
