<script setup lang="ts">
import { reactive, onMounted } from 'vue';
import { X, Save, Building2, MapPin, Navigation, Activity } from 'lucide-vue-next';

interface Almacen {
  idAlmacen?: number;
  nombre: string;
  direccion: string;
  ciudad: string;
  estado: number;
}

const props = defineProps<{ almacenAEditar?: Almacen | null; }>();
const emit = defineEmits<{
  (e: 'guardar', almacen: Almacen & { esEdicion?: boolean }): void;
  (e: 'cerrar'): void;
}>();

const form = reactive<Almacen>({
  nombre: '',
  direccion: '',
  ciudad: '',
  estado: 1
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
        <button @click="emit('cerrar')" class="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500">
          <X class="w-5 h-5" />
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="text-xs font-bold text-gray-700 uppercase mb-1 block">Nombre</label>
            <div class="relative">
              <Building2 class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input v-model="form.nombre" type="text" required maxlength="25"
                     class="w-full pl-10 pr-4 py-2 bg-gray-50 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div>
            <label class="text-xs font-bold text-gray-700 uppercase mb-1 block">Dirección</label>
            <div class="relative">
              <MapPin class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input v-model="form.direccion" type="text" required maxlength="50"
                     class="w-full pl-10 pr-4 py-2 bg-gray-50 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div>
            <label class="text-xs font-bold text-gray-700 uppercase mb-1 block">Ciudad</label>
            <div class="relative">
              <Navigation class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input v-model="form.ciudad" type="text" required maxlength="25"
                     class="w-full pl-10 pr-4 py-2 bg-gray-50 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div>
            <label class="text-xs font-bold text-gray-700 uppercase mb-1 block">Estado</label>
            <div class="relative">
              <Activity class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select v-model.number="form.estado" required
                      class="w-full pl-10 pr-4 py-2 bg-gray-50 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 appearance-none">
                <option :value="1">Activo</option>
                <option :value="0">Inactivo</option>
              </select>
            </div>
          </div>
        </div>
        <div class="flex justify-end gap-3 pt-6 mt-6 border-t">
          <button type="button" @click="emit('cerrar')" class="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Cancelar</button>
          <button type="submit" class="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg">
            <Save class="w-4 h-4" /> {{ props.almacenAEditar ? 'Actualizar' : 'Guardar' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>