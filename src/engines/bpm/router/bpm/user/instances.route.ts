export default [
  {
    path: '/bpm/user/instances',
    name: 'bpmUserInstanceIndex',
    component: () =>
      import(
        /* webpackChunkName: "bpmUserInstanceIndex" */ '@/engines/bpm/views/bpm/user/instances/Index.vue'
      ),
    meta: {
      title: '业务流程',
    },
  },
  {
    path: '/bpm/user/workflows/:workflowId/instances',
    name: 'bpmUserWorkflowInstanceIndex',
    component: () =>
      import(
        /* webpackChunkName: "bpmUserInstanceIndex" */ '@/engines/bpm/views/bpm/user/instances/Index.vue'
      ),
    meta: {
      title: '业务流程',
    },
  },
  {
    path: '/bpm/user/instances/:instanceId/print',
    name: 'bpmUserInstancePrint',
    component: () =>
      import(
        /* webpackChunkName: "bpmUserInstancePrint" */ '@/engines/bpm/views/bpm/user/instances/Print.vue'
      ),
    meta: {
      title: '流程打印',
    },
  },
  {
    path: '/bpm/user/instances/:instanceId',
    name: 'bpmUserInstanceShow',
    component: () =>
      import(
        /* webpackChunkName: "bpmUserInstanceShow" */ '@/engines/bpm/views/bpm/user/instances/Show.vue'
      ),
    meta: {
      title: '流程详情',
    },
  },
];
