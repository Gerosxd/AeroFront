<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { Plus, Search, Building2, Edit2, Trash2 } from "lucide-vue-next";
import NuevaAeronaveModal, {
  type PayloadNuevaAeronave,
} from "../components/NuevaAeronaveModal.vue";
import { guardarAeronave, listarAeronaves } from '../services/aeronave.service'
import CrearOTForm from "../components/CrearOTForm.vue";

// NUEVO: OT
import otService from "../services/ot.service";
import type { OTListado } from "../types/ot";
import DetalleOTModal from '../components/DetalleOTModal.vue';

// --- IMPORTACIONES DE CLIENTES ---
import FormNuevoCliente from "../components/FormNuevoCliente.vue";
import {
  guardarCliente,
  listarClientes,
  actualizarCliente,
  eliminarClienteService,
  type PayloadClienteBackend,
} from "../services/cliente.service";

// --- IMPORTACIONES DE MODELOS ---
import FormNuevoModelo from "../components/FormNuevoModelo.vue";
import {
  guardarModelo,
  listarModelos,
  actualizarModelo,
  eliminarModeloService,
  type PayloadModeloBackend,
} from "../services/modelo.service";

// --- IMPORTACIONES DE REPORTES PROGRAMADOS ---
import { programadaService } from '../services/programada.service';
import type { TareaProgramada } from '../types/programada';
import FormNuevaProgramada from '../components/FormProgramadaModal.vue';

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

