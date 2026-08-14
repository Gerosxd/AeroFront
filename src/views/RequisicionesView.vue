<script setup lang="ts">
import { ref } from 'vue';
import {
  Plus, Search, SlidersHorizontal, Download,
  Settings, Eye, Edit2, MoreVertical, FileText, BarChart2
} from 'lucide-vue-next';

// Datos estáticos para simular la tabla de Requisiciones
const requisiciones = ref([
  {
    folio: 'REQ-2026-0087',
    fecha: '13/05/2026',
    area: 'Ingeniería',
    solicitante: 'Ing. Marco Ruiz',
    prioridad: 'Alta',
    estado: 'Por autorizar',
    totalEstimado: '$32,450.00',
    moneda: 'MXN',
    extraMoneda: '',
    requiereAutorizacion: 'Dirección\nIng. Carlos Méndez',
    fechaLimite: '15/05/2026',
    fechaLimiteSub: '(2 días)'
  },
  {
    folio: 'REQ-2026-0086',
    fecha: '13/05/2026',
    area: 'Técnicos',
    solicitante: 'Téc. Juan López',
    prioridad: 'Media',
    estado: 'Enviada',
    totalEstimado: '$8,120.00',
    moneda: 'MXN',
    extraMoneda: '',
    requiereAutorizacion: 'Dirección\nIng. Carlos Méndez',
    fechaLimite: '14/05/2026',
    fechaLimiteSub: '(1 día)'
  },
  {
    folio: 'REQ-2026-0085',
    fecha: '12/05/2026',
    area: 'Administración',
    solicitante: 'Lic. Ana Martínez',
    prioridad: 'Baja',
    estado: 'Autorizada',
    totalEstimado: '$4,560.00',
    moneda: 'MXN',
    extraMoneda: '',
    requiereAutorizacion: '—',
    fechaLimite: '—',
    fechaLimiteSub: ''
  },
  {
    folio: 'REQ-2026-0084',
    fecha: '12/05/2026',
    area: 'Ingeniería',
    solicitante: 'Ing. Carlos Méndez',
    prioridad: 'Alta',
    estado: 'Por autorizar',
    totalEstimado: '$21,780.00',
    moneda: 'USD',
    extraMoneda: '(USD 1,080.00)',
    requiereAutorizacion: 'Dirección\nIng. Carlos Méndez',
    fechaLimite: '16/05/2026',
    fechaLimiteSub: '(3 días)'
  },
  {
    folio: 'REQ-2026-0083',
    fecha: '11/05/2026',
    area: 'Técnicos',
    solicitante: 'Téc. Luis Ramírez',
    prioridad: 'Media',
    estado: 'Enviada',
    totalEstimado: '$12,300.00',
    moneda: 'MXN',
    extraMoneda: '',
    requiereAutorizacion: 'Dirección\nIng. Carlos Méndez',
    fechaLimite: '13/05/2026',
    fechaLimiteSub: '(Vence hoy)'
  },
  {
    folio: 'REQ-2026-0082',
    fecha: '10/05/2026',
    area: 'Ingeniería',
    solicitante: 'Ing. Marco Ruiz',
    prioridad: 'Baja',
    estado: 'Autorizada',
    totalEstimado: '$6,750.00',
    moneda: 'MXN',
    extraMoneda: '',
    requiereAutorizacion: '—',
    fechaLimite: '—',
    fechaLimiteSub: ''
  },
  {
    folio: 'REQ-2026-0081',
    fecha: '09/05/2026',
    area: 'Administración',
    solicitante: 'Lic. Ana Martínez',
    prioridad: 'Media',
    estado: 'Rechazada',
    totalEstimado: '$3,400.00',
    moneda: 'MXN',
    extraMoneda: '',
    requiereAutorizacion: 'Dirección\nIng. Carlos Méndez',
    fechaLimite: '—',
    fechaLimiteSub: ''
  },
  {
    folio: 'REQ-2026-0080',
    fecha: '09/05/2026',
    area: 'Técnicos',
    solicitante: 'Téc. Juan López',
    prioridad: 'Alta',
    estado: 'Convertida en OC',
    totalEstimado: '$15,280.00',
    moneda: 'MXN',
    extraMoneda: '',
    requiereAutorizacion: '—',
    fechaLimite: '—',
    fechaLimiteSub: ''
  }
]);

