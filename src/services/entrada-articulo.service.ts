import http from '../api/http'
import type {
  EntradaArticuloRegistroRequest,
  EntradaArticuloRegistroResponse,
  EntradaArticuloListadoResponse
} from '../types/entrada-articulo'

export const registrarEntradaCompleta = async (
  payload: EntradaArticuloRegistroRequest
): Promise<EntradaArticuloRegistroResponse> => {
  const { data } = await http.post('/api/entradas-articulos/registro-completo', payload)
  return data
}

export const listarEntradas = async (): Promise<EntradaArticuloListadoResponse[]> => {
  const { data } = await http.get('/api/entradas-articulos')
  return data
}

export const obtenerEntradaPorId = async (
  idEntrada: number
): Promise<EntradaArticuloRegistroResponse> => {
  const { data } = await http.get(`/api/entradas-articulos/${idEntrada}`)
  return data
}