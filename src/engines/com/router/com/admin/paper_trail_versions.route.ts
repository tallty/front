export default [
  {
    path: '/com/admin/paper_trail_versions',
    name: 'comAdminPaperTrailVersionsIndex',
    component: () =>
      import(
        /* webpackChunkName: "comAdminPaperTrailVersionsIndex" */ '@/engines/com/views/com/admin/paper_trail_versions/Index.vue'
      ),
    meta: {
      title: '版本管理',
      role: 'admin',
    },
  },
];
