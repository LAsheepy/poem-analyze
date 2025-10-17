import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Dashboard',
    component: () => import(/* webpackChunkName: "dashboard" */ '@/views/Dashboard.vue')
  },
  {
    path: '/poems',
    name: 'Poems',
    component: () => import(/* webpackChunkName: "poems" */ '@/views/Poems.vue')
  },
  {
    path: '/analysis/:id',
    name: 'Analysis',
    component: () => import(/* webpackChunkName: "analysis" */ '@/views/Analysis.vue'),
    props: true
  },
  {
    path: '/poet-profile',
    name: 'PoetProfile',
    component: () => import(/* webpackChunkName: "poet-profile" */ '@/views/PoetProfile.vue')
  },

  {
    path: '/profile',
    name: 'Profile',
    component: () => import(/* webpackChunkName: "profile" */ '@/views/Profile.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "auth" */ '@/views/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import(/* webpackChunkName: "auth" */ '@/views/Register.vue')
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import(/* webpackChunkName: "settings" */ '@/views/Settings.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import(/* webpackChunkName: "notfound" */ '@/views/NotFound.vue')
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
    const authRequired = ['/profile'].includes(to.path)
    
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