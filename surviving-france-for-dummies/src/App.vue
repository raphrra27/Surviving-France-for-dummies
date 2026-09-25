<script setup>
import { RouterView } from 'vue-router'
import NavBar from '@/components/Header.vue'
// import { useAuthStore } from '@/stores/auth'
// const auth = useAuthStore() (quand le store sera écrit)
</script>

<template>
  <NavBar  />  <!-- v-if="auth.isLoggedIn" (quand on aura une database) -->
  <RouterView />
</template>
