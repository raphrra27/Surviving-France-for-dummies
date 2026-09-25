import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import HomeView from '../views/HomeView.vue'
import Articles from '../views/Articles.vue'
import Map from '../views/Map.vue'
import Quiz from '../views/Quiz.vue'
import Ranking from '../views/Ranking.vue'
import Profil from '../views/Profil.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'Home', component: HomeView },
    { path: '/Login', name: 'Login', component: Login },
    { path: '/Register', name: 'Register', component: Register },
    { path: '/article', name: 'Articles', component: Articles },
    { path: '/map', name: 'Map', component: Map },
    { path: '/quiz', name: 'Quiz', component: Quiz },
    { path: '/ranking', name: 'Ranking', component: Ranking },
    { path: '/profil', name: 'Profil', component: Profil },
  ],
})

router.beforeEach((to) => {
  const isAuthenticated = !!localStorage.getItem('token')
  if (to.meta.requiresAuth && !isAuthenticated) {
    return '/login'
  }
})

export default router
