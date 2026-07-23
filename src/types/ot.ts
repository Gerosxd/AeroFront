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

    // P-00: Carátula AG-145-03
    tipoMantenimiento: string | null
    modalidadMantenimiento: string | null
    comentarioTaller: string | null
    componenteDescripcion: string | null
    componenteNumeroParte: string | null
    componenteNumeroSerie: string | null
    componenteCantidad: number | null
    componenteHoras: number | null
    componenteCiclos: number | null
    componenteAeronaveAsociada: string | null
    componenteHorasCiclosRemocion: string | null

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
    // Campos P-03 Hoja de Servicio AG-145-04
    numeroParte: string | null;
    numeroSerie: string | null;
    accionCorrectiva: string | null;
    efectuadoPor: string | null;
    inspeccionadoPor: string | null;
    fechaCumplimiento: string | null;
}

export interface DiscrepanciaResponse {
    idOTDiscrepancia: number;
    codigo: string;
    descripcion: string;
    estatus: string;
    acciones: string | null;
    // Campos P-00 plantilla AG-145-12
    tipoDiscrepancia: string | null;
    hhEstimadas: number | null;
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
    // Campos P-00 plantilla AG-145-03 (carátula)
    tipoMantenimiento: string | null;
    modalidadMantenimiento: string | null;
    comentarioTaller: string | null;
    componenteDescripcion: string | null;
    componenteNumeroParte: string | null;
    componenteNumeroSerie: string | null;
    componenteCantidad: number | null;
    componenteHoras: number | null;
    componenteCiclos: number | null;
    componenteAeronaveAsociada: string | null;
    componenteHorasCiclosRemocion: string | null;
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