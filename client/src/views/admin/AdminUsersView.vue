<template>
  <v-container>
    <h1 class="text-h4 font-weight-bold">Admin Users</h1>
    <p class="text-body-2 mb-4">Manage registered users.</p>

    <!-- Buttons for Create and Refresh -->
    <v-btn color="green-darken-2" class="mr-2" @click="openCreateModal">
      <v-icon left>mdi-account-plus</v-icon> Create User
    </v-btn>
    <v-btn color="blue-darken-2" @click="fetchUsersData">
      <v-icon left>mdi-refresh</v-icon> Load Users
    </v-btn>

    <!-- Users Table -->
    <v-table class="mt-6">
      <thead>
        <tr>
          <th class="text-left">Username</th>
          <th class="text-left">Email</th>
          <th class="text-left">Role</th>
          <th class="text-left">Created At</th>
          <th class="text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in allUsers" :key="user._id">
          <td>{{ user.username }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.role }}</td>
          <td>{{ new Date(user.createdAt).toLocaleDateString() }}</td>
          <td class="text-center">
            <v-btn icon color="blue" density="compact" @click="openEditModal(user)">
              <v-icon size="22">mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon color="red" density="compact" @click="deleteUser(user._id)">
              <v-icon size="22">mdi-delete</v-icon>
            </v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>

    <!-- Create/Edit User Modal (Now Integrated) -->
    <v-dialog v-model="showCreateForm" max-width="500px" @update:modelValue="handleClose">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ selectedUser ? 'Edit User' : 'Create User' }}</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="userForm">
            <v-text-field v-model="userData.username" label="Username" required></v-text-field>
            <v-text-field v-model="userData.email" label="Email" type="email" required></v-text-field>
            <v-select v-model="userData.role" label="Role" :items="['admin', 'customer']"></v-select>
            <v-text-field v-model="userData.password" label="Password" type="password" required></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="red" @click="handleClose">Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="green" @click="saveUser">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script>
import axios from 'axios';

export default {
  name: 'AdminUsersView',
  data() {
    return {
      allUsers: [],
      showCreateForm: false,
      selectedUser: null,
      userData: {
        username: '',
        email: '',
        role: 'customer',
        password: ''
      }
    };
  },
  methods: {
    async fetchUsersData() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/admin/users`);
        this.allUsers = Array.isArray(response.data.users) ? response.data.users : [];
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    },
    openCreateModal() {
      this.selectedUser = null;
      this.resetUserData();
      this.showCreateForm = true;
    },
    openEditModal(user) {
      this.selectedUser = { ...user };
      this.userData = { ...user };
      this.showCreateForm = true;
    },
    async saveUser() {
      try {
        if (this.selectedUser?._id) {
          const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/user/update/${this.selectedUser._id}/${encodeURIComponent(this.userData.username)}/${this.userData.role}`;
          await axios.put(apiUrl);
        } else {
          await axios.post(`${import.meta.env.VITE_API_BASE_URL}/`, this.userData);
        }
        this.fetchUsersData();
        this.handleClose();
      } catch (error) {
        console.error("Error saving user:", error.response?.data || error);
        alert("Failed to save user.");
      }
    },
    async deleteUser(userId) {
      if (confirm("Are you sure you want to delete this user?")) {
        try {
          await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/user/delete/${userId}`);
          alert("User deleted successfully!");
          this.fetchUsersData();
        } catch (error) {
          console.error("Error deleting user:", error.response?.data || error);
          alert("Failed to delete user.");
        }
      }
    },
    handleClose() {
      this.showCreateForm = false;
      this.resetUserData();
    },
    resetUserData() {
      this.userData = { username: '', email: '', role: 'customer', password: '' };
    }
  },
  mounted() {
    this.fetchUsersData();
  }
};
</script>
