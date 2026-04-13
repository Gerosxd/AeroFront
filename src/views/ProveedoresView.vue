<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import {
  Plus,
  Search,
  Filter,
  Mail,
  Phone,
  MapPin,
  Building2,
} from "lucide-vue-next";
import ProveedoresForm from "../components/ProveedoresForm.vue"; // Ruta actualizada
import {
  obtenerProveedores,
  crearProveedor,
  actualizarProveedor,
  eliminarProveedor,
  type Proveedor,
} from "../services/proveedor.service";

const proveedores = ref<Proveedor[]>([]);
const searchQuery = ref("");
const mostrarModal = ref(false);
const proveedorSeleccionado = ref<Proveedor | null>(null);

const cargarProveedores = async () => {
  try {
    proveedores.value = await obtenerProveedores();
  } catch (error) {
    console.error("Error al cargar proveedores:", error);
  }
};

onMounted(() => {
  cargarProveedores();
});

const proveedoresFiltrados = computed(() => {
  if (!searchQuery.value) return proveedores.value;
  const query = searchQuery.value.toLowerCase();
  return proveedores.value.filter(
    (p) =>
      p.nombre?.toLowerCase().includes(query) ||
      p.contacto?.toLowerCase().includes(query) ||
      p.ciudad?.toLowerCase().includes(query),
  );
});

const abrirModalCrear = () => {
  proveedorSeleccionado.value = null;
  mostrarModal.value = true;
};

const abrirModalEditar = (proveedor: Proveedor) => {
  proveedorSeleccionado.value = { ...proveedor };
  mostrarModal.value = true;
};

const eliminarProveedorLocal = async (proveedor: Proveedor) => {
  const mensajeConfirmacion = `¿Estás seguro de que deseas eliminar este proveedor?\n\n- Empresa: ${proveedor.nombre}\n- Contacto: ${proveedor.contacto}\n\nEsta acción no se puede deshacer.`;

  if (confirm(mensajeConfirmacion)) {
    try {
      await eliminarProveedor(proveedor.idProveedor!);
      await cargarProveedores();
    } catch (error) {
      console.error("Error al eliminar el proveedor:", error);
      alert("Hubo un error al eliminar el proveedor.");
    }
  }
};

const guardarProveedor = async (datos: Proveedor & { esEdicion?: boolean }) => {
  try {
    if (datos.esEdicion && datos.idProveedor) {
      await actualizarProveedor(datos.idProveedor, datos);
    } else {
      await crearProveedor(datos);
    }
    await cargarProveedores();
    mostrarModal.value = false;
  } catch (error) {
    console.error("Error al guardar proveedor:", error);
    alert("Ocurrió un error al guardar el proveedor.");
  }
};
</script>

<template>
  <div class="space-y-6 pb-12">
    <div
      class="flex flex-col md:flex-row md:items-center justify-between gap-4"
    >
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Proveedores</h1>
        <p class="text-gray-500 text-sm">
          Gestión del catálogo general de proveedores y suministros.
        </p>
      </div>
      <button
        @click="abrirModalCrear"
        class="bg-[#0f172a] hover:bg-slate-800 text-white px-5 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors shadow-md w-full md:w-auto"
      >
        <Plus class="w-4 h-4" />
        Nuevo Proveedor
      </button>
    </div>

    <div
      class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between"
    >
      <div class="relative w-full sm:w-96">
        <Search
          class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4"
        />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar por nombre, contacto o ciudad..."
          class="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
        />
      </div>
    </div>

    <div
      class="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm overflow-x-auto"
    >
      <table class="w-full text-left border-collapse min-w-max">
        <thead class="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
          <tr>
            <th class="px-6 py-4">ID</th>
            <th class="px-6 py-4">Empresa</th>
            <th class="px-6 py-4">Contacto</th>
            <th class="px-6 py-4">Ubicación</th>
            <th class="px-6 py-4">Estado</th>
            <th class="px-6 py-4 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-if="proveedoresFiltrados.length === 0">
            <td colspan="6" class="px-6 py-8 text-center text-gray-500 text-sm">
              No se encontraron proveedores.
            </td>
          </tr>
          <tr
            v-for="prov in proveedoresFiltrados"
            :key="prov.idProveedor"
            class="hover:bg-gray-50/80 group"
          >
            <td class="px-6 py-4 text-sm font-medium text-gray-500">
              {{ prov.idProveedor }}
            </td>

            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <div
                  class="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0"
                >
                  <Building2 class="w-4 h-4" />
                </div>
                <div>
                  <div class="font-bold text-gray-900 text-sm">
                    {{ prov.nombre }}
                  </div>
                </div>
              </div>
            </td>

            <td class="px-6 py-4">
              <div class="text-sm font-medium text-gray-900">
                {{ prov.contacto }}
              </div>
              <div class="flex flex-col gap-1 mt-1">
                <div class="flex items-center gap-2 text-xs text-gray-500">
                  <Phone class="w-3 h-3" /> {{ prov.telefono }}
                </div>
                <div
                  v-if="prov.correo"
                  class="flex items-center gap-2 text-xs text-blue-600 hover:underline cursor-pointer"
                >
                  <Mail class="w-3 h-3" /> {{ prov.correo }}
                </div>
              </div>
            </td>

            <td class="px-6 py-4 text-sm text-gray-600">
              <div class="flex items-center gap-1.5 font-medium">
                <MapPin class="w-3.5 h-3.5 text-gray-400" />
                {{ prov.ciudad }}
              </div>
              <div
                v-if="prov.direccion"
                class="text-xs text-gray-400 mt-0.5 ml-5"
              >
                {{ prov.direccion }}
              </div>
            </td>

            <td class="px-6 py-4">
              <span
                :class="[
                  'px-2.5 py-1 rounded-full text-xs font-semibold border',
                  prov.estado === 1
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-red-50 text-red-700 border-red-200',
                ]"
              >
                {{ prov.estado === 1 ? "Activo" : "Inactivo" }}
              </span>
            </td>

            <td class="px-6 py-4 text-right">
              <div class="flex items-center justify-end gap-3">
                <button
                  @click="abrirModalEditar(prov)"
                  class="text-gray-400 hover:text-blue-600 font-medium text-sm transition-colors"
                >
                  Editar
                </button>
                <button
                  @click="eliminarProveedorLocal(prov)"
                  class="text-gray-400 hover:text-red-600 font-medium text-sm transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <ProveedoresForm
      v-if="mostrarModal"
      :proveedor-a-editar="proveedorSeleccionado"
      @cerrar="mostrarModal = false"
      @guardar="guardarProveedor"
    />
  </div>
</template>
