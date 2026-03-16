<script setup lang="ts">
import { reactive, onMounted } from 'vue';
import { X, Save, Building2, MapPin, Tag, User } from 'lucide-vue-next';


interface Almacen {
  id?: string | number;
  nombre: string;
  ubicacion: string;
  tipo: string;
  responsable: string;
}

const props = defineProps<{
  almacenAEditar?: Almacen | null;
}>();

const emit = defineEmits<{
  (e: 'guardar', almacen: Almacen & { esEdicion?: boolean }): void;
  (e: 'cerrar'): void;
}>();


const form = reactive<Almacen>({
  nombre: '',
  ubicacion: '',
  tipo: 'General',
  responsable: ''
});

onMounted(() => {
  if (props.almacenAEditar) {
    Object.assign(form, props.almacenAEditar);
  }
});

const handleSubmit = () => {
  emit('guardar', { ...form, esEdicion: !!props.almacenAEditar });
};
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
    <div class="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
      
      <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <h3 class="font-bold text-gray-900 text-lg">
          {{ props.almacenAEditar ? 'Editar Almacén' : 'Registrar Nuevo Almacén' }}
        </h3>
        <button @click="emit('cerrar')" class="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-500">
          <X class="w-5 h-5" />
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div>
            <label class="text-xs font-bold text-gray-700 uppercase mb-1 block">Nombre del Almacén</label>
            <div class="relative">
              <Building2 class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input v-model="form.nombre" type="text" required placeholder="Ej. Almacén Principal"
                     class="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div>
            <label class="text-xs font-bold text-gray-700 uppercase mb-1 block">Tipo de Almacén</label>
            <div class="relative">
              <Tag class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select v-model="form.tipo" 
                      class="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 appearance-none">
                <option value="General">General</option>
                <option value="Herramientas">Herramientas</option>
                <option value="Componentes">Componentes</option>
                <option value="Fluidos">Fluidos y Químicos</option>
              </select>
            </div>
          </div>

          <div>
            <label class="text-xs font-bold text-gray-700 uppercase mb-1 block">Ubicación Físíca</label>
            <div class="relative">
              <MapPin class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input v-model="form.ubicacion" type="text" required placeholder="Ej. Hangar 1"
                     class="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div>
            <label class="text-xs font-bold text-gray-700 uppercase mb-1 block">Responsable</label>
            <div class="relative">
              <User class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input v-model="form.responsable" type="text" required placeholder="Nombre del encargado"
                     class="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

        </div>

        <div class="flex justify-end gap-3 pt-6 mt-6 border-t border-gray-100">
          <button type="button" @click="emit('cerrar')"
                  class="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            Cancelar
          </button>
          <button type="submit"
                  class="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
            <Save class="w-4 h-4" />
            {{ props.almacenAEditar ? 'Actualizar Almacén' : 'Guardar Almacén' }}
          </button>
        </div>

      </form>
    </div>
  </div>
</template>
