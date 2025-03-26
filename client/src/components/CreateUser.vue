<template>
  <v-dialog v-model="show" max-width="500px">
    <v-card>
      <v-card-title>
        <span class="text-h5">{{ user?._id ? 'Edit User' : 'Create User' }}</span>
      </v-card-title>
      <v-card-text>
        <v-form ref="userForm" v-model="valid">
          <v-text-field v-model="userData.username" label="Username" required></v-text-field>
          <v-text-field v-model="userData.email" label="Email" type="email" required></v-text-field>
          <v-select v-model="userData.role" label="Role" :items="['admin', 'customer']"></v-select>
          <v-text-field v-model="userData.password" label="Password" type="password" required></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn color="red" @click="$emit('close')">Cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="green" @click="saveUser">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from 'axios';

export default {
  props: {
    modelValue: Boolean,
    user: Object
  },
  data() {
    return {
      show: this.modelValue,
      userData: {
        username: '',
        email: '',
        role: 'customer',
        password: ''
      },
      valid: false
    };
  },
  watch: {
    modelValue(val) {
      this.show = val;
    },
    user: {
      handler(newUser) {
        if (newUser) {
          this.userData = { ...newUser };
        } else {
          this.resetUserData();
        }
      },
      immediate: true // Ensures it runs on component mount
    }
  },
  methods: {
    resetUserData() {
    this.userData = { username: '', email: '', role: 'customer', password: '' };
    },
    async saveUser() {
      try {
        if (this.user?._id) {
          await axios.put(`${import.meta.env.VITE_API_BASE_URL}admin/users/${this.user._id}`, this.userData);
        } else {
          await axios.post(`${import.meta.env.VITE_API_BASE_URL}admin/users`, this.userData);
        }
        this.$emit('user-saved');
        this.$emit('close');
      } catch (error) {
        console.error("Error saving user:", error.response?.data || error);
        alert("Failed to save user.");
      }
    }
  }
};
</script>
