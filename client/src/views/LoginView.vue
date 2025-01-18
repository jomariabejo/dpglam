<template>
  <div class="auth-wrapper">
    <div class="auth-container">
      <h2>Login</h2>
      <form @submit.prevent="login">
        <div class="input-group">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="email" required />
        </div>
        <div class="input-group">
          <label for="password">Password</label>
          <input type="password" id="password" v-model="password" required />
        </div>
        <button type="submit">Login</button>
      </form>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      <p>Don't have an account? <router-link to="/register">Register here</router-link></p>
    </div>
  </div>
</template>

<script>
import { AuthService } from '@/services/auth';
import axios from 'axios'

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
      try {
        const response = await axios.post('http://localhost:5000/api/auth/login', {
          email: this.email,
          password: this.password,
        });
        console.log('Login successful, response:', response);  // Check the full response
        // Check if a token was returned
        if (response.data.token) {
          AuthService.setToken(response.data.token) // Store token in localStorage
          this.$router.push('/products');
        } else {
          this.errorMessage = 'Login failed: No token received';
        }
      } catch (error) {
        console.error('Login error:', error);  // Log the error
        this.errorMessage = error.response?.data?.error || 'An error occurred';
      }
  },
}
}
</script>

<style scoped>
/* Full viewport height for the wrapper */
.auth-wrapper {
  display: flex;
  justify-content: center;  /* Horizontally center */
  align-items: center;      /* Vertically center */
  height: 100vh;            /* Take full viewport height */
}

.auth-container {
  width: 100%;
  max-width: 400px;         /* Max width for the form */
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #fff;   /* Background for form */
}

.input-group {
  margin-bottom: 15px;
}

input {
  width: 100%;
  padding: 8px;
  margin-top: 5px;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #218838;
}

.error {
  color: red;
}

p {
  text-align: center;
}
</style>
