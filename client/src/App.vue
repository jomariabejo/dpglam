<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { AuthService } from '../src/services/auth' // Import your AuthService

// Simulate a simple login state (this could be managed via Vuex or Pinia)
const isLoggedIn = ref(false) // This would be dynamic based on actual authentication

// Access the current route
const route = useRoute()
const router = useRouter()

// On component mount, check authentication and set the authorization header
onMounted(() => {
  const token = AuthService.getToken() // Retrieve token from localStorage
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}` // Set the header globally
    isLoggedIn.value = true // Mark as logged in if token exists
  }

  // Redirect to home if already logged in and trying to access /login
  if (route.path === '/login' && isLoggedIn.value) {
    router.push('/') // Redirect to the home page (or any other page)
  }
})

</script>

<template>
  <!-- Main content view -->
  <RouterView />
</template>

<style scoped>

</style>
