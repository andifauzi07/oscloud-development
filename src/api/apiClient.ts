import axios from "axios";

const API_BASE_URL = "https://oscloud-backend.vercel.app/v1";
// const API_BASE_URL = "http://127.0.0.1:8000"

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export default apiClient;