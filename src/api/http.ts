import axios from "axios";
import { getToken } from "../services/auth.service";

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://aerotallerback-f4h2c4f8gqcqefen.mexicocentral-01.azurewebsites.net",
  headers: { "Content-Type": "application/json" },
});

http.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default http;