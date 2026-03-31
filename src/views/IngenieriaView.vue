<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { 
  Plus, Search, Building2, Edit2, Trash2, AlertCircle, Plane, Wrench 
} from 'lucide-vue-next';

// --- IMPORTACIONES DE CLIENTES ---
import FormNuevoCliente from '../components/FormNuevoCliente.vue';
import {
  guardarCliente, listarClientes, actualizarCliente, eliminarClienteService, type PayloadClienteBackend,
} from '../services/cliente.service';

// --- IMPORTACIONES DE MODELOS ---
import FormNuevoModelo from '../components/FormNuevoModelo.vue';
import { 
  guardarModelo, listarModelos, actualizarModelo, eliminarModeloService, type PayloadModeloBackend 
} from '../services/modelo.service';


// ==========================================
// 1. LÓGICA DE CLIENTES
// ==========================================
const clientes = ref<PayloadClienteBackend[]>([]);
const searchQueryClientes = ref("");
const mostrarModalCliente = ref(false);
const clienteSeleccionado = ref<PayloadClienteBackend | null>(null);

const cargarClientes = async () => {
  try {
    clientes.value = await listarClientes();
  } catch (error) {
    console.error("Error al cargar clientes:", error);
  }
};

const clientesFiltrados = computed(() => {
  if (!searchQueryClientes.value) return clientes.value;
  const query = searchQueryClientes.value.toLowerCase();
  return clientes.value.filter(
    (c) =>
      c.compania?.toLowerCase().includes(query) ||
      c.rfc?.toLowerCase().includes(query) ||
      c.contacto?.toLowerCase().includes(query),
  );
});

const abrirModalCrearCliente = () => {
  clienteSeleccionado.value = null;
  mostrarModalCliente.value = true;
};

const abrirModalEditarCliente = (cliente: PayloadClienteBackend) => {
  clienteSeleccionado.value = { ...cliente };
  mostrarModalCliente.value = true;
};

const eliminarClienteLocal = async (idCliente: number) => {
  if (confirm("¿Estás seguro de que deseas eliminar este cliente?")) {
    try {
      await eliminarClienteService(idCliente);
      await cargarClientes();
    } catch (error) {
      alert("Error al eliminar el cliente.");
    }
  }
};

const handleGuardarCliente = async (datos: PayloadClienteBackend & { esEdicion?: boolean }) => {
  try {
    if (datos.esEdicion && datos.idCliente) {
      await actualizarCliente(datos.idCliente, datos);
    } else {
      await guardarCliente(datos);
    }
    await cargarClientes();
    mostrarModalCliente.value = false;
  } catch (error) {
    alert("Hubo un error al guardar el cliente.");
  }
};


// ==========================================
// 2. LÓGICA DE MODELOS DE AERONAVES
// ==========================================
const modelosAPI = ref<PayloadModeloBackend[]>([]);
const searchQueryModelos = ref("");
const mostrarModalModelo = ref(false);
const modeloSeleccionado = ref<PayloadModeloBackend | null>(null);

const cargarModelos = async () => {
  try {
    modelosAPI.value = await listarModelos();
  } catch (error) {
    console.error("Error al cargar modelos:", error);
  }
};

const modelosFiltrados = computed(() => {
  if (!searchQueryModelos.value) return modelosAPI.value;
  const query = searchQueryModelos.value.toLowerCase();
  return modelosAPI.value.filter(m => 
    m.modelo?.toLowerCase().includes(query) || 
    m.marca?.toLowerCase().includes(query)
  );
});

const abrirModalCrearModelo = () => {
  modeloSeleccionado.value = null;
  mostrarModalModelo.value = true;
};

const abrirModalEditarModelo = (modelo: PayloadModeloBackend) => {
  modeloSeleccionado.value = { ...modelo };
  mostrarModalModelo.value = true;
};

