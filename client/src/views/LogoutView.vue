<template>
    <div>
      <p>You have been logged out successfully.</p>
      <router-link to="/login">Go to Login</router-link>
    </div>
  </template>
  
  <script>
  export default {
    created() {
      // Remove the token from localStorage when the user logs out
      localStorage.removeItem('token');
  
      // Redirect the user to the login page
      this.$router.push('/login');
    },
  }
  </script>
  