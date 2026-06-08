import axios from "axios";
import { getToken } from "../services/auth.service";

const isLocal = window.location.hostname === "localhost";

const http = axios.create({
  baseURL: isLocal
      ? "http://localhost:8080"
      : "https://aerotallerback-f4h2c4f8gqcqefen.mexicocentral-01.azurewebsites.net",
  headers: { "Content-Type": "application/json" },
  // SOLUCIÓN: Permite el intercambio seguro de credenciales y cookies entre dominios distintos (Azure Static -> Azure App Service)
  withCredentials: true,
});

http.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    // Aseguramos que no se rompa la asignación de cabeceras en Axios
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  return config;
});

export default http;
