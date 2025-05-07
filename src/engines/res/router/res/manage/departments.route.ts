export default [
  {
    path: '/res/manage/departments',
    name: 'resManageDepartmentsIndex',
    component: () => import(/* webpackChunkName: "resManageDepartmentsIndex" */ '@/engines/res/views/res/manage/departments/Index.vue'),
    meta: {
      title: 'resManageDepartmentsIndex',
    },
  },
  {
    path: '/res/manage/departments/:departmentId',
    name: 'resManageDepartmentsShow',
    component: () => import(/* webpackChunkName: "resManageDepartmentsShow" */ '@/engines/res/views/res/manage/departments/Show.vue'),
    meta: {
      title: 'resManageDepartmentsShow',
    },
  },
];
