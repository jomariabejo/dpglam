// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import { AuthService } from '../services/auth'; // Import AuthService to check authentication status

const routes = [
  {
    path: '/products',
    name: 'Products',
    component: () => import('../views/ProductsView.vue'),
    meta: { requiresAuth: true }, // Protect this route
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/AboutView.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginView.vue'),
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/RegisterView.vue'),
  },
  {
    path: '/logout',
    name: 'Logout',
    beforeEnter(to, from, next) {
      AuthService.removeToken();  // Remove token on logout
      next('/login');  // Redirect to login page
      console.log("Checking if token is removed + " + AuthService.getToken)
    },
  },
];

// Create the router
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Frontend route guard
router.beforeEach((to, from, next) => {
  const isAuthenticated = AuthService.isAuthenticated();
  console.log('isAuthenticated:', isAuthenticated);  // Log to verify if the user is authenticated

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'Login' });  // Redirect to login if not authenticated
  } else {
    next();  // Allow access to the route
  }
});


export default router;
