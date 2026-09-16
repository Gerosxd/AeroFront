<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import otService from '../services/ot.service';
import { decimalAHHMM, hhmmADecimal, calcularHH } from '../utils/timeFormat';
import { X, Calendar, Wrench, ShieldAlert, ClipboardList, Edit3, Check, RotateCcw, PlusCircle, Search, Printer, Pencil, Trash2, Save } from 'lucide-vue-next';
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

// --- FIX guardado (13.3/14.7): detección de cambios sin depender de "Editar OT" ---
const snapshotOriginal = ref<string>('');
const hayCambiosPendientes = computed(() => {
  if (!otEditable.value) return false;
  return JSON.stringify(otEditable.value) !== snapshotOriginal.value;
});
const mostrarGuardado = computed(() => esEdicion.value || hayCambiosPendientes.value);
const guardando = ref(false);

// --- Puntos 3 y 14.6: horas en HH:MM y H.H. derivada ---
const horasEnEdicion = ref<Record<string, string>>({});
const horasInvalidas = ref<Record<string, boolean>>({});
const keyTarea = (t: TareaMantenimientoResponse) => String(t.idTareaOT || t.codigo);
const horasHHMM = (t: TareaMantenimientoResponse): string => {
  const k = keyTarea(t);
  const enEdicion = horasEnEdicion.value[k];
  if (enEdicion !== undefined) return enEdicion;
  return decimalAHHMM(t.horasTotales);
};
const setHorasHHMM = (t: TareaMantenimientoResponse, texto: string) => {
  const k = keyTarea(t);
  horasEnEdicion.value[k] = texto;
  if (!texto.trim()) { (t as any).horasTotales = null; horasInvalidas.value[k] = false; return; }
  const dec = hhmmADecimal(texto);
  if (dec === null) { horasInvalidas.value[k] = true; return; }
  horasInvalidas.value[k] = false;
  t.horasTotales = dec;
};
const hhCalculado = (t: TareaMantenimientoResponse): string | null => {
  const tec = parseInt(String(t.tecnicos ?? ''), 10);
  const hh = calcularHH(isNaN(tec) ? null : tec, t.horasTotales);
  return hh === null ? null : hh.toFixed(2);
};

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
    numeroParte: null,
    numeroSerie: null,
    accionCorrectiva: null,
    efectuadoPor: null,
    inspeccionadoPor: null,
    fechaCumplimiento: null,
  });
  mostrarPopupAgregarTarea.value = false;
  filtroPopupReportes.value = '';
  abrirEdicionTarea(otEditable.value.tareasMantenimiento.length - 1);
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
    tipoDiscrepancia: null,
    hhEstimadas: null,
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
  abrirEdicionDiscrepancia(otEditable.value.discrepancias.length - 1);
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

// --- T-06 / P-02 / P-03: IMPRESIÓN ---
const generandoPdf = ref(false);

const abrirPdf = async (fn: () => Promise<Blob>, errorMsg: string) => {
  try {
    generandoPdf.value = true;
    const blob = await fn();
    const url = window.URL.createObjectURL(blob);
    window.open(url, '_blank');
    setTimeout(() => window.URL.revokeObjectURL(url), 10000);
  } catch (e) {
    console.error(errorMsg, e);
    alert(errorMsg);
  } finally {
    generandoPdf.value = false;
  }
};

// P-02: Carátula de la OT (AG-145-03)
const imprimirCaratula = async () => {
  if (!otEditable.value?.idOT) return;
  if (!(await asegurarGuardado())) return;
  const id = otEditable.value.idOT;
  await abrirPdf(
    () => otService.obtenerCaratulaPdf(id),
    'No se pudo generar la carátula de la OT. Verifica que la OT esté guardada.'
  );
};

// P-03: Hoja de Servicio de una tarea (AG-145-04)
const imprimirHojaServicio = async (tareaRef: TareaMantenimientoResponse) => {
  if (!otEditable.value?.idOT) return;
  const idx = otEditable.value.tareasMantenimiento.indexOf(tareaRef);
  if (idx < 0) return;
  if (!(await asegurarGuardado())) return;
  const tarea = otEditable.value.tareasMantenimiento[idx];
  if (!tarea?.idTareaOT) { alert('No se pudo identificar la tarea. Intenta de nuevo.'); return; }
  const id = otEditable.value.idOT;
  await abrirPdf(
    () => otService.obtenerHojaServicioPdf(id, tarea.idTareaOT),
    'No se pudo generar la Hoja de Servicio de la tarea.'
  );
};

