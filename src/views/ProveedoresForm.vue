<script setup lang="ts">
import { reactive } from 'vue';
import { X, Save, Building2, User, Phone, Mail, MapPin, Tag } from 'lucide-vue-next';

// Definimos la misma interfaz para mantener consistencia
interface Proveedor {
  id: string;
  nombre: string;
  rfc: string;
  contacto: string;
  telefono: string;
  email: string;
  ubicacion: string;
  categoria: 'Componentes' | 'Herramientas' | 'Consumibles' | 'Electrónica';
  estado: 'Activo' | 'Suspendido' | 'Inactivo';
}

const props = defineProps<{
  nextId: string; // Recibimos el ID ya formateado (ej. PROV-005)
}>();

const emit = defineEmits<{
  (e: 'save', proveedor: Proveedor): void;
  (e: 'close'): void;
}>();

// Estado inicial del formulario
const form = reactive<Proveedor>({
  id: props.nextId,
  nombre: '',
  rfc: '',
  contacto: '',
  telefono: '',
  email: '',
  ubicacion: '',
  categoria: 'Componentes',
  estado: 'Activo'
});

const handleSubmit = () => {
  // Emitimos una copia del estado reactivo
  emit('save', { ...form });
};
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl border border-gray-100 overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <div>
          <h2 class="text-xl font-bold text-gray-900">Nuevo Proveedor</h2>
          <p class="text-xs text-gray-500 font-mono">{{ form.id }}</p>
        </div>
        <button @click="emit('close')" class="p-2 hover:bg-gray-200 rounded-full transition-colors">
          <X class="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div class="col-span-2 md:col-span-1">
            <label class="text-xs font-bold text-gray-700 uppercase mb-1 block">Nombre / Razón Social</label>
            <div class="relative">
              <Building2 class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input v-model="form.nombre" type="text" required placeholder="Ej. AeroPartes Int."
                     class="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>

          <div class="col-span-2 md:col-span-1">
            <label class="text-xs font-bold text-gray-700 uppercase mb-1 block">RFC</label>
            <input v-model="form.rfc" type="text" required placeholder="ABC000000XXX"
                   class="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>

          <div class="col-span-2 md:col-span-1">
            <label class="text-xs font-bold text-gray-700 uppercase mb-1 block">Persona de Contacto</label>
            <div class="relative">
              <User class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input v-model="form.contacto" type="text" required
                     class="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div class="col-span-2 md:col-span-1">
            <label class="text-xs font-bold text-gray-700 uppercase mb-1 block">Categoría</label>
            <div class="relative">
              <Tag class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select v-model="form.categoria"
                      class="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm appearance-none outline-none focus:ring-2 focus:ring-blue-500">
                <option>Componentes</option>
                <option>Herramientas</option>
                <option>Consumibles</option>
                <option>Electrónica</option>
              </select>
            </div>
          </div>

          <div class="col-span-2 md:col-span-1">
            <label class="text-xs font-bold text-gray-700 uppercase mb-1 block">Teléfono</label>
            <div class="relative">
              <Phone class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input v-model="form.telefono" type="tel"
                     class="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div class="col-span-2 md:col-span-1">
            <label class="text-xs font-bold text-gray-700 uppercase mb-1 block">Email</label>
            <div class="relative">
              <Mail class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input v-model="form.email" type="email"
                     class="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div class="col-span-2">
            <label class="text-xs font-bold text-gray-700 uppercase mb-1 block">Ubicación</label>
            <div class="relative">
              <MapPin class="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <textarea v-model="form.ubicacion" rows="2"
                        class="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"></textarea>
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <button type="button" @click="emit('close')"
                  class="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            Cancelar
          </button>
          <button type="submit"
                  class="flex items-center gap-2 px-6 py-2 bg-[#0f172a] hover:bg-slate-800 text-white text-sm font-bold rounded-lg transition-all shadow-md">
            <Save class="w-4 h-4" />
            Guardar Proveedor
          </button>
        </div>
      </form>
    </div>
  </div>
</template>