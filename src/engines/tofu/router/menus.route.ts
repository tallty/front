export default [
  {
    path: '/menus/:menuId',
    name: 'menus',
    component: () => import(/* webpackChunkName: "menus" */ '@/engines/tofu/views/menus/Index.vue'),
    meta: {
      title: '模块列表',
    },
  },
];
