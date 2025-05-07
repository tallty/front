export default [
  {
    path: '/res/manage/users',
    name: 'resManageUsersIndex',
    component: () => import(/* webpackChunkName: "resManageUsersIndex" */ '@/engines/res/views/res/manage/users/Index.vue'),
    meta: {
      title: 'resManageUsersIndex',
    },
  },
  {
    path: '/res/manage/users/:userId',
    name: 'resManageUsersShow',
    component: () => import(/* webpackChunkName: "resManageUsersShow" */ '@/engines/res/views/res/manage/users/Show.vue'),
    meta: {
      title: 'resManageUsersShow',
    },
  },
];
