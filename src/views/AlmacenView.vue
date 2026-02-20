<script setup lang="ts">
import { ref } from 'vue';
import { Plus, Search, Filter } from 'lucide-vue-next';

// 1. Definición de la estructura de datos (Interface)
interface Almacen {
  id: string;
  nombre: string;
  ubicacion: string;
  tipo: string;
  capacidad: string;
  ocupacion: number; // Valor numérico para la barra de progreso (0-100)
  estado: 'Activo' | 'Mantenimiento' | 'Inactivo';
  responsable: string;
}

// 2. Datos simulados 
const almacenes = ref<Almacen[]>([
  { id: 'ALM-001', nombre: 'Almacén Principal', ubicacion: 'Hangar A, Planta Baja', tipo: 'General', capacidad: '500 m²', ocupacion: 75, estado: 'Activo', responsable: 'Juan Pérez' },
  { id: 'ALM-002', nombre: 'Almacén de Herramientas', ubicacion: 'Edificio B, Nivel 2', tipo: 'Herramientas', capacidad: '200 m²', ocupacion: 45, estado: 'Activo', responsable: 'María López' },
  { id: 'ALM-003', nombre: 'Almacén de Componentes', ubicacion: 'Hangar C, Área Técnica', tipo: 'Componentes', capacidad: '350 m²', ocupacion: 90, estado: 'Activo', responsable: 'Carlos Ramírez' },
  { id: 'ALM-004', nombre: 'Almacén Secundario', ubicacion: 'Bodega Externa', tipo: 'General', capacidad: '150 m²', ocupacion: 30, estado: 'Mantenimiento', responsable: 'Ana García' },
]);

// colores de estado
const getStatusColor = (estado: string) => {
  switch (estado) {
    case 'Activo': return 'bg-green-100 text-green-700';
    case 'Mantenimiento': return 'bg-yellow-100 text-yellow-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

//barra de progreso
const getProgressColor = (valor: number) => {
  if (valor > 80) return 'bg-orange-500'; // Casi lleno
  if (valor < 30) return 'bg-green-500';  // Vacío
  return 'bg-blue-500'; // Normal
};
</script>

<template>
  <div class="space-y-6">
    
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Almacenes</h1>
        <p class="text-gray-500 text-sm">Gestiona los almacenes físicos del taller aeronáutico.</p>
      </div>
      <button class="bg-[#0f172a] hover:bg-slate-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm font-medium text-sm">
        <Plus class="w-4 h-4" />
        Nuevo Almacén
      </button>
    </div>

    <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-3">
      <div class="relative flex-1">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input 
          type="text" 
          placeholder="Buscar por nombre, ubicación..." 
          class="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>
      <button class="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-700 text-sm font-medium transition-colors">
        <Filter class="w-4 h-4" />
        Filtros
      </button>
    </div>

    <div class="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      <div class="p-4 border-b border-gray-200 bg-gray-50/50">
        <h3 class="font-semibold text-gray-900 flex items-center gap-2">
          <span class="w-2 h-6 bg-blue-600 rounded-full"></span>
          Almacenes Físicos
        </h3>
      </div>
      
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead class="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
            <tr>
              <th class="px-6 py-4">ID</th>
              <th class="px-6 py-4">Nombre</th>
              <th class="px-6 py-4">Ubicación</th>
              <th class="px-6 py-4">Tipo</th>
              <th class="px-6 py-4">Capacidad</th>
              <th class="px-6 py-4 min-w-[150px]">Ocupación</th>
              <th class="px-6 py-4">Estado</th>
              <th class="px-6 py-4">Responsable</th>
              <th class="px-6 py-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="alm in almacenes" :key="alm.id" class="hover:bg-gray-50/80 transition-colors group">
              <td class="px-6 py-4 text-sm font-medium text-gray-500">{{ alm.id }}</td>
              <td class="px-6 py-4 text-sm font-semibold text-gray-900">{{ alm.nombre }}</td>
              <td class="px-6 py-4 text-sm text-gray-500 flex items-center gap-1">
                {{ alm.ubicacion }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-600">{{ alm.tipo }}</td>
              <td class="px-6 py-4 text-sm text-gray-600">{{ alm.capacidad }}</td>
              
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <div class="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      class="h-full rounded-full" 
                      :class="getProgressColor(alm.ocupacion)"
                      :style="`width: ${alm.ocupacion}%`"
                    ></div>
                  </div>
                  <span class="text-xs font-medium text-gray-600">{{ alm.ocupacion }}%</span>
                </div>
              </td>

              <td class="px-6 py-4">
                <span :class="`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(alm.estado)} border-transparent bg-opacity-10`">
                  {{ alm.estado }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-600">{{ alm.responsable }}</td>
              <td class="px-6 py-4 text-center">
                <button class="text-gray-400 hover:text-blue-600 font-medium text-sm transition-colors">
                  Editar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
</template>