import axios from 'axios';

// Base API URL from environment variable or proxy fallback
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Response interceptor for consistent data extraction and error normalization
apiClient.interceptors.response.use(
  (response) => {
    // Backend returns { success, data, message }
    return response.data;
  },
  (error) => {
    const errorPayload = {
      message: error.response?.data?.message || error.message || 'An unexpected error occurred',
      errors: error.response?.data?.errors || null,
      status: error.response?.status || 500,
    };
    return Promise.reject(errorPayload);
  }
);

export default apiClient;

