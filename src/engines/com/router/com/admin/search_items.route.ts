export default [
  {
    path: '/com/admin/search_items',
    name: 'comAdminSearchItemsIndex',
    component: () =>
      import(
        /* webpackChunkName: "comAdminSearchItemsIndex" */ '@/engines/com/views/com/admin/search_items/Index.vue'
      ),
    meta: {
      title: '搜索项',
    },
  },
  {
    path: '/com/admin/search_items/:search_itemId',
    name: 'comAdminSearchItemsShow',
    component: () =>
      import(
        /* webpackChunkName: "comAdminSearchItemsShow" */ '@/engines/com/views/com/admin/search_items/Show.vue'
      ),
    meta: {
      title: 'comAdminSearchItemsShow',
    },
  },
];
