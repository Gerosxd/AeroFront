<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { X, Calendar, Wrench, ShieldAlert, ClipboardList, Edit3, Check, RotateCcw, PlusCircle, Search, Printer, Pencil, Trash2 } from 'lucide-vue-next';
import type { OTDetalle, TareaMantenimientoResponse, DiscrepanciaResponse } from '../types/ot';
import type { TareaProgramada } from '../types/programada';

const props = defineProps<{
  open: boolean;
  ot: OTDetalle | null;
  cargando: boolean;
  forzarEdicion?: boolean;
  reportesDisponibles?: TareaProgramada[];
  clientesDisponibles?: any[];
}>();

const emit = defineEmits(['close', 'guardarOT']);

// --- ESTADOS DE EDICIÓN ---
const esEdicion = ref(false);
const otEditable = ref<OTDetalle | null>(null);
const desplegarListaReportes = ref<number | null>(null);

// --- T-03: POPUP AGREGAR TAREAS DESDE REPORTES ---
const mostrarPopupAgregarTarea = ref(false);
const filtroPopupReportes = ref('');

const reportesFiltradosPopup = computed(() => {
  if (!filtroPopupReportes.value.trim()) return props.reportesDisponibles || [];
  const q = filtroPopupReportes.value.toLowerCase();
  return (props.reportesDisponibles || []).filter(r =>
    r.codigo?.toLowerCase().includes(q) ||
    r.descripcion?.toLowerCase().includes(q)
  );
});

const agregarTareaDesdeReporte = (reporte: TareaProgramada) => {
  if (!otEditable.value) return;
  otEditable.value.tareasMantenimiento.push({
    idTareaOT: 0,
    codigo: reporte.codigo,
    descripcion: reporte.descripcion,
    tecnicos: null,
    horasTotales: 0,
    tipoTarea: null,
    tipoServicio: null,
    intervalo: null,
    requiereRII: null,
    parteAsociada: null,
  });
  mostrarPopupAgregarTarea.value = false;
  filtroPopupReportes.value = '';
};

// --- T-04: FORMULARIO AGREGAR DISCREPANCIAS ---
const mostrarFormDiscrepancia = ref(false);
const discrepanciaForm = ref({
  codigo: '',
  descripcion: '',
  estatus: 'Abierta',
  acciones: '',
});

const agregarDiscrepancia = () => {
  if (!otEditable.value || !discrepanciaForm.value.codigo.trim()) return;
  otEditable.value.discrepancias.push({
    idOTDiscrepancia: 0,
    codigo: discrepanciaForm.value.codigo,
    descripcion: discrepanciaForm.value.descripcion,
    estatus: discrepanciaForm.value.estatus,
    acciones: discrepanciaForm.value.acciones,
    aeronavegable: null,
    fechaAutorizada: null,
    accionCorrectiva: null,
    fechaLiberacion: null,
    efectuadoPor: null,
    inspeccionadoPor: null,
    parteAsociada: null,
  });
  discrepanciaForm.value = { codigo: '', descripcion: '', estatus: 'Abierta', acciones: '' };
  mostrarFormDiscrepancia.value = false;
};

// --- T-05: BUSCADORES ---
const busquedaTareas = ref('');
const busquedaDiscrepancias = ref('');

const tareasFiltradas = computed(() => {
  if (!otEditable.value) return [];
  if (!busquedaTareas.value.trim()) return otEditable.value.tareasMantenimiento;
  const q = busquedaTareas.value.toLowerCase();
  return otEditable.value.tareasMantenimiento.filter(t =>
    t.codigo?.toLowerCase().includes(q) ||
    t.descripcion?.toLowerCase().includes(q)
  );
});

const discrepanciasFiltradas = computed(() => {
  if (!otEditable.value) return [];
  if (!busquedaDiscrepancias.value.trim()) return otEditable.value.discrepancias;
  const q = busquedaDiscrepancias.value.toLowerCase();
  return otEditable.value.discrepancias.filter(d =>
    d.codigo?.toLowerCase().includes(q) ||
    d.descripcion?.toLowerCase().includes(q)
  );
});

// --- T-06: IMPRESIÓN ---
const imprimirCaratula = () => {
  window.print();
};

// --- T-07: ACCIONES POR FILA ---
const eliminarTarea = (idx: number) => {
  if (!otEditable.value) return;
  otEditable.value.tareasMantenimiento.splice(idx, 1);
};

