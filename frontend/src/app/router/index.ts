import { createRouter, createWebHistory } from 'vue-router'
import { DefaultLayout } from '@/shared/ui/layouts'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/pages/home'),
      meta: {
        layout: DefaultLayout,
      },
    },
    {
      path: '/players',
      component: () => import('@/pages/player-list'),
      meta: {
        layout: DefaultLayout,
      },
    },
    {
      path: '/player/:id',
      name: 'player',
      component: () => import('@/pages/player'),
      meta: {
        layout: DefaultLayout,
      },
    },
    {
      path: '/results',
      component: () => import('@/pages/results'),
      meta: {
        layout: DefaultLayout,
      },
    },
  ],
})

router.beforeEach((to, from, next) => {
  // Add any global navigation guards here if needed
  next()
})

export default router
