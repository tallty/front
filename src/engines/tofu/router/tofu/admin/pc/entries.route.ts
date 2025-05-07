export default [
  {
    path: '/tofu/admin/pc/entries',
    name: 'tofuAdminPcEntries.',
    component: () =>
      import(
        /* webpackChunkName: "tofuAdminPcEntries." */ '@/engines/tofu/views/tofu/admin/pc/entries/Index.vue'
      ),
    meta: {
      title: '导航配置',
      role: 'admin',
    },
  },
];