const eliminarDiscrepancia = (idx: number) => {
  if (!otEditable.value) return;
  otEditable.value.discrepancias.splice(idx, 1);
};

// --- T-08: DATOS COMPLEMENTARIOS ---
const mostrarEdicionTarea = ref<number | null>(null);
const mostrarEdicionDiscrepancia = ref<number | null>(null);

const abrirEdicionTarea = (idx: number) => {
  // Inicializar campos complementarios si están vacíos
  const t = otEditable.value?.tareasMantenimiento[idx];
  if (t) {
    if (!t.tipoServicio) t.tipoServicio = '';
    if (!t.intervalo) t.intervalo = '';
    if (!t.requiereRII) t.requiereRII = 'NO';
    if (!t.parteAsociada) t.parteAsociada = '';
  }
  mostrarEdicionTarea.value = idx;
};

const abrirEdicionDiscrepancia = (idx: number) => {
  // Inicializar campos complementarios si están vacíos
  const d = otEditable.value?.discrepancias[idx];
  if (d) {
    if (!d.aeronavegable) d.aeronavegable = 'NO';
    if (!d.fechaAutorizada) d.fechaAutorizada = '';
    if (!d.accionCorrectiva) d.accionCorrectiva = '';
    if (!d.fechaLiberacion) d.fechaLiberacion = '';
    if (!d.efectuadoPor) d.efectuadoPor = '';
    if (!d.inspeccionadoPor) d.inspeccionadoPor = '';
    if (!d.parteAsociada) d.parteAsociada = '';
  }
  mostrarEdicionDiscrepancia.value = idx;
};

// Sincronizar datos de forma segura sin mutar la Prop directamente
watch(
    () => [props.open, props.ot, props.cargando],
    ([isOpen, currentOt, isCargando]) => {
      if (isOpen && currentOt && !isCargando) {
        otEditable.value = JSON.parse(JSON.stringify(currentOt));
        otEditable.value.tareasMantenimiento = otEditable.value.tareasMantenimiento || [];
        otEditable.value.discrepancias = otEditable.value.discrepancias || [];
        esEdicion.value = !!props.forzarEdicion;
        // Reset estados locales
        busquedaTareas.value = '';
        busquedaDiscrepancias.value = '';
        mostrarEdicionTarea.value = null;
        mostrarEdicionDiscrepancia.value = null;
      }
    },
    { immediate: true, deep: true }
);

const activarEdicion = () => {
  esEdicion.value = true;
};

const cancelarEdicion = () => {
  if (props.ot) {
    otEditable.value = JSON.parse(JSON.stringify(props.ot));
  }
  esEdicion.value = false;
  desplegarListaReportes.value = null;
  mostrarEdicionTarea.value = null;
  mostrarEdicionDiscrepancia.value = null;
};

const seleccionarReporteParaTarea = (indexTarea: number, reporte: TareaProgramada) => {
  if (!otEditable.value?.tareasMantenimiento[indexTarea]) return;
  otEditable.value.tareasMantenimiento[indexTarea].codigo = reporte.codigo;
  otEditable.value.tareasMantenimiento[indexTarea].descripcion = reporte.descripcion;
  desplegarListaReportes.value = null;
};

const enviarGuardado = () => {
  emit('guardarOT', otEditable.value);
  esEdicion.value = false;
};

const getStatusColor = (estado: string) => {
  switch (estado) {
    case 'Abierta': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'Pendiente': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    case 'Cerrada': return 'bg-red-50 text-red-700 border-red-200';
    default: return 'bg-slate-100 text-slate-700 border-slate-200';
  }
};
</script>

