import http from '../api/http'

export interface PayloadNuevoArticuloBackend {
  noParte: string
  codigo: string
  noSerie: string
  descripcion: string
  categoria: number
  unidadMedida: number
  almacen: number
  ubicacion: string
  proveedor: number
  precioCompra: number
  moneda: String
  stock: number
  condicion: number
}

export const guardarArticulos = async (payload: PayloadNuevoArticuloBackend[]) => {
  const { data } = await http.post('/api/articulos/bulk', payload)
  return data
}

export const listarArticulos = async () => {
  const { data } = await http.get('/api/articulos')
  return data
}
