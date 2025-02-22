<template>
  <v-container class="d-flex flex-column align-center justify-center fill-height">
    <v-card class="pa-8" max-width="400" elevation="10">
      <v-card-title class="text-h5 text-center">Login</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="login">
          <v-text-field 
            v-model="email" 
            label="Email" 
            type="email" 
            required 
            outlined 
            dense 
          ></v-text-field>
          <v-text-field 
            v-model="password" 
            label="Password" 
            type="password" 
            required 
            outlined 
            dense 
          ></v-text-field>
          <v-btn type="submit" color="green" block class="mt-4">Login</v-btn>
        </v-form>
        <v-alert v-if="errorMessage" type="error" class="mt-4">
          {{ errorMessage }}
        </v-alert>
        <p class="text-center mt-4 text-body-2">
          Don't have an account? 
          <router-link to="/register" class="text-decoration-none text-blue">Register here</router-link>
        </p>
      </v-card-text>
    </v-card>
  </v-container>
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
          password: this.password
        });
        if (response.data.token) {
          AuthService.setToken(response.data.token);
          const userRole = AuthService.getUserRole();
          this.$router.push(userRole === 'admin' ? '/dashboard' : '/my-orders');
        } else {
          this.errorMessage = 'Login failed: No token received';
        }
      } catch (error) {
        this.errorMessage = error.response?.data?.error || 'An error occurred';
      }
    }
  }
}
</script>

<style scoped>
/* Ensures full height to center content */
.v-container {
  height: 100vh;
}
.text-blue {
  color: #1976D2;
}
</style>
