import axios from "axios";
import { getToken } from "../services/auth.service";

const isLocal = window.location.hostname === "localhost";

const http = axios.create({
  baseURL: isLocal
    ? "http://localhost:8080"
    : "https://aerotallerback-f4h2c4f8gqcqefen.mexicocentral-01.azurewebsites.net",
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