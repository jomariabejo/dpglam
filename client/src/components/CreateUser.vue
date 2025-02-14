<template>
  <!-- Modal Overlay -->
  <div class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" @click.self="$emit('close')">
    <!-- Modal Content -->
    <div class="bg-white p-6 rounded-lg shadow-lg w-96">
      <h2 class="text-2xl font-bold text-gray-900 mb-4">
        {{ isEditing ? "Edit User" : "Create New User" }}
      </h2>

      <form @submit.prevent="saveUser">
        <div class="mb-4">
          <label class="block text-gray-700">Username</label>
          <input v-model="form.username" type="text" class="w-full p-2 border rounded-lg" required />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700">Email</label>
          <input v-model="form.email" type="email" class="w-full p-2 border rounded-lg" required />
        </div>

        <div class="mb-4">
          <label class="block text-gray-700">Role</label>
          <select v-model="form.role" class="w-full p-2 border rounded-lg">
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div class="flex justify-end">
          <button type="button" @click="$emit('close')" class="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500 mr-2">
            Cancel
          </button>
          <button type="submit" class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
            {{ isEditing ? "Update" : "Create" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { ref, watch, computed } from "vue";

export default {
  props: {
    user: Object, // Receives user for editing
  },
  setup(props, { emit }) {
    const form = ref({
      username: "",
      email: "",
      role: "customer"
    });

    // Check if we are editing an existing user
    const isEditing = computed(() => !!props.user && !!props.user._id);

    // Watch for changes in props.user and update form
    watch(
      () => props.user,
      (newUser) => {
        if (newUser) {
          form.value = { 
            username: newUser.username, 
            email: newUser.email, 
            role: newUser.role 
          };
        } else {
          form.value = { username: "", email: "", role: "customer" };
        }
      },
      { immediate: true }
    );

    // Save user (create or update)
const saveUser = async () => {
  try {
    if (isEditing.value) {
      // Editing an existing user - Send update request with ID, username, and role in the URL
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/user/update/${props.user._id}/${form.value.username}/${form.value.role}`
      );
    } else {
      // Creating a new user
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/register`, form.value);
    }

    emit("user-saved"); // Notify parent to refresh users
    emit("close"); // Close the modal
  } catch (error) {
    console.error("Error saving user:", error.response ? error.response.data : error);
    alert("Failed to save user.");
  }
};


    return { form, isEditing, saveUser };
  },
};
</script>
