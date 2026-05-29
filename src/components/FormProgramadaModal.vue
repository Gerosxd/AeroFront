<template>
  <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in">

      <div class="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
        <h3 class="text-lg font-bold text-gray-900">Registro de Tarea Programada</h3>
        <button @click="$emit('cerrar')" class="text-gray-400 hover:text-gray-600 transition-colors">
          <X class="w-5 h-5" />
        </button>
      </div>

      <form @submit.prevent="enviarFormulario" class="p-6 space-y-4">

        <div>
          <label class="block text-xs uppercase font-bold text-gray-500 mb-1 tracking-wider">ID/Código</label>
          <input
              v-model="form.codigo"
              type="text"
              required
              placeholder="Ej: PRG-001"
              class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-sm"
          />
        </div>

        <div>
          <label class="block text-xs uppercase font-bold text-gray-500 mb-1 tracking-wider">Modelo</label>
          <div class="relative">
            <select
                v-model.number="form.modeloId"
                required
                class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none appearance-none text-sm"
            >
              <option :value="null" disabled>Seleccione un modelo...</option>
              <option v-for="mod in modelos" :key="mod.idModelo" :value="mod.idModelo">
                {{ mod.marca }} - {{ mod.modelo }}
              </option>
            </select>
            <ChevronDown class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>



        <div>
          <label class="block text-xs uppercase font-bold text-gray-500 mb-1 tracking-wider">Descripción</label>
          <textarea
              v-model="form.descripcion"
              rows="2"
              placeholder="Detalles de la tarea..."
              class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-sm"
          ></textarea>
        </div>

        <div class="flex items-center gap-3 pt-2">
          <button
              type="button"
              @click="$emit('cerrar')"
              class="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg font-bold text-sm hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>

          <button
              type="submit"
              class="flex-1 px-4 py-2.5 bg-[#0f172a] text-white rounded-lg font-bold text-sm hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200"
          >
            {{ reporteEditar ? 'Actualizar' : 'Guardar' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { X, ChevronDown } from 'lucide-vue-next';
import { listarModelos } from '../services/modelo.service';

const emit = defineEmits(['cerrar', 'guardar']);
const modelos = ref<any[]>([]);

const props = defineProps({
  modelos: {
    type: Array as () => any[],
    default: () => []
  },
  // --- ESTO ES LO QUE FALTABA ---
  reporteEditar: {
    type: Object as () => any | null,
    default: null
  }
});

const form = ref({
  codigo: '',
  descripcion: '',
  modeloId: null,
  tecnico: '',
  horasTotales: 0
});

const enviarFormulario = () => {
  if (!form.value.modeloId) {
    alert("Por favor selecciona un modelo");
    return;
  }
  emit('guardar', { ...form.value });
};

onMounted(async () => {
  try {
    const res = await listarModelos();
    // Validamos si la respuesta viene directa o en un nodo .data
    modelos.value = Array.isArray(res) ? res : res.data;
    console.log("Modelos cargados:", modelos.value);
  } catch (error) {
    console.error("Error cargando modelos:", error);
  }
});

onMounted(() => {
  // Si recibimos un reporte para editar/ver, llenamos el formulario
  if (props.reporteEditar) {
    form.value = {
      codigo: props.reporteEditar.codigo,
      descripcion: props.reporteEditar.descripcion,
      modeloId: props.reporteEditar.modelo, // Usamos el ID numérico
      tecnico: props.reporteEditar.tecnico,
      horasTotales: props.reporteEditar.horasTotales
    };
  }
});
</script>