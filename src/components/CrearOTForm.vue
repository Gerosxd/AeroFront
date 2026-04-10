<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import otService from '../services/ot.service'
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

const mostrarFormularioTarea = ref(false)
const mostrarFormularioDiscrepancia = ref(false)

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

  tareasMantenimiento: [],
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

  form.tareasMantenimiento = []
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

    const [matriculasResp, noOTResp] = await Promise.all([
      otService.obtenerMatriculas(),
      otService.obtenerSiguienteNoOT(),
    ])

    matriculas.value = matriculasResp
    noOT.value = noOTResp.noOT

    if (!form.fechaApertura) {
      form.fechaApertura = obtenerFechaHoraLocalInput()
    }
  } catch (err: any) {
    error.value =
      err?.response?.data ||
      err?.message ||
      'No se pudieron cargar los datos iniciales.'
  } finally {
    cargandoInicial.value = false
  }
}

function abrirFormularioTarea() {
  limpiarMensajes()
  mostrarFormularioTarea.value = !mostrarFormularioTarea.value
}

function abrirFormularioDiscrepancia() {
  limpiarMensajes()
  mostrarFormularioDiscrepancia.value = !mostrarFormularioDiscrepancia.value
}

function agregarTarea() {
  limpiarMensajes()

  if (!tareaForm.codigo.trim()) {
    error.value = 'El código de la tarea es obligatorio.'
    return
  }

  if (!tareaForm.descripcion.trim()) {
    error.value = 'La descripción de la tarea es obligatoria.'
    return
  }

  form.tareasMantenimiento.push({
    codigo: tareaForm.codigo.trim(),
    descripcion: tareaForm.descripcion.trim(),
    tecnicos: tareaForm.tecnicos.trim(),
    horasTotales: tareaForm.horasTotales,
    tipoTarea: tareaForm.tipoTarea.trim(),
  })

  resetTareaForm()
  mostrarFormularioTarea.value = false
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

  return true
}

async function crearOT() {
  if (!validarFormulario()) return

  try {
    guardando.value = true
    limpiarMensajes()

    const payload: CrearOTRequest = {
      idAeronave: form.idAeronave,
      idCliente: null,

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

      tareasMantenimiento: form.tareasMantenimiento,
      discrepancias: form.discrepancias,
    }

    const response = await otService.crearOT(payload)

    success.value = `OT creada correctamente con folio ${response.noOT}.`

    resetFormularioPrincipal()
    await cargarDatosIniciales()
  } catch (err: any) {
    error.value =
      err?.response?.data ||
      err?.message ||
      'Ocurrió un error al crear la OT.'
  } finally {
    guardando.value = false
  }
}

function cancelarFormulario() {
  const hayCambios =
    form.idAeronave !== null ||
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
    const confirmar = window.confirm(
      'Hay información sin guardar. ¿Deseas cancelar y perder los cambios?'
    )
    if (!confirmar) return
  }

  limpiarMensajes()
  resetFormularioPrincipal()
}

function visualizarOT() {
  window.alert('La vista previa no se implementará por ahora.')
}

onMounted(async () => {
  resetFormularioPrincipal()
  await cargarDatosIniciales()
})
</script>

