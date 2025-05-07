export default [
  {
    path: '/com/admin/private_policies',
    name: 'comAdminPrivatePoliciesIndex',
    component: () =>
      import(
        /* webpackChunkName: "comAdminPrivatePoliciesIndex" */ '@/engines/com/views/com/admin/private_policies/Index.vue'
      ),
    meta: {
      title: '条款',
    },
  },
  {
    path: '/com/admin/private_policies/:private_policyId',
    name: 'comAdminPrivatePoliciesShow',
    component: () =>
      import(
        /* webpackChunkName: "comAdminPrivatePoliciesShow" */ '@/engines/com/views/com/admin/private_policies/Show.vue'
      ),
    meta: {
      title: '条款',
    },
  },
];
