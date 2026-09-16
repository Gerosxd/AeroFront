<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import otService from '../services/ot.service'
import { hhmmADecimal } from '../utils/timeFormat'

// Importaciones de servicios y tipos relacionales estructurados
import { programadaService } from '../services/programada.service'
import type { TareaProgramada } from '../types/programada'
import { listarClientes } from '../services/cliente.service';

import type {
  AeronaveCombo,
  CrearOTRequest,
  TareaMantenimientoRequest,
  DiscrepanciaOTRequest,
} from '../types/ot'

const cargandoInicial = ref(false)
const guardando = ref(false)
const error = ref('')
const success = ref('')

const matriculas = ref<AeronaveCombo[]>([])
const noOT = ref('')

// Punto 3: horas totales de la OT en HH:MM -> decimal para el backend
const horasTotalesHHMM = ref('')
const horasTotalesInvalidas = ref(false)
const onHorasTotalesInput = (texto: string) => {
  horasTotalesHHMM.value = texto
  if (!texto.trim()) { form.horasTotales = null; horasTotalesInvalidas.value = false; return }
  const dec = hhmmADecimal(texto)
  if (dec === null) { horasTotalesInvalidas.value = true; return }
  horasTotalesInvalidas.value = false
  form.horasTotales = dec
}

const mostrarFormularioTarea = ref(false)
const mostrarFormularioDiscrepancia = ref(false)

// Catálogo de reportes disponibles para el Popup grande
const reportesDisponibles = ref<TareaProgramada[]>([])
const mostrarPopupReportes = ref(false)
const indiceFilaSeleccionada = ref<number | null>(null)
const filtroPopupReportes = ref('')

// Catálogo de clientes registrados
const clientesDisponibles = ref<any[]>([])

const form = reactive<CrearOTRequest>({
  idAeronave: null,
  idCliente: null,

  fechaApertura: null,
  fechaEntrega: null,
  fechaCierre: null,

  horasTotales: null,
  ciclosTotales: null,

  tiempoMotor1: null,
  cicloMotor1: null,

  tiempoMotor2: null,
  cicloMotor2: null,

  tiempoMotor3: null,
  cicloMotor3: null,

  tiempoAPU: null,
  cicloAPU: null,

  comentarioCliente: '',

  // P-00: Carátula AG-145-03
  tipoMantenimiento: null,
  modalidadMantenimiento: null,
  tipoAeronave: null,        // B3
  tipoAeronaveOtro: null,    // B3
  comentarioTaller: null,
  componenteDescripcion: null,
  componenteNumeroParte: null,
  componenteNumeroSerie: null,
  componenteCantidad: null,
  componenteHoras: null,
  componenteCiclos: null,
  componenteAeronaveAsociada: null,
  componenteHorasCiclosRemocion: null,

  tareasMantenimiento: [
    { codigo: '', descripcion: '', tecnicos: '', horasTotales: null, tipoTarea: 'Programada' }
  ],
  discrepancias: [],
})

const tareaForm = reactive<TareaMantenimientoRequest>({
  codigo: '',
  descripcion: '',
  tecnicos: '',
  horasTotales: null,
  tipoTarea: '',
})

const discrepanciaForm = reactive<DiscrepanciaOTRequest>({
  codigo: '',
  descripcion: '',
  estatus: '',
  acciones: '',
})

const totalTareas = computed(() => form.tareasMantenimiento.length)
const totalDiscrepancias = computed(() => form.discrepancias.length)

const agregarNuevaFilaTarea = () => {
  form.tareasMantenimiento.push({
    codigo: '',
    descripcion: '',
    tecnicos: '',
    horasTotales: null,
    tipoTarea: 'Programada'
  })
}

const eliminarFilaTarea = (index: number) => {
  if (form.tareasMantenimiento.length > 1) {
    form.tareasMantenimiento.splice(index, 1)
  } else {
    alert("La Orden de Trabajo debe contener al menos una tarea de mantenimiento.")
  }
}

const abrirPopupReportes = (index: number) => {
  indiceFilaSeleccionada.value = index
  filtroPopupReportes.value = ''
  mostrarPopupReportes.value = true
}

