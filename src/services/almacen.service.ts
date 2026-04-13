import http from '../api/http';

export interface Almacen {
  idAlmacen?: number;
  nombre: string;
  direccion: string;
  ciudad: string;
  estado: number;
}

export const obtenerAlmacenes = async (): Promise<Almacen[]> => {
  const { data } = await http.get('/api/almacenes');
  return data;
};

export const crearAlmacen = async (almacen: Almacen): Promise<Almacen> => {
  const { data } = await http.post('/api/almacenes', almacen);
  return data;
};

export const actualizarAlmacen = async (id: number, almacen: Almacen): Promise<Almacen> => {
  const { data } = await http.put(`/api/almacenes/${id}`, almacen);
  return data;
};

export const eliminarAlmacen = async (id: number): Promise<void> => {
  await http.delete(`/api/almacenes/${id}`);
};