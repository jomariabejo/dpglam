<template>
    <div class="flex items-center justify-center h-screen bg-gray-100">
      <div class="w-full max-w-md p-8 bg-white border border-gray-300 rounded-lg shadow-lg">
        <h2 class="text-2xl font-semibold text-center mb-6">My Profile</h2>
  
        <!-- Profile Details -->
        <div class="mb-6">
          <div class="flex items-center justify-between mb-4">
            <span class="text-sm font-medium text-gray-700">Username:</span>
            <span class="text-lg text-gray-800">{{ username }}</span>
          </div>
          <div class="flex items-center justify-between mb-4">
            <span class="text-sm font-medium text-gray-700">Email:</span>
            <span class="text-lg text-gray-800">{{ email }}</span>
          </div>
        </div>
  
        <!-- Update Profile Section -->
        <div class="mb-6">
          <h3 class="text-lg font-semibold text-gray-700 mb-4">Update Profile</h3>
          <div class="space-y-4">
            <div>
              <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
              <input type="text" id="username" v-model="username" required 
                     class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" id="email" v-model="email" required 
                     class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <button @click="updateProfile" 
                    class="w-full py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-blue-400">
              Update Profile
            </button>
          </div>
        </div>
  
        <!-- Account Deletion Section -->
        <div class="mt-6">
          <h3 class="text-lg font-semibold text-gray-700 mb-4">Delete Account</h3>
          <button @click="deleteAccount" 
                  class="w-full py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400">
            Delete Account
          </button>
        </div>
  
        <!-- Error and Success Messages -->
        <p v-if="errorMessage" class="text-red-500 text-center mt-4">{{ errorMessage }}</p>
        <p v-if="successMessage" class="text-green-500 text-center mt-4">{{ successMessage }}</p>
      </div>
    </div>
  </template>
  
  <script>
  import { AuthService } from '@/services/auth';
  
  export default {
    data() {
      return {
        username: '',
        email: '',
        errorMessage: '',
        successMessage: '',
      };
    },
    mounted() {
      this.loadUserFromToken();
    },
    methods: {
    loadUserFromToken() {
      const token = AuthService.getToken();

      if (token) {
        try {
          const decodedToken = AuthService.decodeToken(token); // Assuming AuthService has this method
          this.username = decodedToken.username || 'N/A';
          this.email = decodedToken.email || 'N/A';
        } catch (error) {
          this.errorMessage = 'Failed to decode token';
          console.error('Error decoding token:', error);
        }
      } else {
        this.errorMessage = 'No token found';
      }
    }
,
  
      // Update user profile data
      async updateProfile() {
        // Add logic for updating the profile
      },
  
      // Delete user account
      async deleteAccount() {
        // Add logic for deleting the account
      }
    }
  };
  </script>
  
  <style scoped>
  /* Tailwind handles the design, but you can add custom styles here if needed */
  </style>
  