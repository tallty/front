export default [
  {
    path: '/res/user/info',
    name: 'resUserInfoShow',
    component: () =>
      import(
        /* webpackChunkName: "resUserInfoShow" */ '@/engines/res/views/res/user/info/Show.vue'
      ),
    meta: {
      title: '个人信息',
    },
  },
];
