// import { jwt_decode } from 'jwt-decode';  // ESM version of the library


// export const AuthService = {
//   // Get token from localStorage (or cookies)
//   getToken() {
//     return localStorage.getItem('auth_token');
//   },

//   // Store token in localStorage (or cookies)
//   setToken(token) {
//     localStorage.setItem('auth_token', token);
//   },

//   // Remove token from localStorage (or cookies)
//   removeToken() {
//     localStorage.removeItem('auth_token');
//   },

//   // Check if the token exists and is not expired
//   isAuthenticated() {
//     const token = this.getToken();
//     console.log("isAuthenticated method says: token is = " + token);

//     if (!token) return false;

//     try {
//       // Decode the token to check for expiry
//       const decoded = jwt_decode(token);
//       const isExpired = decoded.exp * 1000 < Date.now(); // Convert expiry to milliseconds

//       if (isExpired) {
//         this.removeToken(); // Optionally remove expired token
//         return false;
//       }

//       return true;
//     } catch (error) {
//       console.error("Token decoding error:", error);
//       this.removeToken(); // Remove token on decoding error
//       return false;
//     }
//   },

//   // Get the user role from the JWT token
//   getUserRole() {
//     const token = this.getToken();
//     if (!token) return null;  // If no token, return null

//     try {
//       const decoded = jwt_decode(token);
//       return decoded.role || null; // Assuming the token has a 'role' field
//     } catch (error) {
//       console.error("Error decoding token to get role:", error);
//       return null;
//     }
//   },

//   // Check if the user is an admin
//   isAdmin() {
//     return this.getUserRole() === 'admin'; // Assuming 'admin' is the role for admin users
//   },

//   // Refresh token logic (if applicable)
//   refreshToken() {
//     // Implement token refresh logic if your backend supports it
//     // This typically involves calling the backend to get a new token using a refresh token
//   },
// };


import { jwtDecode } from 'jwt-decode';  // Correct named import
export const AuthService = {
  // Get token from localStorage (or cookies)
  getToken() {
    return localStorage.getItem('auth_token');
  },
  // Store token in localStorage (or cookies)
  setToken(token) {
    localStorage.setItem('auth_token', token);
  },
  // Remove token from localStorage (or cookies)
  removeToken() {
    localStorage.removeItem('auth_token');
  },
  // Check if the token exists and is not expired
  isAuthenticated() {
    const token = this.getToken();
console.log("isAuthenticated method says: token is = " + token)
    if (!token) return false;
    try {
      // Decode the token to check for expiry
      const decoded = jwtDecode(token);
      const isExpired = decoded.exp * 1000 < Date.now();  // Convert expiry to milliseconds
      if (isExpired) {
        this.removeToken();  // Optionally remove expired token
        return false;
      }
      return true;
    } catch (error) {
      console.error("Token decoding error:", error);
      this.removeToken(); // Remove token on decoding error
      return false;
    }
  },
  // Refresh token logic (if applicable)
  refreshToken() {
    // Implement token refresh logic if your backend supports it
    // This typically involves calling the backend to get a new token using a refresh token
  },
};