// P-03: Hojas de Servicio de todas las tareas
const imprimirTodasHojasServicio = async () => {
  if (!otEditable.value?.idOT) return;
  if (!(await asegurarGuardado())) return;
  const id = otEditable.value.idOT;
  await abrirPdf(
    () => otService.obtenerHojasServicioPdf(id),
    'No se pudieron generar las Hojas de Servicio.'
  );
};

// P-04: Formato de una discrepancia (AG-145-12)
const imprimirDiscrepancia = async (dRef: DiscrepanciaResponse) => {
  if (!otEditable.value?.idOT) return;
  const idx = otEditable.value.discrepancias.indexOf(dRef);
  if (idx < 0) return;
  if (!(await asegurarGuardado())) return;
  const d = otEditable.value.discrepancias[idx];
  if (!d?.idOTDiscrepancia) { alert('No se pudo identificar la discrepancia. Intenta de nuevo.'); return; }
  await abrirPdf(
    () => otService.obtenerDiscrepanciaPdf(id, d.idOTDiscrepancia),
    'No se pudo generar el formato de la discrepancia.'
  );
};

// P-04: Formato con todas las discrepancias
const imprimirTodasDiscrepancias = async () => {
  if (!otEditable.value?.idOT) return;
  if (!(await asegurarGuardado())) return;
  const id = otEditable.value.idOT;
  await abrirPdf(
    () => otService.obtenerDiscrepanciasPdf(id),
    'No se pudo generar el formato de Discrepancias.'
  );
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
  // Inicializa los campos complementarios directamente sobre el modelo,
  // para que se envíen al backend al guardar.
  const t = otEditable.value?.tareasMantenimiento[idx];
  if (t) {
    if (t.tipoServicio == null) t.tipoServicio = '';
    if (t.intervalo == null) t.intervalo = '';
    if (t.tipoTarea == null) t.tipoTarea = '';
    if (t.requiereRII == null) t.requiereRII = 'NO';
    if (t.parteAsociada == null) t.parteAsociada = '';
    // P-03: Hoja de Servicio
    if (t.numeroParte == null) t.numeroParte = '';
    if (t.numeroSerie == null) t.numeroSerie = '';
    if (t.accionCorrectiva == null) t.accionCorrectiva = '';
    if (t.efectuadoPor == null) t.efectuadoPor = '';
    if (t.inspeccionadoPor == null) t.inspeccionadoPor = '';
    if (t.fechaCumplimiento == null) t.fechaCumplimiento = '';
  }
  mostrarEdicionTarea.value = idx;
};

const abrirEdicionDiscrepancia = (idx: number) => {
  const d = otEditable.value?.discrepancias[idx];
  if (d) {
    if (d.aeronavegable == null) d.aeronavegable = 'NO';
    if (d.fechaAutorizada == null) d.fechaAutorizada = '';
    if (d.accionCorrectiva == null) d.accionCorrectiva = '';
    if (d.fechaLiberacion == null) d.fechaLiberacion = '';
    if (d.efectuadoPor == null) d.efectuadoPor = '';
    if (d.inspeccionadoPor == null) d.inspeccionadoPor = '';
    if (d.parteAsociada == null) d.parteAsociada = '';
    if (d.tipoDiscrepancia === undefined) d.tipoDiscrepancia = null;
    if (d.hhEstimadas === undefined) d.hhEstimadas = null;
  }
  mostrarEdicionDiscrepancia.value = idx;
};

