import http from '../api/http'

export const listarSalidas = async () => {
    const { data } = await http.get('/api/salidas')
    return data
}