const eliminarModeloLocal = async (id: number) => {
  if (confirm("¿Seguro que deseas eliminar este modelo?")) {
    try {
      await eliminarModeloService(id);
      await cargarModelos();
    } catch (error) {
      alert("Error al eliminar el modelo.");
    }
  }
};

const handleGuardarModelo = async (datos: PayloadModeloBackend & { esEdicion?: boolean }) => {
  try {
    if (datos.esEdicion && datos.idModelo) {
      await actualizarModelo(datos.idModelo, datos);
    } else {
      await guardarModelo(datos);
    }
    await cargarModelos();
    mostrarModalModelo.value = false;
  } catch (error: any) {
    if (error.response && error.response.status === 409) {
      alert(error.response.data); // Muestra error de duplicado
    } else {
      alert("Hubo un error al guardar el modelo.");
    }
  }
};

// ==========================================
// 3. INICIALIZACIÓN Y PESTAÑAS
// ==========================================
onMounted(() => {
  cargarClientes();
  cargarModelos();
});

const activeTab = ref('modelos'); // Inicia en modelos para probar rápido
const tabs = [
  { id: 'todas', label: 'Todas las OT' },
  { id: 'crear', label: 'Crear OT' },
  { id: 'aeronaves', label: 'Aeronaves' },
  { id: 'clientes', label: 'Clientes' },
  { id: 'modelos', label: 'Modelos' },
  { id: 'reportes', label: 'Reportes Programados' },
];
</script>

