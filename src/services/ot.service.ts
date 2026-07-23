import http from '../api/http'
import type {
    AeronaveCombo,
    CrearOTRequest,
    CrearOTResponse,
    SiguienteNoOTResponse,
    OTListado,
    OTDetalle,
} from '../types/ot'



class OTService {
    async obtenerMatriculas(): Promise<AeronaveCombo[]> {
        const { data } = await http.get<AeronaveCombo[]>('/api/ots/matriculas')
        return data
    }

    async obtenerSiguienteNoOT(): Promise<SiguienteNoOTResponse> {
        const { data } = await http.get<SiguienteNoOTResponse>('/api/ots/siguiente-noot')
        return data
    }

    async crearOT(payload: CrearOTRequest): Promise<CrearOTResponse> {
        const { data } = await http.post<CrearOTResponse>('/api/ots', payload)
        return data
    }

    async listarOTs(): Promise<OTListado[]> {
        const { data } = await http.get<OTListado[]>('/api/ots')
        return data
    }

    async obtenerPorId(idOT: number): Promise<OTDetalle> {
        const { data } = await http.get<any>(`/api/ots/${idOT}`)
        return data
    }

    // NUEVO METODO: Para actualizar la Orden de Trabajo modificada en el modal
    async actualizar(idOT: number, payload: OTDetalle): Promise<void> {
        await http.put(`/api/ots/${idOT}`, payload)
    }

    // P-02: Descarga/abre la carátula AG-145-03 en PDF
    async obtenerCaratulaPdf(idOT: number): Promise<Blob> {
        const { data } = await http.get(`/api/ots/${idOT}/caratula-pdf`, {
            responseType: 'blob',
        })
        return data
    }

    // P-03: Hoja de Servicio AG-145-04 de una tarea específica
    async obtenerHojaServicioPdf(idOT: number, idTarea: number): Promise<Blob> {
        const { data } = await http.get(`/api/ots/${idOT}/hoja-servicio-pdf/${idTarea}`, {
            responseType: 'blob',
        })
        return data
    }

    // P-03: Hojas de Servicio de todas las tareas de la OT
    async obtenerHojasServicioPdf(idOT: number): Promise<Blob> {
        const { data } = await http.get(`/api/ots/${idOT}/hojas-servicio-pdf`, {
            responseType: 'blob',
        })
        return data
    }

    // P-04: Formato AG-145-12 de una discrepancia específica
    async obtenerDiscrepanciaPdf(idOT: number, idDiscrepancia: number): Promise<Blob> {
        const { data } = await http.get(`/api/ots/${idOT}/discrepancia-pdf/${idDiscrepancia}`, {
            responseType: 'blob',
        })
        return data
    }

    // P-04: Formato AG-145-12 con todas las discrepancias de la OT
    async obtenerDiscrepanciasPdf(idOT: number): Promise<Blob> {
        const { data } = await http.get(`/api/ots/${idOT}/discrepancias-pdf`, {
            responseType: 'blob',
        })
        return data
    }
}

export default new OTService()