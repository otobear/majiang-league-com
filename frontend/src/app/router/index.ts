import { createRouter, createWebHistory } from 'vue-router'
import { DefaultLayout } from '@/shared/ui/layouts'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/players',
    },
    {
      path: '/players',
      component: () => import('@/pages/player-list'),
      meta: {
        layout: DefaultLayout,
      },
    },
    {
      path: '/players/:id',
      name: 'player',
      component: () => import('@/pages/player'),
      meta: {
        layout: DefaultLayout,
      },
    },
    {
      path: '/tournaments',
      component: () => import('@/pages/tournament-list'),
      meta: {
        layout: DefaultLayout,
      },
    },
    {
      path: '/tournaments/:id',
      name: 'tournament',
      component: () => import('@/pages/tournament'),
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
