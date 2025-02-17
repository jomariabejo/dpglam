<template>
    <div class="max-w-7xl mx-auto py-8">
      <!-- Product Details Section -->
      <div v-if="product" class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Product Image -->
        <div class="flex justify-center">
          <img
            :src="product.image"
            :alt="product.name"
            class="rounded-lg shadow-lg max-w-full h-auto"
          />
        </div>
  
        <!-- Product Info -->
        <div class="space-y-4">
          <h1 class="text-4xl font-semibold text-gray-800">{{ product.name }}</h1>
          <p class="text-lg text-gray-600">{{ product.description }}</p>
          
          <div class="flex items-center space-x-4">
            <span class="text-2xl font-bold text-gray-900">${{ product.price.toFixed(2) }}</span>
            <span v-if="product.stockQuantity > 0" class="text-green-500 font-semibold">
              In Stock ({{ product.stockQuantity }})
            </span>
            <span v-else class="text-red-500 font-semibold">Out of Stock</span>
          </div>
  
          <div class="flex space-x-4 mt-6">
            <button 
              :disabled="product.stockQuantity === 0" 
              class="bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 disabled:bg-gray-400"
              @click="addToCart"
            >
              Add to Cart
            </button>
            <button
              class="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg shadow hover:bg-gray-300"
              @click="viewDetails"
            >
              View Details
            </button>
          </div>
        </div>
      </div>
  
      <!-- Loading state -->
      <div v-else class="text-center">
        <p class="text-lg text-gray-500">Loading product...</p>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import AuthService from '@/services/AuthService'; // Assuming AuthService is defined for managing the token
  
  export default {
    data() {
      return {
        product: null, // Will hold the fetched product data
      };
    },
  
    methods: {
      // Function to fetch product details with authorization token
      async fetchProductData() {
        try {
          const token = AuthService.getToken(); // Get token from AuthService
  
          // Make the GET request with Authorization header
          const response = await axios.get('http://localhost:5000/products/123', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
  
          // Set the product data from the response
          this.product = response.data;
        } catch (error) {
          console.error('Error fetching product data:', error);
        }
      },
  
      // Add to Cart logic (just a placeholder)
      addToCart() {
        console.log('Product added to cart:', this.product);
      },
  
      // View more details (optional)
      viewDetails() {
        console.log('Viewing product details for:', this.product.name);
      },
    },
  
    // Fetch data when the component is mounted
    mounted() {
      this.fetchProductData();
    },
  };
  </script>
  
  <style scoped>
  /* You can add additional custom styles here if needed */
  </style>
  