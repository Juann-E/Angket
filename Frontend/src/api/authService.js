import axiosClient from './axiosClient';

export const authService = {
  // Admin login
  async login(username, password) {
    try {
      console.log("Mengirim request login...");
      const response = await axiosClient.post('/auth/login', { username, password });
      
      console.log("Response Backend:", response); // Debugging

      // PERBAIKAN: NestJS mengembalikan 201 untuk POST
      if (response.status === 200 || response.status === 201) {
        
        // Cek apakah token ada (backend NestJS pakai key 'access_token')
        const token = response.data.access_token || response.data.token;
        
        if (token) {
          localStorage.setItem('adminToken', token);
          
          // Buat dummy user agar AuthContext valid
          const user = { username: username, role: 'admin' };
          localStorage.setItem('user', JSON.stringify(user));
          
          return { success: true, token, user };
        } else {
          console.error("Token tidak ditemukan di response:", response.data);
          throw new Error("Login berhasil tapi token tidak diterima dari server.");
        }
      }
      
      throw new Error(`Login gagal dengan status: ${response.status}`);
      
    } catch (error) {
      console.error("Error di authService:", error);
      // Pastikan error diteruskan agar UI tahu pesan aslinya
      throw error;
    }
  },

  // Admin logout
  async logout() {
    try {
      const response = await axiosClient.post('/auth/logout');
      // Clear local storage on successful logout
      this.removeToken();
      return response.data;
    } catch (error) {
      // Even if logout fails on the server, we should clear the local token
      console.error('Logout error:', error);
      this.removeToken();
      return { message: 'Logout completed locally' };
    }
  },

  // Get current user from localStorage
  getCurrentUser() {
    const token = localStorage.getItem('adminToken');
    const user = localStorage.getItem('user');
    
    if (!token || !user) return null;
    
    try {
      const userData = JSON.parse(user);
      return {
        isAuthenticated: true,
        token,
        user: userData
      };
    } catch (error) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('user');
      return null;
    }
  },

  // Set auth token
  setToken(token) {
    localStorage.setItem('adminToken', token);
  },

  // Remove auth token and user
  removeToken() {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('user');
  }
};