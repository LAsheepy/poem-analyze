import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: {
      title: '首页'
    }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/Dashboard.vue'),
    meta: {
      title: '工作台'
    }
  },
  {
    path: '/poems',
    name: 'Poems',
    component: () => import('@/views/Poems.vue'),
    meta: {
      title: '诗词解析'
    }
  },
  {
    path: '/analysis/:id',
    name: 'DetailedAnalysis',
    component: () => import('@/views/DetailedAnalysis.vue'),
    meta: {
      title: '诗词解析详情'
    }
  },
  {
    path: '/poems/:id',
    name: 'PoemDetails',
    component: () => import('@/views/DetailedAnalysis.vue'),
    meta: {
      title: '诗词详情'
    }
  },
  {
    path: '/teacher',
    name: 'Teacher',
    component: () => import('@/views/Teacher.vue'),
    meta: {
      title: '教学管理',
      requiresTeacher: true
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  if (to.meta.title) {
    document.title = `${to.meta.title} - 诗韵星`
  }
  
  // 确保路由正常跳转
  if (to.path === from.path && to.name === from.name) {
    // 如果是相同路由，强制刷新
    next({ ...to, replace: true })
  } else {
    next()
  }
})

export default router