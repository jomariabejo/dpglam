<template>
    <div class="bg-white shadow-lg rounded-xl p-6 flex items-center space-x-4">
      <div class="p-4 rounded-full text-white" :class="colorClass">
        <i :class="iconClass"></i>
      </div>
      <div>
        <h2 class="text-gray-600 text-sm font-medium">{{ title }}</h2>
        <p class="text-2xl font-bold text-gray-900">{{ count }}</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      title: String,
      count: Number,
      color: String, // blue, green, purple, etc.
      icon: String // shopping-cart, users, credit-card
    },
    computed: {
      colorClass() {
        return {
          blue: "bg-blue-500",
          green: "bg-green-500",
          purple: "bg-purple-500",
        }[this.color] || "bg-gray-500";
      },
      iconClass() {
        return {
          "shopping-cart": "fas fa-shopping-cart text-xl",
          "users": "fas fa-users text-xl",
          "credit-card": "fas fa-credit-card text-xl",
        }[this.icon] || "fas fa-box text-xl";
      }
    }
  };
  </script>
  
  <style scoped>
  i {
    font-size: 1.5rem;
  }
  </style>
  