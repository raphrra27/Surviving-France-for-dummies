<script setup>
import { RouterView } from 'vue-router'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
</script>

<template>
  <Header v-if="auth.isAuthenticated" />
  <RouterView />
  <Footer v-if="auth.isAuthenticated" />
</template>
