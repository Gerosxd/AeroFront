import http from '../api/http'
import type {
  EntradaArticuloRegistroRequest,
  EntradaArticuloRegistroResponse,
  EntradaArticuloListadoResponse,
  EntradaArticuloExportRequest
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

export const exportarEntradaExcel = async (
  idEntrada: number,
  payload: EntradaArticuloExportRequest,
  folio?: string
): Promise<void> => {
  const { data } = await http.post(
    `/api/entradas-articulos/${idEntrada}/exportar-excel`,
    payload,
    { responseType: 'blob' }
  )

  const url = window.URL.createObjectURL(data)
  const link = document.createElement('a')
  link.href = url
  link.download = `${folio || `entrada-${idEntrada}`}.xlsx`

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

export const exportarEntradaPdf = async (
  idEntrada: number,
  payload: EntradaArticuloExportRequest,
  folio?: string
): Promise<void> => {
  const { data } = await http.post(
    `/api/entradas-articulos/${idEntrada}/exportar-pdf`,
    payload,
    { responseType: 'blob' }
  )

  const url = window.URL.createObjectURL(data)
  const link = document.createElement('a')
  link.href = url
  link.download = `${folio || `entrada-${idEntrada}`}.pdf`

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}