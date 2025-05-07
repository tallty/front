export default [
  {
    path: '/bpm/stat/workflows',
    name: 'bpmStatWorkflowsIndex',
    component: () =>
      import(
        /* webpackChunkName: "bpmStatWorkflowsIndex" */ '@/engines/bpm/views/bpm/stat/workflows/Index.vue'
      ),
    meta: {
      title: '流速分析',
    },
  },
  {
    path: '/bpm/stat/workflows/:workflowId',
    name: 'bpmStatWorkflowsShow',
    component: () =>
      import(
        /* webpackChunkName: "bpmStatWorkflowsShow" */ '@/engines/bpm/views/bpm/stat/workflows/Show.vue'
      ),
    meta: {
      title: 'bpmStatWorkflowsShow',
      keepTab: true,
    },
  },
];
