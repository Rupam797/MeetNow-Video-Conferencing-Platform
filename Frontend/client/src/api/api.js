import axios from 'axios';

let backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080/api/v1.0';

// Remove trailing slash if present
if (backendUrl.endsWith('/')) {
  backendUrl = backendUrl.slice(0, -1);
}

// Automatically append context path '/api/v1.0' if not present
if (!backendUrl.endsWith('/api/v1.0')) {
  backendUrl = `${backendUrl}/api/v1.0`;
}

const api = axios.create({
  baseURL: backendUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle authentication errors (like expired token)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      // If we are in the browser, we can force redirect to login
      if (window.location.pathname !== '/login' && window.location.pathname !== '/' && window.location.pathname !== '/signup') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
