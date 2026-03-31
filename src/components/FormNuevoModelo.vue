<script setup lang="ts">
import { reactive, onMounted } from 'vue';
import { X, Save, Plane, Tag, List } from 'lucide-vue-next';
import type { PayloadModeloBackend } from '../services/modelo.service';

const props = defineProps<{
  modeloAEditar?: PayloadModeloBackend | null;
}>();

const emit = defineEmits<{
  (e: 'guardar', modelo: PayloadModeloBackend & { esEdicion?: boolean }): void;
  (e: 'cerrar'): void;
}>();

const form = reactive<PayloadModeloBackend>({
  modelo: '',
  marca: '',
  tipoAeronave: null
});

onMounted(() => {
  if (props.modeloAEditar) {
    Object.assign(form, props.modeloAEditar);
  }
});

const handleSubmit = () => {
  emit('guardar', { ...form, esEdicion: !!props.modeloAEditar });
};
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
    <div class="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
      
      <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
        <h3 class="font-bold text-gray-900 text-lg">
          {{ props.modeloAEditar ? 'Editar Modelo' : 'Registrar Nuevo Modelo' }}
        </h3>
        <button @click="emit('cerrar')" class="p-1.5 hover:bg-gray-200 rounded-full transition-colors text-gray-500">
          <X class="w-5 h-5" />
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="p-6">
        <div class="space-y-4">
          
          <div>
            <label class="text-xs font-bold text-gray-700 uppercase mb-1 block">Modelo de la Aeronave <span class="text-red-500">*</span></label>
            <div class="relative">
              <Plane class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input v-model="form.modelo" type="text" required placeholder="Ej. 737-800"
                     class="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div>
            <label class="text-xs font-bold text-gray-700 uppercase mb-1 block">Marca / Fabricante <span class="text-red-500">*</span></label>
            <div class="relative">
              <Tag class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input v-model="form.marca" type="text" required placeholder="Ej. Boeing"
                     class="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div>
            <label class="text-xs font-bold text-gray-700 uppercase mb-1 block">Tipo de Aeronave (Pendiente)</label>
            <div class="relative">
              <List class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select v-model="form.tipoAeronave" required
                      class="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 appearance-none">
                <option :value="null" disabled>Seleccione un tipo...</option>
                <option :value="1">Comercial</option>
                <option :value="2">Carga</option>
                <option :value="3">Privado</option>
              </select>
            </div>
            <p class="text-[10px] text-gray-400 mt-1">*Opciones provisionales a la espera de catálogo oficial.</p>
          </div>

        </div>

        <div class="flex justify-end gap-3 pt-6 mt-6 border-t border-gray-100">
          <button type="button" @click="emit('cerrar')"
                  class="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            Cancelar
          </button>
          <button type="submit"
                  class="flex items-center gap-2 px-6 py-2 bg-[#0f172a] hover:bg-slate-800 text-white text-sm font-bold rounded-lg transition-colors shadow-md">
            <Save class="w-4 h-4" />
            {{ props.modeloAEditar ? 'Actualizar' : 'Guardar' }}
          </button>
        </div>

      </form>
    </div>
  </div>
</template>