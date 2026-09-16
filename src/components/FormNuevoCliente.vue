<script setup lang="ts">
import { reactive, onMounted } from 'vue';
import { X, Save, Building2, Phone, Mail, MapPin, User, FileBadge } from 'lucide-vue-next';
import type { PayloadClienteBackend } from '../services/cliente.service';

const props = defineProps<{
  clienteAEditar?: PayloadClienteBackend | null;
}>();

const emit = defineEmits<{
  (e: 'guardar', cliente: PayloadClienteBackend & { esEdicion?: boolean }): void;
  (e: 'cerrar'): void;
}>();

const form = reactive<PayloadClienteBackend>({
  compania: '',
  rfc: '',
  direccion: '',
  ciudad: '',       // B1
  estadoRep: '',    // B1
  contacto: '',
  telefono: '',
  correo: '',
  estado: 'Activo' // Por defecto lo creamos activo
});

// B1: Estados de la República Mexicana para el selector
const estadosMexico = [
  'Aguascalientes', 'Baja California', 'Baja California Sur', 'Campeche',
  'Chiapas', 'Chihuahua', 'Ciudad de México', 'Coahuila', 'Colima',
  'Durango', 'Estado de México', 'Guanajuato', 'Guerrero', 'Hidalgo',
  'Jalisco', 'Michoacán', 'Morelos', 'Nayarit', 'Nuevo León', 'Oaxaca',
  'Puebla', 'Querétaro', 'Quintana Roo', 'San Luis Potosí', 'Sinaloa',
  'Sonora', 'Tabasco', 'Tamaulipas', 'Tlaxcala', 'Veracruz', 'Yucatán', 'Zacatecas'
];

onMounted(() => {
  if (props.clienteAEditar) {
    Object.assign(form, props.clienteAEditar);
  }
});

const handleSubmit = () => {
  emit('guardar', { ...form, esEdicion: !!props.clienteAEditar });
};
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
    <div class="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200 max-h-[90vh] flex flex-col">
      <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
        <h3 class="font-bold text-gray-900 text-lg">
          {{ props.clienteAEditar ? 'Editar Cliente' : 'Registrar Nuevo Cliente' }}
        </h3>
        <button @click="emit('cerrar')" class="p-1.5 hover:bg-gray-200 rounded-full transition-colors text-gray-500">
          <X class="w-5 h-5" />
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="p-6 overflow-y-auto">
        
        <h4 class="text-sm font-bold text-blue-600 uppercase mb-4 border-b pb-2">Datos de la Empresa</h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div class="col-span-2 md:col-span-1">
            <label class="text-xs font-bold text-gray-700 uppercase mb-1 block">Nombre / Dependencia</label>
            <div class="relative">
              <Building2 class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input v-model="form.compania" type="text" required placeholder="Nombre de la empresa" class="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div class="col-span-2 md:col-span-1">
            <label class="text-xs font-bold text-gray-700 uppercase mb-1 block">RFC</label>
            <div class="relative">
              <FileBadge class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input v-model="form.rfc" type="text" required placeholder="ABC000000XXX" class="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-mono outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div class="col-span-2">
            <label class="text-xs font-bold text-gray-700 uppercase mb-1 block">Dirección Completa</label>
            <div class="relative">
              <MapPin class="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <textarea v-model="form.direccion" required rows="2" placeholder="Calle, Número, Colonia, C.P." class="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none"></textarea>
            </div>
          </div>

          <!-- B1: Ciudad y Estado en columnas independientes (comentario 5) -->
          <div class="col-span-2 md:col-span-1">
            <label class="text-xs font-bold text-gray-700 uppercase mb-1 block">Ciudad</label>
            <div class="relative">
              <MapPin class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input v-model="form.ciudad" type="text" placeholder="Ciudad" class="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div class="col-span-2 md:col-span-1">
            <label class="text-xs font-bold text-gray-700 uppercase mb-1 block">Estado</label>
            <select v-model="form.estadoRep" class="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 appearance-none">
              <option value="">Seleccionar estado</option>
              <option v-for="est in estadosMexico" :key="est" :value="est">{{ est }}</option>
            </select>
          </div>
        </div>

        <h4 class="text-sm font-bold text-emerald-600 uppercase mb-4 border-b pb-2">Datos de Contacto</h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="col-span-2">
            <label class="text-xs font-bold text-gray-700 uppercase mb-1 block">Nombre del Contacto</label>
            <div class="relative">
              <User class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input v-model="form.contacto" type="text" required placeholder="Nombre de la persona encargada" class="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div class="col-span-2 md:col-span-1">
            <label class="text-xs font-bold text-gray-700 uppercase mb-1 block">
              Correo <span class="text-gray-400 font-normal normal-case">(opcional)</span>
            </label>
            <div class="relative">
              <Mail class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <!-- B1: type="text" en vez de "email" para permitir vacío o "ukn" sin bloqueo del navegador (comentario 1) -->
              <input v-model="form.correo" type="text" placeholder="correo@empresa.com (opcional)" class="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div class="col-span-2 md:col-span-1">
            <label class="text-xs font-bold text-gray-700 uppercase mb-1 block">Teléfono</label>
            <div class="relative">
              <Phone class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input v-model="form.telefono" type="tel" required placeholder="10 dígitos" class="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div class="col-span-2 md:col-span-1 mt-2">
            <label class="text-xs font-bold text-gray-700 uppercase mb-1 block">Estado del Cliente</label>
            <select v-model="form.estado" class="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 appearance-none">
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>
        </div>

        <div class="flex justify-end gap-3 pt-6 mt-6 border-t border-gray-100">
          <button type="button" @click="emit('cerrar')" class="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">Cancelar</button>
          <button type="submit" class="flex items-center gap-2 px-6 py-2 bg-[#0f172a] hover:bg-slate-800 text-white text-sm font-bold rounded-lg transition-colors shadow-md">
            <Save class="w-4 h-4" /> {{ props.clienteAEditar ? 'Actualizar' : 'Guardar' }}
          </button>
        </div>

      </form>
    </div>
  </div>
</template>