// Sincronizar datos de forma segura sin mutar la Prop directamente
watch(
    () => [props.open, props.ot, props.cargando],
    ([isOpen, currentOt, isCargando]) => {
      if (isOpen && currentOt && !isCargando) {
        // No pisar edición en curso con cambios sin guardar de la misma OT
        if (
          otEditable.value &&
          hayCambiosPendientes.value &&
          (currentOt as OTDetalle).idOT === otEditable.value.idOT
        ) {
          return;
        }
        const nueva = JSON.parse(JSON.stringify(currentOt)) as OTDetalle;
        nueva.tareasMantenimiento = nueva.tareasMantenimiento || [];
        nueva.discrepancias = nueva.discrepancias || [];
        otEditable.value = nueva;
        esEdicion.value = !!props.forzarEdicion;
        snapshotOriginal.value = JSON.stringify(otEditable.value);
        // Reset estados locales
        busquedaTareas.value = '';
        busquedaDiscrepancias.value = '';
        mostrarEdicionTarea.value = null;
        mostrarEdicionDiscrepancia.value = null;
        horasEnEdicion.value = {};
        horasInvalidas.value = {};
      }
    },
    { immediate: true, deep: true }
);

const activarEdicion = () => {
  esEdicion.value = true;
};

const cerrarModal = () => {
  if (hayCambiosPendientes.value && !confirm('Tienes cambios sin guardar. ¿Cerrar y descartarlos?')) return;
  emit('close');
};

const cancelarEdicion = () => {
  if (props.ot) {
    const restaurada = JSON.parse(JSON.stringify(props.ot)) as OTDetalle;
    restaurada.tareasMantenimiento = restaurada.tareasMantenimiento || [];
    restaurada.discrepancias = restaurada.discrepancias || [];
    otEditable.value = restaurada;
    snapshotOriginal.value = JSON.stringify(otEditable.value);
  }
  esEdicion.value = false;
  desplegarListaReportes.value = null;
  mostrarEdicionTarea.value = null;
  mostrarEdicionDiscrepancia.value = null;
  horasEnEdicion.value = {};
  horasInvalidas.value = {};
};


const enviarGuardado = async (): Promise<boolean> => {
  if (!otEditable.value?.idOT) return false;
  try {
    guardando.value = true;
    await otService.actualizar(otEditable.value.idOT, otEditable.value);
    // Recargar SIN cerrar el modal, para obtener idTareaOT / idOTDiscrepancia reales
    const recargada = await otService.obtenerPorId(otEditable.value.idOT);
    const clon = JSON.parse(JSON.stringify(recargada)) as OTDetalle;
    clon.tareasMantenimiento = clon.tareasMantenimiento || [];
    clon.discrepancias = clon.discrepancias || [];
    otEditable.value = clon;
    snapshotOriginal.value = JSON.stringify(otEditable.value);
    horasEnEdicion.value = {};
    horasInvalidas.value = {};
    esEdicion.value = false;
    emit('guardarOT', otEditable.value);
    return true;
  } catch (e: any) {
    console.error('Error al guardar la OT:', e);
    alert(e?.response?.data || 'No se pudieron guardar los cambios de la OT.');
    return false;
  } finally {
    guardando.value = false;
  }
};