// Filtro en tiempo real para el Popup grande
const reportesFiltradosPopup = computed(() => {
  if (!filtroPopupReportes.value.trim()) return reportesDisponibles.value
  const q = filtroPopupReportes.value.toLowerCase()
  return reportesDisponibles.value.filter(r =>
      r.codigo?.toLowerCase().includes(q) ||
      r.descripcion?.toLowerCase().includes(q)
  )
})

const seleccionarReporteDesdePopup = (reporte: TareaProgramada) => {
  if (indiceFilaSeleccionada.value !== null) {
    form.tareasMantenimiento[indiceFilaSeleccionada.value].codigo = reporte.codigo
    form.tareasMantenimiento[indiceFilaSeleccionada.value].descripcion = reporte.descripcion
  }
  mostrarPopupReportes.value = false
  indiceFilaSeleccionada.value = null
}

function limpiarMensajes() {
  error.value = ''
  success.value = ''
}

function obtenerFechaHoraLocalInput(): string {
  const ahora = new Date()
  const offset = ahora.getTimezoneOffset()
  const local = new Date(ahora.getTime() - offset * 60000)
  return local.toISOString().slice(0, 16)
}

function resetTareaForm() {
  tareaForm.codigo = ''
  tareaForm.descripcion = ''
  tareaForm.tecnicos = ''
  tareaForm.horasTotales = null
  tareaForm.tipoTarea = ''
}

function resetDiscrepanciaForm() {
  discrepanciaForm.codigo = ''
  discrepanciaForm.descripcion = ''
  discrepanciaForm.estatus = ''
  discrepanciaForm.acciones = ''
}

function resetFormularioPrincipal() {
  form.idAeronave = null
  form.idCliente = null

  form.fechaApertura = obtenerFechaHoraLocalInput()
  form.fechaEntrega = null
  form.fechaCierre = null

  form.horasTotales = null
  horasTotalesHHMM.value = ''
  horasTotalesInvalidas.value = false
  form.ciclosTotales = null

  form.tiempoMotor1 = null
  form.cicloMotor1 = null

  form.tiempoMotor2 = null
  form.cicloMotor2 = null

  form.tiempoMotor3 = null
  form.cicloMotor3 = null

  form.tiempoAPU = null
  form.cicloAPU = null

  form.comentarioCliente = ''

  form.tipoMantenimiento = null
  form.modalidadMantenimiento = null
  form.tipoAeronave = null
  form.tipoAeronaveOtro = null
  form.comentarioTaller = null
  form.componenteDescripcion = null
  form.componenteNumeroParte = null
  form.componenteNumeroSerie = null
  form.componenteCantidad = null
  form.componenteHoras = null
  form.componenteCiclos = null
  form.componenteAeronaveAsociada = null
  form.componenteHorasCiclosRemocion = null

  form.tareasMantenimiento = [
    { codigo: '', descripcion: '', tecnicos: '', horasTotales: null, tipoTarea: 'Programada' }
  ]
  form.discrepancias = []

  mostrarFormularioTarea.value = false
  mostrarFormularioDiscrepancia.value = false

  resetTareaForm()
  resetDiscrepanciaForm()
}

async function cargarDatosIniciales() {
  try {
    cargandoInicial.value = true
    limpiarMensajes()

    const [matriculasResp, noOTResp, clientesResp] = await Promise.all([
      otService.obtenerMatriculas(),
      otService.obtenerSiguienteNoOT(),
      listarClientes()
    ])

    matriculas.value = matriculasResp
    noOT.value = noOTResp.noOT
    clientesDisponibles.value = clientesResp

    if (!form.fechaApertura) {
      form.fechaApertura = obtenerFechaHoraLocalInput()
    }
  } catch (err: any) {
    error.value = err?.response?.data || err?.message || 'No se pudieron cargar los datos iniciales.'
  } finally {
    cargandoInicial.value = false
  }
}

function eliminarTarea(index: number) {
  form.tareasMantenimiento.splice(index, 1)
}

