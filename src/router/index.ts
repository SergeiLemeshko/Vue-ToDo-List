import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import CategoriesView from '../views/CategoriesView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'categories',
    component: CategoriesView
  },
  {
    path: '/todo',
    name: 'todo',
    component: () => import('../views/TodoView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