<template>
  <div class="max-w-6xl mx-auto">
    <div class="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      <div class="px-6 py-5 border-b border-gray-200">
        <h2 class="text-3xl font-bold text-slate-900">Crear OT</h2>
        <p class="text-sm text-gray-500 mt-1">
          Captura la información de la orden de trabajo aeronáutica.
        </p>
      </div>

      <div class="p-6 space-y-6 bg-slate-50">
        <div v-if="cargandoInicial" class="text-sm text-gray-500">
          Cargando información inicial...
        </div>

        <div
          v-if="error"
          class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {{ error }}
        </div>

        <div
          v-if="success"
          class="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
        >
          {{ success }}
        </div>

        <!-- DATOS PRINCIPALES -->
        <section class="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
          <h3 class="text-lg font-semibold text-slate-900">Datos de la OT</h3>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">No. OT</label>
              <input
                :value="noOT"
                type="text"
                disabled
                class="w-full rounded-lg border border-gray-300 bg-gray-100 px-3 py-2 text-sm text-gray-600"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Matrícula *</label>
              <select
                v-model="form.idAeronave"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
              >
                <option :value="null">Seleccionar matrícula</option>
                <option
                  v-for="aeronave in matriculas"
                  :key="aeronave.idAeronave"
                  :value="aeronave.idAeronave"
                >
                  {{ aeronave.matricula }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Fecha de apertura</label>
              <input
                v-model="form.fechaApertura"
                type="datetime-local"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Fecha de entrega</label>
              <input
                v-model="form.fechaEntrega"
                type="date"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Fecha de cierre</label>
              <input
                v-model="form.fechaCierre"
                type="date"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Horas totales</label>
              <input
                v-model.number="form.horasTotales"
                type="number"
                min="0"
                step="0.01"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Ciclos totales</label>
              <input
                v-model.number="form.ciclosTotales"
                type="number"
                min="0"
                step="1"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
              />
            </div>
          </div>
        </section>

        <!-- INFO MOTORES -->
        <section class="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
          <h3 class="text-lg font-semibold text-slate-900">Info. Motores</h3>

          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tiempo motor 1</label>
              <input v-model.number="form.tiempoMotor1" type="number" min="0" step="0.01"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tiempo motor 2</label>
              <input v-model.number="form.tiempoMotor2" type="number" min="0" step="0.01"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tiempo motor 3</label>
              <input v-model.number="form.tiempoMotor3" type="number" min="0" step="0.01"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tiempo APU</label>
              <input v-model.number="form.tiempoAPU" type="number" min="0" step="0.01"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Ciclos motor 1</label>
              <input v-model.number="form.cicloMotor1" type="number" min="0" step="1"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Ciclos motor 2</label>
              <input v-model.number="form.cicloMotor2" type="number" min="0" step="1"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Ciclos motor 3</label>
              <input v-model.number="form.cicloMotor3" type="number" min="0" step="1"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Ciclos APU</label>
              <input v-model.number="form.cicloAPU" type="number" min="0" step="1"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm" />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Comentarios adicionales solicitados por el cliente
            </label>
            <textarea
              v-model="form.comentarioCliente"
              rows="4"
              class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm resize-none"
            />
          </div>
        </section>

        <!-- TAREAS -->
        <section class="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
          <div class="flex items-center gap-2">
            <h3 class="text-lg font-semibold text-slate-900">Tareas de mantenimiento</h3>
            <button
              type="button"
              @click="abrirFormularioTarea"
              class="w-7 h-7 rounded-full bg-slate-700 text-white flex items-center justify-center hover:bg-slate-800"
            >
              +
            </button>
          </div>

          <div
            v-if="mostrarFormularioTarea"
            class="grid grid-cols-1 md:grid-cols-5 gap-3 p-4 rounded-xl border border-gray-200 bg-slate-50"
          >
            <input v-model="tareaForm.codigo" type="text" placeholder="Código"
              class="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
            <input v-model="tareaForm.descripcion" type="text" placeholder="Descripción"
              class="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
            <input v-model="tareaForm.tecnicos" type="text" placeholder="Técnicos"
              class="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
            <input v-model.number="tareaForm.horasTotales" type="number" min="0" step="0.01" placeholder="Horas totales"
              class="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
            <div class="flex gap-2">
              <input v-model="tareaForm.tipoTarea" type="text" placeholder="Tipo tarea"
                class="rounded-lg border border-gray-300 px-3 py-2 text-sm w-full" />
              <button type="button" @click="agregarTarea"
                class="rounded-lg bg-slate-900 text-white px-4 py-2 text-sm hover:bg-slate-800">
                Agregar
              </button>
            </div>
          </div>

          <div class="overflow-x-auto border border-gray-200 rounded-lg">
            <table class="min-w-full text-sm">
              <thead class="bg-gray-50 text-gray-600">
                <tr>
                  <th class="px-3 py-2 text-left">Código</th>
                  <th class="px-3 py-2 text-left">Descripción</th>
                  <th class="px-3 py-2 text-left">Técnicos</th>
                  <th class="px-3 py-2 text-left">Horas totales</th>
                  <th class="px-3 py-2 text-left">Tipo Tarea</th>
                  <th class="px-3 py-2 text-left">Acción</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="form.tareasMantenimiento.length === 0">
                  <td colspan="6" class="px-3 py-6 text-center text-gray-500">
                    Aún no hay tareas agregadas.
                  </td>
                </tr>
                <tr v-for="(tarea, index) in form.tareasMantenimiento" :key="`${tarea.codigo}-${index}`" class="border-t">
                  <td class="px-3 py-2">{{ tarea.codigo }}</td>
                  <td class="px-3 py-2">{{ tarea.descripcion }}</td>
                  <td class="px-3 py-2">{{ tarea.tecnicos || '-' }}</td>
                  <td class="px-3 py-2">{{ tarea.horasTotales ?? '-' }}</td>
                  <td class="px-3 py-2">{{ tarea.tipoTarea || '-' }}</td>
                  <td class="px-3 py-2">
                    <button type="button" @click="eliminarTarea(index)" class="text-red-600 hover:text-red-800">
                      Quitar
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- DISCREPANCIAS -->
        <section class="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
          <div class="flex items-center gap-2">
            <h3 class="text-lg font-semibold text-slate-900">Discrepancias</h3>
            <button
              type="button"
              @click="abrirFormularioDiscrepancia"
              class="w-7 h-7 rounded-full bg-slate-700 text-white flex items-center justify-center hover:bg-slate-800"
            >
              +
            </button>
          </div>

          <div
            v-if="mostrarFormularioDiscrepancia"
            class="grid grid-cols-1 md:grid-cols-4 gap-3 p-4 rounded-xl border border-gray-200 bg-slate-50"
          >
            <input v-model="discrepanciaForm.codigo" type="text" placeholder="Código"
              class="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
            <input v-model="discrepanciaForm.descripcion" type="text" placeholder="Descripción"
              class="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
            <input v-model="discrepanciaForm.estatus" type="text" placeholder="Estatus"
              class="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
            <div class="flex gap-2">
              <input v-model="discrepanciaForm.acciones" type="text" placeholder="Acciones"
                class="rounded-lg border border-gray-300 px-3 py-2 text-sm w-full" />
              <button type="button" @click="agregarDiscrepancia"
                class="rounded-lg bg-slate-900 text-white px-4 py-2 text-sm hover:bg-slate-800">
                Agregar
              </button>
            </div>
          </div>

          <div class="overflow-x-auto border border-gray-200 rounded-lg">
            <table class="min-w-full text-sm">
              <thead class="bg-gray-50 text-gray-600">
                <tr>
                  <th class="px-3 py-2 text-left">Código</th>
                  <th class="px-3 py-2 text-left">Descripción</th>
                  <th class="px-3 py-2 text-left">Estatus</th>
                  <th class="px-3 py-2 text-left">Acciones</th>
                  <th class="px-3 py-2 text-left">Acción</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="form.discrepancias.length === 0">
                  <td colspan="5" class="px-3 py-6 text-center text-gray-500">
                    Aún no hay discrepancias agregadas.
                  </td>
                </tr>
                <tr v-for="(discrepancia, index) in form.discrepancias" :key="`${discrepancia.codigo}-${index}`" class="border-t">
                  <td class="px-3 py-2">{{ discrepancia.codigo }}</td>
                  <td class="px-3 py-2">{{ discrepancia.descripcion }}</td>
                  <td class="px-3 py-2">{{ discrepancia.estatus || '-' }}</td>
                  <td class="px-3 py-2">{{ discrepancia.acciones || '-' }}</td>
                  <td class="px-3 py-2">
                    <button type="button" @click="eliminarDiscrepancia(index)" class="text-red-600 hover:text-red-800">
                      Quitar
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- BOTONES -->
        <div class="flex flex-wrap justify-between items-center gap-3 pt-2">
          <div class="flex gap-3">
            <button
              type="button"
              @click="cancelarFormulario"
              class="rounded-lg bg-red-500 text-white px-5 py-2.5 text-sm font-medium hover:bg-red-600"
            >
              Cancelar
            </button>

            <button
              type="button"
              :disabled="guardando"
              @click="crearOT"
              class="rounded-lg bg-slate-900 text-white px-5 py-2.5 text-sm font-medium hover:bg-slate-800 disabled:opacity-60"
            >
              {{ guardando ? 'Guardando...' : 'Crear OT' }}
            </button>
          </div>

          <button
            type="button"
            @click="visualizarOT"
            class="rounded-lg bg-slate-900 text-white px-5 py-2.5 text-sm font-medium hover:bg-slate-800"
          >
            Visualizar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>