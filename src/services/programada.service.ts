// SOLUCIÓN: Importamos tu instancia configurada que ya sabe viajar al App Service de Azure
import http from './http'; // Ajusta la ruta relativa hacia tu archivo http.ts si es necesario
import type { TareaProgramada } from '../types/programada';

export const programadaService = {
    async listarTodas() {
        // Al usar 'http', hereda automáticamente la baseURL del backend correcto
        const response = await http.get<TareaProgramada[]>('/api/programadas');
        return response.data;
    },
    async registrar(tarea: TareaProgramada) {
        // Esto enviará el POST directo a https://aerotallerback-...azurewebsites.net/api/programadas
        return await http.post('/api/programadas', tarea);
    }
};