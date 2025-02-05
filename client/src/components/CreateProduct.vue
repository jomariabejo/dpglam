<template>
    <!-- Modal Overlay -->
    <div class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" @click.self="$emit('close')">
      <!-- Modal Content -->
      <div class="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">Create New Product</h2>
        
        <form @submit.prevent="createProduct">
          <div class="mb-4">
            <label class="block text-gray-700">Name:</label>
            <input v-model="product.name" type="text" class="w-full p-2 border rounded-lg">
          </div>
  
          <div class="mb-4">
            <label class="block text-gray-700">Description:</label>
            <textarea v-model="product.description" class="w-full p-2 border rounded-lg"></textarea>
          </div>
  
          <div class="mb-4">
            <label class="block text-gray-700">Price:</label>
            <input v-model="product.price" type="number" class="w-full p-2 border rounded-lg">
          </div>
  
          <div class="mb-4">
            <label class="block text-gray-700">Stock:</label>
            <input v-model="product.stockQuantity" type="number" class="w-full p-2 border rounded-lg">
          </div>
  
          <div class="mb-4">
            <label class="block text-gray-700">Category:</label>
            <input v-model="product.category" type="text" class="w-full p-2 border rounded-lg">
          </div>
  
          <div class="mb-4">
            <label class="block text-gray-700">SKU:</label>
            <input v-model="product.sku" type="text" class="w-full p-2 border rounded-lg">
          </div>
  
          <div class="mb-4">
            <label class="block text-gray-700">Image URL:</label>
            <input v-model="product.image" type="text" class="w-full p-2 border rounded-lg">
          </div>
  
          <div class="flex justify-end">
            <button type="button" @click="$emit('close')" class="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500 mr-2">
              Cancel
            </button>
            <button type="submit" class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        product: {
          name: '',
          description: '',
          price: 0,
          stockQuantity: 0,
          category: '',
          sku: '',
          image: ''
        }
      };
    },
    methods: {
      async createProduct() {
        try {
          const response = await axios.post('http://localhost:5000/api/auth/admin/products/', this.product);
          console.log('Product Created:', response.data);
          alert('Product successfully created!');
          this.$emit('product-created'); // Emit event to refresh product list
          this.$emit('close'); // Close modal after submission
        } catch (error) {
          console.error('Error creating product:', error);
          alert('Failed to create product.');
        }
      }
    }
  };
  </script>
  