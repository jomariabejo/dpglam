import { jwtDecode } from 'jwt-decode';

export const AuthService = {
  getToken() {
    return localStorage.getItem('auth_token');
  },
  setToken(token) {
    localStorage.setItem('auth_token', token);
  },
  removeToken() {
    localStorage.removeItem('auth_token');
  },
  isAuthenticated() {
    const token = this.getToken();
    if (!token) return false;
    try {
      const decoded = jwtDecode(token);
      const isExpired = decoded.exp * 1000 < Date.now(); // Convert expiry to milliseconds
      if (isExpired) {
        this.removeToken();
        return false;
      }
      return true;
    } catch (error) {
      console.error("Token decoding error:", error);
      this.removeToken();
      return false;
    }
  },
  getUserRole() {
    const token = this.getToken();
    if (!token) return null;
    try {
      const decoded = jwtDecode(token);
      return decoded.role || null; // Assuming the role is inside the token payload
    } catch (error) {
      console.error("Error decoding token to get role:", error);
      return null;
    }
  },
  isAdmin() {
    return this.getUserRole() === 'admin'; // Check if the role is 'admin'
  },
  getUserEmail() {
    const token = this.getToken();
    if (!token) return null;
    try {
      const decoded = jwtDecode(token);
      return decoded.email || null; // Assuming the email is inside the token payload
    } catch (error) {
      console.error("Error decoding token to get email:", error);
      return null;
    }
  },
  getUsername() {
    const token = this.getToken();
    if (!token) return null;
    try {
      const decoded = jwtDecode(token);
      return decoded.username || null; // Assuming the username is inside the token payload
    } catch (error) {
      console.error("Error decoding token to get username:", error);
      return null;
    }
  },
  decodeToken(token) {
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  }
};
