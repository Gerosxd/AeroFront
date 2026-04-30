<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import { X } from 'lucide-vue-next'
import type {
  EntradaArticuloRegistroResponse,
  EntradaArticuloExportRequest
} from '../types/entrada-articulo'

const props = defineProps<{
  open: boolean
  entrada: EntradaArticuloRegistroResponse | null
  tipo: 'excel' | 'pdf'
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'confirm', payload: EntradaArticuloExportRequest): void
}>()

// Helper para obtener la fecha actual
const hoy = computed(() => {
  const d = new Date()
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
})

// Estado del formulario reactivo
const form = reactive<EntradaArticuloExportRequest>({
  encargadoAlmacen: '',
  fechaEncargado: '',
  traslada: '',
  fechaTraslada: '',
  recibe: '',
  fechaRecibe: ''
})

// Jalar datos automáticamente al abrir el modal
watch(
    () => props.open,
    (open) => {
      if (!open) return

      // Jalamos los nombres si existen en el objeto entrada, si no, vacío
      form.encargadoAlmacen = props.entrada?.encargadoAlmacen || ''
      form.fechaEncargado = hoy.value

      form.traslada = props.entrada?.traslada || ''
      form.fechaTraslada = hoy.value

      form.recibe = props.entrada?.recibe || ''
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
      <!-- Overlay con desenfoque (Idéntico al de Salidas) -->
      <div class="absolute inset-0 bg-black/40 backdrop-blur-[2px]" @click="close"></div>

      <div class="absolute inset-0 flex items-center justify-center p-4">
        <!-- Contenedor con scroll por si la pantalla es pequeña -->
        <div class="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-200">

          <!-- Header (Estilo Salidas) -->
          <div class="sticky top-0 z-10 flex items-start justify-between px-6 py-5 border-b border-slate-200 bg-white">
            <div>
              <h3 class="text-lg font-bold text-slate-900">
                {{ tipo === 'excel' ? 'Exportar a Excel' : 'Exportar a PDF' }}
              </h3>
              <p class="text-sm text-slate-500 mt-1">
                Captura los datos de responsables para la entrada: <span class="font-semibold text-blue-600">{{ entrada?.folio }}</span>
              </p>
            </div>

            <button
                class="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
                @click="close"
            >
              <X class="w-5 h-5" />
            </button>
          </div>

          <!-- Body - Grid de 2 columnas -->
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

          <!-- Footer (Sticky al fondo) -->
          <div class="sticky bottom-0 flex justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50">
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