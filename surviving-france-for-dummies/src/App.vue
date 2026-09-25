<script setup>
import { RouterView } from 'vue-router'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
// import { useAuthStore } from '@/stores/auth'
// const auth = useAuthStore()
</script>

<template>
  <Header  />  <!-- v-if="auth.isLoggedIn" (quand on aura une database) -->
  <RouterView />
  <Footer /> <!-- pareil pour lui  -->
</template>
