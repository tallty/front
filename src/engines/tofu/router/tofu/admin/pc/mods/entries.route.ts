export default [
  {
    path: '/tofu/admin/pc/mods/:modId/entries',
    name: 'tofuAdminPcModsEntries.',
    component: () =>
      import(
        /* webpackChunkName: "tofuAdminPcModsEntries." */ '@/engines/tofu/views/tofu/admin/pc/mods/entries/Index.vue'
      ),
    meta: {
      title: '模块导航配置',
      role: 'admin',
    },
  },
];
