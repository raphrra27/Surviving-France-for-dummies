<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

function logout() {
  auth.logout()
  router.push('/Login')
}
</script>

<template>
  <div class="home-page">
    <h1>Index page</h1>
    <button type="button" @click="logout">Log out (test)</button>
  </div>
</template>
