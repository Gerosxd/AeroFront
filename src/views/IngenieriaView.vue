<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { 
  Plus, Search, Building2, Edit2, Trash2, AlertCircle, Plane, Wrench
} from 'lucide-vue-next';
import { useRouter } from 'vue-router'
import NuevaAeronaveModal, { type PayloadNuevaAeronave } from '../components/NuevaAeronaveModal.vue'
import { guardarAeronave } from '../services/aeronave.service'

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
}

const showNuevaAeronave = ref(false)

const abrirFormulario = () => {
  showNuevaAeronave.value = true
}

const cerrarFormulario = () => {
  showNuevaAeronave.value = false
}

const guardarNuevaAeronave = async (payload: PayloadNuevaAeronave) => {
  try {

    await guardarAeronave(payload)

    // actualizar lista local
    aeronaves.value.push({
      matricula: payload.matricula,
      nsAeronave: payload.nsAeronave,
      modeloAeronave: payload.modeloAeronave,
      marcaAeronave: payload.marcaAeronave,
      tipoAeronave: payload.tipoAeronave,
      operador: payload.operador,

      maMotorLH: payload.maMotorLH,
      moMotorLH: payload.moMotorLH,
      nsMotorLH: payload.nsMotorLH,

      maMotorRH: payload.maMotorRH,
      moMotorRH: payload.moMotorRH,
      nsMotorRH: payload.nsMotorRH,

      maMotorC: payload.maMotorC,
      moMotorC: payload.moMotorC,
      nsMotorC: payload.nsMotorC,

      maAPU: payload.maAPU,
      moAPU: payload.moAPU,
      nsAPU: payload.nsAPU
    })

    showNuevaAeronave.value = false

  } catch (error) {
    console.error("Error al guardar aeronave", error)
  }
}

const nuevaAeronave = ref<Aeronave>({
  matricula: "",
  nsAeronave: "",
  modeloAeronave: "",

  marcaAeronave: "",
  tipoAeronave: "",

  operador: "",

  maMotorLH: "",
  moMotorLH: "",
  nsMotorLH: "",

  maMotorRH: "",
  moMotorRH: "",
  nsMotorRH: "",

  maMotorC: "",
  moMotorC: "",
  nsMotorC: "",

  maAPU: "",
  moAPU: "",
  nsAPU: ""
})

const obtenerModelo = async (modeloId: string) => {

  const response = await fetch(`/api/modelos/${modeloId}`)
  const data = await response.json()

  nuevaAeronave.value.modeloAeronave = modeloId
  nuevaAeronave.value.marcaAeronave = data.marca
  nuevaAeronave.value.tipoAeronave = data.tipo
}

const catalogos = {
  marcas: [],
  tipos: [],
  modelos: []
}

