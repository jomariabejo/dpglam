<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold text-gray-900">Admin Products</h1>
    <p class="mt-4 text-gray-600">Manage your products and fetch sample data from FakeStoreAPI.</p>

    <button 
      @click="openCreateModal"
      class="mt-4 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
    >
      Create Product Data
    </button> 

    <button 
      @click="fetchProductsData"
      class="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
    >
      Load Products Data
    </button> 

    <button 
      @click="fetchFakeStoreData"
      class="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
    >
      Load Fake Store Data
    </button>

    <!-- Show Create Product Form -->
    <CreateProduct 
      v-if="showCreateForm" 
      :product="selectedProduct" 
      @close="showCreateForm = false" 
      @product-saved="fetchProductsData" 
    />

    <!-- Products Table -->
    <div class="mt-6 overflow-x-auto">
      <table class="min-w-full bg-white border border-gray-200 rounded-lg">
        <thead class="bg-gray-200">
          <tr>
            <th class="px-4 py-2 border">Name</th>
            <th class="px-4 py-2 border">Description</th>
            <th class="px-4 py-2 border">Price</th>
            <th class="px-4 py-2 border">Stock</th>
            <th class="px-4 py-2 border">Category</th>
            <th class="px-4 py-2 border">SKU</th>
            <th class="px-4 py-2 border">Image</th>
            <th class="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in allProducts" :key="product.sku || product.id">
            <td class="px-4 py-2 border">{{ product.name || product.title }}</td>
            <td class="px-4 py-2 border">{{ product.description }}</td>
            <td class="px-4 py-2 border">${{ product.price }}</td>
            <td class="px-4 py-2 border">{{ product.stockQuantity || 'N/A' }}</td>
            <td class="px-4 py-2 border">{{ product.category }}</td>
            <td class="px-4 py-2 border">{{ product.sku || 'N/A' }}</td>
            <td class="px-4 py-2 border">
              <img :src="product.image" alt="Product Image" class="h-12 w-12 object-cover rounded-md">
            </td>
            <td class="px-4 py-2 border flex space-x-2 justify-center">
              <button @click="openEditModal(product)" class="text-blue-600 hover:text-blue-800">
                ✏️
              </button>
              <button @click="deleteProduct(product._id)" class="text-red-600 hover:text-red-800">
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
import CreateProduct from '@/components/CreateProduct.vue';

export default {
  name: 'AdminProductsView',
  components: {
    CreateProduct
  },
  data() {
    return {
      allProducts: [],
      showCreateForm: false,
      selectedProduct: null
    };
  },
  methods: {
    async fetchFakeStoreData() {
      try {
        const response = await axios.get('https://fakestoreapi.com/products');
        this.allProducts = response.data;
      } catch (error) {
        console.error('Error fetching data from FakeStoreAPI:', error);
      }
    },
    async fetchProductsData() {
      try {
        const response = await axios.get('http://localhost:5000/api/auth/admin/products/');
        this.allProducts = response.data.products || [];
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },
    openCreateModal() {
      this.selectedProduct = null; // Reset for new product creation
      this.showCreateForm = true;
    },
    openEditModal(product) {
      this.selectedProduct = { ...product }; // Clone product for editing
      this.showCreateForm = true;
    },
    async deleteProduct(productId) {
      if (confirm('Are you sure you want to delete this product?')) {
        try {
          await axios.delete(`http://localhost:5000/api/auth/admin/products/${productId}`);
          this.fetchProductsData();
        } catch (error) {
          console.error('Error deleting product:', error);
        }
      }
    }
  },
  mounted() {
    this.fetchProductsData();
  }
};
</script>
