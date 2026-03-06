<script setup lang="ts">
import { ref } from 'vue';
import { Plus, Search, Filter, Mail, Phone, MapPin } from 'lucide-vue-next';
import ProveedoresForm from './ProveedoresForm.vue';

// 1. Estructura del Proveedor
interface Proveedor {
  id: string;
  nombre: string;
  rfc: string;
  contacto: string;
  telefono: string;
  email: string;
  ubicacion: string;
  categoria: 'Componentes' | 'Herramientas' | 'Consumibles' | 'Electrónica';
  estado: 'Activo' | 'Suspendido' | 'Inactivo';
}

// 2. Datos simulados
const proveedores = ref<Proveedor[]>([
  { 
    id: 'PROV-001', 
    nombre: 'AeroPartes Internacional S.A.', 
    rfc: 'API850123ABC', 
    contacto: 'Roberto Méndez', 
    telefono: '+52 55 1234 5678', 
    email: 'contacto@aeropartes.com', 
    ubicacion: 'Ciudad de México', 
    categoria: 'Componentes', 
    estado: 'Activo' 
  },
  { 
    id: 'PROV-002', 
    nombre: 'Herramientas Aeronáuticas del Norte', 
    rfc: 'HAN920615XYZ', 
    contacto: 'Laura Sánchez', 
    telefono: '+52 81 9876 5432', 
    email: 'ventas@han.com.mx', 
    ubicacion: 'Monterrey, NL', 
    categoria: 'Herramientas', 
    estado: 'Activo' 
  },
  { 
    id: 'PROV-003', 
    nombre: 'Química Aeroespacial S.A. de C.V.', 
    rfc: 'QAS780912DEF', 
    contacto: 'Miguel Torres', 
    telefono: '+52 33 5555 1234', 
    email: 'info@quimaero.com', 
    ubicacion: 'Guadalajara, JAL', 
    categoria: 'Consumibles', 
    estado: 'Activo' 
  },
  { 
    id: 'PROV-004', 
    nombre: 'Electrónica Aviónica Global', 
    rfc: 'EAG650430GHI', 
    contacto: 'Patricia Romero', 
    telefono: '+52 55 8888 9999', 
    email: 'contacto@eaglobal.mx', 
    ubicacion: 'Querétaro, QRO', 
    categoria: 'Electrónica', 
    estado: 'Suspendido' 
  }
]);

// Helper para colores de Estado
const getStatusColor = (estado: string) => {
  switch (estado) {
    case 'Activo': return 'bg-green-100 text-green-700 border-green-200';
    case 'Suspendido': return 'bg-yellow-100 text-yellow-700 border-yellow-200'; // Color para PROV-004
    default: return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

// Helper para colores de Categoría
const getCategoryStyle = (categoria: string) => {
  switch (categoria) {
    case 'Componentes': return 'bg-blue-100 text-blue-700';
    case 'Herramientas': return 'bg-purple-100 text-purple-700';
    case 'Consumibles': return 'bg-orange-100 text-orange-700';
    case 'Electrónica': return 'bg-indigo-100 text-indigo-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

const showModal = ref(false);

// Lógica para el ID autoincremental PROV-XXX
const getNextId = () => {
  const maxId = proveedores.value.reduce((max, p) => {
    const num = parseInt(p.id.split('-')[1]);
    return num > max ? num : max;
  }, 0);
  return `PROV-${(maxId + 1).toString().padStart(3, '0')}`;
};

const handleSave = (nuevo: Proveedor) => {
  proveedores.value.push(nuevo);
  showModal.value = false;
};
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Proveedores</h1>
        <p class="text-gray-500 text-sm">Gestiona el catálogo de proveedores de partes y servicios aeronáuticos.</p>
      </div>
      <button
          @click="showModal = true"
          class="bg-[#0f172a] hover:bg-slate-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm font-medium text-sm">
        <Plus class="w-4 h-4" />
        Nuevo Proveedor
      </button>
    </div>

    <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-3">
      <div class="relative flex-1">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input 
          type="text" 
          placeholder="Buscar por nombre, RFC, contacto..." 
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
          <span class="w-6 h-6 flex items-center justify-center bg-white rounded-md border border-gray-200 shadow-sm text-gray-500">
             <MapPin class="w-3 h-3" />
          </span>
          Catálogo de Proveedores
        </h3>
      </div>
      
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead class="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
            <tr>
              <th class="px-6 py-4">ID</th>
              <th class="px-6 py-4">Nombre / RFC</th>
              <th class="px-6 py-4">Contacto</th>
              <th class="px-6 py-4">Datos de Contacto</th>
              <th class="px-6 py-4">Ubicación</th>
              <th class="px-6 py-4">Categoría</th>
              <th class="px-6 py-4">Estado</th>
              <th class="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="prov in proveedores" :key="prov.id" class="hover:bg-gray-50/80 transition-colors">
              
              <td class="px-6 py-4 text-sm font-medium text-gray-500">{{ prov.id }}</td>
              
              <td class="px-6 py-4">
                <div class="text-sm font-semibold text-gray-900">{{ prov.nombre }}</div>
                <div class="text-xs text-gray-400 font-mono mt-0.5">{{ prov.rfc }}</div>
              </td>
              
              <td class="px-6 py-4 text-sm text-gray-600 font-medium">
                {{ prov.contacto }}
              </td>

              <td class="px-6 py-4">
                <div class="flex flex-col gap-1">
                    <div class="flex items-center gap-2 text-xs text-gray-600">
                        <Phone class="w-3 h-3 text-gray-400" />
                        {{ prov.telefono }}
                    </div>
                    <div class="flex items-center gap-2 text-xs text-blue-600 hover:underline cursor-pointer">
                        <Mail class="w-3 h-3" />
                        {{ prov.email }}
                    </div>
                </div>
              </td>
              
              <td class="px-6 py-4 text-sm text-gray-600">
                <div class="flex items-center gap-1.5">
                    <MapPin class="w-3.5 h-3.5 text-gray-400" />
                    {{ prov.ubicacion }}
                </div>
              </td>

              <td class="px-6 py-4">
                <span :class="`px-2.5 py-1 rounded-md text-xs font-semibold ${getCategoryStyle(prov.categoria)}`">
                  {{ prov.categoria }}
                </span>
              </td>

              <td class="px-6 py-4">
                <span :class="`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(prov.estado)}`">
                  {{ prov.estado }}
                </span>
              </td>

              <td class="px-6 py-4 text-right">
                <button class="text-gray-900 hover:text-blue-600 font-medium text-sm transition-colors">
                  Editar
                </button>
              </td>

            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <ProveedoresForm
        v-if="showModal"
        :nextId="getNextId()"
        @save="handleSave"
        @close="showModal = false"
    />
  </div>
</template>