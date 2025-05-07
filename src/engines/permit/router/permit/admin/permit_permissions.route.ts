export default [
  {
    path: '/permit/admin/permissions',
    name: 'permitAdminPermitPermissionsIndex',
    component: () =>
      import(
        /* webpackChunkName: "permitAdminPermitPermissionsIndex" */ '@/engines/permit/views/permit/admin/permit_permissions/Index.vue'
      ),
    meta: {
      title: '权限动作列表',
    },
  },
  {
    path: '/permit/admin/permissions/:permit_permissionId',
    name: 'permitAdminPermitPermissionsShow',
    component: () =>
      import(
        /* webpackChunkName: "permitAdminPermitPermissionsShow" */ '@/engines/permit/views/permit/admin/permit_permissions/Show.vue'
      ),
    meta: {
      title: 'permitAdminPermitPermissionsShow',
    },
  },
];