const getPrioridadBadgeClass = (prioridad: string) => {
  switch (prioridad) {
    case 'Alta':
      return 'bg-red-50 text-red-700 border-red-200';
    case 'Media':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'Baja':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200';
  }
};

const getEstadoBadgeClass = (estado: string) => {
  switch (estado) {
    case 'Por autorizar':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'Enviada':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'Autorizada':
      return 'bg-purple-50 text-purple-700 border-purple-200';
    case 'Rechazada':
      return 'bg-red-50 text-red-700 border-red-200';
    case 'Convertida en OC':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200';
  }
};
</script>

<template>
  <div class="space-y-6 pb-12 animate-fade-in">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Requisiciones</h1>
        <p class="text-gray-500 text-sm">Gestiona y da seguimiento a todas las requisiciones de compra.</p>
      </div>

      <div class="flex items-center gap-3">
        <button class="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold transition-colors shadow-sm">
          <FileText class="w-4 h-4 text-blue-600" />
          Mis requisiciones
        </button>
        <button class="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold transition-colors shadow-sm">
          <BarChart2 class="w-4 h-4 text-blue-600" />
          Reportes
        </button>
        <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold transition-colors shadow-sm">
          <Plus class="w-4 h-4" />
          Nueva requisición
        </button>
      </div>
    </div>

    <!-- Barra de Filtros -->
    <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
      <div class="relative md:col-span-3">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
            type="text"
            placeholder="Buscar por folio, solicitante, área, descripción..."
            class="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
        />
      </div>

      <div class="md:col-span-2">
        <select class="w-full py-2 px-3 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none">
          <option>Estado: Todos</option>
          <option>Por autorizar</option>
          <option>Enviada</option>
          <option>Autorizada</option>
          <option>Rechazada</option>
          <option>Convertida en OC</option>
        </select>
      </div>

      <div class="md:col-span-2">
        <select class="w-full py-2 px-3 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none">
          <option>Área: Todas</option>
          <option>Ingeniería</option>
          <option>Técnicos</option>
          <option>Administración</option>
        </select>
      </div>

      <div class="md:col-span-2">
        <select class="w-full py-2 px-3 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none">
          <option>Solicitante: Todos</option>
        </select>
      </div>

      <div class="md:col-span-2 flex items-center gap-1.5">
        <input type="text" placeholder="dd/mm/aaaa" class="w-1/2 py-2 px-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 outline-none text-center" />
        <input type="text" placeholder="dd/mm/aaaa" class="w-1/2 py-2 px-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 outline-none text-center" />
      </div>

      <div class="md:col-span-1 flex justify-end">
        <button class="w-full py-2 px-3 border border-gray-200 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-50 flex items-center justify-center gap-1.5 transition-colors">
          <SlidersHorizontal class="w-3.5 h-3.5" />
          Filtros
        </button>
      </div>
    </div>

    <!-- Contenedor Tabla -->
    <div class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div class="p-4 border-b border-gray-200 flex items-center justify-between">
        <div class="flex items-center gap-6">
          <span class="text-sm font-bold text-blue-600 border-b-2 border-blue-600 pb-4 -mb-4">Requisiciones</span>
        </div>

        <div class="flex items-center gap-2">
          <button class="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-50 flex items-center gap-1.5 transition-colors shadow-sm">
            <Download class="w-3.5 h-3.5" /> Exportar
          </button>
          <button class="p-1.5 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors shadow-sm">
            <Settings class="w-4 h-4" />
          </button>
        </div>
      </div>

      <div class="overflow-x-auto w-full">
        <table class="w-full text-left border-collapse min-w-[1100px]">
          <thead class="bg-gray-50 text-gray-500 text-[11px] uppercase font-semibold border-b border-gray-200">
          <tr>
            <th class="px-5 py-3">Folio req.</th>
            <th class="px-5 py-3">Fecha</th>
            <th class="px-5 py-3">Área solicitante</th>
            <th class="px-5 py-3">Solicitante</th>
            <th class="px-5 py-3 text-center">Prioridad</th>
            <th class="px-5 py-3">Estado</th>
            <th class="px-5 py-3">Total estimado</th>
            <th class="px-5 py-3">Moneda</th>
            <th class="px-5 py-3">Requiere autorización</th>
            <th class="px-5 py-3">Fecha límite</th>
            <th class="px-5 py-3 text-right">Acciones</th>
          </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 text-xs">
          <tr v-for="req in requisiciones" :key="req.folio" class="hover:bg-gray-50/80 transition-colors">
            <td class="px-5 py-3 font-semibold text-blue-600 cursor-pointer hover:underline">
              {{ req.folio }}
            </td>
            <td class="px-5 py-3 text-gray-600">{{ req.fecha }}</td>
            <td class="px-5 py-3 text-gray-700">{{ req.area }}</td>
            <td class="px-5 py-3 font-medium text-gray-800">{{ req.solicitante }}</td>
            <td class="px-5 py-3 text-center">
                <span :class="['px-2 py-0.5 rounded-full text-[11px] font-semibold border inline-block', getPrioridadBadgeClass(req.prioridad)]">
                  {{ req.prioridad }}
                </span>
            </td>
            <td class="px-5 py-3">
                <span :class="['px-2.5 py-0.5 rounded-full text-[11px] font-semibold border inline-block', getEstadoBadgeClass(req.estado)]">
                  {{ req.estado }}
                </span>
            </td>
            <td class="px-5 py-3 font-bold text-gray-900">{{ req.totalEstimado }}</td>
            <td class="px-5 py-3 text-gray-600 font-mono">
              <div>{{ req.moneda }}</div>
              <div v-if="req.extraMoneda" class="text-[10px] text-gray-400">{{ req.extraMoneda }}</div>
            </td>
            <td class="px-5 py-3 text-gray-600 whitespace-pre-line leading-tight text-[11px]">
              {{ req.requiereAutorizacion }}
            </td>
            <td class="px-5 py-3">
              <div class="text-gray-800">{{ req.fechaLimite }}</div>
              <div v-if="req.fechaLimiteSub" :class="req.fechaLimiteSub.includes('hoy') ? 'text-red-500 font-bold' : 'text-amber-600'" class="text-[10px]">
                {{ req.fechaLimiteSub }}
              </div>
            </td>
            <td class="px-5 py-3 text-right">
              <div class="flex items-center justify-end gap-1">
                <button class="p-1 text-gray-400 hover:text-blue-600 rounded">
                  <Eye class="w-4 h-4" />
                </button>
                <button class="p-1 text-gray-400 hover:text-amber-600 rounded">
                  <Edit2 class="w-4 h-4" />
                </button>
                <button class="p-1 text-gray-400 hover:text-gray-600 rounded">
                  <MoreVertical class="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <!-- Paginación -->
      <div class="p-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
        <div>Mostrando 1 a 8 de 25 resultados</div>
        <div class="flex items-center gap-2">
          <div class="flex items-center gap-1 border border-gray-200 rounded-lg px-2 py-1 bg-white">
            <span>10 por página</span>
          </div>
          <div class="flex items-center gap-1">
            <button class="p-1 px-2 border border-gray-200 rounded text-gray-400 hover:bg-gray-50">&lt;</button>
            <button class="p-1 px-2 bg-blue-600 text-white rounded font-bold">1</button>
            <button class="p-1 px-2 hover:bg-gray-100 rounded">2</button>
            <button class="p-1 px-2 hover:bg-gray-100 rounded">3</button>
            <button class="p-1 px-2 border border-gray-200 rounded text-gray-600 hover:bg-gray-50">&gt;</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.25s ease-in-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>