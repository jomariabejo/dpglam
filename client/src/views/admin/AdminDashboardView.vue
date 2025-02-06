<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
    <p class="mt-4 text-gray-600">Monitor Products, Orders, and Users</p>

    <!-- Stats Cards Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      <DashboardCard title="Total Orders" :count="stats.orders" color="blue" icon="shopping-cart" />
      <DashboardCard title="Total Users" :count="stats.users" color="green" icon="users" />
      <DashboardCard title="Total Purchases" :count="stats.purchases" color="purple" icon="credit-card" />
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import DashboardCard from "@/components/DashboardCard.vue"; // Import reusable card component
import axios from "axios";

export default {
  name: "AdminDashboardView",
  components: { DashboardCard },
  setup() {
    const stats = ref({
      orders: 0,
      users: 0,
      purchases: 0
    });

    // Fetch stats from API
    const fetchStats = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/auth/dashboard/stats");
        stats.value = response.data;
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    onMounted(fetchStats); // Fetch data on component mount

    return { stats };
  },
};
</script>
