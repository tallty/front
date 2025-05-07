export default [
  {
    path: '/res/admin/org_identities',
    name: 'resAdminOrgIdentitiesIndex',
    component: () =>
      import(
        /* webpackChunkName: "resAdminOrgIdentitiesIndex" */ '@/engines/res/views/res/admin/org_identities/Index.vue'
      ),
    meta: {
      title: 'resAdminOrgIdentitiesIndex',
      role: 'admin',
    },
  },
];
