import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

export const AuthService = {
  getToken() {
    return localStorage.getItem('auth_token');
  },

  setToken(token) {
    localStorage.setItem('auth_token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  },

  removeToken() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('role');
    delete axios.defaults.headers.common['Authorization'];
  },

  isAuthenticated() {
    const token = this.getToken();
    if (!token) return false;
    try {
      const decoded = jwtDecode(token);
      const isExpired = decoded.exp * 1000 < Date.now();
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
      return decoded.role || null;
    } catch (error) {
      console.error("Error decoding token to get role:", error);
      return null;
    }
  },

  isAdmin() {
    return this.getUserRole() === 'admin';
  },

  getUserEmail() {
    const token = this.getToken();
    if (!token) return null;
    try {
      const decoded = jwtDecode(token);
      return decoded.email || null;
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
      return decoded.username || null;
    } catch (error) {
      console.error("Error decoding token to get username:", error);
      return null;
    }
  },

  getUserProfileImage() {
    const token = this.getToken();
    if (!token) return null;
    try {
      const decoded = jwtDecode(token);
      return decoded.profileImageUrl || "https://dpglam-storage-bucket.s3.ap-southeast-2.amazonaws.com/default-user-icon.jpg";
    } catch (error) {
      console.error("Error decoding token to get user profile image:", error);
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
