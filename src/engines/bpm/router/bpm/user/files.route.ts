export default [
  {
    path: '/bpm/user/files/new',
    name: 'bpmUserFilesNew',
    component: () =>
      import(
        /* webpackChunkName: "bpmUserFilesNew" */ '@/engines/bpm/views/bpm/user/files/New.vue'
      ),
    meta: {
      title: '文件上传',
    },
  },
];
