import axios from 'axios';
import toast from 'react-hot-toast';

// Use environment variable or fallback to relative path (works via Vite proxy in dev and behind a reverse proxy in prod)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the auth token
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

// Add a response interceptor to handle authentication errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.assign('/login');
      toast.error('Session expired. Please login again.');
    } else if (error.response?.status === 403) {
      // Only show permission toast for non-GET requests (mutations like post/delete).
      // Silent failures on background GET requests (e.g. fetching stats) should not alarm the user.
      if (error.config?.method !== 'get') {
        toast.error('You do not have permission to perform this action.');
      }
    } else {
      const message = error.response?.data?.message || 'Something went wrong. Please try again.';
      if (error.config?.method !== 'get') { // Don't show toast for every background GET failure
        toast.error(message);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
