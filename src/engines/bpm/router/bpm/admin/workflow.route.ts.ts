export default [
  {
    path: '/bpm/admin/workflows',
    name: 'bpmAdminWorkflowIndex',
    component: () =>
      import(
        /* webpackChunkName: "bpmAdminWorkflowIndex" */ '@/engines/bpm/views/bpm/admin/workflows/Index.vue'
      ),
    meta: {
      title: '工作流',
      role: 'admin',
    },
  },
  {
    path: '/bpm/admin/workflows/new',
    name: 'bpmAdminWorkflowCreate',
    component: () =>
      import(
        /* webpackChunkName: "bpmAdminWorkflowCreate" */ '@/engines/bpm/views/bpm/admin/workflows/Form.vue'
      ),
    meta: {
      title: '创建工作流',
      role: 'admin',
      menuKey: '/bpm/admin/workflows',
    },
  },
  {
    path: '/bpm/admin/workflows/:id/edit',
    name: 'bpmAdminWorkflowEdit',
    component: () =>
      import(
        /* webpackChunkName: "bpmAdminWorkflowEdit" */ '@/engines/bpm/views/bpm/admin/workflows/Form.vue'
      ),
    meta: {
      title: '编辑工作流',
      role: 'admin',
      menuKey: '/bpm/admin/workflows',
    },
  },
  {
    path: '/bpm/admin/workflows/:id',
    name: 'bpmAdminWorkflowShow',
    component: () =>
      import(
        /* webpackChunkName: "bpmAdminWorkflowShow" */ '@/engines/bpm/views/bpm/admin/workflows/Show.vue'
      ),
    meta: {
      title: '工作流详情',
      role: 'admin',
      menuKey: '/bpm/admin/workflows',
    },
  },
];
