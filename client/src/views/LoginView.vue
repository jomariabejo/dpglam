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

        <v-btn @click="handleGoogleLogin" color="red" block class="mt-4">
          Login using Google
        </v-btn>

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
    };
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
    },
    async handleGoogleLogin() {
      try {
          // Redirect to Google OAuth URL
          window.location.href = `http://localhost:5000/`;
        } catch (error) {
          console.error("Google login error:", error);
        }
      },
      
      async handleGoogleCallback() {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get("token");
        const error = urlParams.get("error");

        if (error) {
          this.errorMessage = error === "EmailNotFound" 
            ? "Your email is not registered in our system." 
            : "Google login failed.";
          return;
        }

        if (!token) {
          this.errorMessage = "Google authentication failed.";
          return;
        }

        // Store token
        AuthService.setToken(token);

        // Get user role from AuthService
        const userRole = AuthService.getUserRole(); 

        // Redirect based on role
        this.$router.push(userRole === "admin" ? "/dashboard" : "/my-orders");
      },
  mounted() {
    // Call this when the page loads (for OAuth callback handling)
    this.handleGoogleCallback(); 
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