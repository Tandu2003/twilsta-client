import axios from 'axios';

const apiInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add response interceptor to handle errors
apiInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.data) {
      // If the error response has a message, use it
      const errorData = error.response.data as { message: string };
      error.message = errorData.message || error.message;
    }
    return Promise.reject(error);
  },
);

export default apiInstance;
