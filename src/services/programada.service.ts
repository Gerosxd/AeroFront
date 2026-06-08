import axios from 'axios';
import type { TareaProgramada } from '../types/programada';

// SOLUCIÓN CORRECTA: Alterna dinámicamente entre tu servidor local y tu servidor real de Azure App Services
const API_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:8080/api/programadas'
    : 'https://aerotallerback-f4h2c4f8gqcqefen.mexicocentral-01.azurewebsites.net/api/programadas';

export const programadaService = {
    async listarTodas() {
        const response = await axios.get<TareaProgramada[]>(API_URL, {
            withCredentials: true // Permite que pase el filtro de CORS de Azure
        });
        return response.data;
    },

    async registrar(tarea: TareaProgramada) {
        return await axios.post(API_URL, tarea, {
            withCredentials: true // Permite mutar datos (POST) cruzando dominios en producción
        });
    }
};