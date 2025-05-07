export default [
  {
    path: '/bpm/admin/catalogs',
    name: 'bpmAdminCatalogsIndex',
    component: () =>
      import(
        /* webpackChunkName: "bpmAdminCatalogsIndex" */ '@/engines/bpm/views/bpm/admin/catalogs/Index.vue'
      ),
    meta: {
      title: '流程分类',
      role: 'admin',
    },
  },
  {
    path: '/bpm/admin/catalogs/:catalogId',
    name: 'bpmAdminCatalogsShow',
    component: () =>
      import(
        /* webpackChunkName: "bpmAdminCatalogsShow" */ '@/engines/bpm/views/bpm/admin/catalogs/Show.vue'
      ),
    meta: {
      title: '流程分类详情',
      role: 'admin',
    },
  },
];
