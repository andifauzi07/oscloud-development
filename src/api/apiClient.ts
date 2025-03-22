import axios from "axios";

// const API_BASE_URL = 'https://oscloud-backend.vercel.app/v1';
const API_BASE_URL = "http://localhost:8000/v1";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default apiClient;
