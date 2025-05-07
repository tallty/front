export default [
  {
    path: '/bpm/rule_stat/workflows',
    name: 'bpmRuleStatWorkflowsIndex',
    component: () => import(/* webpackChunkName: "bpmRuleStatWorkflowsIndex" */ '@/engines/bpm/views/bpm/rule_stat/workflows/Index.vue'),
    meta: {
      title: '流速分析',
    },
  },
  {
    path: '/bpm/rule_stat/workflows/:workflowId',
    name: 'bpmRuleStatWorkflowsShow',
    component: () => import(/* webpackChunkName: "bpmRuleStatWorkflowsShow" */ '@/engines/bpm/views/bpm/rule_stat/workflows/Show.vue'),
    meta: {
      title: 'bpmRuleStatWorkflowsShow',
    },
  },
];
