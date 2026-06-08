import axios from 'axios';
import type { TareaProgramada } from '../types/programada';

// SOLUCIÓN: Usar la ruta relativa de la API para producción, o alternar según el entorno
const API_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:8080/api/programadas'
    : '/api/programadas';

export const programadaService = {
    async listarTodas() {
        const response = await axios.get<TareaProgramada[]>(API_URL);
        return response.data;
    },
    async registrar(tarea: TareaProgramada) {
        return await axios.post(API_URL, tarea);
    }
};