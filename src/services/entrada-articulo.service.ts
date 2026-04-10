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

export const obtenerEntradaPdfBlob = async (idEntrada: number): Promise<Blob> => {
  const { data } = await http.get(`/api/entradas-articulos/${idEntrada}/pdf`, {
    responseType: 'blob'
  })

  return data
}

export const descargarEntradaPdf = async (
  idEntrada: number,
  folio?: string
): Promise<void> => {
  const blob = await obtenerEntradaPdfBlob(idEntrada)
  const url = window.URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = `${folio || `entrada-${idEntrada}`}.pdf`

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  window.URL.revokeObjectURL(url)
}

export const imprimirEntradaPdf = async (idEntrada: number): Promise<void> => {
  const blob = await obtenerEntradaPdfBlob(idEntrada)
  const url = window.URL.createObjectURL(blob)

  const ventana = window.open(url, '_blank')

  if (!ventana) {
    window.URL.revokeObjectURL(url)
    throw new Error('No se pudo abrir la ventana para imprimir. Verifica si el navegador bloqueó el popup.')
  }

  const liberarUrl = () => {
    setTimeout(() => {
      window.URL.revokeObjectURL(url)
    }, 10000)
  }

  ventana.onload = () => {
    try {
      ventana.focus()
      ventana.print()
    } catch {
      // no hacemos nada, al menos ya abrió el PDF
    } finally {
      liberarUrl()
    }
  }

  setTimeout(() => {
    liberarUrl()
  }, 12000)
}