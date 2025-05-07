export default [
  {
    path: '/bpm/admin/workflows/:workflowId/rules',
    name: 'bpmAdminRulesIndex',
    component: () =>
      import(
        /* webpackChunkName: "bpmAdminRulesIndex" */ '@/engines/bpm/views/bpm/admin/rules/Index.vue'
      ),
    meta: {
      title: 'bpmAdminRulesIndex',
    },
  },
  {
    path: '/bpm/admin/rules/:ruleId',
    name: 'bpmAdminRulesShow',
    component: () =>
      import(
        /* webpackChunkName: "bpmAdminRulesShow" */ '@/engines/bpm/views/bpm/admin/rules/Show.vue'
      ),
    meta: {
      title: 'bpmAdminRulesShow',
    },
  },
];
