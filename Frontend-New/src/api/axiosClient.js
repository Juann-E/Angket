import axios from 'axios';

// Create axios instance with base configuration
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const axiosClient = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token (kecuali untuk endpoint login)
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    const url = config.url || '';

    if (token && !url.includes('/auth/login')) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || '';

    if (status === 401 && !url.includes('/auth/login')) {
      const currentPath = window.location.pathname;
      const isPublicPath =
        currentPath === '/' || currentPath.startsWith('/survey');
      const isLogoutRequest = url.includes('/auth/logout');

      if (!isPublicPath && !isLogoutRequest) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
