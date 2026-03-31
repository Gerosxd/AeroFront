import http from '../api/http'

export interface PayloadModeloBackend {
  idModelo?: number;
  modelo: string;
  marca: string;
  tipoAeronave: number | null; // Es el ID del tipo 
}

export const guardarModelo = async (payload: PayloadModeloBackend) => {
  const { data } = await http.post('/api/modelos', payload);
  return data;
}

export const listarModelos = async () => {
  const { data } = await http.get('/api/modelos');
  return data;
}

export const actualizarModelo = async (id: number, payload: PayloadModeloBackend) => {
  const { data } = await http.put(`/api/modelos/${id}`, payload);
  return data;
}

export const eliminarModeloService = async (id: number) => {
  const { data } = await http.delete(`/api/modelos/${id}`);
  return data;
}