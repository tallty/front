export default [
  {
    path: '/res/member/departments',
    name: 'resMemberdepartmentsIndex',
    component: () =>
      import(
        /* webpackChunkName: "resMemberdepartmentsIndex" */ '@/engines/res/views/res/member/departments/Index.vue'
      ),
    meta: {
      title: '条线结构',
    },
  },
  {
    path: '/res/member/departments/:departmentId',
    name: 'resMemberdepartmentsShow',
    component: () =>
      import(
        /* webpackChunkName: "resMemberdepartmentsShow" */ '@/engines/res/views/res/member/departments/Show.vue'
      ),
    meta: {
      title: '条线详情',
      menuKey: '/res/member/departments',
    },
  },
];
