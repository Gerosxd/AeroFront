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

const hoy = computed(() => {
  const d = new Date()
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
})

const form = reactive<EntradaArticuloExportRequest>({
  encargadoAlmacen: '',
  fechaEncargado: '',
  traslada: '',
  fechaTraslada: '',
  recibe: '',
  fechaRecibe: ''
})

watch(
  () => props.open,
  (open) => {
    if (!open) return

    form.encargadoAlmacen = ''
    form.fechaEncargado = hoy.value
    form.traslada = ''
    form.fechaTraslada = hoy.value
    form.recibe = ''
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
      <div class="absolute inset-0 bg-black/40" @click="close"></div>

      <div class="absolute inset-0 flex items-center justify-center p-4">
        <div class="w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
          <div class="flex items-start justify-between px-6 py-5 border-b border-slate-200">
            <div>
              <h3 class="text-lg font-semibold text-slate-900">
                {{ tipo === 'excel' ? 'Exportar Excel' : 'Exportar PDF' }}
              </h3>
              <p class="text-sm text-slate-500 mt-1">
                Captura los datos de firmas para {{ entrada?.folio || 'la entrada' }}
              </p>
            </div>

            <button
              class="p-2 rounded-lg hover:bg-slate-100 text-slate-700"
              @click="close"
              aria-label="Cerrar"
            >
              <X class="w-5 h-5" />
            </button>
          </div>

          <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-slate-700 mb-1">Encargado de almacén</label>
              <input
                v-model="form.encargadoAlmacen"
                type="text"
                class="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Fecha encargado</label>
              <input
                v-model="form.fechaEncargado"
                type="date"
                class="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-slate-700 mb-1">Traslada</label>
              <input
                v-model="form.traslada"
                type="text"
                class="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Fecha traslada</label>
              <input
                v-model="form.fechaTraslada"
                type="date"
                class="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-slate-700 mb-1">Recibe</label>
              <input
                v-model="form.recibe"
                type="text"
                class="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Fecha recibe</label>
              <input
                v-model="form.fechaRecibe"
                type="date"
                class="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div class="flex justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-white">
            <button
              type="button"
              @click="close"
              class="px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm font-medium hover:bg-slate-50"
            >
              Cancelar
            </button>

            <button
              type="button"
              @click="submit"
              :disabled="loading"
              class="px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-60"
            >
              {{ loading ? 'Exportando...' : (tipo === 'excel' ? 'Exportar Excel' : 'Exportar PDF') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>