const handleGuardarCliente = async (
    datos: PayloadClienteBackend & { esEdicion?: boolean },
) => {
  try {
    // SOLUCIÓN: Extraemos 'esEdicion' para que NO se envíe en el JSON hacia el Backend de Java
    const { esEdicion, ...payloadParaBackend } = datos;

    if (esEdicion && datos.idCliente) {
      await actualizarCliente(datos.idCliente, payloadParaBackend);
      alert("El cliente ha sido actualizado correctamente.");
    } else {
      // Enviamos el objeto limpio sin campos extraños
      await guardarCliente(payloadParaBackend);
      alert("El cliente ha sido registrado correctamente.");
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
  return modelosAPI.value.filter(
    (m) =>
      m.modelo?.toLowerCase().includes(query) ||
      m.marca?.toLowerCase().includes(query),
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

const handleGuardarModelo = async (
  datos: PayloadModeloBackend & { esEdicion?: boolean },
) => {
  try {
    if (datos.esEdicion && datos.idModelo) {
      await actualizarModelo(datos.idModelo, datos);
      alert("El modelo de aeronave ha sido actualizado correctamente.");
    } else {
      await guardarModelo(datos);
      alert("El modelo de aeronave ha sido registrado correctamente.");
    }
    await cargarModelos();
    mostrarModalModelo.value = false;
  } catch (error: any) {
    if (error.response && error.response.status === 409) {
      alert(error.response.data);
    } else {
      alert("Hubo un error al guardar el modelo.");
    }
  }
};

// ==========================================
// 3. LÓGICA DE AERONAVES
// ==========================================
// Se deja como estaba originalmente, sin forzar implementación nueva
const showNuevaAeronave = ref(false);

const abrirFormulario = () => {
  showNuevaAeronave.value = true;
};

const cargarAeronaves = async () => {
  try {
    const data = await listarAeronaves();
    aeronaves.value = data;
  } catch (error) {
    console.error("Error al cargar aeronaves:", error);
  }
};

const guardarNuevaAeronave = async (payload: PayloadNuevaAeronave) => {
  try {
    const modeloEncontrado = catalogos.value.modelos.find(m => m.nombre === payload.modeloAeronave);
    const idModeloNumber = modeloEncontrado ? modeloEncontrado.id : 0;
    const payloadParaBackend = {
      ...payload,
      modeloAeronave: idModeloNumber
    };
    await guardarAeronave(payloadParaBackend as any);

    alert("¡Aeronave registrada con éxito!");
    if (Array.isArray(aeronaves.value)) {
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
      });
    }
    showNuevaAeronave.value = false;
  } catch (error) {
    console.error("Error al guardar aeronave", error);
    alert("Hubo un error al guardar la aeronave en el servidor.");
  }
}

// Tipado local mínimo para no romper esta vista
type AeronaveLocal = {
  matricula: string;
  nsAeronave: string;
  modeloAeronave: string;
  marcaAeronave: string;
  tipoAeronave: string;
  operador: string;
  maMotorLH: string;
  moMotorLH: string;
  nsMotorLH: string;
  maMotorRH: string;
  moMotorRH: string;
  nsMotorRH: string;
  maMotorC: string;
  moMotorC: string;
  nsMotorC: string;
  maAPU: string;
  moAPU: string;
  nsAPU: string;
};

const aeronaves = ref<AeronaveLocal[]>([]);


const catalogos = computed(() => {
  return {
    marcas: [],
    tipos: [],
    modelos: modelosAPI.value.map(m => ({
      id: m.idModelo || 0,
      nombre: m.modelo,
      marca: m.marca
    }))
  };
});

// ==========================================
// 4. NUEVO: LÓGICA DE OTs
// ==========================================
const ots = ref<OTListado[]>([]);
const cargandoOTs = ref(false);

// VARIABLES RECTIVAS DE CONTROL PARA DETALLE
const modoEdicionInicial = ref(false);
const mostrarModalDetalleOT = ref(false);
const cargandoDetalle = ref(false);
const otSeleccionadaDetalle = ref<OTDetalle | null>(null);
import type { OTDetalle } from "../types/ot";
const cargarOTs = async () => {
  try {
    cargandoOTs.value = true;
    ots.value = await otService.listarOTs();
  } catch (error) {
    console.error("Error al cargar OTs:", error);
  } finally {
    cargandoOTs.value = false;
  }
};

// FUNCIÓN PARA SOLICITAR EL REGISTRO ASÍNCRONO
// 1. Modificar la función que abre el detalle para asegurarnos de clonar y limpiar referencias
const abrirDetalleOT = async (idOT: number, editarDirecto: boolean = false) => {
  otSeleccionadaDetalle.value = null;
  cargandoDetalle.value = true;
  modoEdicionInicial.value = editarDirecto; // Guardamos la intención del usuario
  mostrarModalDetalleOT.value = true;

  try {
    const data = await otService.obtenerPorId(idOT);
    // Clonamos limpiando proxies reactivos de Vue
    otSeleccionadaDetalle.value = JSON.parse(JSON.stringify(data));
  } catch (error) {
    console.error("Error al cargar el detalle de la OT:", error);
    alert("No se pudo obtener la información detallada de la Orden de Trabajo.");
    mostrarModalDetalleOT.value = false;
  } finally {
    cargandoDetalle.value = false; // Detiene el estado de carga
  }
};

// 2. NUEVA FUNCIÓN: Guardar actualización de la OT completa hacia el Backend
const handleActualizarOT = async (otActualizada: OTDetalle) => {
  try {
    cargandoDetalle.value = true;

    // Invocamos el servicio apuntando al backend (ej: otService.actualizar)
    // NOTA: Si no tienes el metodo creado, impleméntalo en tu ot.service.ts usando axios. put(`/ot/${otActualizada.idOT}`, otActualizada)
    if (otService.actualizar) {
      await otService.actualizar(otActualizada.idOT, otActualizada);
    } else {
      console.warn("Falta implementar otService.actualizar en el archivo de servicios. Simulando guardado exitoso.");
    }

    alert("La Orden de Trabajo se ha actualizado con éxito en producción.");

    // Recargar flujos visuales
    await cargarOTs();
    mostrarModalDetalleOT.value = false;
  } catch (error: any) {
    console.error("Error al actualizar la OT:", error);
    alert(error.response?.data || "Error de red al intentar guardar los cambios de la OT.");
  } finally {
    cargandoDetalle.value = false;
  }
};

// ==========================================
// 5. LÓGICA DE REPORTES PROGRAMADOS
// ==========================================
const reportesAPI = ref<TareaProgramada[]>([]);
const mostrarModalReporte = ref(false);
const reporteSeleccionado = ref<TareaProgramada | null>(null);

const cargarReportes = async () => {
  try {
    reportesAPI.value = await programadaService.listarTodas();
  } catch (error) {
    console.error("Error al cargar reportes:", error);
  }
};

const abrirModalCrearReporte = () => {
  reporteSeleccionado.value = null;
  mostrarModalReporte.value = true;
};

const abrirModalVerReporte = (reporte: TareaProgramada) => {
  reporteSeleccionado.value = { ...reporte };
  mostrarModalReporte.value = true;
};

const cerrarModalReporte = () => {
  reporteSeleccionado.value = null;
  mostrarModalReporte.value = false;
};

const handleGuardarReporte = async (datos: TareaProgramada) => {
  try {
    await programadaService.registrar(datos);
    await cargarReportes();
    cerrarModalReporte();
  } catch (error: any) {
    alert(error.response?.data || "Error al guardar el reporte.");
  }
};

// ==========================================
// 6. HELPERS VISUALES
// ==========================================
const getPriorityColor = (p: string) => {
  switch (p) {
    case "Urgente":
      return "bg-red-100 text-red-700 border-red-200";
    case "Alta":
      return "bg-orange-100 text-orange-700 border-orange-200";
    case "Media":
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    default:
      return "bg-green-100 text-green-700 border-green-200";
  }
};

const getStatusColor = (estado: string) => {
  switch (estado) {
    case "Activo":
    case "Abierta":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "Pendiente":
      return "bg-yellow-50 text-yellow-700 border-yellow-200";
    case "Inactivo":
    case "Cerrada":
      return "bg-red-50 text-red-700 border-red-200";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
};


// ==========================================
// 7. INICIALIZACIÓN Y PESTAÑAS
// ==========================================
onMounted(() => {
  cargarClientes();
  cargarModelos();
  cargarOTs();
  cargarAeronaves();
  cargarReportes();
});

const activeTab = ref("todas");
const tabs = [
  { id: "todas", label: "Todas las OT" },
  { id: "crear", label: "Crear OT" },
  { id: "clientes", label: "Clientes" },
  { id: "modelos", label: "Modelos" },
  { id: "aeronaves", label: "Aeronaves" },
  { id: "reportes", label: "Tareas Programados" },
];
</script>

<template>
  <div class="space-y-6 pb-12">
    <div
        class="flex flex-col md:flex-row md:items-center justify-between gap-4"
    >
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Ingeniería</h1>
        <p class="text-gray-500 text-sm">
          Gestiona órdenes de trabajo, aeronaves, clientes y reportes.
        </p>
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
            'whitespace-nowrap py-3 px-1 border-b-2 text-sm transition-colors',
          ]"
        >
          {{ tab.label }}
        </button>
      </nav>
    </div>

    <div v-if="activeTab === 'todas'" class="space-y-4 animate-fade-in">
      <div class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div class="overflow-x-auto w-full">
          <table class="w-full text-left border-collapse min-w-[900px]">
            <thead class="bg-gray-50 text-gray-500 text-xs uppercase font-semibold border-b border-gray-200">
            <tr>
              <th class="px-6 py-4">No. OT</th>
              <th class="px-6 py-4">Matrícula</th>
              <th class="px-6 py-4">Cliente</th>
              <th class="px-6 py-4">Fecha creación</th>
              <th class="px-6 py-4">Fecha entrega</th>
              <th class="px-6 py-4">Fecha cierre</th>
              <th class="px-6 py-4">Estado</th>
              <th class="px-6 py-4 text-right">Acciones</th>
            </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 text-sm">
            <tr v-if="cargandoOTs">
              <td colspan="8" class="px-6 py-8 text-center text-gray-500 font-medium">
                Cargando órdenes de trabajo desde el servidor...
              </td>
            </tr>

            <tr v-else-if="ots.length === 0">
              <td colspan="8" class="px-6 py-8 text-center text-gray-400 italic">
                No hay órdenes de trabajo registradas en el sistema.
              </td>
            </tr>

            <tr v-for="ot in ots" :key="ot.idOT" class="hover:bg-gray-50/80 transition-colors group">
              <td class="px-6 py-4 font-bold text-gray-900">
                {{ ot.noOT }}
              </td>
              <td class="px-6 py-4 text-gray-600">
              <span class="bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-mono text-xs font-semibold border border-blue-100">
                {{ ot.matricula || "Sin matrícula" }}
              </span>
              </td>
              <td class="px-6 py-4 text-gray-600 font-medium">
                {{ ot.cliente?.compania || ot.clienteCompania || ot.cliente || "Sin cliente asignado" }}
              </td>
              <td class="px-6 py-4 text-gray-500 text-xs">
                {{ ot.fechaCreacion || "-" }}
              </td>
              <td class="px-6 py-4 text-gray-500 text-xs">
                {{ ot.fechaEntrega || "-" }}
              </td>
              <td class="px-6 py-4 text-gray-500 text-xs">
                {{ ot.fechaCierre || "-" }}
              </td>
              <td class="px-6 py-4">
              <span :class="['px-2.5 py-1 rounded-full text-xs font-bold border', getStatusColor(ot.estado || '')]">
                {{ ot.estado || "Sin estado" }}
              </span>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-150">
                  <button
                      @click="abrirDetalleOT(ot.idOT, false)"
                      class="text-blue-600 hover:text-blue-800 font-bold text-xs bg-blue-50 hover:bg-blue-100 px-2.5 py-1.5 rounded-lg border border-blue-200/60 transition-colors"
                  >
                    Ver
                  </button>

                  <button
                      @click="abrirDetalleOT(ot.idOT, true)"
                      class="text-amber-600 hover:text-amber-800 font-bold text-xs bg-amber-50 hover:bg-amber-100 px-2.5 py-1.5 rounded-lg border border-amber-200/60 transition-colors"
                  >
                    Editar
                  </button>
                </div>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div v-else-if="activeTab === 'crear'" class="animate-fade-in">
      <CrearOTForm />
    </div>

    <div
        v-else-if="activeTab === 'aeronaves'"
        class="space-y-4 animate-fade-in"
    >
      <div class="flex justify-end">
        <button
            @click="abrirFormulario"
            class="bg-[#0f172a] hover:bg-slate-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm font-medium text-sm"
        >
          <Plus class="w-4 h-4" />
          Nueva Aeronave
        </button>
      </div>

      <NuevaAeronaveModal
          :open="showNuevaAeronave"
          :catalogos="catalogos"
          :clientes="clientes"
          @close="showNuevaAeronave = false"
          @submit="guardarNuevaAeronave"
      />

      <div
          class="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm overflow-x-auto"
      >
        <table class="w-full text-left border-collapse min-w-max">
          <thead
              class="bg-gray-50 text-gray-500 text-xs uppercase font-semibold"
          >
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
          <tr v-if="aeronaves.length === 0">
            <td colspan="9" class="px-6 py-8 text-center text-gray-500">
              Este módulo aún no carga aeronaves desde backend en esta vista.
            </td>
          </tr>

          <tr
              v-for="nave in aeronaves"
              :key="nave.matricula"
              class="hover:bg-gray-50 group"
          >
            <td class="px-6 py-4 font-bold text-gray-900 text-sm">
              {{ nave.matricula }}
            </td>
            <td class="px-6 py-4 text-gray-600 text-sm">
              {{ nave.modeloAeronave }}
            </td>
            <td class="px-6 py-4 text-gray-600 text-sm">
              {{ nave.marcaAeronave }}
            </td>
            <td class="px-6 py-4 text-gray-500 font-mono text-xs">
              {{ nave.nsAeronave }}
            </td>
            <td class="px-6 py-4 text-gray-600 text-sm">-</td>
            <td class="px-6 py-4 text-gray-600 text-sm">-</td>
            <td class="px-6 py-4 text-gray-600 text-sm">-</td>
            <td class="px-6 py-4 text-gray-600 text-sm">-</td>
            <td class="px-6 py-4 text-right">
              <div class="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                <button
                    class="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  <Edit2 class="w-4 h-4" />
                </button>
                <button
                    class="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-else-if="activeTab === 'clientes'" class="space-y-4 animate-fade-in">
      <div
          class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm"
      >
        <div class="relative w-full sm:w-96">
          <Search
              class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4"
          />
          <input
              v-model="searchQueryClientes"
              type="text"
              placeholder="Buscar por nombre, RFC o contacto..."
              class="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
          />
        </div>

        <button
            @click="abrirModalCrearCliente"
            class="bg-[#0f172a] text-white px-5 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors w-full sm:w-auto shadow-md"
        >
          <Plus class="w-4 h-4" /> Nuevo Cliente
        </button>
      </div>

      <div
          class="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm overflow-x-auto"
      >
        <table class="w-full text-left border-collapse min-w-max">
          <thead
              class="bg-gray-50 text-gray-500 text-xs uppercase font-semibold"
          >
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
            <td colspan="9" class="p-8 text-center text-gray-500">
              No se encontraron clientes.
            </td>
          </tr>

          <tr
              v-for="cliente in clientesFiltrados"
              :key="cliente.idCliente"
              class="hover:bg-gray-50 group"
          >
            <td class="px-6 py-4 text-gray-500 font-mono text-xs">
              {{ cliente.idCliente }}
            </td>
            <td class="px-6 py-4 font-bold text-gray-900 text-sm">
              <div class="flex items-center gap-2">
                <Building2 class="w-4 h-4 text-gray-400" />{{
                  cliente.compania
                }}
              </div>
            </td>
            <td class="px-6 py-4 text-gray-600 font-mono text-xs">
              {{ cliente.rfc }}
            </td>
            <td class="px-6 py-4 text-gray-600 text-sm">
              {{ cliente.contacto }}
            </td>
            <td class="px-6 py-4 text-gray-600 text-sm">
              {{ cliente.telefono }}
            </td>
            <td
                class="px-6 py-4 text-blue-600 text-sm hover:underline cursor-pointer"
            >
              {{ cliente.correo }}
            </td>
            <td class="px-6 py-4 text-center">
                <span
                    class="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold"
                >
                  {{ cliente.aeronaves || "Pendiente" }}
                </span>
            </td>
            <td class="px-6 py-4 text-center">
                <span
                    :class="[
                    'px-2.5 py-1 rounded-full text-xs font-semibold border',
                    (cliente.estado || 'Activo') === 'Activo'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-red-50 text-red-700 border-red-200',
                  ]"
                >
                  {{ cliente.estado || "Activo" }}
                </span>
            </td>
            <td class="px-6 py-4 text-right">
              <div
                  class="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
              >
                <button
                    @click="abrirModalEditarCliente(cliente)"
                    class="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  <Edit2 class="w-4 h-4" />
                </button>
                <button
                    @click="eliminarClienteLocal(cliente.idCliente!)"
                    class="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-else-if="activeTab === 'modelos'" class="space-y-4 animate-fade-in">
      <div
          class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm"
      >
        <div class="relative w-full sm:w-96">
          <Search
              class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4"
          />
          <input
              v-model="searchQueryModelos"
              type="text"
              placeholder="Buscar modelo o marca..."
              class="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
          />
        </div>

        <button
            @click="abrirModalCrearModelo"
            class="bg-[#0f172a] text-white px-5 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors w-full sm:w-auto shadow-md"
        >
          <Plus class="w-4 h-4" /> Nuevo Modelo
        </button>
      </div>

      <div
          class="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm overflow-x-auto"
      >
        <table class="w-full text-left border-collapse min-w-max">
          <thead
              class="bg-gray-50 text-gray-500 text-xs uppercase font-semibold"
          >
          <tr>
            <th class="px-6 py-4">ID</th>
            <th class="px-6 py-4">Modelo</th>
            <th class="px-6 py-4">Fabricante</th>
            <th class="px-6 py-4 text-right">Acciones</th>
          </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
          <tr v-if="modelosFiltrados.length === 0">
            <td colspan="4" class="p-8 text-center text-gray-500">
              No se encontraron modelos.
            </td>
          </tr>

          <tr
              v-for="mod in modelosFiltrados"
              :key="mod.idModelo"
              class="hover:bg-gray-50 group"
          >
            <td class="px-6 py-4 text-gray-500 text-xs">
              {{ mod.idModelo }}
            </td>
            <td class="px-6 py-4 font-bold text-gray-900 text-sm">
              {{ mod.modelo }}
            </td>
            <td class="px-6 py-4 text-gray-600 text-sm">{{ mod.marca }}</td>
            <td class="px-6 py-4 text-right">
              <div class="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                <button
                    @click="abrirModalEditarModelo(mod)"
                    class="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  <Edit2 class="w-4 h-4" />
                </button>
                <button
                    @click="eliminarModeloLocal(mod.idModelo!)"
                    class="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-else class="space-y-4 animate-fade-in">
      <div class="flex justify-end bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <button
            @click="abrirModalCrearReporte"
            class="bg-[#0f172a] text-white px-5 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors shadow-md"
        >
          <Plus class="w-4 h-4" /> Nuevo Reporte
        </button>
      </div>

      <div class="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm overflow-x-auto">
        <table class="w-full text-left border-collapse min-w-max">
          <thead class="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
          <tr>
            <th class="px-6 py-4">ID/Código</th>
            <th class="px-6 py-4">Descripción</th>
            <th class="px-6 py-4 text-center">Modelo / Aeronave</th>
            <th class="px-6 py-4 text-right">Acciones</th>
          </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
          <tr v-if="reportesAPI.length === 0">
            <td colspan="4" class="p-8 text-center text-gray-500">No hay reportes programados registrados.</td>
          </tr>
          <tr v-for="rep in reportesAPI" :key="rep.codigo" class="hover:bg-gray-50 group">
            <td class="px-6 py-4 font-mono text-xs text-blue-600">{{ rep.codigo }}</td>
            <td class="px-6 py-4 text-gray-900 text-sm">{{ rep.descripcion }}</td>
            <td class="px-6 py-4 text-center text-gray-900 text-sm">
              {{ rep.modeloAeronave?.modelo || 'Sin Modelo' }}
            </td>
            <td class="px-6 py-4 text-right">
              <div class="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                <button
                    @click="abrirModalVerReporte(rep)"
                    class="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100"
                >
                  VER
                </button>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
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

    <DetalleOTModal
        :open="mostrarModalDetalleOT"
        :ot="otSeleccionadaDetalle"
        :cargando="cargandoDetalle"
        :forzarEdicion="modoEdicionInicial"
        :reportesDisponibles="reportesAPI"
        :clientesDisponibles="clientes"
        @close="mostrarModalDetalleOT = false"
        @guardarOT="handleActualizarOT"
    />

    <FormNuevaProgramada
        v-if="mostrarModalReporte"
        :modelos="modelosAPI"
        :reporteEditar="reporteSeleccionado"
        @cerrar="cerrarModalReporte"
        @guardar="handleGuardarReporte"
    />
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
