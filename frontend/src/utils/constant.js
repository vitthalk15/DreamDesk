import axios from 'axios';

// export const USER_API_END_POINT="http://localhost:5000/api/v1/user";
// export const JOB_API_END_POINT="http://localhost:5000/api/v1/job";
// export const APPLICATION_API_END_POINT="http://localhost:5000/api/v1/application";
// export const COMPANY_API_END_POINT="http://localhost:5000/api/v1/company";

const BACKEND_URL = "https://dreamdesk-93vh.onrender.com";

// Configure axios defaults
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Add response interceptor to handle errors
axios.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            // Handle unauthorized error
            console.error('Authentication error:', error.response?.data);
        }
        return Promise.reject(error);
    }
);

export const USER_API_END_POINT = `${BACKEND_URL}/api/v1/user`;
export const JOB_API_END_POINT = `${BACKEND_URL}/api/v1/job`;
export const APPLICATION_API_END_POINT = `${BACKEND_URL}/api/v1/application`;
export const COMPANY_API_END_POINT = `${BACKEND_URL}/api/v1/company`;