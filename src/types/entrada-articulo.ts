export interface EntradaArticuloDetalleRequest {
  codigo: string
  noSerie: string
  descripcion: string
  categoria: number
  unidadMedida: number
  cantidad: number
  ubicacion: string
  precioCompra: number
  moneda: number
  condicion: number
}

export interface EntradaArticuloRegistroRequest {
  usuario: number
  proveedor: number
  almacenDestino: number
  estadoEntrada: number
  observaciones: string
  detalles: EntradaArticuloDetalleRequest[]
}

export interface EntradaArticuloDetalleResponse {
  idArticulo: number
  codigo: string
  descripcion: string
  cantidad: number
  ubicacion: string
  precioUnitario: number
}

export interface EntradaArticuloRegistroResponse {
  idEntrada: number
  folio: string
  fechaEntrada: string
  proveedor: string
  almacenDestino: string
  estado: string
  recibidoPor: string
  detalles: EntradaArticuloDetalleResponse[]
}

export interface EntradaArticuloListadoResponse {
  idEntrada: number
  folio: string
  fechaEntrada: string
  proveedor: string
  almacenDestino: string
  recibidoPor: string
  estado: string
  totalArticulos: number
}