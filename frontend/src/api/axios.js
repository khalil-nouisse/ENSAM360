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

axiosInstance.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem('refreshToken');
                if (!refreshToken) {
                    return Promise.reject(error);
                }

                // Call refresh endpoint
                // We use axios directly to avoid interceptors on this call
                // Note: We need to append the path to BASE_URL or use a clean instance
                const response = await axios.post(`${BASE_URL}/api/auth/refresh`, {
                    token: refreshToken
                });

                const { accessToken } = response.data;

                // Store new token
                localStorage.setItem('token', accessToken);

                // Update header and retry original request
                originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
                return axiosInstance(originalRequest);

            } catch (err) {
                // If refresh fails, clear tokens and redirect to login
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                // Optional: Redirect to login page
                window.location.href = '/login';
                return Promise.reject(err);
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;

export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});