// --- 3. HELPERS VISUALES (COLORES) ---
const getPriorityColor = (p: string) => {
  switch(p) {
    case 'Urgente': return 'bg-red-100 text-red-700 border-red-200';
    case 'Alta': return 'bg-orange-100 text-orange-700 border-orange-200';
    case 'Media': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    default: return 'bg-green-100 text-green-700 border-green-200';
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
      </div>

    <div v-else-if="activeTab === 'aeronaves'" class="space-y-4 animate-fade-in">
      <div class="flex justify-end">
        <button
          @click="abrirFormulario"
          class="bg-[#0f172a] hover:bg-slate-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm font-medium text-sm">
          <Plus class="w-4 h-4" />
          Nueva Aeronave
        </button>
      </div>
      <NuevaAeronaveModal
        :open="showNuevaAeronave"
        :catalogos="catalogos"
        @close="showNuevaAeronave=false"
        @submit="guardarNuevaAeronave"
      />
      <div class="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm overflow-x-auto">
        <table class="w-full text-left border-collapse min-w-max">
          <thead class="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
            <tr>
              <th class="px-6 py-4">Matrícula</th>
              <th class="px-6 py-4">Modelo</th>
              <th class="px-6 py-4">Fabricante</th>
              <th class="px-6 py-4">No. Serie</th>
              <th class="px-6 py-4">Cliente</th>
              <th class="px-6 py-4">Horas de Vuelo</th>
              <th class="px-6 py-4">Ciclos</th>
              <th class="px-6 py-4">Estado</th>
              <th class="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="nave in aeronaves" :key="nave.matricula" class="hover:bg-gray-50">
              <td class="px-6 py-4 font-bold text-gray-900 text-sm">{{ nave.matricula }}</td>
              <td class="px-6 py-4 text-gray-600 text-sm">{{ nave.modeloAeronave }}</td>
              <td class="px-6 py-4 text-gray-600 text-sm">{{ nave.marcaAeronave }}</td>
              <td class="px-6 py-4 text-gray-600 text-sm">{{ nave.tipoAeronave }}</td>
              <td class="px-6 py-4 text-gray-500 font-mono text-xs">{{ nave.nsAeronave }}</td>
              <td class="px-6 py-4 text-gray-600 text-sm">{{ nave.operador }}</td>
              <td class="px-6 py-4 text-gray-600 text-sm">
                {{ nave.moMotorLH }} / {{ nave.moMotorRH }}
              </td>
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

    <div v-else-if="activeTab === 'clientes'" class="space-y-4 animate-fade-in">
      <div class="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm overflow-x-auto">
        <table class="w-full text-left border-collapse min-w-max">
          <thead class="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
            <tr>
              <th class="px-6 py-4">ID</th>
              <th class="px-6 py-4">Nombre</th>
              <th class="px-6 py-4">RFC</th>
              <th class="px-6 py-4">Contacto</th>
              <th class="px-6 py-4">Teléfono</th>
              <th class="px-6 py-4">Email</th>
              <th class="px-6 py-4">Aeronaves</th>
              <th class="px-6 py-4">Estado</th>
              <th class="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="cli in clientes" :key="cli.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 text-gray-500 text-xs">{{ cli.id }}</td>
              <td class="px-6 py-4 font-bold text-gray-900 text-sm">{{ cli.nombre }}</td>
              <td class="px-6 py-4 text-gray-600 text-xs font-mono">{{ cli.rfc }}</td>
              <td class="px-6 py-4 text-gray-600 text-sm">{{ cli.contacto }}</td>
              <td class="px-6 py-4 text-gray-600 text-xs">{{ cli.telefono }}</td>
              <td class="px-6 py-4 text-blue-600 text-xs hover:underline cursor-pointer">{{ cli.email }}</td>
              <td class="px-6 py-4 text-gray-900 font-bold text-center">{{ cli.flota }}</td>
              <td class="px-6 py-4"><span :class="`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(cli.estado)}`">{{ cli.estado }}</span></td>
              <td class="px-6 py-4 text-right"><button class="text-gray-900 hover:text-blue-600 font-bold text-sm">Editar</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-else-if="activeTab === 'modelos'" class="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm overflow-x-auto animate-fade-in">
      <table class="w-full text-left border-collapse min-w-max">
        <thead class="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
          <tr>
            <th class="px-6 py-4">ID</th>
            <th class="px-6 py-4">Modelo</th>
            <th class="px-6 py-4">Fabricante</th>
            <th class="px-6 py-4">Tipo</th>
            <th class="px-6 py-4">Capacidad</th>
            <th class="px-6 py-4">Motores</th>
            <th class="px-6 py-4">Unidades en Flota</th>
            <th class="px-6 py-4 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="mod in modelos" :key="mod.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 text-gray-500 text-xs">{{ mod.id }}</td>
            <td class="px-6 py-4 font-bold text-gray-900 text-sm">{{ mod.modelo }}</td>
            <td class="px-6 py-4 text-gray-600 text-sm">{{ mod.fabricante }}</td>
            <td class="px-6 py-4 text-gray-600 text-sm">{{ mod.tipo }}</td>
            <td class="px-6 py-4 text-gray-600 text-sm">{{ mod.capacidad }}</td>
            <td class="px-6 py-4 text-gray-600 text-sm">{{ mod.motores }}</td>
            <td class="px-6 py-4 text-gray-900 font-bold">{{ mod.flota }}</td>
            <td class="px-6 py-4 text-right"><button class="text-gray-900 hover:text-blue-600 font-bold text-sm">Editar</button></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm overflow-x-auto animate-fade-in">
       <table class="w-full text-left border-collapse min-w-max">
        <thead class="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
          <tr>
            <th class="px-6 py-4">ID Reporte</th>
            <th class="px-6 py-4">Aeronave</th>
            <th class="px-6 py-4">Tipo</th>
            <th class="px-6 py-4">Descripción</th>
            <th class="px-6 py-4">Fecha Programada</th>
            <th class="px-6 py-4">Horas Límite</th>
            <th class="px-6 py-4">Ciclos Límite</th>
            <th class="px-6 py-4">Prioridad</th>
            <th class="px-6 py-4">Estado</th>
            <th class="px-6 py-4 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="rep in reportes" :key="rep.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 text-gray-500 text-sm">{{ rep.id }}</td>
            <td class="px-6 py-4 font-bold text-gray-900 text-sm">{{ rep.aeronave }}</td>
            <td class="px-6 py-4 text-gray-600 text-sm">{{ rep.tipo }}</td>
            <td class="px-6 py-4 text-gray-600 text-sm">{{ rep.descripcion }}</td>
            <td class="px-6 py-4 text-gray-600 text-sm">{{ rep.fechaProg }}</td>
            <td class="px-6 py-4 text-gray-600 text-sm">{{ rep.horasLimite }}</td>
            <td class="px-6 py-4 text-gray-600 text-sm">{{ rep.ciclosLimite }}</td>
            <td class="px-6 py-4"><span :class="`px-2 py-0.5 rounded border text-xs font-medium ${getPriorityColor(rep.prioridad)}`">{{ rep.prioridad }}</span></td>
            <td class="px-6 py-4"><span :class="`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(rep.estado)}`">{{ rep.estado }}</span></td>
            <td class="px-6 py-4 text-right"><button class="text-gray-900 hover:text-blue-600 font-bold text-sm">Ver</button></td>
          </tr>
        </tbody>
      </table>
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
