<script setup lang="ts">
import { 
  Search, Plane, Wrench, CheckCircle, AlertTriangle, 
  Calendar, AlertOctagon, Clock 
} from 'lucide-vue-next';

// Datos de las tarjetas superiores
const stats = [
  { title: 'Aeronaves en Servicio', value: '12', icon: Plane, color: 'bg-blue-500' },
  { title: 'Trabajos Activos', value: '28', subtext: '8 en progreso', icon: Wrench, color: 'bg-orange-500' },
  { title: 'Completados (Mes)', value: '145', icon: CheckCircle, color: 'bg-green-500' },
  { title: 'Pendientes Urgentes', value: '5', subtext: 'Requieren atención', icon: AlertTriangle, color: 'bg-red-500' },
];

// Datos de Alertas
const alertas = [
  { tipo: 'inspeccion', titulo: 'Inspección C pendiente', nave: 'Boeing 737-800 (N737BA)', tiempo: 'Vence en 3 días', color: 'orange' },
  { tipo: 'mto', titulo: 'Mantenimiento programado', nave: 'Airbus A320 (N320AB)', tiempo: 'Programado para mañana', color: 'yellow' },
  { tipo: 'critico', titulo: 'Componente crítico reportado', nave: 'Cessna 172 (N172CE)', tiempo: 'Requiere atención inmediata', color: 'red' }
];

// Helper para colores de alerta
const getAlertStyle = (color: string) => {
  if (color === 'orange') return 'bg-orange-50 border-orange-100 text-orange-900';
  if (color === 'yellow') return 'bg-yellow-50 border-yellow-100 text-yellow-900';
  if (color === 'red') return 'bg-red-50 border-red-100 text-red-900';
  return '';
};
</script>

<template>
  <div class="max-w-[1920px] mx-auto space-y-8">
    
    <div class="flex flex-col md:flex-row gap-4 justify-between items-end md:items-center">
      <div>
        <h2 class="text-3xl font-bold text-gray-900">Dashboard Principal</h2>
        <p class="text-gray-500 mt-1">Bienvenido de vuelta. Aquí está el resumen de tu taller aeronáutico.</p>
      </div>
       <div class="relative w-full md:w-96">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input type="text" placeholder="Buscar aeronaves, trabajos..." class="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 outline-none" />
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      <div v-for="(stat, index) in stats" :key="index" class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start justify-between">
        <div>
          <p class="text-sm font-medium text-gray-500 mb-1">{{ stat.title }}</p>
          <h3 class="text-3xl font-bold text-gray-900">{{ stat.value }}</h3>
          <p v-if="stat.subtext" class="text-xs text-gray-400 mt-1">{{ stat.subtext }}</p>
        </div>
        <div :class="`${stat.color} p-3 rounded-lg text-white shadow-sm`">
          <component :is="stat.icon" class="w-6 h-6" />
        </div>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div class="flex items-center gap-2 mb-6">
        <AlertTriangle class="w-5 h-5 text-orange-500" />
        <h3 class="text-lg font-bold text-gray-900">Alertas y Notificaciones</h3>
        <span class="text-sm text-gray-500 ml-2">1 alertas urgentes</span>
      </div>
      <div class="space-y-4">
        <div v-for="(alerta, idx) in alertas" :key="idx" 
             :class="`p-4 border rounded-lg flex items-start gap-4 ${getAlertStyle(alerta.color)}`">
          <div class="mt-1">
             <Calendar v-if="alerta.tipo === 'inspeccion'" class="w-5 h-5" />
             <Wrench v-else-if="alerta.tipo === 'mto'" class="w-5 h-5" />
             <AlertOctagon v-else class="w-5 h-5" />
          </div>
          <div class="flex-1">
            <h4 class="font-semibold">{{ alerta.titulo }}</h4>
            <p class="text-sm opacity-90">{{ alerta.nave }}</p>
            <p class="text-xs mt-1 font-medium opacity-80">{{ alerta.tiempo }}</p>
          </div>
          <button v-if="alerta.tipo === 'critico'" class="bg-red-600 text-white text-xs px-3 py-1 rounded-full">Urgente</button>
        </div>
      </div>
    </div>

  </div>
</template>