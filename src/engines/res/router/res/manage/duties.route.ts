export default [
  {
    path: '/res/manage/duties',
    name: 'resManageDutiesIndex',
    component: () => import(/* webpackChunkName: "resManageDutiesIndex" */ '@/engines/res/views/res/manage/duties/Index.vue'),
    meta: {
      title: 'resManageDutiesIndex',
    },
  },
  {
    path: '/res/manage/duties/:dutyId',
    name: 'resManageDutiesShow',
    component: () => import(/* webpackChunkName: "resManageDutiesShow" */ '@/engines/res/views/res/manage/duties/Show.vue'),
    meta: {
      title: 'resManageDutiesShow',
    },
  },
];
