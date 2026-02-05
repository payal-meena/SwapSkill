import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Only set Content-Type for non-FormData requests
    if (!(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      try {
        localStorage.removeItem('token');
      } catch (e) {}

      // Emit a global event so UI can optionally respond (but do not auto-navigate)
      try {
        const evt = new CustomEvent('api:unauthorized', { detail: { status: 401 } });
        window.dispatchEvent(evt);
      } catch (e) {
        console.warn('Could not dispatch unauthorized event', e);
      }
    }
    return Promise.reject(error);
  }
);

export default api;