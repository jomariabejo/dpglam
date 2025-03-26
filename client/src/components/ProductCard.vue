<template>
    <div class="bg-white border border-gray-300 rounded-lg shadow-lg p-4">
      <img :src="product.image || defaultImage" alt="Product Image" class="w-full h-48 object-cover rounded-md">
      <h3 class="text-lg font-semibold mt-2">{{ product.name }}</h3>
      <p class="text-gray-600 text-sm">{{ product.description }}</p>
      <div class="mt-3">
        <span class="text-green-600 font-bold">${{ product.price.toFixed(2) }}</span>
      </div>
      <button
        @click="displayAlert"
        class="mt-4 w-full bg-green-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
      >
        Add to Cart
      </button>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      product: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        defaultImage: 'https://via.placeholder.com/150'
      };
    },
    methods: {
      displayAlert() {
        alert("Add to Cart feature is still in development, and there have been challenges with integrating PayPal Sandbox for payments.")
      }
    }
  };
  </script>
  