function agregarDiscrepancia() {
  limpiarMensajes()
  if (!discrepanciaForm.codigo.trim()) {
    error.value = 'El código de la discrepancia es obligatorio.'
    return
  }
  if (!discrepanciaForm.descripcion.trim()) {
    error.value = 'La descripción de la discrepancia es obligatoria.'
    return
  }

  form.discrepancias.push({
    codigo: discrepanciaForm.codigo.trim(),
    descripcion: discrepanciaForm.descripcion.trim(),
    estatus: discrepanciaForm.estatus.trim(),
    acciones: discrepanciaForm.acciones.trim(),
  })

  resetDiscrepanciaForm()
  mostrarFormularioDiscrepancia.value = false
}

function eliminarDiscrepancia(index: number) {
  form.discrepancias.splice(index, 1)
}

function validarFormulario(): boolean {
  limpiarMensajes()
  if (!form.idAeronave) {
    error.value = 'La matrícula es obligatoria.'
    return false
  }
  if (!form.idCliente) {
    error.value = 'El cliente es obligatorio.'
    return false
  }
  return true
}

async function crearOT() {
  if (!validarFormulario()) return

  try {
    guardando.value = true
    limpiarMensajes()

    // SOLUCIÓN: Cambiar 'idCliente: null' por 'form.idCliente' para que se guarde en MySQL
    const payload: CrearOTRequest = {
      noOT: noOT.value?.trim() || '', // B2: folio manual; vacío = el backend autogenera
      idAeronave: form.idAeronave,
      idCliente: form.idCliente,

      fechaApertura: form.fechaApertura,
      fechaEntrega: form.fechaEntrega || null,
      fechaCierre: form.fechaCierre || null,

      horasTotales: form.horasTotales,
      ciclosTotales: form.ciclosTotales,

      tiempoMotor1: form.tiempoMotor1,
      cicloMotor1: form.cicloMotor1,

      tiempoMotor2: form.tiempoMotor2,
      cicloMotor2: form.cicloMotor2,

      tiempoMotor3: form.tiempoMotor3,
      cicloMotor3: form.cicloMotor3,

      tiempoAPU: form.tiempoAPU,
      cicloAPU: form.cicloAPU,

      comentarioCliente: form.comentarioCliente,

      tipoMantenimiento: form.tipoMantenimiento,
      modalidadMantenimiento: form.modalidadMantenimiento,
      tipoAeronave: form.tipoAeronave,
      tipoAeronaveOtro: form.tipoAeronave === 'OTRO' ? form.tipoAeronaveOtro : null,
      comentarioTaller: form.comentarioTaller,
      componenteDescripcion: form.tipoMantenimiento === 'COMPONENTE' ? form.componenteDescripcion : null,
      componenteNumeroParte: form.tipoMantenimiento === 'COMPONENTE' ? form.componenteNumeroParte : null,
      componenteNumeroSerie: form.tipoMantenimiento === 'COMPONENTE' ? form.componenteNumeroSerie : null,
      componenteCantidad: form.tipoMantenimiento === 'COMPONENTE' ? form.componenteCantidad : null,
      componenteHoras: form.tipoMantenimiento === 'COMPONENTE' ? form.componenteHoras : null,
      componenteCiclos: form.tipoMantenimiento === 'COMPONENTE' ? form.componenteCiclos : null,
      componenteAeronaveAsociada: form.tipoMantenimiento === 'COMPONENTE' ? form.componenteAeronaveAsociada : null,
      componenteHorasCiclosRemocion: form.tipoMantenimiento === 'COMPONENTE' ? form.componenteHorasCiclosRemocion : null,

      tareasMantenimiento: form.tareasMantenimiento,
      discrepancias: form.discrepancias,
    }

    const response = await otService.crearOT(payload)
    success.value = `OT creada correctamente con folio ${response.noOT}.`

    resetFormularioPrincipal()
    await cargarDatosIniciales()
  } catch (err: any) {
    error.value = err?.response?.data || err?.message || 'Ocurrió un error al crear la OT.'
  } finally {
    guardando.value = false
  }
}