/** Antes de imprimir: si hay cambios pendientes, guarda primero. */
const asegurarGuardado = async (): Promise<boolean> => {
  if (!hayCambiosPendientes.value) return true;
  return await enviarGuardado();
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
          <button @click="cerrarModal" class="p-1 text-gray-400 hover:text-white rounded-md transition-colors">
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

          <!-- ===================== P-00: DATOS DE CARÁTULA (AG-145-03) ===================== -->
          <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3 text-sm">
            <h3 class="font-bold text-gray-800 border-b pb-2 text-xs uppercase flex items-center gap-1.5">
              <ClipboardList class="w-4 h-4 text-slate-500" /> Datos de Carátula
            </h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-[10px] font-semibold text-gray-500 mb-0.5">Tipo de servicio</label>
                <select v-model="otEditable.tipoMantenimiento" class="w-full bg-gray-50 border border-gray-300 rounded-md px-2 py-1.5 text-xs outline-none focus:ring-1 focus:ring-blue-400">
                  <option :value="null">— Sin definir —</option>
                  <option value="AERONAVE">Mantenimiento de Aeronave</option>
                  <option value="COMPONENTE">Reparación de Componente</option>
                </select>
              </div>
              <div>
                <label class="block text-[10px] font-semibold text-gray-500 mb-0.5">Modalidad</label>
                <select v-model="otEditable.modalidadMantenimiento" class="w-full bg-gray-50 border border-gray-300 rounded-md px-2 py-1.5 text-xs outline-none focus:ring-1 focus:ring-blue-400">
                  <option :value="null">— Sin definir —</option>
                  <option value="PROGRAMADO">Mantenimiento Programado</option>
                  <option value="NO_PROGRAMADO">Mantenimiento No Programado</option>
                </select>
              </div>
              <!-- B3: tipo de aeronave para los checkboxes de la carátula -->
              <div>
                <label class="block text-[10px] font-semibold text-gray-500 mb-0.5">Tipo de aeronave</label>
                <select v-model="otEditable.tipoAeronave" class="w-full bg-gray-50 border border-gray-300 rounded-md px-2 py-1.5 text-xs outline-none focus:ring-1 focus:ring-blue-400">
                  <option :value="null">— Sin definir —</option>
                  <option value="ALA_FIJA">Ala Fija</option>
                  <option value="ALA_ROTATIVA">Ala Rotativa</option>
                  <option value="OTRO">Otro</option>
                </select>
              </div>
              <div v-if="otEditable.tipoAeronave === 'OTRO'">
                <label class="block text-[10px] font-semibold text-gray-500 mb-0.5">Especificar (Otro)</label>
                <input v-model="otEditable.tipoAeronaveOtro" type="text" placeholder="Ej. Planeador, Dron" class="w-full bg-gray-50 border border-gray-300 rounded-md px-2 py-1.5 text-xs outline-none focus:ring-1 focus:ring-blue-400" />
              </div>
              <div class="sm:col-span-2">
                <label class="block text-[10px] font-semibold text-gray-500 mb-0.5">Comentarios del Responsable de Taller</label>
                <textarea v-model="otEditable.comentarioTaller" rows="2" class="w-full bg-gray-50 border border-gray-300 rounded-md px-2 py-1.5 text-xs outline-none focus:ring-1 focus:ring-blue-400 resize-none"></textarea>
              </div>
            </div>

            <!-- Bloque de componente: solo para Reparación de Componente -->
            <div v-if="otEditable.tipoMantenimiento === 'COMPONENTE'" class="border border-blue-200 bg-blue-50/40 rounded-lg p-3 space-y-2">
              <span class="text-[11px] font-bold text-slate-700 uppercase">Información de Componente</span>
              <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                <div class="sm:col-span-2">
                  <label class="block text-[10px] font-semibold text-gray-500 mb-0.5">Descripción</label>
                  <input v-model="otEditable.componenteDescripcion" type="text" class="w-full bg-white border border-gray-300 rounded-md px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-blue-400" />
                </div>
                <div>
                  <label class="block text-[10px] font-semibold text-gray-500 mb-0.5">Cantidad</label>
                  <input v-model.number="otEditable.componenteCantidad" type="number" min="1" step="1" class="w-full bg-white border border-gray-300 rounded-md px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-blue-400" />
                </div>
                <div>
                  <label class="block text-[10px] font-semibold text-gray-500 mb-0.5">No. de parte</label>
                  <input v-model="otEditable.componenteNumeroParte" type="text" class="w-full bg-white border border-gray-300 rounded-md px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-blue-400" />
                </div>
                <div>
                  <label class="block text-[10px] font-semibold text-gray-500 mb-0.5">No. de serie</label>
                  <input v-model="otEditable.componenteNumeroSerie" type="text" class="w-full bg-white border border-gray-300 rounded-md px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-blue-400" />
                </div>
                <div>
                  <label class="block text-[10px] font-semibold text-gray-500 mb-0.5">Horas totales</label>
                  <input v-model.number="otEditable.componenteHoras" type="number" min="0" step="0.01" class="w-full bg-white border border-gray-300 rounded-md px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-blue-400" />
                </div>
                <div>
                  <label class="block text-[10px] font-semibold text-gray-500 mb-0.5">Ciclos totales</label>
                  <input v-model.number="otEditable.componenteCiclos" type="number" min="0" step="1" class="w-full bg-white border border-gray-300 rounded-md px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-blue-400" />
                </div>
                <div>
                  <label class="block text-[10px] font-semibold text-gray-500 mb-0.5">Aeronave asociada</label>
                  <input v-model="otEditable.componenteAeronaveAsociada" type="text" placeholder="Matrícula" class="w-full bg-white border border-gray-300 rounded-md px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-blue-400" />
                </div>
                <div>
                  <label class="block text-[10px] font-semibold text-gray-500 mb-0.5">Horas/Ciclos remoción</label>
                  <input v-model="otEditable.componenteHorasCiclosRemocion" type="text" class="w-full bg-white border border-gray-300 rounded-md px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-blue-400" />
                </div>
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
                @click="imprimirTodasHojasServicio"
                :disabled="generandoPdf"
                class="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-medium transition-colors disabled:opacity-60"
                title="Imprimir Hojas de Servicio de todas las tareas"
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
                    <td class="p-2 text-gray-900 font-semibold text-right">{{ decimalAHHMM(t.horasTotales) || '0:00' }}</td>
                    <!-- T-07: Botones de acción -->
                    <td class="p-2 text-center">
                      <div class="flex items-center justify-center gap-1.5">
                        <button v-if="hayCambiosPendientes" @click="enviarGuardado" :disabled="guardando" class="p-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-600 transition-colors disabled:opacity-50" title="Guardar cambios">
                          <Save class="w-3.5 h-3.5" />
                        </button>
                        <button @click="abrirEdicionTarea(idx)" class="p-1 rounded hover:bg-blue-50 text-gray-500 hover:text-blue-600 transition-colors" title="Editar datos complementarios">
                          <Pencil class="w-3.5 h-3.5" />
                        </button>
                        <button @click="imprimirHojaServicio(t)" :disabled="generandoPdf" class="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50" title="Imprimir Hoja de Servicio de esta tarea">
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
                            <input v-model="t.tecnicos" type="number" min="0" step="1" class="w-full bg-white border border-gray-300 rounded-md px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-blue-400" />
                          </div>
                          <div>
                            <label class="block text-[10px] font-semibold text-gray-500 mb-0.5">Horas por técnico (HH:MM)</label>
                            <input :value="horasHHMM(t)" @input="setHorasHHMM(t, ($event.target as HTMLInputElement).value)" type="text" inputmode="numeric" placeholder="Ej. 6:30" :class="['w-full bg-white border rounded-md px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-blue-400', horasInvalidas[keyTarea(t)] ? 'border-red-400' : 'border-gray-300']" />
                          </div>
                          <div>
                            <label class="block text-[10px] font-semibold text-gray-500 mb-0.5">H.H. (téc × horas)</label>
                            <div class="w-full bg-gray-100 border border-gray-200 rounded-md px-2 py-1 text-xs font-semibold text-gray-700">{{ hhCalculado(t) ?? '—' }}</div>
                          </div>
                          <div class="sm:col-span-2">
                            <label class="block text-[10px] font-semibold text-gray-500 mb-0.5">Parte / componente / material asociado</label>
                            <input v-model="t.parteAsociada" type="text" placeholder="Pendiente conexión con almacén" class="w-full bg-white border border-gray-300 rounded-md px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-blue-400" />
                          </div>
                        </div>

                        <!-- P-03: Datos de la Hoja de Servicio AG-145-04 -->
                        <div class="border-t border-blue-200 pt-2">
                          <span class="text-[10px] font-bold text-blue-800 uppercase">Hoja de Servicio (AG-145-04)</span>
                        </div>
                        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                          <div>
                            <label class="block text-[10px] font-semibold text-gray-500 mb-0.5">No. de parte</label>
                            <input v-model="t.numeroParte" type="text" class="w-full bg-white border border-gray-300 rounded-md px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-blue-400" />
                          </div>
                          <div>
                            <label class="block text-[10px] font-semibold text-gray-500 mb-0.5">No. de serie</label>
                            <input v-model="t.numeroSerie" type="text" class="w-full bg-white border border-gray-300 rounded-md px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-blue-400" />
                          </div>
                          <div>
                            <label class="block text-[10px] font-semibold text-gray-500 mb-0.5">Efectuado por</label>
                            <input v-model="t.efectuadoPor" type="text" class="w-full bg-white border border-gray-300 rounded-md px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-blue-400" />
                          </div>
                          <div>
                            <label class="block text-[10px] font-semibold text-gray-500 mb-0.5">
                              Inspeccionado por<span v-if="t.requiereRII === 'SI'" class="text-red-500" title="Obligatorio para tareas RII"> *</span>
                            </label>
                            <input v-model="t.inspeccionadoPor" type="text" :class="['w-full bg-white border rounded-md px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-blue-400', t.requiereRII === 'SI' && !t.inspeccionadoPor ? 'border-red-300' : 'border-gray-300']" />
                          </div>
                          <div>
                            <label class="block text-[10px] font-semibold text-gray-500 mb-0.5">Fecha de cumplimiento</label>
                            <input v-model="t.fechaCumplimiento" type="date" class="w-full bg-white border border-gray-300 rounded-md px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-blue-400" />
                          </div>
                          <div class="col-span-2 sm:col-span-3 lg:col-span-4">
                            <label class="block text-[10px] font-semibold text-gray-500 mb-0.5">Acción correctiva</label>
                            <textarea v-model="t.accionCorrectiva" rows="3" placeholder="Trabajo realizado, con referencias a manuales o procedimientos utilizados..." class="w-full bg-white border border-gray-300 rounded-md px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-blue-400 resize-none"></textarea>
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
                @click="imprimirTodasDiscrepancias"
                :disabled="generandoPdf"
                class="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-medium transition-colors disabled:opacity-60"
                title="Imprimir formato AG-145-12 con todas las discrepancias"
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
                        <button v-if="hayCambiosPendientes" @click="enviarGuardado" :disabled="guardando" class="p-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-600 transition-colors disabled:opacity-50" title="Guardar cambios">
                          <Save class="w-3.5 h-3.5" />
                        </button>
                        <button @click="abrirEdicionDiscrepancia(idx)" class="p-1 rounded hover:bg-blue-50 text-gray-500 hover:text-blue-600 transition-colors" title="Editar datos complementarios">
                          <Pencil class="w-3.5 h-3.5" />
                        </button>
                        <button @click="imprimirDiscrepancia(d)" :disabled="generandoPdf" class="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50" title="Imprimir formato AG-145-12 de esta discrepancia">
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
                            <label class="block text-[10px] font-semibold text-gray-500 mb-0.5">Tipo de discrepancia</label>
                            <select v-model="d.tipoDiscrepancia" class="w-full bg-white border border-gray-300 rounded-md px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-amber-400">
                              <option :value="null">— Seleccionar —</option>
                              <option value="OPERADOR">Reportada por el operador</option>
                              <option value="SERVICIO">Generada en servicio</option>
                            </select>
                          </div>
                          <div>
                            <label class="block text-[10px] font-semibold text-gray-500 mb-0.5">H.H. Estimadas</label>
                            <input v-model.number="d.hhEstimadas" type="number" min="0" step="0.5" class="w-full bg-white border border-gray-300 rounded-md px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-amber-400" />
                          </div>
                          <!-- 13.5: 'Aeronavegable' retirado; el formato AG-145-12 vigente ya no lo incluye. -->
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
          :disabled="generandoPdf"
          class="flex items-center gap-1.5 px-4 py-2 bg-slate-700 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors disabled:opacity-60"
        >
          <Printer class="w-3.5 h-3.5" /> {{ generandoPdf ? 'Generando...' : 'Imprimir Carátula OT' }}
        </button>
        <div v-if="mostrarGuardado" class="flex items-center gap-3">
          <span v-if="hayCambiosPendientes" class="text-xs font-semibold text-amber-600 flex items-center gap-1">
            <span class="w-2 h-2 rounded-full bg-amber-500 inline-block"></span> Cambios sin guardar
          </span>
          <button
              @click="cancelarEdicion"
              class="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
          >
            <RotateCcw class="w-3.5 h-3.5" /> Cancelar
          </button>
          <button
              @click="enviarGuardado"
              :disabled="guardando"
              class="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors shadow-sm disabled:opacity-60"
          >
            <Check class="w-3.5 h-3.5" /> {{ guardando ? 'Guardando...' : 'Guardar Cambios' }}
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