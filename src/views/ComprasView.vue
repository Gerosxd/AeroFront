<script setup lang="ts">
import { ref } from 'vue';
import {
  Plus, Search, SlidersHorizontal, Download,
  Settings, Eye, MoreVertical, FileText
} from 'lucide-vue-next';

// Datos estáticos para simular la tabla de Compras
const compras = ref([
  {
    folio: 'OC-2026-0154',
    fecha: '13/05/2026',
    proveedor: 'Aero Partes S.A.',
    moneda: 'MXN',
    total: '$245,680.50',
    extraMoneda: '',
    estado: 'En tránsito',
    recepcion: '0 / 10',
    entregaEstimada: '15/05/2026',
    entregaSub: '(2 días)',
    solicitante: 'Ing. Carlos Méndez'
  },
  {
    folio: 'OC-2026-0153',
    fecha: '12/05/2026',
    proveedor: 'Avio Supplies Inc.',
    moneda: 'USD',
    total: '$3,250.00',
    extraMoneda: '(USD 175.00)',
    estado: 'Recepción parcial',
    recepcion: '5 / 10',
    entregaEstimada: '16/05/2026',
    entregaSub: '(3 días)',
    solicitante: 'Téc. Juan López'
  },
  {
    folio: 'OC-2026-0152',
    fecha: '10/05/2026',
    proveedor: 'Industrial Parts MX',
    moneda: 'MXN',
    total: '$12,780.00',
    extraMoneda: '',
    estado: 'Recepción completa',
    recepcion: '10 / 10',
    entregaEstimada: '12/05/2026',
    entregaSub: '(Entregado)',
    solicitante: 'Lic. Ana Martínez'
  },
  {
    folio: 'OC-2026-0151',
    fecha: '09/05/2026',
    proveedor: 'Fasteners & Tools',
    moneda: 'USD',
    total: '$1,120.00',
    extraMoneda: '(USD 60.00)',
    estado: 'En tránsito',
    recepcion: '0 / 5',
    entregaEstimada: '18/05/2026',
    entregaSub: '(5 días)',
    solicitante: 'Ing. Marco Ruiz'
  },
  {
    folio: 'OC-2026-0150',
    fecha: '08/05/2026',
    proveedor: 'Aero Parts USA',
    moneda: 'USD',
    total: '$8,450.00',
    extraMoneda: '(USD 450.00)',
    estado: 'En tránsito',
    recepcion: '0 / 20',
    entregaEstimada: '20/05/2026',
    entregaSub: '(7 días)',
    solicitante: 'Téc. Luis Ramírez'
  },
  {
    folio: 'OC-2026-0149',
    fecha: '06/05/2026',
    proveedor: 'Servicios Especiales SA',
    moneda: 'MXN',
    total: '$5,600.00',
    extraMoneda: '',
    estado: 'Cancelada',
    recepcion: '0 / 8',
    entregaEstimada: '—',
    entregaSub: '',
    solicitante: 'Lic. Ana Martínez'
  },
  {
    folio: 'OC-2026-0148',
    fecha: '05/05/2026',
    proveedor: 'Aero Partes S.A.',
    moneda: 'MXN',
    total: '$32,150.00',
    extraMoneda: '',
    estado: 'Recepción completa',
    recepcion: '15 / 15',
    entregaEstimada: '08/05/2026',
    entregaSub: '(Entregado)',
    solicitante: 'Ing. Carlos Méndez'
  },
  {
    folio: 'OC-2026-0147',
    fecha: '04/05/2026',
    proveedor: 'Avio Supplies Inc.',
    moneda: 'USD',
    total: '$2,900.00',
    extraMoneda: '(USD 155.00)',
    estado: 'Recepción parcial',
    recepcion: '2 / 6',
    entregaEstimada: '13/05/2026',
    entregaSub: '(2 días)',
    solicitante: 'Téc. Juan López'
  }
]);