function cancelarFormulario() {
  const hayCambios =
      form.idAeronave !== null ||
      form.idCliente !== null ||
      !!form.fechaEntrega ||
      !!form.fechaCierre ||
      form.horasTotales !== null ||
      form.ciclosTotales !== null ||
      form.tiempoMotor1 !== null ||
      form.cicloMotor1 !== null ||
      form.tiempoMotor2 !== null ||
      form.cicloMotor2 !== null ||
      form.tiempoMotor3 !== null ||
      form.cicloMotor3 !== null ||
      form.tiempoAPU !== null ||
      form.cicloAPU !== null ||
      form.comentarioCliente.trim() !== '' ||
      form.tareasMantenimiento.length > 0 ||
      form.discrepancias.length > 0

  if (hayCambios) {
    const confirmar = window.confirm('Hay información sin guardar. ¿Deseas cancelar y perder los cambios?')
    if (!confirmar) return
  }

  limpiarMensajes()
  resetFormularioPrincipal()
}

function visualizarOT() { window.alert('La vista previa no se implementará por ahora.'); }

onMounted(async () => {
  try {
    reportesDisponibles.value = await programadaService.listarTodas()
    clientesDisponibles.value = await listarClientes()
  } catch (err) {
    console.error("Error al cargar reportes programados o clientes:", err)
  }
  resetFormularioPrincipal()
  await cargarDatosIniciales()
})
</script>

