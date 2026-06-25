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
}

export default new OTService()