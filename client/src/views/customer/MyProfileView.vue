<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4">
    <div class="w-full max-w-md bg-white shadow-2xl rounded-xl overflow-hidden">
      <div class="bg-green-500 text-white p-6 text-center">
        <h2 class="text-2xl font-bold">Update Profile</h2>
      </div>
      
      <form @submit.prevent="updateProfile" class="p-6 space-y-6">
        <!-- Profile Image Upload -->
        <div class="flex flex-col items-center">
          <div class="relative">
            <img 
              :src="profileImageUrl || 'https://dpglam-storage-bucket.s3.ap-southeast-2.amazonaws.com/default-user-icon.jpg'" 
              alt="Profile" 
              class="w-32 h-32 rounded-full object-cover border-4 border-blue-300 shadow-lg mb-4"
            />
            <label 
              class="absolute bottom-0 right-0 bg-green-500 text-white rounded-full p-2 cursor-pointer hover:bg-green-600 transition-colors"
            >
              <input 
                type="file" 
                @change="handleFileUpload" 
                class="hidden"
                accept="image/jpeg,image/png,image/jpg"
              />
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </label>
          </div>
          
          <p v-if="imageError" class="text-red-500 text-sm mt-2">
            {{ imageError }}
          </p>
        </div>

        <!-- Input Fields -->
        <div class="space-y-4">
          <!-- Username -->
          <div>
            <label for="username" class="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input 
              type="text" 
              id="username" 
              v-model="form.username" 
              placeholder="Enter new username" 
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
            />
          </div>

          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input 
              type="email" 
              id="email" 
              v-model="form.email" 
              placeholder="Enter new email" 
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
            />
          </div>

          <!-- Password -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <div class="relative">
              <input 
                :type="showPassword ? 'text' : 'password'" 
                id="password" 
                v-model="form.password" 
                placeholder="Enter new password" 
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
              />
              <button 
                type="button" 
                @click="togglePasswordVisibility" 
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-green-500"
              >
                <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.78zm4.261 4.261l1.265 1.265a2.995 2.995 0 012.767 2.767l3.464 3.464a4 4 0 00-6.495-6.495z" clip-rule="evenodd" />
                  <path d="M10 7a3 3 0 012.822 2.022l-4.8-4.8A2.995 2.995 0 0110 7z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <button 
          type="submit" 
          :disabled="isUpdating"
          class="w-full py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ isUpdating ? "Updating..." : "Update Profile" }}
        </button>

        <!-- Error and Success Messages -->
        <div 
          v-if="errorMessage" 
          class="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg text-center"
        >
          {{ errorMessage }}
        </div>
        <div 
          v-if="successMessage" 
          class="bg-green-50 border border-green-300 text-green-700 px-4 py-3 rounded-lg text-center"
        >
          {{ successMessage }}
        </div>

        <!-- Delete Account Section -->
        <div class="border-t pt-6 mt-6">
          <button 
            type="button"
            @click="showDeleteModal = true" 
            class="w-full py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 transition-all duration-300"
          >
            Delete My Account
          </button>
        </div>
      </form>

      <!-- Confirmation Modal -->
      <div 
        v-if="showDeleteModal" 
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      >
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-md">
          <div class="p-6">
            <h3 class="text-xl font-bold text-gray-800 mb-4">Confirm Account Deletion</h3>
            <p class="text-gray-600 mb-6">
              Are you sure you want to delete your account? This action cannot be undone.
            </p>
            <div class="flex space-x-4">
              <button 
                @click="deleteAccount" 
                :disabled="isDeleting"
                class="flex-1 bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ isDeleting ? "Deleting..." : "Yes, Delete" }}
              </button>
              <button 
                @click="showDeleteModal = false" 
                class="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { AuthService } from '@/services/auth';

export default {
  data() {
    return {
      form: {
        username: '',
        email: '',
        password: ''
      },
      profileImageUrl: '',
      profileImage: null,
      isUpdating: false,
      isDeleting: false,
      errorMessage: '',
      successMessage: '',
      showDeleteModal: false,
      showPassword: false,
      imageError: ''
    };
  },
  mounted() {
    this.loadUserFromToken();
  },
  methods: {
    async loadUserFromToken() {
      const token = AuthService.getToken();

      if (token) {
        try {
          const decodedToken = AuthService.decodeToken(token);
          this.form.username = decodedToken.username || '';
          this.form.email = decodedToken.email || '';
          this.profileImageUrl = decodedToken.profileImageUrl || 'https://dpglam-storage-bucket.s3.ap-southeast-2.amazonaws.com/default-user-icon.jpg';
        } catch (error) {
          this.errorMessage = 'Failed to load user data';
          console.error('Error decoding token:', error);
        }
      } else {
        this.errorMessage = 'Please log in to update your profile';
      }
    },
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      this.imageError = ''; // Reset error message

      if (file) {
        const fileSizeMB = file.size / (1024 * 1024);
        const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];

        if (!allowedTypes.includes(file.type)) {
          this.imageError = "Only JPEG, JPG, and PNG formats are allowed.";
          return;
        }

        if (fileSizeMB > 25) {
          this.imageError = "File size must be less than 25MB.";
          return;
        }

        this.profileImage = file;
        this.profileImageUrl = URL.createObjectURL(file);
      }
    },
    async updateProfile() {
      // Basic validation
      if (!this.form.username && !this.form.email && !this.form.password && !this.profileImage) {
        this.errorMessage = 'Please provide at least one update';
        return;
      }

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
            'Authorization': `Bearer ${AuthService.getToken()}`
          }
        });

        this.successMessage = response.data.message || 'Profile updated successfully';

        if (response.data.profileImageUrl) {
          this.profileImageUrl = response.data.profileImageUrl;
        }

        // Optional: Update token or refresh user data
        this.loadUserFromToken();
      } catch (error) {
        this.errorMessage = error.response?.data?.error || 'Something went wrong. Please try again.';
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
        this.errorMessage = error.response?.data?.error || 'Failed to delete account';
      } finally {
        this.isDeleting = false;
        this.showDeleteModal = false;
      }
    }
  }
};
</script>