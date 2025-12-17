import axios from 'axios';

const BASE_URL = process.env.BACKEND_SERVER || import.meta.env.VITE_BACKEND_SERVER || 'http://localhost:5000';

const axiosInstance = axios.create({
    baseURL: BASE_URL
});

axiosInstance.interceptors.request.use(
    config => {
        // token = access token
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`; // Authorization: Bearer <token>
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

export default axiosInstance;

export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});