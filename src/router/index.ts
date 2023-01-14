import { createRouter, createWebHistory } from 'vue-router';
import type { Router, RouteRecordRaw } from 'vue-router';
import HomeView from '@/views/HomeView.vue';

const history = createWebHistory(import.meta.env.BASE_URL);

export const homeRoute: RouteRecordRaw = {
  name: 'home',
  path: '/',
  component: HomeView,
};

export const aboutRoute: RouteRecordRaw = {
  name: 'about',
  path: '/about',
  component: () => import('@/views/AboutView.vue'),
};

export const routes: RouteRecordRaw[] = [homeRoute, aboutRoute];

const router: Router = createRouter({
  history,
  routes,
});

export default router;
