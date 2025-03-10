<template>
  <div class="flex items-center justify-center h-screen bg-gray-100">
    <div class="w-full max-w-md p-8 bg-white border border-gray-300 rounded-lg shadow-lg">
      <h2 class="text-2xl font-semibold text-center mb-6">Update Profile</h2>

      <form @submit.prevent="updateProfile">
        <div class="flex justify-center mb-4">
          <img 
            v-if="profileImageUrl" 
            :src="profileImageUrl" 
            alt="Profile Image" 
            class="w-24 h-24 rounded-full border-2 border-gray-300 shadow-sm"
          />
          <input 
            type="file" 
            @change="handleFileUpload" 
            class="mt-2 text-sm text-gray-600"
          />
      </div>
        <!-- Username -->
        <div class="mb-4">
          <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
          <input 
            type="text" 
            id="username" 
            v-model="form.username" 
            placeholder="Enter new username" 
            class="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
          />
        </div>

        <!-- Email -->
        <div class="mb-4">
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input 
            type="email" 
            id="email" 
            v-model="form.email" 
            placeholder="Enter new email" 
            class="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
          />
        </div>

        <!-- Password -->
        <div class="mb-6">
          <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
          <input 
            type="password" 
            id="password" 
            v-model="form.password" 
            placeholder="Enter new password" 
            class="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
          />
        </div>

        <!-- Submit Button -->
        <button 
          type="submit" 
          :disabled="isUpdating" 
          class="w-full py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          {{ isUpdating ? "Updating..." : "Update Profile" }}
        </button>

        <!-- Error and Success Messages -->
        <div v-if="errorMessage" class="text-red-500 text-center mt-4">
          <p>{{ errorMessage }}</p>
        </div>
        <div v-if="successMessage" class="text-green-500 text-center mt-4">
          <p>{{ successMessage }}</p>
        </div>
      </form>

      <!-- Delete Account Section -->
      <button 
        @click="showDeleteModal = true" 
        class="mt-6 w-full py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
      >
        Delete My Account
      </button>

      <!-- Confirmation Modal -->
      <div v-if="showDeleteModal" class="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
        <div class="bg-white p-6 rounded-lg w-96">
          <h3 class="text-xl font-semibold mb-4">Are you sure you want to delete your account?</h3>
          <div class="flex justify-between">
            <button 
              @click="deleteAccount" 
              :disabled="isDeleting"
              class="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
            >
              {{ isDeleting ? "Deleting..." : "Yes, Delete" }}
            </button>
            <button 
              @click="showDeleteModal = false" 
              class="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      <!-- Link to another page, e.g., registration -->
      <p class="text-center mt-4 text-sm">
        Need to change your details? 
        <router-link to="/profile" class="text-blue-500 hover:text-blue-700">Go back to profile</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { AuthService } from '@/services/auth'; // Assuming you have AuthService to handle token logic

export default {
  data() {
    return {
      form: {
        username: '',
        email: '',
        password: ''
      },
      profileImageUrl: '',
      isUpdating: false,
      isDeleting: false, // Tracks deletion state
      errorMessage: '',
      successMessage: '',
      showDeleteModal: false // Controls the visibility of the confirmation modal
    };
  },
  mounted() {
    this.loadUserFromToken(); // Load user data when component is mounted
  },
  methods: {
    async loadUserFromToken() {
      const token = AuthService.getToken();

      if (token) {
        try {
          const decodedToken = AuthService.decodeToken(token); // Assuming AuthService has this method
          this.form.username = decodedToken.username || 'N/A';
          this.form.email = decodedToken.email || 'N/A';
          this.profileImageUrl = decodedToken.profileImageUrl || 'https://dpglam-storage-bucket.s3.ap-southeast-2.amazonaws.com/default-user-icon.jpg';
        } catch (error) {
          this.errorMessage = 'Failed to decode token';
          console.error('Error decoding token:', error);
        }
      } else {
        this.errorMessage = 'No token found';
      }
    },
    handleFileUpload(event) {
      const file = event.target.files[0];

      if (file) {
        const fileSizeMB = file.size / (1024 * 1024); // Convert bytes to MB
        const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];

        if (!allowedTypes.includes(file.type)) {
          this.errorMessage = "Only JPEG, JPG, and PNG formats are allowed.";
          return;
        }

        if (fileSizeMB > 25) {
          this.errorMessage = "File size must be at least 25MB.";
          return;
        }

        this.errorMessage = "";
        this.profileImage = file;
        this.profileImageUrl = URL.createObjectURL(file);
      }
    },
    async updateProfile() {
      this.isUpdating = true;
      this.errorMessage = '';
      this.successMessage = '';

      const formData = new FormData();
      if (this.form.username) formData.append('username', this.form.username);
      if (this.form.email) formData.append('email', this.form.email);
      if (this.form.password) formData.append('password', this.form.password);
      if (this.profileImage) formData.append('profileImage', this.profileImage);

      try {
        const response = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/user/update`, formData, {
          headers: { 
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${AuthService.getToken()}` // Add token here
          }
        });

        this.successMessage = response.data.message;

        if (response.data.profileImageUrl) {
          this.profileImageUrl = response.data.profileImageUrl;
        }
      } catch (error) {
        this.errorMessage = error.response ? error.response.data.error : 'Something went wrong. Please try again.';
      } finally {
        this.isUpdating = false;
      }
    },
    
    async deleteAccount() {
      this.isDeleting = true;
      this.errorMessage = '';
      this.successMessage = '';

      try {
        const token = AuthService.getToken();
        await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/user/delete`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        this.successMessage = "Account successfully deleted. Redirecting to login...";
        
        // Clear token and log out
        AuthService.logout();

        // Redirect after 3 seconds
        setTimeout(() => {
          this.$router.push('/login');
        }, 3000);

      } catch (error) {
        this.errorMessage = error.response ? error.response.data.error : 'Failed to delete account';
      } finally {
        this.isDeleting = false;
        this.showDeleteModal = false;
      }
    }
  }
};
</script>
