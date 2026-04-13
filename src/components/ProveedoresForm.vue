<script setup lang="ts">
import { reactive, onMounted } from 'vue';
import { X, Save, Building2, User, Phone, Mail, MapPin, Hash } from 'lucide-vue-next';
import type { Proveedor } from '../services/proveedor.service';

const props = defineProps<{
  proveedorAEditar?: Proveedor | null;
}>();

const emit = defineEmits<{
  (e: 'guardar', proveedor: Proveedor & { esEdicion?: boolean }): void;
  (e: 'cerrar'): void;
}>();

const form = reactive<Proveedor>({
  nombre: '',
  contacto: '',
  correo: '',
  direccion: '',
  codigoPostal: '',
  ciudad: '',
  telefono: '',
  estado: 1 // Por defecto activo
});

onMounted(() => {
  if (props.proveedorAEditar) {
    Object.assign(form, props.proveedorAEditar);
  }
});

const handleSubmit = () => {
  emit('guardar', { ...form, esEdicion: !!props.proveedorAEditar });
};
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
    <div class="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
      
      <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
        <h3 class="font-bold text-gray-900 text-lg">
          {{ props.proveedorAEditar ? 'Editar Proveedor' : 'Registrar Nuevo Proveedor' }}
        </h3>
        <button @click="emit('cerrar')" class="p-1.5 hover:bg-gray-200 rounded-full transition-colors text-gray-500">
          <X class="w-5 h-5" />
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <div class="col-span-2">
            <label class="text-xs font-bold text-gray-700 uppercase mb-1 block">Nombre de la Empresa <span class="text-red-500">*</span></label>
            <div class="relative">
              <Building2 class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input v-model="form.nombre" type="text" required maxlength="50"
                     class="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div>
            <label class="text-xs font-bold text-gray-700 uppercase mb-1 block">Contacto Principal <span class="text-red-500">*</span></label>
            <div class="relative">
              <User class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input v-model="form.contacto" type="text" required maxlength="50"
                     class="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div>
            <label class="text-xs font-bold text-gray-700 uppercase mb-1 block">Teléfono <span class="text-red-500">*</span></label>
            <div class="relative">
              <Phone class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input v-model="form.telefono" type="text" required maxlength="15"
                     class="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div class="col-span-2 md:col-span-1">
            <label class="text-xs font-bold text-gray-700 uppercase mb-1 block">Correo Electrónico</label>
            <div class="relative">
              <Mail class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input v-model="form.correo" type="email" maxlength="100"
                     class="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div class="col-span-2 md:col-span-1">
            <label class="text-xs font-bold text-gray-700 uppercase mb-1 block">Estado <span class="text-red-500">*</span></label>
            <select v-model="form.estado" required class="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500">
              <option :value="1">Activo</option>
              <option :value="0">Inactivo</option>
            </select>
          </div>

          <div class="col-span-2">
            <label class="text-xs font-bold text-gray-700 uppercase mb-1 block">Dirección</label>
            <div class="relative">
              <MapPin class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input v-model="form.direccion" type="text" maxlength="50"
                     class="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div>
            <label class="text-xs font-bold text-gray-700 uppercase mb-1 block">Ciudad <span class="text-red-500">*</span></label>
            <div class="relative">
              <Building2 class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input v-model="form.ciudad" type="text" required maxlength="25"
                     class="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div>
            <label class="text-xs font-bold text-gray-700 uppercase mb-1 block">Código Postal</label>
            <div class="relative">
              <Hash class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input v-model="form.codigoPostal" type="text" maxlength="10"
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
                  class="flex items-center gap-2 px-6 py-2 bg-[#0f172a] hover:bg-slate-800 text-white text-sm font-bold rounded-lg transition-colors shadow-md">
            <Save class="w-4 h-4" />
            {{ props.proveedorAEditar ? 'Actualizar' : 'Guardar' }}
          </button>
        </div>

      </form>
    </div>
  </div>
</template>