export interface AeronaveCombo {
    idAeronave: number
    matricula: string
}

export interface SiguienteNoOTResponse {
    noOT: string
}

export interface TareaMantenimientoRequest {
    codigo: string
    descripcion: string
    tecnicos: string
    horasTotales: number | null
    tipoTarea: string
}

export interface DiscrepanciaOTRequest {
    codigo: string
    descripcion: string
    estatus: string
    acciones: string
}

export interface CrearOTRequest {
    idAeronave: number | null
    idCliente: number | null

    fechaApertura: string | null
    fechaEntrega: string | null
    fechaCierre: string | null

    horasTotales: number | null
    ciclosTotales: number | null

    tiempoMotor1: number | null
    cicloMotor1: number | null

    tiempoMotor2: number | null
    cicloMotor2: number | null

    tiempoMotor3: number | null
    cicloMotor3: number | null

    tiempoAPU: number | null
    cicloAPU: number | null

    comentarioCliente: string

    tareasMantenimiento: TareaMantenimientoRequest[]
    discrepancias: DiscrepanciaOTRequest[]
}

export interface CrearOTResponse {
    idOT: number
    noOT: string
    mensaje: string
}

export interface OTListado {
    idOT: number
    noOT: string
    matricula: string | null
    cliente: string | null
    fechaCreacion: string | null
    fechaEntrega: string | null
    fechaCierre: string | null
    estado: string | null
}

export interface TareaMantenimientoResponse {
    idTareaOT: number;
    codigo: string;
    descripcion: string;
    tecnicos: string | null;
    horasTotales: number;
    tipoTarea: string | null;
    // Campos complementarios T-08
    tipoServicio: string | null;
    intervalo: string | null;
    requiereRII: string | null;
    parteAsociada: string | null;
}

export interface DiscrepanciaResponse {
    idOTDiscrepancia: number;
    codigo: string;
    descripcion: string;
    estatus: string;
    acciones: string | null;
    // Campos complementarios T-08
    aeronavegable: string | null;
    fechaAutorizada: string | null;
    accionCorrectiva: string | null;
    fechaLiberacion: string | null;
    efectuadoPor: string | null;
    inspeccionadoPor: string | null;
    parteAsociada: string | null;
}

export interface OTDetalle {
    idOT: number;
    noOT: string;
    matricula: string;
    modeloAeronave: string | null;
    clienteCompania: string;
    clienteContacto: string | null;
    comentarioCliente: string | null;
    estado: string;
    fechaCreacion: string;
    fechaApertura: string;
    fechaEntrega: string | null;
    fechaCierre: string | null;

    // Contadores de Ingeniería
    horasTotales: number;
    ciclosTotales: number;
    tiempoMotor1: number | null;
    cicloMotor1: number | null;
    tiempoMotor2: number | null;
    cicloMotor2: number | null;
    tiempoMotor3: number | null;
    cicloMotor3: number | null;
    tiempoAPU: number | null;
    cicloAPU: number | null;

    // Colecciones hijas relacionales
    tareasMantenimiento: TareaMantenimientoResponse[];
    discrepancias: DiscrepanciaResponse[];
}