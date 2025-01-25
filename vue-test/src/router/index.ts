import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { verifyAuth } from '@/service/authenticationService'

const routes: RouteRecordRaw[] = [
 {
   path: '/',
   name: 'Login',
   component: () => import('../pages/LoginPage.vue')
 },
 {
   path: '/home',
   name: 'Home',
   component: () => import('../pages/HomePage.vue'),
 }
]

const router = createRouter({
 history: createWebHistory(),
 routes
})

router.beforeEach(async (to, from, next) => {
 const isAuthenticated = await verifyAuth()
 
 if (to.path === '/' && isAuthenticated) {
   next('/home')
 } else if (to.path !== '/' && !isAuthenticated) {
   next('/')
 } else {
   next()
 }
})

export default router;