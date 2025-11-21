import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://written-katuscha-atitusvininoetz-28c4d976.koyeb.app';

export const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use((config) => {
    const token = sessionStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});