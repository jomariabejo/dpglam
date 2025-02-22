<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { AuthService } from '../src/services/auth'
import AdminNavigationBarView from './views/admin/AdminNavigationView.vue'
import CustomerNavigationBarView from './views/customer/CustomerNavigationView.vue'

const isLoggedIn = ref(false)
const isAdmin = ref(false)
const route = useRoute()
const router = useRouter()

// Function to check authentication and role
const checkAuth = async () => {
  const token = AuthService.getToken()
  isLoggedIn.value = !!token

  if (isLoggedIn.value) {
    try {
      // Optional: Validate token with backend before using it
      await axios.get('/api/validate-token', { 
        headers: { Authorization: `Bearer ${token}` } 
      });

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      isAdmin.value = AuthService.isAdmin()
    } catch (error) {
      console.warn("Invalid or expired token, logging out.")
      AuthService.logout()
      isLoggedIn.value = false
      isAdmin.value = false
      console.log(error)
    }
  } else {
    isAdmin.value = false
  }
}

// Run on component mount
onMounted(() => {
  checkAuth()

  if (route.path === '/login' && isLoggedIn.value) {
    router.push('/')
  }
})

// Watch for route changes
watch(route, () => {
  checkAuth()
})
</script>

<template>
  <v-app>
    <!-- Admin Navigation -->
    <AdminNavigationBarView v-if="isLoggedIn && isAdmin && route.path !== '/login'" />

    <!-- Customer Navigation -->
    <CustomerNavigationBarView v-if="isLoggedIn && !isAdmin && route.path !== '/login'" />

    <v-main>
      <RouterView />
    </v-main>
  </v-app>
</template>

<style scoped>
/* No additional styling needed since Vuetify handles layout */
</style>
