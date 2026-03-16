import http from '../api/http'

export interface CatalogoItem {
  id: number
  nombre: string
}

export interface Catalogos {
  categorias: CatalogoItem[]
  unidades: CatalogoItem[]
  almacenes: CatalogoItem[]
  proveedores: CatalogoItem[]
  condiciones: CatalogoItem[]
}

export const obtenerCategorias = async (): Promise<CatalogoItem[]> => {
  const { data } = await http.get('/api/catalogos/categorias')
  return data
}

export const obtenerUnidades = async (): Promise<CatalogoItem[]> => {
  const { data } = await http.get('/api/catalogos/unidades')
  return data
}

export const obtenerAlmacenes = async (): Promise<CatalogoItem[]> => {
  const { data } = await http.get('/api/catalogos/almacenes')
  return data
}

export const obtenerProveedores = async (): Promise<CatalogoItem[]> => {
  const { data } = await http.get('/api/catalogos/proveedores')
  return data
}

export const obtenerCondiciones = async (): Promise<CatalogoItem[]> => {
  const { data } = await http.get('/api/catalogos/condiciones')
  return data
}

export const obtenerEstadosEntrada = async (): Promise<CatalogoItem[]> => {
  const { data } = await http.get('/api/catalogos/estados-entrada')
  return data
}

export const obtenerTodosLosCatalogos = async (): Promise<Catalogos> => {
  const [categorias, unidades, almacenes, proveedores, condiciones,estadosEntrada] = await Promise.all([])
    await Promise.all([
      obtenerCategorias(),
      obtenerUnidades(),
      obtenerAlmacenes(),
      obtenerProveedores(),
      obtenerCondiciones(),
      obtenerEstadosEntrada()
    ])

  return {
    categorias,
    unidades,
    almacenes,
    proveedores,
    condiciones
  }
}