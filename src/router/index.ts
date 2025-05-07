import { Component } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import { MenuDataItem } from './typing';
import SwitchLayout from '../layouts/switch-layout.vue';
import useAuth from './useAuth';

const routes: MenuDataItem[] = [];
// 引入 engine 文件夹下文件
const engineRoute = require.context('./../engines/', true, /\.route\.ts$/);

engineRoute.keys().forEach(fileName => {
  const moduleRoutes = engineRoute(fileName).default;
  if (Array.isArray(moduleRoutes)) {
    routes.push(...moduleRoutes);
  }
});

// 引入 router 文件夹下文件
const requireRoute = require.context('.', true, /\.route\.ts$/);

requireRoute.keys().forEach(fileName => {
  const moduleRoutes = requireRoute(fileName).default;
  if (Array.isArray(moduleRoutes)) {
    routes.push(...moduleRoutes);
  }
});

const { checkAuth } = useAuth();

const beforeEntry = (to: any, from: any, next: any) => {
  checkAuth(to.path)
    .then(() => next())
    .catch(() => next('/login'));
};

export const staticRoutes: MenuDataItem[] = [
  {
    name: 'index',
    path: '/',
    redirect: process.env.VUE_APP_HOME_PATH || '/home',
    component: SwitchLayout,
    beforeEnter: [beforeEntry],
    children: [...routes],
  },
  {
    path: '/test/view',
    name: 'test-view',
    meta: { icon: 'HistoryOutlined', title: 'pages.dashboard.welcome.title' },
    component: (): Component => import('@/views/test/view/index.vue'),
  },
  {
    path: '/login',
    meta: { icon: 'HistoryOutlined', title: '登录' },
    component: (): Component => import('@/views/sessions/login.vue'),
  },
  {
    path: '/:pathMatch(.*)',
    component: () => import('@/views/exception/404.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.VUE_APP_PUBLIC_PATH),
  routes: staticRoutes,
});

export default router;
