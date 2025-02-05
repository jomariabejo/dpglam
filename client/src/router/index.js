import { createRouter, createWebHistory } from 'vue-router';
import { AuthService } from '../services/auth';

const routes = [
  {
    path: '/products',
    name: 'Products',
    component: () => import('../views/ProductsView.vue'),
    meta: { requiresAuth: true }, // Protect this route
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('../views/admin/AdminDashboardView.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }, // Only allow admins to access
  },
  {
    path: '/admin/fakestore',
    name: 'AdminProductsView',
    component: () => import('../views/admin/AdminProductsVew.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }, // Only allow admins to access
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/AboutView.vue'),
    meta: { requiresAuth: true }, // Protect this route
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
    },
  },
  {
    path: '/forbidden', // Forbidden Jutsu by Orochimaru
    name: 'Forbidden',
    component: () => import('../views/ForbiddenView.vue'), // Create a Forbidden view
  },

// USER ROUTER
  {
    path: '/myprofile',
    name: 'MyProfileView',
    component: () => import('../views/customer/MyProfileView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/dashboard',
    name: 'AdminDashboardView',
    component: () => import('../views/admin/AdminDashboardView.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }, // Only allow admins to access
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
  const userRole = AuthService.getUserRole(); // Get the role of the user (stored in JWT)

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'Login' });  // Redirect to login if not authenticated
  } else if (to.meta.requiresAdmin && userRole !== 'admin') {
    next({ name: 'Forbidden' }); // Redirect to forbidden if the user is not an admin
  } else {
    next();  // Allow access to the route
  }
});

export default router;
