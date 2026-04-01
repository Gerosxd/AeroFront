import http from '../api/http'

export interface PayloadNuevaAeronaveBackend {
  matricula: string
  nsAeronave: string
  modeloAeronave: number
  operador: string
  maMotorLH: string
  moMotorLH: string
  nsMotorLH: string
  maMotorRH: string
  moMotorRH: string
  nsMotorRH: string
  maMotorC: string
  moMotorC: string
  nsMotorC: string
  maAPU: string
  moAPU: string
  nsAPU: string
}

export const guardarAeronave = async (payload: PayloadNuevaAeronaveBackend) => {
  const { data } = await http.post('/api/aeronaves', payload)
  return data
}

export const listarAeronaves = async () => {
  const { data } = await http.get('/api/aeronaves')
  return data
}
