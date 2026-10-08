import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import HomeView from '../views/HomeView.vue'
import Articles from '../views/Articles.vue'
import ArticleDiscover from '../views/ArticleDiscover.vue'
import Map from '../views/Map.vue'
import Quiz from '../views/Quiz.vue'
import Ranking from '../views/Ranking.vue'
import Profil from '../views/Profil.vue'
import AboutUs from '../views/AboutUs.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/Login' },
    { path: '/HomeView', name: 'Home', component: HomeView, meta: { requiresAuth: true } },
    { path: '/Login', name: 'Login', component: Login, meta: { guestOnly: true } },
    { path: '/Register', name: 'Register', component: Register, meta: { guestOnly: true } },
    { path: '/article', name: 'Articles', component: Articles, meta: { requiresAuth: true } },
    { path: '/article/:slug', name: 'ArticleDiscover', component: ArticleDiscover, meta: { requiresAuth: true } },
    { path: '/map', name: 'Map', component: Map, meta: { requiresAuth: true } },
    { path: '/quiz', name: 'Quiz', component: Quiz, meta: { requiresAuth: true } },
    { path: '/ranking', name: 'Ranking', component: Ranking, meta: { requiresAuth: true } },
    { path: '/profil', name: 'Profil', component: Profil, meta: { requiresAuth: true } },
    { path: '/aboutus', name: 'AboutUs', component: AboutUs },
  ],
})

router.beforeEach((to) => {
  const isAuthenticated = !!localStorage.getItem('token')
  if (to.meta.requiresAuth && !isAuthenticated) {
    return '/login'
  }
  if (to.meta.guestOnly && isAuthenticated) {
    return '/HomeView'
  }
})

export default router
