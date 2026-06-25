<script setup lang="ts">
import { ref, watch } from 'vue';
import { X, Calendar, Wrench, ShieldAlert, ClipboardList, Edit3, Check, RotateCcw } from 'lucide-vue-next';
import type { OTDetalle } from '../types/ot';
import type { TareaProgramada } from '../types/programada';

const props = defineProps<{
  open: boolean;
  ot: OTDetalle | null;
  cargando: boolean;
  forzarEdicion?: boolean; // Nueva propiedad añadida
  reportesDisponibles?: TareaProgramada[];
  clientesDisponibles?: any[];
}>();

const emit = defineEmits(['close', 'guardarOT']);

// --- ESTADOS DE EDICIÓN (Clon reactivo local para producción) ---
const esEdicion = ref(false);
const otEditable = ref<OTDetalle | null>(null);
const desplegarListaReportes = ref<number | null>(null);

// Sincronizar datos de forma segura sin mutar la Prop directamente
watch(
    () => [props.open, props.ot, props.cargando],
    ([isOpen, currentOt, isCargando]) => {
      if (isOpen && currentOt && !isCargando) {
        // Mapeamos los datos de manera profunda rompiendo referencias
        otEditable.value = JSON.parse(JSON.stringify(currentOt));

        // Aseguramos que los arrays existan para evitar errores de renderizado
        otEditable.value.tareasMantenimiento = otEditable.value.tareasMantenimiento || [];
        otEditable.value.discrepancias = otEditable.value.discrepancias || [];

        // Si el padre mandó la orden de editar directo, activamos la edición
        esEdicion.value = !!props.forzarEdicion;
      }
    },
    { immediate: true, deep: true } // Crucial para que Vue reaccione al cambio asíncrono
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
    <div class="bg-white w-full max-w-4xl rounded-xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">

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

          <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-2 text-sm">
            <h3 class="font-bold text-gray-800 border-b pb-1 text-xs uppercase flex items-center gap-1.5">
              <ClipboardList class="w-4 h-4 text-blue-500" /> Tareas de Mantenimiento
            </h3>
            <div class="overflow-x-auto w-full">
              <table class="w-full text-left border-collapse text-xs min-w-[600px]">
                <thead>
                <tr class="bg-gray-50 text-gray-500 uppercase font-semibold">
                  <th class="p-2 border-b w-1/4">Código</th>
                  <th class="p-2 border-b w-1/3">Descripción</th>
                  <th class="p-2 border-b w-1/4">Técnicos</th>
                  <th class="p-2 border-b w-1/6 text-right">Horas</th>
                </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                <tr v-for="(t, idx) in otEditable.tareasMantenimiento" :key="idx" class="relative">
                  <td class="p-2 font-mono text-gray-900 vertical-align-middle">
                    <div v-if="desplegarListaReportes !== null" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                      <div class="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
                        <div class="px-6 py-4 bg-slate-900 text-white flex justify-between items-center">
                          <h3 class="text-base font-bold">Seleccionar Reporte Programado</h3>
                          <button type="button" @click="desplegarListaReportes = null" class="text-gray-400 hover:text-white">✕</button>
                        </div>
                        <div class="overflow-y-auto divide-y divide-gray-100 flex-1 bg-white p-4">
                          <div
                              v-for="rep in reportesDisponibles"
                              :key="rep.codigo"
                              @click="seleccionarReporteParaTarea(desplegarListaReportes, rep)"
                              class="p-4 hover:bg-blue-50 cursor-pointer transition-colors"
                          >
                            <div class="font-bold text-blue-600 font-mono text-sm">{{ rep.codigo }}</div>
                            <div class="text-gray-700 text-sm mt-1 leading-relaxed whitespace-normal break-words font-medium">{{ rep.descripcion }}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <span v-else>{{ t.codigo }}</span>
                  </td>
                  <td class="p-2 text-gray-600 vertical-align-middle">
                    <input v-if="esEdicion" type="text" v-model="t.descripcion" class="w-full bg-gray-50 border border-gray-300 rounded p-1.5 text-xs focus:ring-1 focus:ring-blue-500 outline-none" />
                    <span v-else>{{ t.descripcion }}</span>
                  </td>
                  <td class="p-2 text-gray-500 vertical-align-middle">
                    <input v-if="esEdicion" type="text" v-model="t.tecnicos" placeholder="Nombres de técnicos" class="w-full bg-gray-50 border border-gray-300 rounded p-1.5 text-xs focus:ring-1 focus:ring-blue-500 outline-none" />
                    <span v-else>{{ t.tecnicos || 'No asignado' }}</span>
                  </td>
                  <td class="p-2 text-gray-900 font-semibold text-right vertical-align-middle">
                    <input v-if="esEdicion" type="number" step="0.1" v-model.number="t.horasTotales" class="w-20 text-right bg-gray-50 border border-gray-300 rounded p-1.5 text-xs focus:ring-1 focus:ring-blue-500 outline-none inline-block" />
                    <span v-else>{{ t.horasTotales || '0' }} hrs</span>
                  </td>
                </tr>
                <tr v-if="!otEditable.tareasMantenimiento || otEditable.tareasMantenimiento.length === 0">
                  <td colspan="4" class="p-4 text-center text-gray-400 italic">Sin tareas de ingeniería programadas.</td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-2 text-sm">
            <h3 class="font-bold text-gray-800 border-b pb-1 text-xs uppercase flex items-center gap-1.5">
              <ShieldAlert class="w-4 h-4 text-amber-500" /> Discrepancias Reportadas
            </h3>
            <div class="overflow-x-auto w-full">
              <table class="w-full text-left border-collapse text-xs min-w-[500px]">
                <thead>
                <tr class="bg-gray-50 text-gray-500 uppercase font-semibold">
                  <th class="p-2 border-b w-1/4">Código</th>
                  <th class="p-2 border-b w-1/2">Descripción</th>
                  <th class="p-2 border-b w-1/4">Estatus</th>
                </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                <tr v-for="(d, idx) in otEditable.discrepancias" :key="idx">
                  <td class="p-2 font-mono text-gray-900">{{ d.codigo }}</td>
                  <td class="p-2 text-gray-600">
                    <input v-if="esEdicion" type="text" v-model="d.descripcion" class="w-full bg-gray-50 border border-gray-300 rounded p-1 text-xs focus:ring-1 focus:ring-blue-500 outline-none" />
                    <span v-else>{{ d.descripcion }}</span>
                  </td>
                  <td class="p-2 text-gray-500">
                    <select v-if="esEdicion" v-model="d.estatus" class="bg-gray-50 border border-gray-300 rounded p-1 text-xs focus:ring-1 focus:ring-blue-500 outline-none">
                      <option value="Abierta">Abierta</option>
                      <option value="Resuelta">Resuelta</option>
                    </select>
                    <span v-else>{{ d.estatus || 'Abierta' }}</span>
                  </td>
                </tr>
                <tr v-if="!otEditable.discrepancias || otEditable.discrepancias.length === 0">
                  <td colspan="3" class="p-4 text-center text-gray-400 italic">Sin discrepancias iniciales asociadas.</td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>

      <div v-if="esEdicion" class="px-6 py-3 bg-gray-100 border-t border-gray-200 flex justify-end gap-3 flex-shrink-0">
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
</template>