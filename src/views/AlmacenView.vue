<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { Plus, Search, Filter, PackageOpen } from 'lucide-vue-next';
import FormNuevoAlmacen from '../components/FormNuevoAlmacen.vue';
import { obtenerAlmacenes, crearAlmacen, actualizarAlmacen, eliminarAlmacen, type Almacen } from '../services/almacen.service';

const activeTab = ref('General');
const tabs = ['General'];

const almacenes = ref<Almacen[]>([]);
const searchQuery = ref('');

onMounted(async () => {
  try {
    almacenes.value = await obtenerAlmacenes();
  } catch (error) {
    console.error("Error al cargar almacenes:", error);
  }
});

const almacenesFiltrados = computed(() => {
  if (!searchQuery.value) return almacenes.value;
  const query = searchQuery.value.toLowerCase();
  return almacenes.value.filter(alm => 
    alm.nombre.toLowerCase().includes(query) ||
    alm.direccion.toLowerCase().includes(query) ||
    alm.ciudad.toLowerCase().includes(query)
  );
});

const mostrarModal = ref(false);
const almacenSeleccionado = ref<any>(null);

const abrirModalCrear = () => {
  almacenSeleccionado.value = null; 
  mostrarModal.value = true;
};

const abrirModalEditar = (almacen: Almacen) => {
  almacenSeleccionado.value = { ...almacen }; 
  mostrarModal.value = true;
};

const eliminarAlmacenLocal = async (almacen: Almacen) => {
  const mensajeConfirmacion = `¿Estás seguro de que deseas eliminar este almacén?\n\nDatos del registro a eliminar:\n- Nombre: ${almacen.nombre}\n- Ciudad: ${almacen.ciudad}\n- Dirección: ${almacen.direccion}\n\nEsta acción no se puede deshacer.`;
  
  if (confirm(mensajeConfirmacion)) {
    try {
      await eliminarAlmacen(almacen.idAlmacen!);
      almacenes.value = await obtenerAlmacenes();
    } catch (error) {
      console.error("Error al eliminar el almacén:", error);
      alert("Hubo un error al eliminar el almacén.");
    }
  }
};

const guardarAlmacen = async (datosFormulario: any) => {
  try {
    if (datosFormulario.esEdicion && datosFormulario.idAlmacen) {
      await actualizarAlmacen(datosFormulario.idAlmacen, datosFormulario);
    } else {
      await crearAlmacen(datosFormulario);
    }
    almacenes.value = await obtenerAlmacenes();
    mostrarModal.value = false;
  } catch (error) {
    console.error("Error al guardar:", error);
  }
};
</script>

<template>
  <div class="space-y-6 relative">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Almacenes</h1>
      </div>
      <button v-if="activeTab === 'General'" @click="abrirModalCrear" class="bg-[#0f172a] hover:bg-slate-800 text-white px-4 py-2 rounded-lg flex items-center gap-2">
        <Plus class="w-4 h-4" /> Nuevo Almacén
      </button>
    </div>

    <div class="border-b border-gray-200">
      <nav class="-mb-px flex space-x-8 overflow-x-auto no-scrollbar" aria-label="Tabs">
        <button v-for="tab in tabs" :key="tab" @click="activeTab = tab"
          :class="[activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300', 'whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors cursor-pointer']">
          {{ tab }}
        </button>
      </nav>
    </div>

    <div v-if="activeTab === 'General'" class="space-y-6">
      
      <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-3">
        <div class="relative flex-1">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input v-model="searchQuery" type="text" placeholder="Buscar por nombre, dirección, ciudad..." 
            class="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
        </div>
      </div>

      <div class="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead class="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
              <tr>
                <th class="px-6 py-4">ID</th>
                <th class="px-6 py-4">Nombre</th>
                <th class="px-6 py-4">Dirección</th>
                <th class="px-6 py-4">Ciudad</th>
                <th class="px-6 py-4">Estado</th>
                <th class="px-6 py-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="alm in almacenesFiltrados" :key="alm.idAlmacen" class="hover:bg-gray-50/80 group">
                <td class="px-6 py-4 text-sm font-medium text-gray-500">{{ alm.idAlmacen }}</td>
                <td class="px-6 py-4 text-sm font-semibold text-gray-900">{{ alm.nombre }}</td>
                <td class="px-6 py-4 text-sm text-gray-500">{{ alm.direccion }}</td>
                <td class="px-6 py-4 text-sm text-gray-600">{{ alm.ciudad }}</td>
                <td class="px-6 py-4 text-sm">
                  <span :class="alm.estado === 1 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'" class="px-2 py-1 rounded-full text-xs font-medium">
                    {{ alm.estado === 1 ? 'Activo' : 'Inactivo' }}
                  </span>
                </td>
                <td class="px-6 py-4 text-center">
                  <div class="flex items-center justify-center gap-3">
                    <button @click="abrirModalEditar(alm)" class="text-gray-400 hover:text-blue-600 font-medium text-sm transition-colors">Editar</button>
                    <button @click="eliminarAlmacenLocal(alm)" class="text-gray-400 hover:text-red-600 font-medium text-sm transition-colors">Eliminar</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <FormNuevoAlmacen v-if="mostrarModal" :almacen-a-editar="almacenSeleccionado" @cerrar="mostrarModal = false" @guardar="guardarAlmacen" />
  </div>
</template>