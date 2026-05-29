<script setup lang="ts">
import { X, Calendar, Wrench, ShieldAlert, ClipboardList } from 'lucide-vue-next';
import type { OTDetalle } from '../types/ot';

defineProps<{
  open: boolean;
  ot: OTDetalle | null;
  cargando: boolean;
}>();

const emit = defineEmits(['close']);

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
    <div class="bg-white w-full max-w-4xl rounded-xl shadow-xl overflow-hidden flex flex-col max-h-[85vh]">

      <div class="px-6 py-4 bg-slate-900 text-white flex justify-between items-center">
        <h2 class="text-base font-bold flex items-center gap-2">
          <Wrench class="w-4 h-4 text-blue-400" />
          Orden de Trabajo: {{ ot?.noOT || 'Cargando...' }}
        </h2>
        <button @click="emit('close')" class="p-1 text-gray-400 hover:text-white rounded-md transition-colors">
          <X class="w-4 h-4" />
        </button>
      </div>

      <div class="p-6 overflow-y-auto space-y-6 flex-1 bg-slate-50">
        <div v-if="cargando" class="py-12 text-center text-gray-500 text-sm">
          Cargando datos desde el servidor...
        </div>

        <div v-else-if="ot" class="grid grid-cols-1 md:grid-cols-3 gap-4">

          <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-2.5 text-sm">
            <h3 class="font-bold text-gray-800 border-b pb-1 text-xs uppercase tracking-wider">General</h3>
            <div><span class="text-xs text-gray-400 block">Estatus actual:</span><span :class="`px-2 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor(ot.estado)}`">{{ ot.estado }}</span></div>
            <div><span class="text-xs text-gray-400 block">Horas Totales:</span><span class="font-medium text-gray-900">{{ ot.horasTotales || '0.00' }} hrs</span></div>
            <div><span class="text-xs text-gray-400 block">Ciclos Totales:</span><span class="font-medium text-gray-900">{{ ot.ciclosTotales || '0' }}</span></div>
          </div>

          <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-2.5 text-sm">
            <h3 class="font-bold text-gray-800 border-b pb-1 text-xs uppercase tracking-wider">Aeronave</h3>
            <div><span class="text-xs text-gray-400 block">Matrícula:</span><span class="font-bold text-blue-600">{{ ot.matricula }}</span></div>
            <div><span class="text-xs text-gray-400 block">Modelo:</span><span class="text-gray-700">{{ ot.modeloAeronave || '-' }}</span></div>
          </div>

          <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-2.5 text-sm">
            <h3 class="font-bold text-gray-800 border-b pb-1 text-xs uppercase tracking-wider">Cliente</h3>
            <div><span class="text-xs text-gray-400 block">Compañía:</span><span class="font-medium text-gray-900">{{ ot.clienteCompania }}</span></div>
            <div><span class="text-xs text-gray-400 block">Contacto Directo:</span><span class="text-gray-600">{{ ot.clienteContacto || '-' }}</span></div>
          </div>

          <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div class="flex items-center gap-2"><Calendar class="w-4 h-4 text-gray-400" /><div><span class="text-gray-400 block">Creación:</span><span class="text-gray-700 font-medium">{{ ot.fechaCreacion }}</span></div></div>
            <div class="flex items-center gap-2"><Calendar class="w-4 h-4 text-gray-400" /><div><span class="text-gray-400 block">Entrega Estimada:</span><span class="text-gray-700 font-medium">{{ ot.fechaEntrega || '-' }}</span></div></div>
            <div class="flex items-center gap-2"><Calendar class="w-4 h-4 text-gray-400" /><div><span class="text-gray-400 block">Cierre de OT:</span><span class="text-gray-700 font-medium">{{ ot.fechaCierre || '-' }}</span></div></div>
          </div>

          <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm md:col-span-3 space-y-2 text-sm">
            <h3 class="font-bold text-gray-800 border-b pb-1 text-xs uppercase flex items-center gap-1.5"><ClipboardList class="w-4 h-4 text-blue-500" /> Tareas de Mantenimiento</h3>
            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse text-xs">
                <thead>
                <tr class="bg-gray-50 text-gray-500 uppercase font-semibold"><th class="p-2 border-b">Código</th><th class="p-2 border-b">Descripción</th><th class="p-2 border-b">Técnicos</th><th class="p-2 border-b">Horas</th></tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                <tr v-for="t in ot.tareasMantenimiento" :key="t.codigo"><td class="p-2 font-mono text-gray-900">{{ t.codigo }}</td><td class="p-2 text-gray-600">{{ t.descripcion }}</td><td class="p-2 text-gray-500">{{ t.tecnicos || 'No asignado' }}</td><td class="p-2 text-gray-900 font-semibold">{{ t.horasTotales || '0' }} hrs</td></tr>
                <tr v-if="!ot.tareasMantenimiento || ot.tareasMantenimiento.length === 0"><td colspan="4" class="p-2 text-center text-gray-400 italic">Sin tareas de ingeniería programadas.</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm md:col-span-3 space-y-2 text-sm">
            <h3 class="font-bold text-gray-800 border-b pb-1 text-xs uppercase flex items-center gap-1.5"><ShieldAlert class="w-4 h-4 text-amber-500" /> Discrepancias Reportadas</h3>
            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse text-xs">
                <thead>
                <tr class="bg-gray-50 text-gray-500 uppercase font-semibold"><th class="p-2 border-b">Código</th><th class="p-2 border-b">Descripción</th><th class="p-2 border-b">Estatus</th></tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                <tr v-for="d in ot.discrepancias" :key="d.codigo"><td class="p-2 font-mono text-gray-900">{{ d.codigo }}</td><td class="p-2 text-gray-600">{{ d.descripcion }}</td><td class="p-2 text-gray-500">{{ d.estatus || 'Abierta' }}</td></tr>
                <tr v-if="!ot.discrepancias || ot.discrepancias.length === 0"><td colspan="3" class="p-2 text-center text-gray-400 italic">Sin discrepancias iniciales asociadas.</td></tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>