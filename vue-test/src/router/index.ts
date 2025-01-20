
import { createRouter, createWebHistory } from 'vue-router'

import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
    {
      path: '/',
      name: 'Login',
      component: () => import('../pages/LoginPage.vue')
    },
    {
      path: '/home',
      name: 'Home',
      component: () => import('../pages/HomePage.vue')
    }
  ]
  
  const router = createRouter({
    history: createWebHistory(),
    routes
  })
  
  export default router