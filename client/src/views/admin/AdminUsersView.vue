<template>
    <div class="p-6">
      <h1 class="text-3xl font-bold text-gray-900">Admin Users</h1>
      <p class="mt-4 text-gray-600">Manage registered users.</p>
  
      <button 
        @click="openCreateModal"
        class="mt-4 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
      >
        Create User
      </button> 
  
      <button 
        @click="fetchUsersData"
        class="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
      >
        Load Users
      </button>
  
      <!-- Show Create User Form -->
      <CreateUser 
        v-if="showCreateForm" 
        :user="selectedUser" 
        @close="showCreateForm = false" 
        @user-saved="fetchUsersData" 
      />
  
      <!-- Users Table -->
      <div class="mt-6 overflow-x-auto">
        <table class="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead class="bg-gray-200">
            <tr>
              <th class="px-4 py-2 border">Username</th>
              <th class="px-4 py-2 border">Email</th>
              <th class="px-4 py-2 border">Role</th>
              <th class="px-4 py-2 border">Created At</th>
              <th class="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in allUsers" :key="user._id">
              <td class="px-4 py-2 border">{{ user.username }}</td>
              <td class="px-4 py-2 border">{{ user.email }}</td>
              <td class="px-4 py-2 border">{{ user.role }}</td>
              <td class="px-4 py-2 border">{{ new Date(user.createdAt).toLocaleDateString() }}</td>
              <td class="px-4 py-2 border flex space-x-2 justify-center">
                <button @click="openEditModal(user)" class="text-blue-600 hover:text-blue-800">
                  ✏️
                </button>
                <button @click="deleteUser(user._id)" class="text-red-600 hover:text-red-800">
                  🗑️
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import CreateUser from '@/components/CreateUser.vue';
  
  export default {
    name: 'AdminUsersView',
    components: {
      CreateUser
    },
    data() {
      return {
        allUsers: [],
        showCreateForm: false,
        selectedUser: null
      };
    },
    methods: {
      async fetchUsersData() {
  try {
    const response = await axios.get("http://localhost:5000/api/auth/admin/users");

    console.log("Full API Response:", response); // Debugging
    console.log("Users Array:", response.data.users); // Ensure it's an array

    if (!Array.isArray(response.data.users)) {
      console.error("API response is not an array:", response.data);
      return;
    }

    this.allUsers = response.data.users; // 
  } catch (error) {
    console.error("Error fetching users:", error);
  }
}


,

  

  openCreateModal() {
    this.selectedUser = null;
    this.showCreateForm = true;
  },

  openEditModal(user) {
    this.selectedUser = { ...user };
    this.showCreateForm = true;
  },

  async deleteUser(userId) {
    if (confirm("Are you sure you want to delete this user?")) {
        try {
            
            await axios.delete(`http://localhost:5000/api/auth/user/delete/${userId}`)

            alert("User deleted successfully!");
            this.fetchUsersData(); // Refresh user list
        } catch (error) {
            console.error("Error deleting user:", error.response ? error.response.data : error);
            alert("Failed to delete user. Check console for details.");
        }
    }
}

    },
    mounted() {
      this.fetchUsersData();
    }
  };
  </script>
  