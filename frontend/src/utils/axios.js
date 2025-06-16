import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4001";

// Create axios instance with default config
const axiosInstance = axios.create({
    baseURL: BACKEND_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

export default axiosInstance; 