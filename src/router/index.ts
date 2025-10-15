import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('@/views/Dashboard.vue')
  },
  {
    path: '/poems',
    name: 'Poems',
    component: () => import('@/views/Poems.vue')
  },
  {
    path: '/analysis/:id',
    name: 'Analysis',
    component: () => import('@/views/Analysis.vue'),
    props: true
  },
  {
    path: '/chat',
    name: 'Chat',
    component: () => import('@/views/Chat.vue')
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/Profile.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Register.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// 路由守卫 - 检查认证状态
router.beforeEach(async (to, from, next) => {
  try {
    // 获取用户认证状态
    const { supabase } = await import('@/lib/supabase')
    const { data: { user } } = await supabase.auth.getUser()

    // 需要认证的路由
    const authRequired = ['/profile', '/chat'].includes(to.path)
    
    if (authRequired && !user) {
      next('/login')
    } else {
      next()
    }
  } catch (error) {
    console.error('路由守卫错误:', error)
    next()
  }
})

export default router