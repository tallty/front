export default [
  {
    path: '/bpm/rule_stat/workflows/:workflowId/rules',
    name: 'bpmRuleStatRulesIndex',
    component: () =>
      import(
        /* webpackChunkName: "bpmRuleStatRulesIndex" */ '@/engines/bpm/views/bpm/rule_stat/rules/Index.vue'
      ),
    meta: {
      title: '流速',
    },
  },
  {
    path: '/bpm/rule_stat/rules/:ruleId',
    name: 'bpmRuleStatRulesShow',
    component: () =>
      import(
        /* webpackChunkName: "bpmRuleStatRulesShow" */ '@/engines/bpm/views/bpm/rule_stat/rules/Show.vue'
      ),
    meta: {
      title: 'bpmRuleStatRulesShow',
    },
  },
];
