import http from '../api/http'

export interface PayloadClienteBackend {
  idCliente?: number; 
  compania: string;   // Nombre (dependencia o empresa)
  rfc: string;
  direccion: string;  // Dirección completa
  ciudad?: string | null;    // B1: Ciudad (comentario 5 del reporte)
  estadoRep?: string | null; // B1: Estado de la República (columna EstadoRep en BD)
  contacto: string;   // Nombre del contacto
  telefono: string;
  correo?: string | null;    // B1: correo opcional (comentario 1: algunos clientes no lo dan)
  aeronaves?: number; // Para cumplir con el ticket (espacio pendiente)
  estado?: string;    // Estatus Activo/Inactivo del cliente
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