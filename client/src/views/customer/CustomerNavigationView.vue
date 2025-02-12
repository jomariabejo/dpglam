<template>
    <nav class="flex flex-row justify-between items-center p-4 shadow-lg">
        <div class="flex justify-center items-center mx-auto">
            <div class="hidden md:flex space-x-6">
                <RouterLink class="text-white rounded-full bg-green-800 px-5 py-2 hover:bg-green-800 hover:text-white transition duration-200" to="/my-orders">My Orders</RouterLink>
                <RouterLink class="text-white rounded-full bg-green-800 px-5 py-2 hover:bg-green-800 hover:text-white transition duration-200" to="/public/products">Products</RouterLink>
                <RouterLink class="text-white rounded-full bg-green-800 px-5 py-2 hover:bg-green-800 hover:text-white transition duration-200" to="/myprofile">My Profile</RouterLink>
                <RouterLink class="text-white rounded-full bg-green-800 px-5 py-2 hover:bg-green-800 hover:text-white transition duration-200" to="/logout">Logout</RouterLink>
            </div>
        </div>
    </nav>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';

</script>
    
<style></style>