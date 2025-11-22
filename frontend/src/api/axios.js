import axios from 'axios';

const BASE_URL = process.env.BACKEND_SERVER || import.meta.env.VITE_BACKEND_SERVER || 'http://localhost:5000';

export default axios.create({
    baseURL: BASE_URL
});

export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});