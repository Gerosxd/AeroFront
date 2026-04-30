import http from '../api/http'
import type {
    SalidaArticuloExportRequest
} from '../types/salida-articulo'

export const listarSalidas = async () => {
    const { data } = await http.get('/api/salidas')
    return data
}

export const obtenerSalidaPorId = async (idSalida: number | string) => {
    const { data } = await http.get(`/api/salidas/${idSalida}`)
    return data
}

export const exportarSalidaExcel = async (idSalida: number, payload: SalidaArticuloExportRequest, noSalida?: string): Promise<void> => {
    const { data } = await http.post(`/api/salidas/${idSalida}/exportar-excel`, payload, {
        responseType: 'blob'
    })
    descargarArchivo(data, `${noSalida || idSalida}.xlsx`)
}

export const exportarSalidaPdf = async (idSalida: number, payload: SalidaArticuloExportRequest, noSalida?: string): Promise<void> => {
    const { data } = await http.post(`/api/salidas/${idSalida}/exportar-pdf`, payload, {
        responseType: 'blob'
    })
    descargarArchivo(data, `${noSalida || idSalida}.pdf`)
}

const descargarArchivo = (blob: Blob, nombre: string) => {
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = nombre
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
}