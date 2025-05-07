export default [
  {
    path: '/res/admin/books',
    name: 'resAdminBooksIndex',
    component: () =>
      import(
        /* webpackChunkName: "resAdminBooksIndex" */ '@/engines/res/views/res/admin/books/Index.vue'
      ),
    meta: {
      title: '通讯录',
    },
  },
  {
    path: '/res/admin/books/:bookId',
    name: 'resAdminBooksShow',
    component: () =>
      import(
        /* webpackChunkName: "resAdminBooksShow" */ '@/engines/res/views/res/admin/books/Show.vue'
      ),
    meta: {
      title: '通讯录详情',
    },
  },
];
