<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import { X } from 'lucide-vue-next'
import type {
  SalidaArticuloExportRequest
} from '../types/salida-articulo'

// Definición de Props con los tipos de Salida
const props = defineProps<{
  open: boolean
  salida: any | null // Aquí puedes usar tu interfaz SalidaArtResponse
  tipo: 'excel' | 'pdf'
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'confirm', payload: SalidaArticuloExportRequest): void
}>()

// Helper para obtener la fecha actual en formato YYYY-MM-DD
const hoy = computed(() => {
  const d = new Date()
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
})

// Estado del formulario reactivo
const form = reactive<SalidaArticuloExportRequest>({
  encargadoAlmacen: '',
  fechaEncargado: '',
  traslada: '',
  fechaTraslada: '',
  recibe: '',
  fechaRecibe: ''
})

// Reiniciar el formulario al abrir el modal
watch(
    () => props.open,
    (open) => {
      if (!open) return

      // Si la salida ya tiene nombres guardados, puedes pre-llenarlos aquí
      form.encargadoAlmacen = props.salida?.encargadoAlmacen || ''
      form.fechaEncargado = hoy.value
      form.traslada = props.salida?.traslada || ''
      form.fechaTraslada = hoy.value
      form.recibe = props.salida?.recibe || ''
      form.fechaRecibe = hoy.value
    }
)

const close = () => emit('close')

const submit = () => {
  emit('confirm', { ...form })
}
</script>

<template>
  <teleport to="body">
    <div v-if="open" class="fixed inset-0 z-[10000]">
      <!-- Overlay con desenfoque -->
      <div class="absolute inset-0 bg-black/40 backdrop-blur-[2px]" @click="close"></div>

      <div class="absolute inset-0 flex items-center justify-center p-4">
        <div class="w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-200">

          <!-- Header -->
          <div class="flex items-start justify-between px-6 py-5 border-b border-slate-200 bg-white">
            <div>
              <h3 class="text-lg font-bold text-slate-900">
                {{ tipo === 'excel' ? 'Exportar a Excel' : 'Exportar a PDF' }}
              </h3>
              <p class="text-sm text-slate-500 mt-1">
                Captura los datos de responsables para la salida: <span class="font-semibold text-blue-600">{{ salida?.noSalida }}</span>
              </p>
            </div>

            <button
                class="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
                @click="close"
                aria-label="Cerrar"
            >
              <X class="w-5 h-5" />
            </button>
          </div>

          <!-- Body - Formulario de Firmas -->
          <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-5 bg-white">

            <!-- Bloque Encargado -->
            <div class="md:col-span-1">
              <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Encargado de Almacén</label>
              <input
                  v-model="form.encargadoAlmacen"
                  type="text"
                  placeholder="Nombre completo"
                  class="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Fecha Firma</label>
              <input
                  v-model="form.fechaEncargado"
                  type="date"
                  class="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <!-- Bloque Traslada -->
            <div class="md:col-span-1">
              <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Persona que Traslada</label>
              <input
                  v-model="form.traslada"
                  type="text"
                  placeholder="Nombre completo"
                  class="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Fecha Firma</label>
              <input
                  v-model="form.fechaTraslada"
                  type="date"
                  class="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <!-- Bloque Recibe -->
            <div class="md:col-span-1">
              <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Persona que Recibe</label>
              <input
                  v-model="form.recibe"
                  type="text"
                  placeholder="Nombre completo"
                  class="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Fecha Firma</label>
              <input
                  v-model="form.fechaRecibe"
                  type="date"
                  class="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <!-- Footer -->
          <div class="flex justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50">
            <button
                type="button"
                @click="close"
                class="px-5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-all"
            >
              Cancelar
            </button>

            <button
                type="button"
                @click="submit"
                :disabled="loading"
                class="px-6 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 disabled:opacity-60 transition-all flex items-center gap-2 shadow-lg shadow-blue-200"
            >
              <span v-if="loading" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              {{ loading ? 'Generando archivo...' : (tipo === 'excel' ? 'Descargar Excel' : 'Descargar PDF') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>