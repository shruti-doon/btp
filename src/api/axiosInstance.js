// src/api/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://10.4.21.99:3000', // this MUST be correct
  headers: {
    'auth-token': 'your-auth-token',
    'accept-language': 'en_IN',
  },
});

export default axiosInstance;