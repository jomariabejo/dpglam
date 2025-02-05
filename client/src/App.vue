<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { AuthService } from '../src/services/auth' // Import your AuthService
import AdminNavigationBarView from './views/admin/AdminNavigationView.vue'
import CustomerNavigationBarView from './views/customer/CustomerNavigationView.vue'

const isLoggedIn = ref(false) // Tracks login status
const isAdmin = ref(false) // Tracks admin status
const route = useRoute()
const router = useRouter()

// Function to check authentication and role
const checkAuth = () => {
  const token = AuthService.getToken() // Retrieve token from localStorage
  isLoggedIn.value = !!token // Convert token existence to boolean

  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}` // Set authorization header
    isAdmin.value = AuthService.isAdmin() // Check if user is admin
  }
}

// Run on component mount
onMounted(() => {
  checkAuth()

  // Redirect logged-in users away from login page
  if (route.path === '/login' && isLoggedIn.value) {
    router.push('/')
  }
})

// Watch for route changes to re-evaluate authentication
watch(route, () => {
  checkAuth()
})
</script>

<template>
  <!-- Show Admin Navigation if the user is an admin -->
  <AdminNavigationBarView v-if="isLoggedIn && isAdmin && route.path !== '/login'" />

  <!-- Show Customer Navigation if the user is not an admin -->
  <CustomerNavigationBarView v-if="isLoggedIn && !isAdmin && route.path !== '/login'" />

  <RouterView />
</template>

<style scoped>
</style>
