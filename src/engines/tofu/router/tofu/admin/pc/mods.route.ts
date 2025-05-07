export default [
  {
    path: '/tofu/admin/pc/mods',
    name: 'tofuAdminPcMods.',
    component: () =>
      import(
        /* webpackChunkName: "tofuAdminPcMods." */ '@/engines/tofu/views/tofu/admin/pc/mods/Index.vue'
      ),
    meta: {
      title: '模块配置',
      role: 'admin',
    },
  },
];