<template>
  <div class="space-y-6 pb-12">
    
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Ingeniería</h1>
        <p class="text-gray-500 text-sm">Gestiona órdenes de trabajo, aeronaves, clientes y reportes.</p>
      </div>
    </div>

    <div class="border-b border-gray-200 overflow-x-auto">
      <nav class="flex gap-6 min-w-max">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            activeTab === tab.id 
              ? 'border-blue-600 text-blue-600 font-semibold' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
            'whitespace-nowrap py-3 px-1 border-b-2 text-sm transition-colors'
          ]"
        >
          {{ tab.label }}
        </button>
      </nav>
    </div>

    <div v-if="activeTab === 'clientes'" class="space-y-4 animate-fade-in">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div class="relative w-full sm:w-96">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input v-model="searchQueryClientes" type="text" placeholder="Buscar por nombre, RFC o contacto..." 
            class="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"/>
        </div>
        <button @click="abrirModalCrearCliente" class="bg-[#0f172a] text-white px-5 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors w-full sm:w-auto shadow-md">
          <Plus class="w-4 h-4" /> Nuevo Cliente
        </button>
      </div>

      <div class="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm overflow-x-auto">
        <table class="w-full text-left border-collapse min-w-max">
          <thead class="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
            <tr>
              <th class="px-6 py-4">ID</th>
              <th class="px-6 py-4">Nombre del cliente</th>
              <th class="px-6 py-4">RFC</th>
              <th class="px-6 py-4">Contacto</th>
              <th class="px-6 py-4">Teléfono</th>
              <th class="px-6 py-4">Correo</th>
              <th class="px-6 py-4 text-center">Aeronaves</th>
              <th class="px-6 py-4 text-center">Estado</th>
              <th class="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-if="clientesFiltrados.length === 0">
              <td colspan="9" class="p-8 text-center text-gray-500">No se encontraron clientes.</td>
            </tr>
            <tr v-for="cliente in clientesFiltrados" :key="cliente.idCliente" class="hover:bg-gray-50 group">
              <td class="px-6 py-4 text-gray-500 font-mono text-xs">{{ cliente.idCliente }}</td>
              <td class="px-6 py-4 font-bold text-gray-900 text-sm">
                <div class="flex items-center gap-2"><Building2 class="w-4 h-4 text-gray-400" />{{ cliente.compania }}</div>
              </td>
              <td class="px-6 py-4 text-gray-600 font-mono text-xs">{{ cliente.rfc }}</td>
              <td class="px-6 py-4 text-gray-600 text-sm">{{ cliente.contacto }}</td>
              <td class="px-6 py-4 text-gray-600 text-sm">{{ cliente.telefono }}</td>
              <td class="px-6 py-4 text-blue-600 text-sm hover:underline cursor-pointer">{{ cliente.correo }}</td>
              <td class="px-6 py-4 text-center"><span class="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">{{ cliente.aeronaves || 'Pendiente' }}</span></td>
              <td class="px-6 py-4 text-center">
                <span :class="['px-2.5 py-1 rounded-full text-xs font-semibold border', (cliente.estado || 'Activo') === 'Activo' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200']">
                  {{ cliente.estado || 'Activo' }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                  <button @click="abrirModalEditarCliente(cliente)" class="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 class="w-4 h-4" /></button>
                  <button @click="eliminarClienteLocal(cliente.idCliente!)" class="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 class="w-4 h-4" /></button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-else-if="activeTab === 'modelos'" class="space-y-4 animate-fade-in">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div class="relative w-full sm:w-96">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input v-model="searchQueryModelos" type="text" placeholder="Buscar modelo o marca..." 
            class="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"/>
        </div>
        <button @click="abrirModalCrearModelo" class="bg-[#0f172a] text-white px-5 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors w-full sm:w-auto shadow-md">
          <Plus class="w-4 h-4" /> Nuevo Modelo
        </button>
      </div>

      <div class="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm overflow-x-auto">
        <table class="w-full text-left border-collapse min-w-max">
          <thead class="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
            <tr>
              <th class="px-6 py-4">ID</th>
              <th class="px-6 py-4">Modelo</th>
              <th class="px-6 py-4">Marca</th>
              <th class="px-6 py-4">Tipo (ID)</th>
              <th class="px-6 py-4">Estado</th>
              <th class="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-if="modelosFiltrados.length === 0">
              <td colspan="6" class="p-8 text-center text-gray-500">No se encontraron modelos registrados.</td>
            </tr>
            <tr v-for="mod in modelosFiltrados" :key="mod.idModelo" class="hover:bg-gray-50 group">
              <td class="px-6 py-4 text-gray-500 text-xs">{{ mod.idModelo }}</td>
              <td class="px-6 py-4 font-bold text-gray-900 text-sm">
                <div class="flex items-center gap-2"><Plane class="w-4 h-4 text-gray-400" />{{ mod.modelo }}</div>
              </td>
              <td class="px-6 py-4 text-gray-600 text-sm">{{ mod.marca }}</td>
              <td class="px-6 py-4 text-gray-600 text-sm"><span class="px-2 py-1 bg-gray-100 rounded text-xs font-mono">{{ mod.tipoAeronave || 'N/A' }}</span></td>
              <td class="px-6 py-4 text-sm"><span class="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">Activo</span></td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                  <button @click="abrirModalEditarModelo(mod)" class="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 class="w-4 h-4" /></button>
                  <button @click="eliminarModeloLocal(mod.idModelo!)" class="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 class="w-4 h-4" /></button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-else class="flex flex-col items-center justify-center py-20 px-4 bg-white border border-gray-200 border-dashed rounded-xl shadow-sm animate-fade-in">
      <div class="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
        <Wrench class="w-8 h-8 text-blue-500" />
      </div>
      <h3 class="text-xl font-bold text-gray-900 mb-2">Módulo en Construcción</h3>
      <p class="text-gray-500 text-center max-w-md text-sm">
        Esta sección se encuentra actualmente en fase de desarrollo. Pronto estará disponible con conexión al sistema central.
      </p>
    </div>

    <FormNuevoCliente
      v-if="mostrarModalCliente"
      :cliente-a-editar="clienteSeleccionado"
      @cerrar="mostrarModalCliente = false"
      @guardar="handleGuardarCliente"
    />

    <FormNuevoModelo
      v-if="mostrarModalModelo"
      :modelo-a-editar="modeloSeleccionado"
      @cerrar="mostrarModalModelo = false"
      @guardar="handleGuardarModelo"
    />

  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>