<template>
  <div class="max-w-6xl mx-auto">
    <div class="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

      <div class="px-6 py-5 border-b border-gray-200">
        <h2 class="text-3xl font-bold text-slate-900">Crear OT</h2>
        <p class="text-sm text-gray-500 mt-1">Captura la información de la orden de trabajo aeronáutica.</p>
      </div>

      <div class="p-6 space-y-6 bg-slate-50">
        <div v-if="cargandoInicial" class="text-sm text-gray-500">Cargando información inicial...</div>

        <div v-if="error" class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{{ error }}</div>
        <div v-if="success" class="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{{ success }}</div>

        <section class="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
          <h3 class="text-lg font-semibold text-slate-900">Datos de la OT</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">No. OT</label>
              <!-- B2 (comentario 7): editable. El backend respeta el valor manual;
                   si se deja el sugerido, usa el consecutivo autogenerado. -->
              <input v-model="noOT" type="text" placeholder="Ej. AG/OT/26-031" class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none" />
              <p class="text-xs text-gray-400 mt-1">Sugerido automáticamente. Puedes editarlo si la OT real usa otro folio.</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Matrícula *</label>
              <select v-model="form.idAeronave" class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none">
                <option :value="null">Seleccionar matrícula</option>
                <option v-for="aeronave in matriculas" :key="aeronave.idAeronave" :value="aeronave.idAeronave">{{ aeronave.matricula }}</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Cliente / Compañía *</label>
              <select v-model="form.idCliente" class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none">
                <option :value="null">Seleccionar cliente</option>
                <option v-for="cli in clientesDisponibles" :key="cli.idCliente" :value="cli.idCliente">{{ cli.compania }}</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Fecha de apertura</label>
              <input v-model="form.fechaApertura" type="datetime-local" class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Fecha de entrega</label>
              <input v-model="form.fechaEntrega" type="date" class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Fecha de cierre</label>
              <input v-model="form.fechaCierre" type="date" class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Horas totales (HH:MM)</label>
              <input :value="horasTotalesHHMM" @input="onHorasTotalesInput(($event.target as HTMLInputElement).value)" type="text" inputmode="numeric" placeholder="Ej. 9756:40" :class="['w-full rounded-lg border bg-white px-3 py-2 text-sm', horasTotalesInvalidas ? 'border-red-400' : 'border-gray-300']" />
              <p v-if="horasTotalesInvalidas" class="text-xs text-red-500 mt-1">Formato inválido. Usa horas:minutos, ej. 1250:30</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Ciclos totales</label>
              <input v-model.number="form.ciclosTotales" type="number" min="0" step="1" class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm" />
            </div>
          </div>
        </section>

        <!-- P-00: Tipo de Orden de Trabajo (Carátula AG-145-03) -->
        <section class="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
          <h3 class="text-lg font-semibold text-slate-900">Tipo de Orden de Trabajo</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tipo de servicio</label>
              <select v-model="form.tipoMantenimiento" class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none">
                <option :value="null">Seleccionar tipo</option>
                <option value="AERONAVE">Mantenimiento de Aeronave</option>
                <option value="COMPONENTE">Reparación de Componente</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Modalidad</label>
              <select v-model="form.modalidadMantenimiento" class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none">
                <option :value="null">Seleccionar modalidad</option>
                <option value="PROGRAMADO">Mantenimiento Programado</option>
                <option value="NO_PROGRAMADO">Mantenimiento No Programado</option>
              </select>
            </div>
            <!-- B3 (comentarios 9 y 12): tipo de aeronave para la carátula -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tipo de aeronave</label>
              <select v-model="form.tipoAeronave" class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none">
                <option :value="null">Seleccionar tipo</option>
                <option value="ALA_FIJA">Ala Fija</option>
                <option value="ALA_ROTATIVA">Ala Rotativa</option>
                <option value="OTRO">Otro</option>
              </select>
            </div>
            <div v-if="form.tipoAeronave === 'OTRO'">
              <label class="block text-sm font-medium text-gray-700 mb-1">Especificar (Otro)</label>
              <input v-model="form.tipoAeronaveOtro" type="text" placeholder="Ej. Planeador, Dron" class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none" />
            </div>
          </div>

          <!-- Bloque de componente: solo cuando es Reparación de Componente -->
          <div v-if="form.tipoMantenimiento === 'COMPONENTE'" class="border border-blue-200 bg-blue-50/40 rounded-lg p-4 space-y-3">
            <h4 class="text-sm font-semibold text-slate-800">Información de Componente</h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div class="lg:col-span-2">
                <label class="block text-xs font-medium text-gray-600 mb-1">Descripción</label>
                <input v-model="form.componenteDescripcion" type="text" class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Cantidad</label>
                <input v-model.number="form.componenteCantidad" type="number" min="1" step="1" class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Número de parte</label>
                <input v-model="form.componenteNumeroParte" type="text" class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Número de serie</label>
                <input v-model="form.componenteNumeroSerie" type="text" class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Horas totales</label>
                <input v-model.number="form.componenteHoras" type="number" min="0" step="0.01" class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Ciclos totales</label>
                <input v-model.number="form.componenteCiclos" type="number" min="0" step="1" class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Aeronave asociada (matrícula)</label>
                <input v-model="form.componenteAeronaveAsociada" type="text" placeholder="Ej. XA-ABC" class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Horas / Ciclos al momento de remoción</label>
                <input v-model="form.componenteHorasCiclosRemocion" type="text" placeholder="Ej. 1250.5 hrs / 830 ciclos" class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none" />
              </div>
            </div>
          </div>
        </section>

        <section class="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
          <h3 class="text-lg font-semibold text-slate-900">Info. Motores</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="flex flex-col space-y-1">
              <label class="text-sm font-medium text-gray-700">Tiempo motor 1</label>
              <input v-model.number="form.tiempoMotor1" type="number" min="0" step="0.01" class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none" />
            </div>
            <div class="flex flex-col space-y-1">
              <label class="text-sm font-medium text-gray-700">Tiempo motor 2</label>
              <input v-model.number="form.tiempoMotor2" type="number" min="0" step="0.01" class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none" />
            </div>
            <div class="flex flex-col space-y-1">
              <label class="text-sm font-medium text-gray-700">Tiempo motor 3</label>
              <input v-model.number="form.tiempoMotor3" type="number" min="0" step="0.01" class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none" />
            </div>
            <div class="flex flex-col space-y-1">
              <label class="text-sm font-medium text-gray-700">Tiempo APU</label>
              <input v-model.number="form.tiempoAPU" type="number" min="0" step="0.01" class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none" />
            </div>
            <div class="flex flex-col space-y-1">
              <label class="text-sm font-medium text-gray-700">Ciclos motor 1</label>
              <input v-model.number="form.cicloMotor1" type="number" min="0" step="1" class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none" />
            </div>
            <div class="flex flex-col space-y-1">
              <label class="text-sm font-medium text-gray-700">Ciclos motor 2</label>
              <input v-model.number="form.cicloMotor2" type="number" min="0" step="1" class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none" />
            </div>
            <div class="flex flex-col space-y-1">
              <label class="text-sm font-medium text-gray-700">Ciclos motor 3</label>
              <input v-model.number="form.cicloMotor3" type="number" min="0" step="1" class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none" />
            </div>
            <div class="flex flex-col space-y-1">
              <label class="text-sm font-medium text-gray-700">Ciclos APU</label>
              <input v-model.number="form.cicloAPU" type="number" min="0" step="1" class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none" />
            </div>
          </div>
          <div class="pt-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">Comentarios adicionales solicitados por el cliente</label>
            <textarea v-model="form.comentarioCliente" rows="4" class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm resize-none outline-none" />
          </div>
          <div class="pt-2">
            <!-- B4 (comentario 10): comentarios del responsable de taller para la carátula AG-145-03 -->
            <label class="block text-sm font-medium text-gray-700 mb-1">Comentarios del Responsable de Taller</label>
            <textarea v-model="form.comentarioTaller" rows="4" placeholder="Observaciones del taller sobre la orden de trabajo" class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm resize-none outline-none" />
          </div>
        </section>

        <section class="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
          <div class="flex items-center justify-between border-b pb-2">
            <h3 class="text-lg font-semibold text-slate-900">Tareas de mantenimiento</h3>
            <button type="button" @click="agregarNuevaFilaTarea" class="rounded-lg bg-slate-900 text-white px-3 py-1.5 text-xs font-medium hover:bg-slate-800">+ Agregar Tarea</button>
          </div>

          <div class="overflow-x-auto border border-gray-200 rounded-lg">
            <table class="min-w-full text-sm text-left border-collapse">
              <thead class="bg-gray-50 text-gray-600 font-semibold text-xs border-b">
              <tr>
                <th class="px-4 py-2 w-1/3">Código / Reporte Programado</th>
                <th class="px-4 py-2 w-1/3">Descripción</th>
                <th class="px-4 py-2 w-1/4">Técnicos</th>
                <th class="px-4 py-2 w-24 text-right">Horas</th>
                <th class="px-4 py-2 text-center w-12">Acción</th>
              </tr>
              </thead>
              <tbody>
              <tr v-if="form.tareasMantenimiento.length === 0"><td colspan="5" class="px-4 py-6 text-center text-gray-500">Aún no hay tareas agregadas.</td></tr>
              <tr v-for="(tarea, index) in form.tareasMantenimiento" :key="index" class="border-t">
                <td class="px-4 py-2 align-middle">
                  <button
                      type="button"
                      @click="abrirPopupReportes(index)"
                      class="w-full text-left bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-xs text-blue-600 font-bold hover:bg-gray-100 flex justify-between items-center transition-colors outline-none"
                  >
                    <span class="truncate">{{ tarea.codigo || 'Buscar Reporte...' }}</span>
                    <span class="text-gray-400 text-xs">🔍</span>
                  </button>
                </td>
                <td class="px-4 py-2"><input v-model="tarea.descripcion" type="text" class="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs outline-none" /></td>
                <td class="px-4 py-2"><input v-model="tarea.tecnicos" type="text" class="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs outline-none" /></td>
                <td class="px-4 py-2 text-right"><input v-model.number="form.tareasMantenimiento[index].horasTotales" type="number" min="0" step="0.01" class="w-20 text-right rounded-lg border border-gray-300 px-2 py-2 text-xs outline-none inline-block" /></td>
                <td class="px-4 py-2 text-center"><button type="button" @click="eliminarFilaTarea(index)" class="text-red-600 hover:text-red-800 font-semibold">Quitar</button></td>
              </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section class="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
          <div class="flex items-center gap-2"><h3 class="text-lg font-semibold text-slate-900">Discrepancias</h3><button type="button" @click="abrirFormularioDiscrepancia" class="w-7 h-7 rounded-full bg-slate-700 text-white flex items-center justify-center hover:bg-slate-800">+</button></div>
          <div v-if="mostrarFormularioDiscrepancia" class="grid grid-cols-1 md:grid-cols-4 gap-3 p-4 rounded-xl border border-gray-200 bg-slate-50">
            <input v-model="discrepanciaForm.codigo" type="text" placeholder="Código" class="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
            <input v-model="discrepanciaForm.descripcion" type="text" placeholder="Descripción" class="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
            <input v-model="discrepanciaForm.estatus" type="text" placeholder="Estatus" class="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
            <div class="flex gap-2">
              <input v-model="discrepanciaForm.acciones" type="text" placeholder="Acciones" class="rounded-lg border border-gray-300 px-3 py-2 text-sm w-full" />
              <button type="button" @click="agregarDiscrepancia" class="rounded-lg bg-slate-900 text-white px-4 py-2 text-sm hover:bg-slate-800">Agregar</button>
            </div>
          </div>
          <div class="overflow-x-auto border border-gray-200 rounded-lg">
            <table class="min-w-full text-sm">
              <thead class="bg-gray-50 text-gray-600"><tr><th class="px-3 py-2 text-left">Código</th><th class="px-3 py-2 text-left">Descripción</th><th class="px-3 py-2 text-left">Estatus</th><th class="px-3 py-2 text-left">Acciones</th><th class="px-3 py-2 text-left">Acción</th></tr></thead>
              <tbody>
              <tr v-if="form.discrepancias.length === 0"><td colspan="5" class="px-3 py-6 text-center text-gray-500">Aún no hay discrepancias agregadas.</td></tr>
              <tr v-for="(discrepancia, index) in form.discrepancias" :key="index" class="border-t">
                <td class="px-3 py-2">{{ discrepancy.codigo }}</td>
                <td class="px-3 py-2">{{ discrepancy.descripcion }}</td>
                <td class="px-3 py-2">{{ discrepancy.estatus || '-' }}</td>
                <td class="px-3 py-2">{{ discrepancy.acciones || '-' }}</td>
                <td class="px-3 py-2"><button type="button" @click="eliminarDiscrepancy(index)" class="text-red-600 hover:text-red-800">Quitar</button></td>
              </tr>
              </tbody>
            </table>
          </div>
        </section>

        <div class="flex flex-wrap justify-between items-center gap-3 pt-2">
          <div class="flex gap-3">
            <button type="button" @click="cancelarFormulario" class="rounded-lg bg-red-500 text-white px-5 py-2.5 text-sm font-medium hover:bg-red-600">Cancelar</button>
            <button type="button" :disabled="guardando" @click="crearOT" class="rounded-lg bg-slate-900 text-white px-5 py-2.5 text-sm font-medium hover:bg-slate-800 disabled:opacity-60">{{ guardando ? 'Guardando...' : 'Crear OT' }}</button>
          </div>
          <button type="button" @click="visualizarOT" class="rounded-lg bg-slate-900 text-white px-5 py-2.5 text-sm font-medium hover:bg-slate-800">Visualizar</button>
        </div>

      </div>
    </div>

    <div v-if="mostrarPopupReportes" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div class="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        <div class="px-6 py-4 bg-slate-900 text-white flex justify-between items-center">
          <h3 class="text-base font-bold">Seleccionar Reporte Programado</h3>
          <button type="button" @click="mostrarPopupReportes = false" class="text-gray-400 hover:text-white text-lg">✕</button>
        </div>

        <div class="p-4 bg-slate-50 border-b border-gray-200">
          <input
              v-model="filtroPopupReportes"
              type="text"
              placeholder="Buscar por código o descripción de ingeniería..."
              class="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 shadow-inner"
          />
        </div>

        <div class="overflow-y-auto divide-y divide-gray-100 flex-1 bg-white">
          <div
              v-for="rep in reportesFiltradosPopup"
              :key="rep.codigo"
              @click="seleccionarReporteDesdePopup(rep)"
              class="p-4 hover:bg-blue-50/70 cursor-pointer transition-colors"
          >
            <div class="font-bold text-blue-600 font-mono text-sm tracking-wide">{{ rep.codigo }}</div>
            <div class="text-gray-700 text-sm mt-1 leading-relaxed whitespace-normal break-words font-medium">{{ rep.descripcion }}</div>
          </div>
          <div v-if="reportesFiltradosPopup.length === 0" class="p-8 text-center text-gray-400 italic text-sm">
            No se encontraron reportes que coincidan con la búsqueda.
          </div>
        </div>
      </div>
    </div>

  </div>
</template>