import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import TodoView from '../views/TodoView.vue'


const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'todo',
    component: TodoView
  },
  {
    path: '/categories',
    name: 'categories',
    component: () => import('../views/CategoriesView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
