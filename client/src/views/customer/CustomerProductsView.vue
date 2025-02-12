<template>
    <div class="min-h-screen bg-gray-100 p-6">
      <h2 class="text-2xl font-semibold text-center mb-6">Available Products</h2>
      <div v-if="loading" class="text-center text-gray-500">Loading products...</div>
      <div v-else-if="errorMessage" class="text-center text-red-500">{{ errorMessage }}</div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <ProductCard v-for="product in products" :key="product.sku" :product="product" />
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import ProductCard from '@/components/ProductCard.vue';
  
  export default {
    components: { ProductCard },
    data() {
      return {
        products: [],
        loading: true,
        errorMessage: ''
      };
    },
    async created() {
        try {
            const response = await axios.get('http://localhost:5000/api/auth/products');
            console.log('API Response:', response.data); // Debugging line
            this.products = response.data.products || [];
        } catch (error) {
            console.error('Fetch error:', error.response?.data || error.message); // Log the exact error
            this.errorMessage = error.response?.data?.error || 'Failed to load products.';
        } finally {
            this.loading = false;
        }
    }
  };
  </script>
  