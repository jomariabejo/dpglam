<template>
  <!-- Modal Overlay -->
  <div class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" @click.self="$emit('close')">
    <!-- Modal Content -->
    <div class="bg-white p-6 rounded-lg shadow-lg w-96">
      <h2 class="text-2xl font-bold text-gray-900 mb-4">{{ isEditing ? "Edit Product" : "Create New Product" }}</h2>

      <form @submit.prevent="saveProduct">
        <div class="mb-4">
          <label class="block text-gray-700">Name:</label>
          <input v-model="form.name" type="text" class="w-full p-2 border rounded-lg">
        </div>

        <div class="mb-4">
          <label class="block text-gray-700">Description:</label>
          <textarea v-model="form.description" class="w-full p-2 border rounded-lg"></textarea>
        </div>

        <div class="mb-4">
          <label class="block text-gray-700">Price:</label>
          <input v-model="form.price" type="number" class="w-full p-2 border rounded-lg">
        </div>

        <div class="mb-4">
          <label class="block text-gray-700">Stock:</label>
          <input v-model="form.stockQuantity" type="number" class="w-full p-2 border rounded-lg">
        </div>

        <div class="mb-4">
          <label class="block text-gray-700">Category:</label>
          <input v-model="form.category" type="text" class="w-full p-2 border rounded-lg">
        </div>

        <div class="mb-4">
          <label class="block text-gray-700">SKU:</label>
          <input v-model="form.sku" type="text" class="w-full p-2 border rounded-lg">
        </div>

        <div class="mb-4">
          <label class="block text-gray-700">Image URL:</label>
          <input v-model="form.image" type="text" class="w-full p-2 border rounded-lg">
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
    product: Object, // Receives product for editing
  },
  setup(props, { emit }) {
    const form = ref({
      name: "",
      description: "",
      price: 0,
      stockQuantity: 0,
      category: "",
      sku: "",
      image: "",
    });

    // Check if we are editing an existing product
    const isEditing = computed(() => !!props.product && !!props.product._id);

    // Watch for changes in props.product and update form
    watch(
      () => props.product,
      (newProduct) => {
        if (newProduct) {
          form.value = { ...newProduct }; // Clone to avoid modifying prop directly
        } else {
          form.value = { name: "", description: "", price: 0, stockQuantity: 0, category: "", sku: "", image: "" };
        }
      },
      { immediate: true }
    );

    // Save product (create or update)
    const saveProduct = async () => {
      try {
        if (isEditing.value) {
          // Edit existing product
          await axios.put(`http://localhost:5000/api/auth/admin/products/${form.value._id}`, form.value);
        } else {
          // Create new product
          await axios.post("http://localhost:5000/api/auth/admin/products/", form.value);
        }
        emit("product-saved"); // Notify parent to refresh product list
        emit("close"); // Close modal
      } catch (error) {
        console.error("Error saving product:", error);
        alert("Failed to save product.");
      }
    };

    return { form, isEditing, saveProduct };
  },
};
</script>
