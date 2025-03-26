<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <h2 class="text-2xl text-green-400 font-semibold text-center mb-6">
      Available Products: {{ products.length }}
    </h2>
    
    <div class="flex justify-center mb-6">
      <div class="w-full max-w-xs">
        <label for="sort-select" class="block text-sm font-medium text-gray-700 mb-2">
          Sort Products By
        </label>
        <select 
          id="sort-select" 
          v-model="sortKey" 
          @change="sortProducts"
          class="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="name">Name (A-Z)</option>
          <option value="price.asc">Price (Low to High)</option>
          <option value="price.desc">Price (High to Low)</option>
          <option value="rating">Rating</option>
        </select>
      </div>
    </div>

    <div v-if="loading" class="text-center text-gray-500">Loading products...</div>
    <div v-else-if="errorMessage" class="text-center text-red-500">{{ errorMessage }}</div>
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <ProductCard 
        v-for="product in sortedProducts" 
        :key="product.sku" 
        :product="product" 
      />
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
      errorMessage: '',
      sortKey: 'name' // default sort
    };
  },
  computed: {
    sortedProducts() {
      // Create a copy of products to avoid mutating the original array
      let sorted = [...this.products];
      
      switch(this.sortKey) {
        case 'name':
          return sorted.sort((a, b) => a.name.localeCompare(b.name));
        
        case 'price.asc':
          return sorted.sort((a, b) => a.price - b.price);
        
        case 'price.desc':
          return sorted.sort((a, b) => b.price - a.price);
        
        case 'rating':
          return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        
        default:
          return sorted;
      }
    }
  },
  methods: {
    sortProducts() {
      // This method can be used for additional logic if needed
      // The actual sorting is handled by the computed property
    }
  },
  async created() {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/products`);
      console.log('API Response:', response.data); // Debugging line
      this.products = response.data.products || [];
    } catch (error) {
      console.error('Fetch error:', error.response?.data || error.message);
      this.errorMessage = error.response?.data?.error || 'Failed to load products.';
    } finally {
      this.loading = false;
    }
  }
};
</script>