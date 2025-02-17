<template>
  <div class="flex items-center justify-center h-screen bg-gray-100">
    <div class="w-full max-w-md p-8 bg-white border border-gray-300 rounded-lg shadow-lg">
      <h2 class="text-2xl font-semibold text-center mb-6">Login</h2>
      <form @submit.prevent="login">
        <div class="mb-4">
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input type="email" id="email" v-model="email" required 
                 class="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div class="mb-6">
          <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
          <input type="password" id="password" v-model="password" required 
                 class="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <button type="submit" 
                class="w-full py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400">
          Login
        </button>
      </form>
      <p v-if="errorMessage" class="text-red-500 text-center mt-4">{{ errorMessage }}</p>
      <p class="text-center mt-4 text-sm">
        Don't have an account? 
        <router-link to="/register" class="text-blue-500 hover:text-blue-700">Register here</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import { AuthService } from '@/services/auth';
import axios from 'axios';

export default {
  data() {
    return {
      email: '',
      password: '',
      errorMessage: '',
    }
  },
  methods: {
    async login() {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

      try {
        const response = await axios.post(`${API_BASE_URL}/login`, {
          email: this.email,
          password: this.password,
          profileImageUrl: this.profileImageUrl
        });
        console.log('Login successful, response:', response);  // Check the full response
        // Check if a token was returned
        if (response.data.token) {
          AuthService.setToken(response.data.token) // Store token in localStorage
          const userRole = AuthService.getUserRole()

          if(userRole === 'admin') {
            this.$router.push("/dashboard")
          }
          else {
            this.$router.push("/my-orders")
          }
          
          console.log("User role is " + userRole)
        } else {
          this.errorMessage = 'Login failed: No token received';
        }
      } catch (error) {
        console.error('Login error:', error);  // Log the error
        this.errorMessage = error.response?.data?.error || 'An error occurred';
      }
    }
  }
}
</script>

<style scoped>
/* No additional custom styles needed as Tailwind handles all the design */
</style>
