export default [
  {
    path: '/bpm/user/workflows',
    name: 'bpmUserWorkflowIndex',
    component: () =>
      import(
        /* webpackChunkName: "bpmUserWorkflowIndex" */ '@/engines/bpm/views/bpm/user/workflows/Index.vue'
      ),
    meta: {
      title: '工作流',
    },
  },
  {
    path: '/bpm/user/workflows/:workflowId',
    name: 'bpmUserWorkflowShow',
    component: () =>
      import(
        /* webpackChunkName: "bpmUserWorkflowShow" */ '@/engines/bpm/views/bpm/user/workflows/Show.vue'
      ),
    meta: {
      title: '工作流详情',
      menuKey: '/workflow',
    },
  },
];
