<script setup lang="ts">
import { reactive } from 'vue';
import { X, Save, Plane } from 'lucide-vue-next';

export interface PayloadNuevaAeronave {
  matricula: string;
  nsAeronave: string;
  modeloAeronave: string;
  marcaAeronave: string;
  tipoAeronave: string;
  operador: string;
  maMotorLH: string; moMotorLH: string; nsMotorLH: string;
  maMotorRH: string; moMotorRH: string; nsMotorRH: string;
  maMotorC: string; moMotorC: string; nsMotorC: string;
  maAPU: string; moAPU: string; nsAPU: string;
}

const props = defineProps<{
  open: boolean;
  catalogos: { modelos: any[] };
  clientes?: any[]; // Ticket 37: Recibimos la lista de clientes
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'submit', payload: PayloadNuevaAeronave): void;
}>();

const form = reactive<PayloadNuevaAeronave>({
  matricula: '', nsAeronave: '', modeloAeronave: '', marcaAeronave: '', tipoAeronave: '', operador: '',
  maMotorLH: '', moMotorLH: '', nsMotorLH: '',
  maMotorRH: '', moMotorRH: '', nsMotorRH: '',
  maMotorC: '', moMotorC: '', nsMotorC: '',
  maAPU: '', moAPU: '', nsAPU: ''
});

const resetForm = () => {
  Object.keys(form).forEach(key => (form as any)[key] = '');
};

const handleClose = () => {
  resetForm();
  emit('close');
};

const handleSubmit = () => {
  emit('submit', { ...form });
  resetForm();
};
</script>

<template>
  <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
    <div class="bg-white rounded-xl shadow-xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
      
      <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
        <h3 class="font-bold text-gray-900 text-lg flex items-center gap-2">
          <Plane class="w-5 h-5 text-blue-600" />
          Registrar Nueva Aeronave
        </h3>
        <button @click="handleClose" class="p-1.5 hover:bg-gray-200 rounded-full transition-colors text-gray-500">
          <X class="w-5 h-5" />
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="p-6 overflow-y-auto space-y-6">
        
        <div>
          <h4 class="text-sm font-bold text-blue-600 uppercase mb-3 border-b pb-1">Datos Generales</h4>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="text-xs font-bold text-gray-700 uppercase mb-1 block">Matrícula <span class="text-red-500">*</span></label>
              <input v-model="form.matricula" required type="text" class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label class="text-xs font-bold text-gray-700 uppercase mb-1 block">No. Serie <span class="text-red-500">*</span></label>
              <input v-model="form.nsAeronave" required type="text" class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label class="text-xs font-bold text-gray-700 uppercase mb-1 block">Modelo <span class="text-red-500">*</span></label>
              <select v-model="form.modeloAeronave" required class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500">
                <option value="" disabled>Seleccione un modelo</option>
                <option v-for="mod in props.catalogos?.modelos || []" :key="mod.id" :value="mod.nombre">{{ mod.nombre }} ({{ mod.marca }})</option>
              </select>
            </div>
            
            <div class="md:col-span-3">
              <label class="text-xs font-bold text-gray-700 uppercase mb-1 block">Cliente / Operador <span class="text-red-500">*</span></label>
              <select v-model="form.operador" required class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500">
                <option value="" disabled>Seleccione un cliente registrado</option>
                <option v-for="cli in props.clientes || []" :key="cli.idCliente" :value="cli.compania">{{ cli.compania }} - RFC: {{ cli.rfc }}</option>
              </select>
            </div>
          </div>
        </div>

        <h4 class="text-sm font-bold text-slate-700 uppercase mb-3 border-b pb-1 mt-6">Especificaciones de Motores</h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <div class="bg-gray-50/50 p-4 rounded-xl border border-gray-100">
            <h5 class="text-xs font-bold text-gray-800 uppercase mb-3 text-center">Motor Izquierdo (LH)</h5>
            <div class="space-y-3">
              <div><label class="text-[10px] uppercase font-semibold text-gray-500 block mb-1">Marca</label><input v-model="form.maMotorLH" type="text" class="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm" /></div>
              <div><label class="text-[10px] uppercase font-semibold text-gray-500 block mb-1">Modelo</label><input v-model="form.moMotorLH" type="text" class="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm" /></div>
              <div><label class="text-[10px] uppercase font-semibold text-gray-500 block mb-1">No. Serie</label><input v-model="form.nsMotorLH" type="text" class="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm" /></div>
            </div>
          </div>

          <div class="bg-gray-50/50 p-4 rounded-xl border border-gray-100">
            <h5 class="text-xs font-bold text-gray-800 uppercase mb-3 text-center">Motor Derecho (RH)</h5>
            <div class="space-y-3">
              <div><label class="text-[10px] uppercase font-semibold text-gray-500 block mb-1">Marca</label><input v-model="form.maMotorRH" type="text" class="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm" /></div>
              <div><label class="text-[10px] uppercase font-semibold text-gray-500 block mb-1">Modelo</label><input v-model="form.moMotorRH" type="text" class="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm" /></div>
              <div><label class="text-[10px] uppercase font-semibold text-gray-500 block mb-1">No. Serie</label><input v-model="form.nsMotorRH" type="text" class="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm" /></div>
            </div>
          </div>

          <div class="bg-gray-50/50 p-4 rounded-xl border border-gray-100">
            <h5 class="text-xs font-bold text-gray-800 uppercase mb-3 text-center">Motor Central (C)</h5>
            <div class="space-y-3">
              <div><label class="text-[10px] uppercase font-semibold text-gray-500 block mb-1">Marca</label><input v-model="form.maMotorC" type="text" class="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm" /></div>
              <div><label class="text-[10px] uppercase font-semibold text-gray-500 block mb-1">Modelo</label><input v-model="form.moMotorC" type="text" class="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm" /></div>
              <div><label class="text-[10px] uppercase font-semibold text-gray-500 block mb-1">No. Serie</label><input v-model="form.nsMotorC" type="text" class="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm" /></div>
            </div>
          </div>

          <div class="bg-gray-50/50 p-4 rounded-xl border border-gray-100">
            <h5 class="text-xs font-bold text-gray-800 uppercase mb-3 text-center">APU</h5>
            <div class="space-y-3">
              <div><label class="text-[10px] uppercase font-semibold text-gray-500 block mb-1">Marca</label><input v-model="form.maAPU" type="text" class="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm" /></div>
              <div><label class="text-[10px] uppercase font-semibold text-gray-500 block mb-1">Modelo</label><input v-model="form.moAPU" type="text" class="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm" /></div>
              <div><label class="text-[10px] uppercase font-semibold text-gray-500 block mb-1">No. Serie</label><input v-model="form.nsAPU" type="text" class="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm" /></div>
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-3 pt-6 mt-6 border-t border-gray-100">
          <button type="button" @click="handleClose" class="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">Cancelar</button>
          <button type="submit" class="flex items-center gap-2 px-6 py-2 bg-[#0f172a] hover:bg-slate-800 text-white text-sm font-bold rounded-lg transition-colors shadow-md">
            <Save class="w-4 h-4" /> Guardar Aeronave
          </button>
        </div>
        
      </form>
    </div>
  </div>
</template>