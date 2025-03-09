<script setup>
import { AuthService } from "@/services/auth";
import { onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

onMounted(() => {
  const token = route.query.token;

  if (token) {
    AuthService.setToken(token);
    const userRole = AuthService.getUserRole(); // Store result to avoid multiple calls

    router.push(userRole === "admin" ? "/dashboard" : "/my-orders");
  } else {
    alert("Register first your email.");
    router.push("/login?error=InvalidToken");
  }
});
</script>

<template>
  <div class="loading-screen">
    <h2>Authenticating...</h2>
  </div>
</template>

<style scoped>
.loading-screen {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>
