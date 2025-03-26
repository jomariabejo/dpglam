<template>
    <!-- App Bar (Top Navbar) -->
    <v-app-bar app color="green-darken-4" dark>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>DP Glam</v-toolbar-title>
    </v-app-bar>
  
    <!-- Sidebar (Navigation Drawer) -->
    <v-navigation-drawer v-model="drawer" app color="grey-lighten-3">
      <v-list>
        <v-list-item to="/dashboard" prepend-icon="mdi-view-dashboard" title="Dashboard"></v-list-item>
        <v-list-item to="/admin/users" prepend-icon="mdi-home" title="Users"></v-list-item>
        <v-list-item to="/admin/transactions" prepend-icon="mdi-cash-multiple" title="Transactions"></v-list-item>
        <v-list-item to="/admin/orders" prepend-icon="mdi-receipt-text" title="Orders"></v-list-item>
        <v-list-item to="/admin/fakestore" prepend-icon="mdi-store" title="Fakestore"></v-list-item>
        <v-list-item to="/logout" prepend-icon="mdi-logout" title="Logout"></v-list-item>
      </v-list>
    </v-navigation-drawer>
  </template>
  
  <script>
  export default {
    data() {
      return {
        drawer: true, // Controls the sidebar state
      }
    }
  }
  </script>
  
  <style scoped>
  .v-main {
    min-height: 100vh;
  }
  </style>
  