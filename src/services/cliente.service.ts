import http from '../api/http'

export interface PayloadClienteBackend {
  idCliente?: number; 
  compania: string;   // Nombre (dependencia o empresa)
  rfc: string;
  direccion: string;  // Dirección completa
  contacto: string;   // Nombre del contacto
  telefono: string;
  correo: string;
  aeronaves?: number; // Para cumplir con el ticket (espacio pendiente)
  estado?: string;    // Para cumplir con el ticket
}

export const guardarCliente = async (payload: PayloadClienteBackend) => {
  const { data } = await http.post('/api/clientes', payload);
  return data;
}

export const listarClientes = async () => {
  const { data } = await http.get('/api/clientes');
  return data;
}

export const actualizarCliente = async (id: number, payload: PayloadClienteBackend) => {
  // Asumiendo que tu backend usa PUT /api/clientes/{id}
  const { data } = await http.put(`/api/clientes/${id}`, payload);
  return data;
}

export const eliminarClienteService = async (id: number) => {
  // Asumiendo que tu backend usa DELETE /api/clientes/{id}
  const { data } = await http.delete(`/api/clientes/${id}`);
  return data;
}