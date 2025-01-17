<template>
  <div class="auth-wrapper">
    <div class="auth-container">
      <h2>Register</h2>
      <form @submit.prevent="register">
        <div class="input-group">
          <label for="username">Username</label>
          <input type="username" id="username" v-model="username" required />
        </div>
        <div class="input-group">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="email" required />
        </div>
        <div class="input-group">
          <label for="password">Password</label>
          <input type="password" id="password" v-model="password" required />
        </div>
        <div class="input-group">
          <label for="confirmPassword">Confirm Password</label>
          <input type="password" id="confirmPassword" v-model="confirmPassword" required />
        </div>
        <button type="submit">Register</button>
      </form>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      <p>Already have an account? <router-link to="/login">Login here</router-link></p>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      email: '',
      password: '',
      confirmPassword: '',
      errorMessage: '',
    }
  },
  methods: {
    async register() {
      if (this.password !== this.confirmPassword) {
        this.errorMessage = 'Passwords do not match!'
        return
      }

      try {
        await axios.post('http://localhost:5000/api/auth/register', {
          username: this.username,
          email: this.email,
          password: this.password,
        })

        // Redirect to login after successful registration
        this.$router.push('/login')
      } catch (error) {
        this.errorMessage = error.response?.data?.error || 'An error occurred'
      }
    },
  },
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
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

.error {
  color: red;
}

p {
  text-align: center;
}
</style>
