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
    path: '/admin',
    name: 'Admin',
    component: () => import('../views/admin/AdminDashboardView.vue'),
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
];

// Create the router
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// // Frontend route guard
// router.beforeEach((to, from, next) => {
//   const token = AuthService.getToken();  // Use AuthService to get the token

//   if (token) {
//     // Decode the token to get user data (including the role)
//     try {
//       const decodedToken = jwt_decode(token);
//       const userRole = decodedToken.role;

//       // If trying to access /admin and the user is not an admin
//       if (to.meta.requiresAdmin && userRole !== "administrator") {
//         return next("/forbidden"); // Redirect to forbidden page
//       }

//       // Redirect to the correct page after login based on the role
//       if (userRole === "customer") {
//         if (to.path === "/admin") {
//           return next("/forbidden"); // If customer tries to access /admin, show forbidden
//         }
//         return next("/products"); // Redirect to products for customers
//       }

//       if (userRole === "administrator") {
//         return next("/admin"); // Redirect to admin page for admin users
//       }
//     } catch (error) {
//       console.error("Error decoding token:", error);
//       return next("/login"); // If there's an error decoding the token, go to login
//     }
//   } else {
//     // If there's no token, proceed normally
//     next();
//   }
// });


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
