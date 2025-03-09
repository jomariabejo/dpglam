<template>
  <v-container>
    <!-- Page Header -->
    <v-row align="center" justify="space-between" class="mb-4">
      <v-col cols="12" sm="6">
        <h1 class="text-h4 font-weight-bold">Admin Products</h1>
        <p class="text-body-2">Manage your products and fetch sample data from FakeStoreAPI.</p>
      </v-col>
    </v-row>

    <!-- Action Buttons -->
    <v-row class="mb-4">
      <v-col cols="12" sm="4" md="3">
        <v-btn block color="green-darken-2" @click="openCreateModal">
          <v-icon left>mdi-plus</v-icon> Create Product
        </v-btn>
      </v-col>
      <v-col cols="12" sm="4" md="3">
        <v-btn block color="blue-darken-2" @click="fetchProductsData">
          <v-icon left>mdi-refresh</v-icon> Load Products
        </v-btn>
      </v-col>
      <v-col cols="12" sm="4" md="3">
        <v-btn block color="blue-darken-2" @click="fetchFakeStoreData">
          <v-icon left>mdi-database</v-icon> Load Fake Store Data
        </v-btn>
      </v-col>
    </v-row>

    <!-- Products Table -->
    <v-table class="mt-4 elevation-2">
      <thead class="bg-grey-lighten-3">
        <tr>
          <th class="text-left">Name</th>
          <th class="text-left">Description</th>
          <th class="text-left">Price</th>
          <th class="text-left">Stock</th>
          <th class="text-left">Category</th>
          <th class="text-left">SKU</th>
          <th class="text-left">Image</th>
          <th class="text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in allProducts" :key="product.sku || product.id">
          <td>{{ product.name || product.title }}</td>
          <td class="truncate-text">{{ product.description }}</td>
          <td>${{ product.price }}</td>
          <td>{{ product.stockQuantity || 'N/A' }}</td>
          <td>{{ product.category }}</td>
          <td>{{ product.sku || 'N/A' }}</td>
          <td>
            <v-img :src="product.image" alt="Product Image" max-width="50" max-height="50" class="rounded"></v-img>
          </td>
          <td class="text-center">
            <v-btn icon color="blue" density="compact" @click="openEditModal(product)">
              <v-icon size="22">mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon color="red" density="compact" @click="deleteProduct(product._id)">
              <v-icon size="22">mdi-delete</v-icon>
            </v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>

    <!-- Create/Edit Product Modal -->
    <v-dialog v-model="showCreateForm" max-width="500px" @update:modelValue="handleClose">
      <CreateProduct :product="selectedProduct" @close="handleClose" @product-saved="fetchProductsData" />
    </v-dialog>
  </v-container>
</template>

<script>
import axios from 'axios';
import CreateProduct from '@/components/CreateProduct.vue';

export default {
  name: 'AdminProductsView',
  components: { CreateProduct },
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
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/admin/products/`);
        this.allProducts = response.data.products || [];
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },
    openCreateModal() {
      this.selectedProduct = null;
      this.showCreateForm = true;
    },
    openEditModal(product) {
      this.selectedProduct = { ...product };
      this.showCreateForm = true;
    },
    async deleteProduct(productId) {
      if (confirm('Are you sure you want to delete this product?')) {
        try {
          await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/admin/products/${productId}`);
          this.fetchProductsData();
        } catch (error) {
          console.error('Error deleting product:', error);
        }
      }
    },
    handleClose() {
      this.showCreateForm = false;
    }
  },
  mounted() {
    this.fetchProductsData();
  }
};
</script>
