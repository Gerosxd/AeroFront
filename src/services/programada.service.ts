
import axios from 'axios';
import type { TareaProgramada } from '../types/programada';

const API_URL = 'http://localhost:8080/api/programadas';

export const programadaService = {
    async listarTodas() {
        const response = await axios.get<TareaProgramada[]>(API_URL);
        return response.data;
    },
    async registrar(tarea: TareaProgramada) {
        // [cite: 10, 11]
        return await axios.post(API_URL, tarea);
    }
};