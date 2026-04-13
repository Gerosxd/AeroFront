import http from '../api/http';

export interface Proveedor {
  idProveedor?: number;
  nombre: string;
  contacto: string;
  correo: string;
  direccion: string;
  codigoPostal: string;
  ciudad: string;
  telefono: string;
  estado: number;
}

export const obtenerProveedores = async (): Promise<Proveedor[]> => {
  const { data } = await http.get('/api/proveedores');
  return data;
};

export const crearProveedor = async (proveedor: Proveedor): Promise<Proveedor> => {
  const { data } = await http.post('/api/proveedores', proveedor);
  return data;
};

export const actualizarProveedor = async (id: number, proveedor: Proveedor): Promise<Proveedor> => {
  const { data } = await http.put(`/api/proveedores/${id}`, proveedor);
  return data;
};

export const eliminarProveedor = async (id: number): Promise<void> => {
  await http.delete(`/api/proveedores/${id}`);
};