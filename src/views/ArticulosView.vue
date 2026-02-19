<script setup lang="ts">
import { ref } from 'vue';
import { Plus, Search, Filter, Box, ArrowDownCircle } from 'lucide-vue-next';

// --- SECCIÓN 1: LISTADO GENERAL  ---
interface Articulo {
  id: string;
  codigo: string;
  noSerie: string;
  descripcion: string;
  categoria: string;
  unidadMedida: string;
  stock: number;
  almacen: string;
  ubicacion: string;
  proveedor: string;
  precio: number;
  condicion: 'Nuevo' | 'Reparado' | 'Overhaul' | 'Reacondicionado';
}

const articulos = ref<Articulo[]>([
  { id: '1', codigo: 'ART-001', noSerie: 'SN-12345', descripcion: 'Filtro de aceite hidráulico', categoria: 'Componentes', unidadMedida: 'Pza', stock: 45, almacen: 'Principal', ubicacion: 'Est. A-2-3', proveedor: 'AeroPartes S.A.', precio: 1250.00, condicion: 'Nuevo' },
  { id: '2', codigo: 'ART-002', noSerie: 'SN-67890', descripcion: 'Fluido hidráulico Skydrol', categoria: 'Fluidos', unidadMedida: 'Gal', stock: 120, almacen: 'Secundario', ubicacion: 'Est. B-1-5', proveedor: 'Química Aero', precio: 85.00, condicion: 'Nuevo' },
  { id: '3', codigo: 'ART-003', noSerie: 'SN-11223', descripcion: 'Kit de juntas motor PT6', categoria: 'Kits', unidadMedida: 'Pza', stock: 8, almacen: 'Principal', ubicacion: 'Est. C-3-2', proveedor: 'Pratt & Whitney', precio: 3200.00, condicion: 'Reparado' },
  { id: '4', codigo: 'ART-004', noSerie: 'SN-44556', descripcion: 'Rodamiento principal tren aterrizaje', categoria: 'Componentes', unidadMedida: 'Pza', stock: 15, almacen: 'Principal', ubicacion: 'Est. D-1-8', proveedor: 'SKF Aerospace', precio: 4850.00, condicion: 'Overhaul' },
  { id: '5', codigo: 'ART-005', noSerie: 'SN-78901', descripcion: 'Aceite lubricante turbina Mobil Jet II', categoria: 'Lubricantes', unidadMedida: 'Lts', stock: 200, almacen: 'Secundario', ubicacion: 'Est. E-2-4', proveedor: 'ExxonMobil Aviation', precio: 42.50, condicion: 'Nuevo' },
]);

// --- SECCIÓN 2: NUEVA SECCIÓN DE ENTRADAS ---
interface Entrada {
  id: string;
  fecha: string;
  codigoArticulo: string;
  descripcion: string;
  cantidad: number;
  unidadMedida: string;
  proveedor: string;
  almacen: string;
  ubicacion: string;
  recibidoPor: string;
  estado: 'Completado' | 'Pendiente';
}

// Datos simulados 
const entradas = ref<Entrada[]>([
  { 
    id: 'ENT-001', fecha: '15/02/2026', codigoArticulo: 'ART-001', 
    descripcion: 'Filtro de aceite hidráulico', cantidad: 25, unidadMedida: 'Pza', 
    proveedor: 'AeroPartes S.A.', almacen: 'Principal', ubicacion: 'Est. A-2-3', 
    recibidoPor: 'Juan Pérez', estado: 'Completado' 
  },
  { 
    id: 'ENT-002', fecha: '14/02/2026', codigoArticulo: 'ART-028', 
    descripcion: 'Aceite sintético motor turbina', cantidad: 80, unidadMedida: 'Lts', 
    proveedor: 'ExxonMobil Aviation', almacen: 'Secundario', ubicacion: 'Est. B-1-5', 
    recibidoPor: 'María López', estado: 'Pendiente' 
  },
  { 
    id: 'ENT-003', fecha: '13/02/2026', codigoArticulo: 'ART-042', 
    descripcion: 'Válvula check hidráulica 3000 PSI', cantidad: 10, unidadMedida: 'Pza', 
    proveedor: 'Parker Aerospace', almacen: 'Principal', ubicacion: 'Est. C-3-2', 
    recibidoPor: 'Carlos Ramírez', estado: 'Completado' 
  },
  { 
    id: 'ENT-004', fecha: '12/02/2026', codigoArticulo: 'ART-015', 
    descripcion: 'Fluido hidráulico Skydrol LD-4', cantidad: 50, unidadMedida: 'Gal', 
    proveedor: 'Química Aero', almacen: 'Principal', ubicacion: 'Est. D-1-1', 
    recibidoPor: 'Ana García', estado: 'Completado' 
  },
  { 
    id: 'ENT-005', fecha: '11/02/2026', codigoArticulo: 'ART-056', 
    descripcion: 'Filtro de aire motor CFM56', cantidad: 15, unidadMedida: 'Pza', 
    proveedor: 'Donaldson Aerospace', almacen: 'Componentes', ubicacion: 'Est. E-2-4', 
    recibidoPor: 'Roberto Díaz', estado: 'Pendiente' 
  },
]);