<template>
  <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
    <div class="bg-white w-full max-w-6xl rounded-xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">

      <div class="px-6 py-4 bg-slate-900 text-white flex justify-between items-center flex-shrink-0">
        <h2 class="text-base font-bold flex items-center gap-2">
          <Wrench class="w-4 h-4 text-blue-400" />
          Orden de Trabajo: {{ otEditable?.noOT || 'Cargando...' }}
        </h2>
        <div class="flex items-center gap-3">
          <button
              v-if="!esEdicion && otEditable"
              @click="activarEdicion"
              class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
          >
            <Edit3 class="w-3.5 h-3.5" /> Editar OT
          </button>
          <button @click="emit('close')" class="p-1 text-gray-400 hover:text-white rounded-md transition-colors">
            <X class="w-4 h-4" />
          </button>
        </div>
      </div>

      <div class="p-6 overflow-y-auto space-y-6 flex-1 bg-slate-50">
        <div v-if="cargando" class="py-12 text-center text-gray-500 text-sm font-medium">
          Cargando datos desde el servidor...
        </div>

        <div v-else-if="otEditable" class="space-y-6">

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

            <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3 text-sm flex flex-col justify-between">
              <h3 class="font-bold text-gray-800 border-b pb-1 text-xs uppercase tracking-wider">General</h3>
              <div>
                <span class="text-xs text-gray-400 block mb-1">Estatus actual:</span>
                <select v-if="esEdicion" v-model="otEditable.estado" class="w-full bg-gray-50 border border-gray-300 rounded-lg p-1.5 text-xs focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="Abierta">Abierta</option>
                  <option value="Pendiente">Pendiente</option>
                  <option value="Cerrada">Cerrada</option>
                </select>
                <span v-else :class="`px-2 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor(otEditable.estado)}`">{{ otEditable.estado }}</span>
              </div>
              <div class="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <span class="text-xs text-gray-400 block">Horas Totales:</span>
                  <input v-if="esEdicion" type="number" step="0.01" v-model.number="otEditable.horasTotales" class="w-full bg-gray-50 border border-gray-300 rounded-lg p-1 text-xs focus:ring-2 focus:ring-blue-500 outline-none" />
                  <span v-else class="font-medium text-gray-900">{{ otEditable.horasTotales || '0.00' }} hrs</span>
                </div>
                <div>
                  <span class="text-xs text-gray-400 block">Ciclos Totales:</span>
                  <input v-if="esEdicion" type="number" v-model.number="otEditable.ciclosTotales" class="w-full bg-gray-50 border border-gray-300 rounded-lg p-1 text-xs focus:ring-2 focus:ring-blue-500 outline-none" />
                  <span v-else class="font-medium text-gray-900">{{ otEditable.ciclosTotales || '0' }}</span>
                </div>
              </div>
            </div>

            <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-2.5 text-sm">
              <h3 class="font-bold text-gray-800 border-b pb-1 text-xs uppercase tracking-wider">Aeronave</h3>
              <div>
                <span class="text-xs text-gray-400 block">Matrícula:</span>
                <input v-if="esEdicion" type="text" v-model="otEditable.matricula" class="w-full bg-gray-50 border border-gray-300 rounded-lg p-1.5 text-xs focus:ring-2 focus:ring-blue-500 outline-none" />
                <span v-else class="font-bold text-blue-600">{{ otEditable.matricula }}</span>
              </div>
              <div>
                <span class="text-xs text-gray-400 block">Modelo:</span>
                <span class="text-gray-700 font-medium">{{ otEditable.modeloAeronave || '-' }}</span>
              </div>
            </div>

            <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-2.5 text-sm sm:col-span-2 lg:col-span-1">
              <h3 class="font-bold text-gray-800 border-b pb-1 text-xs uppercase tracking-wider">Cliente</h3>
              <div>
                <span class="text-xs text-gray-400 block mb-1">Compañía / Operador:</span>

                <select
                    v-if="esEdicion"
                    v-model="otEditable.idCliente"
                    class="w-full bg-gray-50 border border-gray-300 rounded-lg p-1.5 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option :value="null">Sin cliente</option>
                  <option
                      v-for="cli in clientesDisponibles"
                      :key="cli.idCliente"
                      :value="cli.idCliente"
                  >
                    {{ cli.compania }}
                  </option>
                </select>

                <span v-else class="font-medium text-gray-900">
      {{ otEditable?.clienteCompania || otEditable?.cliente || '-' }}
    </span>
              </div>
            </div>
          </div>

          <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div class="flex items-center gap-2">
              <Calendar class="w-4 h-4 text-gray-400 flex-shrink-0" />
              <div class="w-full">
                <span class="text-gray-400 block">Creación:</span>
                <input v-if="esEdicion" type="date" v-model="otEditable.fechaCreacion" class="w-full bg-gray-50 border border-gray-300 rounded-md p-1 focus:ring-1 focus:ring-blue-500 outline-none" />
                <span v-else class="text-gray-700 font-medium">{{ otEditable.fechaCreacion }}</span>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <Calendar class="w-4 h-4 text-gray-400 flex-shrink-0" />
              <div class="w-full">
                <span class="text-gray-400 block">Entrega Estimada:</span>
                <input v-if="esEdicion" type="date" v-model="otEditable.fechaEntrega" class="w-full bg-gray-50 border border-gray-300 rounded-md p-1 focus:ring-1 focus:ring-blue-500 outline-none" />
                <span v-else class="text-gray-700 font-medium">{{ otEditable.fechaEntrega || '-' }}</span>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <Calendar class="w-4 h-4 text-gray-400 flex-shrink-0" />
              <div class="w-full">
                <span class="text-gray-400 block">Cierre de OT:</span>
                <input v-if="esEdicion" type="date" v-model="otEditable.fechaCierre" class="w-full bg-gray-50 border border-gray-300 rounded-md p-1 focus:ring-1 focus:ring-blue-500 outline-none" />
                <span v-else class="text-gray-700 font-medium">{{ otEditable.fechaCierre || '-' }}</span>
              </div>
            </div>
          </div>

          <!-- ===================== TAREAS DE MANTENIMIENTO ===================== -->
          <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3 text-sm">
            <!-- T-03: Header con botón (+) -->
            <div class="flex items-center justify-between border-b pb-2">
              <h3 class="font-bold text-gray-800 text-xs uppercase flex items-center gap-1.5">
                <ClipboardList class="w-4 h-4 text-blue-500" /> Tareas de Mantenimiento
              </h3>
              <button
                @click="mostrarPopupAgregarTarea = true"
                class="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                title="Agregar tarea desde reportes programados"
              >
                <PlusCircle class="w-4 h-4" /> Agregar
              </button>
            </div>

            <!-- T-05 + T-06: Buscador + botón imprimir -->
            <div class="flex items-center gap-2">
              <div class="relative flex-1">
                <Search class="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
                <input
                  v-model="busquedaTareas"
                  type="text"
                  placeholder="Buscar tareas por código o descripción..."
                  class="w-full pl-8 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>
              <button
                @click="imprimirCaratula"
                class="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-medium transition-colors"
                title="Imprimir todas las tareas"
              >
                <Printer class="w-3.5 h-3.5" /> Imprimir
              </button>
            </div>

            <!-- Tabla con Item + Acción -->
            <div class="overflow-x-auto w-full">
              <table class="w-full text-left border-collapse text-xs min-w-[700px]">
                <thead>
                <tr class="bg-gray-50 text-gray-500 uppercase font-semibold">
                  <th class="p-2 border-b w-12 text-center">Item</th>
                  <th class="p-2 border-b">Código</th>
                  <th class="p-2 border-b">Descripción</th>
                  <th class="p-2 border-b">Técnicos</th>
                  <th class="p-2 border-b text-right">Horas</th>
                  <th class="p-2 border-b text-center w-28">Acción</th>
                </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                <template v-for="(t, idx) in tareasFiltradas" :key="idx">
                  <tr class="relative hover:bg-gray-50/60">
                    <td class="p-2 text-center text-gray-500 font-semibold">{{ idx + 1 }}</td>
                    <td class="p-2 font-mono text-gray-900">{{ t.codigo }}</td>
                    <td class="p-2 text-gray-600">{{ t.descripcion }}</td>
                    <td class="p-2 text-gray-500">{{ t.tecnicos || 'No asignado' }}</td>
                    <td class="p-2 text-gray-900 font-semibold text-right">{{ t.horasTotales || '0' }} hrs</td>
                    <!-- T-07: Botones de acción -->
                    <td class="p-2 text-center">
                      <div class="flex items-center justify-center gap-1.5">
                        <button @click="abrirEdicionTarea(idx)" class="p-1 rounded hover:bg-blue-50 text-gray-500 hover:text-blue-600 transition-colors" title="Editar datos complementarios">
                          <Pencil class="w-3.5 h-3.5" />
                        </button>
                        <button @click="imprimirCaratula" class="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors" title="Imprimir esta tarea">
                          <Printer class="w-3.5 h-3.5" />
                        </button>
                        <button @click="eliminarTarea(idx)" class="p-1 rounded hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors" title="Descartar tarea">
                          <Trash2 class="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  <!-- T-08: Panel de datos complementarios de tarea -->
                  <tr v-if="mostrarEdicionTarea === idx">
                    <td colspan="6" class="p-0">
                      <div class="bg-blue-50/50 border-t border-b border-blue-100 px-4 py-3 space-y-3">
                        <div class="flex items-center justify-between">
                          <span class="text-xs font-bold text-blue-800">Datos complementarios — {{ t.codigo }}</span>
                          <button @click="mostrarEdicionTarea = null" class="text-xs text-gray-500 hover:text-gray-700">Cerrar ✕</button>
                        </div>
                        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                          <div>
                            <label class="block text-[10px] font-semibold text-gray-500 mb-0.5">Tipo de servicio</label>
                            <input v-model="t.tipoServicio" type="text" class="w-full bg-white border border-gray-300 rounded-md px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-blue-400" />
                          </div>
                          <div>
                            <label class="block text-[10px] font-semibold text-gray-500 mb-0.5">Intervalo</label>
                            <input v-model="t.intervalo" type="text" class="w-full bg-white border border-gray-300 rounded-md px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-blue-400" />
                          </div>
                          <div>
                            <label class="block text-[10px] font-semibold text-gray-500 mb-0.5">Tipo de tarea</label>
                            <input v-model="t.tipoTarea" type="text" class="w-full bg-white border border-gray-300 rounded-md px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-blue-400" />
                          </div>
                          <div>
                            <label class="block text-[10px] font-semibold text-gray-500 mb-0.5">Requiere inspección RII</label>
                            <select v-model="t.requiereRII" class="w-full bg-white border border-gray-300 rounded-md px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-blue-400">
                              <option value="SI">SI</option>
                              <option value="NO">NO</option>
                            </select>
                          </div>
                          <div>
                            <label class="block text-[10px] font-semibold text-gray-500 mb-0.5">Técnicos (cantidad)</label>
                            <input v-model.number="t.tecnicos" type="number" min="0" step="1" class="w-full bg-white border border-gray-300 rounded-md px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-blue-400" />
                          </div>
                          <div>
                            <label class="block text-[10px] font-semibold text-gray-500 mb-0.5">Horas totales (HH:MM)</label>
                            <input v-model="t.horasTotales" type="time" class="w-full bg-white border border-gray-300 rounded-md px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-blue-400" />
                          </div>
                          <div class="sm:col-span-2">
                            <label class="block text-[10px] font-semibold text-gray-500 mb-0.5">Parte / componente / material asociado</label>
                            <input v-model="t.parteAsociada" type="text" placeholder="Pendiente conexión con almacén" class="w-full bg-white border border-gray-300 rounded-md px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-blue-400" />
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                </template>
                <tr v-if="tareasFiltradas.length === 0">
                  <td colspan="6" class="p-4 text-center text-gray-400 italic">Sin tareas de ingeniería programadas.</td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- ===================== DISCREPANCIAS REPORTADAS ===================== -->
          <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3 text-sm">
            <!-- T-04: Header con botón (+) -->
            <div class="flex items-center justify-between border-b pb-2">
              <h3 class="font-bold text-gray-800 text-xs uppercase flex items-center gap-1.5">
                <ShieldAlert class="w-4 h-4 text-amber-500" /> Discrepancias Reportadas
              </h3>
              <button
                @click="mostrarFormDiscrepancia = !mostrarFormDiscrepancia"
                class="flex items-center gap-1 text-xs font-semibold text-amber-600 hover:text-amber-800 transition-colors"
                title="Agregar nueva discrepancia"
              >
                <PlusCircle class="w-4 h-4" /> Agregar
              </button>
            </div>

            <!-- T-04: Formulario inline para nueva discrepancia -->
            <div v-if="mostrarFormDiscrepancia" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 p-3 rounded-lg border border-amber-200 bg-amber-50/40">
              <input v-model="discrepanciaForm.codigo" type="text" placeholder="Código" class="bg-white border border-gray-300 rounded-md px-2 py-1.5 text-xs outline-none focus:ring-1 focus:ring-amber-400" />
              <input v-model="discrepanciaForm.descripcion" type="text" placeholder="Descripción" class="bg-white border border-gray-300 rounded-md px-2 py-1.5 text-xs outline-none focus:ring-1 focus:ring-amber-400" />
              <select v-model="discrepanciaForm.estatus" class="bg-white border border-gray-300 rounded-md px-2 py-1.5 text-xs outline-none focus:ring-1 focus:ring-amber-400">
                <option value="Abierta">Abierta</option>
                <option value="Autorizada">Autorizada</option>
                <option value="Resuelta">Resuelta</option>
              </select>
              <div class="flex gap-2">
                <input v-model="discrepanciaForm.acciones" type="text" placeholder="Acciones" class="flex-1 bg-white border border-gray-300 rounded-md px-2 py-1.5 text-xs outline-none focus:ring-1 focus:ring-amber-400" />
                <button @click="agregarDiscrepancia" class="px-3 py-1.5 bg-slate-900 text-white rounded-md text-xs font-semibold hover:bg-slate-800 transition-colors">Añadir</button>
              </div>
            </div>

            <!-- T-05 + T-06: Buscador + botón imprimir -->
            <div class="flex items-center gap-2">
              <div class="relative flex-1">
                <Search class="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
                <input
                  v-model="busquedaDiscrepancias"
                  type="text"
                  placeholder="Buscar discrepancias por código o descripción..."
                  class="w-full pl-8 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>
              <button
                @click="imprimirCaratula"
                class="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-medium transition-colors"
                title="Imprimir todas las discrepancias"
              >
                <Printer class="w-3.5 h-3.5" /> Imprimir
              </button>
            </div>

            <!-- Tabla con Item + Acción -->
            <div class="overflow-x-auto w-full">
              <table class="w-full text-left border-collapse text-xs min-w-[600px]">
                <thead>
                <tr class="bg-gray-50 text-gray-500 uppercase font-semibold">
                  <th class="p-2 border-b w-12 text-center">Item</th>
                  <th class="p-2 border-b">Código</th>
                  <th class="p-2 border-b">Descripción</th>
                  <th class="p-2 border-b">Estatus</th>
                  <th class="p-2 border-b text-center w-28">Acción</th>
                </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                <template v-for="(d, idx) in discrepanciasFiltradas" :key="idx">
                  <tr class="hover:bg-gray-50/60">
                    <td class="p-2 text-center text-gray-500 font-semibold">{{ idx + 1 }}</td>
                    <td class="p-2 font-mono text-gray-900">{{ d.codigo }}</td>
                    <td class="p-2 text-gray-600">{{ d.descripcion }}</td>
                    <td class="p-2 text-gray-500">{{ d.estatus || 'Abierta' }}</td>
                    <!-- T-07: Botones de acción -->
                    <td class="p-2 text-center">
                      <div class="flex items-center justify-center gap-1.5">
                        <button @click="abrirEdicionDiscrepancia(idx)" class="p-1 rounded hover:bg-blue-50 text-gray-500 hover:text-blue-600 transition-colors" title="Editar datos complementarios">
                          <Pencil class="w-3.5 h-3.5" />
                        </button>
                        <button @click="imprimirCaratula" class="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors" title="Imprimir esta discrepancia">
                          <Printer class="w-3.5 h-3.5" />
                        </button>
                        <button @click="eliminarDiscrepancia(idx)" class="p-1 rounded hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors" title="Descartar discrepancia">
                          <Trash2 class="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  <!-- T-08: Panel de datos complementarios de discrepancia -->
                  <tr v-if="mostrarEdicionDiscrepancia === idx">
                    <td colspan="5" class="p-0">
                      <div class="bg-amber-50/50 border-t border-b border-amber-100 px-4 py-3 space-y-3">
                        <div class="flex items-center justify-between">
                          <span class="text-xs font-bold text-amber-800">Datos complementarios — {{ d.codigo }}</span>
                          <button @click="mostrarEdicionDiscrepancia = null" class="text-xs text-gray-500 hover:text-gray-700">Cerrar ✕</button>
                        </div>
                        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                          <div>
                            <label class="block text-[10px] font-semibold text-gray-500 mb-0.5">Aeronavegable</label>
                            <select v-model="d.aeronavegable" class="w-full bg-white border border-gray-300 rounded-md px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-amber-400">
                              <option value="SI">SI</option>
                              <option value="NO">NO</option>
                            </select>
                          </div>
                          <div>
                            <label class="block text-[10px] font-semibold text-gray-500 mb-0.5">Fecha autorizada</label>
                            <input v-model="d.fechaAutorizada" type="date" class="w-full bg-white border border-gray-300 rounded-md px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-amber-400" />
                          </div>
                          <div class="sm:col-span-2">
                            <label class="block text-[10px] font-semibold text-gray-500 mb-0.5">Descripción</label>
                            <input v-model="d.descripcion" type="text" class="w-full bg-white border border-gray-300 rounded-md px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-amber-400" />
                          </div>
                          <div class="sm:col-span-2">
                            <label class="block text-[10px] font-semibold text-gray-500 mb-0.5">Acción correctiva</label>
                            <input v-model="d.accionCorrectiva" type="text" class="w-full bg-white border border-gray-300 rounded-md px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-amber-400" />
                          </div>
                          <div>
                            <label class="block text-[10px] font-semibold text-gray-500 mb-0.5">Fecha de liberación</label>
                            <input v-model="d.fechaLiberacion" type="date" class="w-full bg-white border border-gray-300 rounded-md px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-amber-400" />
                          </div>
                          <div>
                            <label class="block text-[10px] font-semibold text-gray-500 mb-0.5">Efectuado por</label>
                            <input v-model="d.efectuadoPor" type="text" class="w-full bg-white border border-gray-300 rounded-md px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-amber-400" />
                          </div>
                          <div>
                            <label class="block text-[10px] font-semibold text-gray-500 mb-0.5">Inspeccionado por</label>
                            <input v-model="d.inspeccionadoPor" type="text" class="w-full bg-white border border-gray-300 rounded-md px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-amber-400" />
                          </div>
                          <div class="sm:col-span-2">
                            <label class="block text-[10px] font-semibold text-gray-500 mb-0.5">Parte / componente / material asociado</label>
                            <input v-model="d.parteAsociada" type="text" placeholder="Pendiente conexión con almacén" class="w-full bg-white border border-gray-300 rounded-md px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-amber-400" />
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                </template>
                <tr v-if="discrepanciasFiltradas.length === 0">
                  <td colspan="5" class="p-4 text-center text-gray-400 italic">Sin discrepancias iniciales asociadas.</td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>

      <!-- FOOTER: Guardar / Cancelar + T-06: Imprimir Carátula -->
      <div class="px-6 py-3 bg-gray-100 border-t border-gray-200 flex items-center justify-between flex-shrink-0">
        <button
          @click="imprimirCaratula"
          class="flex items-center gap-1.5 px-4 py-2 bg-slate-700 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors"
        >
          <Printer class="w-3.5 h-3.5" /> Imprimir Carátula OT
        </button>
        <div v-if="esEdicion" class="flex gap-3">
          <button
              @click="cancelarEdicion"
              class="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
          >
            <RotateCcw class="w-3.5 h-3.5" /> Cancelar
          </button>
          <button
              @click="enviarGuardado"
              class="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors shadow-sm"
          >
            <Check class="w-3.5 h-3.5" /> Guardar Cambios
          </button>
        </div>
      </div>

    </div>

    <!-- T-03: POPUP para seleccionar reporte programado y agregar como tarea -->
    <Transition name="fade">
      <div v-if="mostrarPopupAgregarTarea" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div class="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
          <div class="px-6 py-4 bg-slate-900 text-white flex justify-between items-center">
            <h3 class="text-base font-bold">Agregar Tarea — Reportes Programados</h3>
            <button type="button" @click="mostrarPopupAgregarTarea = false" class="text-gray-400 hover:text-white text-lg">✕</button>
          </div>
          <div class="p-4 bg-slate-50 border-b border-gray-200">
            <input
              v-model="filtroPopupReportes"
              type="text"
              placeholder="Buscar por código o descripción..."
              class="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 shadow-inner"
            />
          </div>
          <div class="overflow-y-auto divide-y divide-gray-100 flex-1 bg-white">
            <div
              v-for="rep in reportesFiltradosPopup"
              :key="rep.codigo"
              @click="agregarTareaDesdeReporte(rep)"
              class="p-4 hover:bg-blue-50/70 cursor-pointer transition-colors"
            >
              <div class="font-bold text-blue-600 font-mono text-sm tracking-wide">{{ rep.codigo }}</div>
              <div class="text-gray-700 text-sm mt-1 leading-relaxed whitespace-normal break-words font-medium">{{ rep.descripcion }}</div>
            </div>
            <div v-if="reportesFiltradosPopup.length === 0" class="p-8 text-center text-gray-400 italic text-sm">
              No se encontraron reportes que coincidan.
            </div>
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>