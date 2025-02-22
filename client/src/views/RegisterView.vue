<template>
  <v-container class="d-flex flex-column align-center justify-center fill-height">
    <v-card class="pa-8" max-width="400" elevation="10">
      <v-card-title class="text-h5 text-center">Register</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="register">
          <v-text-field 
            v-model="username" 
            label="Username" 
            required 
            outlined 
            dense
          ></v-text-field>
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
          <v-text-field 
            v-model="confirmPassword" 
            label="Confirm Password" 
            type="password" 
            required 
            outlined 
            dense
          ></v-text-field>
          <v-btn type="submit" color="green" block class="mt-4">Register</v-btn>
        </v-form>
        <v-alert v-if="errorMessage" type="error" class="mt-4">
          {{ errorMessage }}
        </v-alert>
        <p class="text-center mt-4 text-body-2">
          Already have an account? 
          <router-link to="/login" class="text-decoration-none text-blue">Login here</router-link>
        </p>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      username: '',
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
        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/register`, {
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

</style>