const getEstadoBadgeClass = (estado: string) => {
  switch (estado) {
    case 'En tránsito':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'Recepción parcial':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'Recepción completa':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'Cancelada':
      return 'bg-red-50 text-red-700 border-red-200';
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
        <h1 class="text-2xl font-bold text-gray-900">Compras</h1>
        <p class="text-gray-500 text-sm">Administra tus procesos de compra y consulta el historial de órdenes.</p>
      </div>

      <div class="flex items-center gap-3">
        <button class="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold transition-colors shadow-sm">
          <FileText class="w-4 h-4 text-blue-600" />
          Requisiciones
        </button>
        <button class="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold transition-colors shadow-sm">
          <FileText class="w-4 h-4 text-blue-600" />
          Cotizaciones
        </button>
        <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold transition-colors shadow-sm">
          <Plus class="w-4 h-4" />
          Nueva Orden de Compra
        </button>
      </div>
    </div>

    <!-- Barra de Filtros -->
    <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
      <div class="relative md:col-span-4">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
            type="text"
            placeholder="Buscar por folio OC, proveedor, P/N, descripción..."
            class="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
        />
      </div>

      <div class="md:col-span-2">
        <select class="w-full py-2 px-3 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none">
          <option>Estado: Todos</option>
          <option>En tránsito</option>
          <option>Recepción parcial</option>
          <option>Recepción completa</option>
          <option>Cancelada</option>
        </select>
      </div>

      <div class="md:col-span-2">
        <select class="w-full py-2 px-3 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none">
          <option>Proveedor: Todos</option>
        </select>
      </div>

      <div class="md:col-span-3 flex items-center gap-2">
        <input type="text" placeholder="dd/mm/aaaa" class="w-1/2 py-2 px-3 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 outline-none text-center" />
        <input type="text" placeholder="dd/mm/aaaa" class="w-1/2 py-2 px-3 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 outline-none text-center" />
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
          <span class="text-sm font-bold text-blue-600 border-b-2 border-blue-600 pb-4 -mb-4">Últimas Órdenes de Compra</span>
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
        <table class="w-full text-left border-collapse min-w-[1000px]">
          <thead class="bg-gray-50 text-gray-500 text-[11px] uppercase font-semibold border-b border-gray-200">
          <tr>
            <th class="px-5 py-3">Folio OC</th>
            <th class="px-5 py-3">Fecha</th>
            <th class="px-5 py-3">Proveedor</th>
            <th class="px-5 py-3">Moneda</th>
            <th class="px-5 py-3">Total</th>
            <th class="px-5 py-3">Estado</th>
            <th class="px-5 py-3 text-center">Recepción</th>
            <th class="px-5 py-3">Entrega estimada</th>
            <th class="px-5 py-3">Solicitante</th>
            <th class="px-5 py-3 text-right">Acciones</th>
          </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 text-xs">
          <tr v-for="item in compras" :key="item.folio" class="hover:bg-gray-50/80 transition-colors">
            <td class="px-5 py-3 font-semibold text-blue-600 cursor-pointer hover:underline">
              {{ item.folio }}
            </td>
            <td class="px-5 py-3 text-gray-600">{{ item.fecha }}</td>
            <td class="px-5 py-3 font-medium text-gray-800">{{ item.proveedor }}</td>
            <td class="px-5 py-3 text-gray-600 font-mono">{{ item.moneda }}</td>
            <td class="px-5 py-3">
              <div class="font-bold text-gray-900">{{ item.total }}</div>
              <div v-if="item.extraMoneda" class="text-[10px] text-gray-400 font-mono">{{ item.extraMoneda }}</div>
            </td>
            <td class="px-5 py-3">
                <span :class="['px-2.5 py-0.5 rounded-full text-[11px] font-semibold border inline-block', getEstadoBadgeClass(item.estado)]">
                  {{ item.estado }}
                </span>
            </td>
            <td class="px-5 py-3 text-center font-mono text-gray-600">{{ item.recepcion }}</td>
            <td class="px-5 py-3">
              <div class="text-gray-800">{{ item.entregaEstimada }}</div>
              <div v-if="item.entregaSub" :class="item.entregaSub.includes('Entregado') ? 'text-emerald-600 font-medium' : 'text-amber-600'" class="text-[10px]">
                {{ item.entregaSub }}
              </div>
            </td>
            <td class="px-5 py-3 text-gray-600">{{ item.solicitante }}</td>
            <td class="px-5 py-3 text-right">
              <div class="flex items-center justify-end gap-1">
                <button class="p-1 text-gray-400 hover:text-blue-600 rounded">
                  <Eye class="w-4 h-4" />
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