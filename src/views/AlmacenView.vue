<script setup lang="ts">
import { ref, computed } from 'vue';
import { Plus, Search, Filter, PackageOpen } from 'lucide-vue-next';
import FormNuevoAlmacen from '../components/FormNuevoAlmacen.vue';

interface Almacen {
  id: string;
  nombre: string;
  ubicacion: string;
  tipo: string;
  responsable: string;
}

// 1. Lógica de Pestañas (Tabs)
const activeTab = ref('General');
const tabs = ['General', 'Artículos', 'Entradas', 'Salidas', 'Movimientos'];

// 2. Datos simulados
const almacenes = ref<Almacen[]>([
  { id: 'ALM-001', nombre: 'Almacén Principal', ubicacion: 'Hangar A, Planta Baja', tipo: 'General', responsable: 'Juan Pérez' },
  { id: 'ALM-002', nombre: 'Almacén de Herramientas', ubicacion: 'Edificio B, Nivel 2', tipo: 'Herramientas', responsable: 'María López' },
  { id: 'ALM-003', nombre: 'Almacén de Componentes', ubicacion: 'Hangar C, Área Técnica', tipo: 'Componentes', responsable: 'Carlos Ramírez' },
  { id: 'ALM-004', nombre: 'Almacén Secundario', ubicacion: 'Bodega Externa', tipo: 'General', responsable: 'Ana García' },
]);

// 3. Lógica del Buscador en Tiempo Real
const searchQuery = ref('');

const almacenesFiltrados = computed(() => {
  if (!searchQuery.value) return almacenes.value;
  
  const query = searchQuery.value.toLowerCase();
  return almacenes.value.filter(alm => 
    alm.nombre.toLowerCase().includes(query) ||
    alm.ubicacion.toLowerCase().includes(query) ||
    alm.responsable.toLowerCase().includes(query) ||
    alm.tipo.toLowerCase().includes(query)
  );
});

// 4. Control del Modal
const mostrarModal = ref(false);
const almacenSeleccionado = ref<any>(null);

const abrirModalCrear = () => {
  almacenSeleccionado.value = null; 
  mostrarModal.value = true;
};

const abrirModalEditar = (almacen: Almacen) => {
  almacenSeleccionado.value = almacen; 
  mostrarModal.value = true;
};

const guardarAlmacen = (datosFormulario: any) => {
  if (datosFormulario.esEdicion) {
    const index = almacenes.value.findIndex(a => a.id === datosFormulario.id);
    if (index !== -1) {
      almacenes.value[index] = { ...datosFormulario };
    }
  } else {
    const nuevoId = `ALM-00${almacenes.value.length + 1}`;
    almacenes.value.push({
      id: nuevoId,
      ...datosFormulario
    });
  }
  mostrarModal.value = false;
};
</script>

<template>
  <div class="space-y-6 relative">
    
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Almacenes</h1>
        <p class="text-gray-500 text-sm">Gestiona los almacenes físicos y sus movimientos.</p>
      </div>
      <button 
        v-if="activeTab === 'General'"
        @click="abrirModalCrear"
        class="bg-[#0f172a] hover:bg-slate-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm font-medium text-sm"
      >
        <Plus class="w-4 h-4" />
        Nuevo Almacén
      </button>
    </div>

    <div class="border-b border-gray-200">
      <nav class="-mb-px flex space-x-8 overflow-x-auto no-scrollbar" aria-label="Tabs">
        <button
          v-for="tab in tabs"
          :key="tab"
          @click="activeTab = tab"
          :class="[
            activeTab === tab
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
            'whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors cursor-pointer'
          ]"
        >
          {{ tab }}
        </button>
      </nav>
    </div>

    <div v-if="activeTab === 'General'" class="space-y-6 animate-in fade-in duration-300">
      
      <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-3">
        <div class="relative flex-1">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Buscar por nombre, ubicación, responsable..." 
            class="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
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
                <th class="px-6 py-4">Responsable</th>
                <th class="px-6 py-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-if="almacenesFiltrados.length === 0">
                <td colspan="6" class="px-6 py-8 text-center text-gray-500 text-sm">
                  No se encontraron almacenes que coincidan con "{{ searchQuery }}".
                </td>
              </tr>
              <tr v-else v-for="alm in almacenesFiltrados" :key="alm.id" class="hover:bg-gray-50/80 transition-colors group">
                <td class="px-6 py-4 text-sm font-medium text-gray-500">{{ alm.id }}</td>
                <td class="px-6 py-4 text-sm font-semibold text-gray-900">{{ alm.nombre }}</td>
                <td class="px-6 py-4 text-sm text-gray-500">{{ alm.ubicacion }}</td>
                <td class="px-6 py-4 text-sm text-gray-600">{{ alm.tipo }}</td>
                <td class="px-6 py-4 text-sm text-gray-600">{{ alm.responsable }}</td>
                <td class="px-6 py-4 text-center">
                  <button 
                    @click="abrirModalEditar(alm)"
                    class="text-gray-400 hover:text-blue-600 font-medium text-sm transition-colors"
                  >
                    Editar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div v-else class="flex flex-col items-center justify-center py-20 px-4 text-center bg-white rounded-xl border border-dashed border-gray-300 animate-in fade-in duration-300">
      <div class="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4">
        <PackageOpen class="w-8 h-8" />
      </div>
      <h3 class="text-lg font-bold text-gray-900 mb-1">Pestaña en Construcción</h3>
      <p class="text-gray-500 text-sm max-w-sm">
        La sección de "{{ activeTab }}" estará disponible pronto una vez que conectemos las tablas correspondientes.
      </p>
    </div>

    <FormNuevoAlmacen 
      v-if="mostrarModal"
      :almacen-a-editar="almacenSeleccionado"
      @cerrar="mostrarModal = false"
      @guardar="guardarAlmacen"
    />

  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>