// --- HELPERS VISUALES ---
const formatCurrency = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

const getConditionStyle = (condicion: string) => {
  switch (condicion) {
    case 'Nuevo': return 'bg-green-100 text-green-700';
    case 'Reparado': return 'bg-blue-100 text-blue-700';
    case 'Overhaul': return 'bg-purple-100 text-purple-700';
    case 'Reacondicionado': return 'bg-indigo-100 text-indigo-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

const getEntryStatusStyle = (estado: string) => {
  switch (estado) {
    case 'Completado': return 'bg-green-100 text-green-700';
    case 'Pendiente': return 'bg-yellow-100 text-yellow-800';
    default: return 'bg-gray-100 text-gray-700';
  }
};

// Control de Pestañas
const activeTab = ref('listado');
</script>

<template>
  <div class="space-y-6">
    
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Artículos</h1>
        <p class="text-gray-500 text-sm">Gestiona el catálogo completo de artículos aeronáuticos.</p>
      </div>
      <button class="bg-[#0f172a] hover:bg-slate-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm font-medium text-sm">
        <Plus class="w-4 h-4" />
        Nuevo Artículo
      </button>
    </div>

    <div class="border-b border-gray-200">
      <nav class="flex gap-6">
        <button 
          @click="activeTab = 'listado'"
          :class="[activeTab === 'listado' ? 'border-blue-600 text-blue-600 font-semibold' : 'border-transparent text-gray-500 hover:text-gray-700', 'whitespace-nowrap py-3 px-1 border-b-2 text-sm transition-colors']"
        >
          Listado General
        </button>
        <button 
          @click="activeTab = 'entradas'"
          :class="[activeTab === 'entradas' ? 'border-blue-600 text-blue-600 font-semibold' : 'border-transparent text-gray-500 hover:text-gray-700', 'whitespace-nowrap py-3 px-1 border-b-2 text-sm transition-colors']"
        >
          Entradas de Artículos
        </button>
      </nav>
    </div>

    <div v-if="activeTab === 'listado'" class="space-y-6">
      <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-3">
        <div class="relative flex-1">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input type="text" placeholder="Buscar por código, número de serie, descripción..." class="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
        <button class="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-700 text-sm font-medium">
          <Filter class="w-4 h-4" /> Filtros
        </button>
      </div>

      <div class="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm overflow-x-auto">
        <div class="p-4 border-b border-gray-200 bg-gray-50/50 min-w-max">
          <h3 class="font-semibold text-gray-900 flex items-center gap-2">
            <Box class="w-4 h-4 text-gray-500" /> Catálogo de Artículos
          </h3>
        </div>
        <div class="min-w-max">
          <table class="w-full text-left border-collapse">
            <thead class="bg-white text-gray-500 text-xs uppercase font-semibold border-b border-gray-100">
              <tr>
                <th class="px-6 py-4">Código</th>
                <th class="px-6 py-4">No. Serie</th>
                <th class="px-6 py-4">Descripción</th>
                <th class="px-6 py-4">Categoría</th>
                <th class="px-6 py-4 text-center">Unidad <br> Medida</th>
                <th class="px-6 py-4">Stock</th>
                <th class="px-6 py-4">Almacén</th>
                <th class="px-6 py-4">Ubicación</th>
                <th class="px-6 py-4">Proveedor</th>
                <th class="px-6 py-4">Precio</th>
                <th class="px-6 py-4">Condición</th>
                <th class="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="art in articulos" :key="art.id" class="hover:bg-gray-50/80 transition-colors">
                <td class="px-6 py-4 text-sm font-medium text-gray-900">{{ art.codigo }}</td>
                <td class="px-6 py-4 text-sm text-gray-500">{{ art.noSerie }}</td>
                <td class="px-6 py-4 text-sm text-gray-900 font-medium max-w-[200px] truncate" :title="art.descripcion">{{ art.descripcion }}</td>
                <td class="px-6 py-4 text-sm text-gray-600">{{ art.categoria }}</td>
                <td class="px-6 py-4 text-sm text-gray-600 text-center">{{ art.unidadMedida }}</td>
                <td class="px-6 py-4 text-sm font-semibold text-gray-900">{{ art.stock }}</td>
                <td class="px-6 py-4 text-sm text-gray-600">{{ art.almacen }}</td>
                <td class="px-6 py-4 text-sm text-gray-500 font-mono text-xs">{{ art.ubicacion }}</td>
                <td class="px-6 py-4 text-sm text-gray-600 max-w-[150px] truncate">{{ art.proveedor }}</td>
                <td class="px-6 py-4 text-sm text-gray-900 font-medium whitespace-nowrap">{{ formatCurrency(art.precio) }}</td>
                <td class="px-6 py-4"><span :class="`px-2.5 py-1 rounded-full text-xs font-semibold ${getConditionStyle(art.condicion)}`">{{ art.condicion }}</span></td>
                <td class="px-6 py-4 text-right"><button class="text-gray-900 hover:text-blue-600 font-bold text-sm">Editar</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div v-else class="space-y-6">
      
      <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-3">
        <div class="relative flex-1">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input type="text" placeholder="Buscar entradas por código, fecha, proveedor..." class="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
        <button class="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-700 text-sm font-medium">
          <Filter class="w-4 h-4" /> Filtros
        </button>
      </div>

      <div class="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm overflow-x-auto">
        
        <div class="p-4 border-b border-gray-200 bg-gray-50/50 min-w-max">
          <h3 class="font-semibold text-gray-900 flex items-center gap-2">
            <ArrowDownCircle class="w-4 h-4 text-gray-500" /> Registro de Entradas
          </h3>
        </div>
        
        <div class="min-w-max">
          <table class="w-full text-left border-collapse">
            <thead class="bg-white text-gray-500 text-xs uppercase font-semibold border-b border-gray-100">
              <tr>
                <th class="px-6 py-4">ID Entrada</th>
                <th class="px-6 py-4">Fecha</th>
                <th class="px-6 py-4">Código <br> Artículo</th>
                <th class="px-6 py-4">Descripción</th>
                <th class="px-6 py-4">Cantidad</th>
                <th class="px-6 py-4 text-center">Unidad <br> Medida</th>
                <th class="px-6 py-4">Proveedor</th>
                <th class="px-6 py-4">Almacén <br> Destino</th>
                <th class="px-6 py-4">Ubicación</th>
                <th class="px-6 py-4">Recibido <br> Por</th>
                <th class="px-6 py-4">Estado</th>
                <th class="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="entrada in entradas" :key="entrada.id" class="hover:bg-gray-50/80 transition-colors">
                <td class="px-6 py-4 text-sm font-medium text-gray-500">{{ entrada.id }}</td>
                <td class="px-6 py-4 text-sm text-gray-900">{{ entrada.fecha }}</td>
                <td class="px-6 py-4 text-sm font-medium text-gray-900">{{ entrada.codigoArticulo }}</td>
                <td class="px-6 py-4 text-sm text-gray-900 max-w-[200px] truncate" :title="entrada.descripcion">{{ entrada.descripcion }}</td>
                <td class="px-6 py-4 text-sm font-semibold text-gray-900 text-center">{{ entrada.cantidad }}</td>
                <td class="px-6 py-4 text-sm text-gray-600 text-center">{{ entrada.unidadMedida }}</td>
                <td class="px-6 py-4 text-sm text-gray-600 truncate max-w-[150px]">{{ entrada.proveedor }}</td>
                <td class="px-6 py-4 text-sm text-gray-600">{{ entrada.almacen }}</td>
                <td class="px-6 py-4 text-sm text-gray-500 font-mono text-xs">{{ entrada.ubicacion }}</td>
                <td class="px-6 py-4 text-sm text-gray-600 max-w-[120px]">{{ entrada.recibidoPor }}</td>
                
                <td class="px-6 py-4">
                  <span :class="`px-2.5 py-1 rounded-full text-xs font-semibold ${getEntryStatusStyle(entrada.estado)}`">
                    {{ entrada.estado }}
                  </span>
                </td>

                <td class="px-6 py-4 text-right">
                  <button class="text-gray-900 hover:text-blue-600 font-bold text-sm">Ver</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

  </div>
</template>