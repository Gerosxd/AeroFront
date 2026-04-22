<script setup lang="ts">
import { computed, ref } from 'vue'
import { X, Download, FileText } from 'lucide-vue-next'
import type {
  EntradaArticuloRegistroResponse,
  EntradaArticuloExportRequest
} from '../types/entrada-articulo'
import { exportarEntradaExcel, exportarEntradaPdf } from '../services/entrada-articulo.service'
import ExportarEntradaModal from './ExportarEntradaModal.vue'

const props = defineProps<{
  open: boolean
  entrada: EntradaArticuloRegistroResponse | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const totalArticulos = computed(() => props.entrada?.detalles.length ?? 0)

const openExportModal = ref(false)
const tipoExportacion = ref<'excel' | 'pdf'>('excel')
const exportando = ref(false)
const errorExport = ref('')

const close = () => emit('close')

const abrirExportacion = (tipo: 'excel' | 'pdf') => {
  tipoExportacion.value = tipo
  errorExport.value = ''
  openExportModal.value = true
}

const cerrarExportacion = () => {
  openExportModal.value = false
}

const confirmarExportacion = async (payload: EntradaArticuloExportRequest) => {
  if (!props.entrada?.idEntrada) return

  exportando.value = true
  errorExport.value = ''

  try {
    if (tipoExportacion.value === 'excel') {
      await exportarEntradaExcel(props.entrada.idEntrada, payload, props.entrada.folio)
    } else {
      await exportarEntradaPdf(props.entrada.idEntrada, payload, props.entrada.folio)
    }

    openExportModal.value = false
  } catch (error) {
    console.error('Error al exportar:', error)
    errorExport.value = `No se pudo exportar la entrada en ${tipoExportacion.value.toUpperCase()}.`
  } finally {
    exportando.value = false
  }
}
</script>

<template>
  <teleport to="body">
    <div v-if="open && entrada" class="fixed inset-0 z-[9999]">
      <div class="absolute inset-0 bg-black/35 backdrop-blur-[1px]" @click="close"></div>

      <div class="absolute inset-0 flex items-center justify-center p-4">
        <div class="w-full max-w-6xl max-h-[94vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
          <div class="flex items-start justify-between px-6 py-5 border-b border-slate-200 bg-white">
            <div>
              <h2 class="text-xl font-semibold text-slate-900">Detalle de Entrada</h2>
              <p class="text-slate-500 mt-1 text-sm">
                {{ entrada.folio }} · Artículos: {{ totalArticulos }}
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

          <div class="flex-1 overflow-y-auto px-5 py-5 bg-slate-50 space-y-6">
            <div class="bg-white rounded-2xl border border-slate-200 p-5">
              <h3 class="text-base font-semibold text-slate-900 mb-5">Datos Generales</h3>

              <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <p class="text-slate-500 text-xs">Folio</p>
                  <p class="text-sm font-semibold text-slate-900 mt-1">{{ entrada.folio }}</p>
                </div>

                <div>
                  <p class="text-slate-500 text-xs">Fecha</p>
                  <p class="text-sm font-semibold text-slate-900 mt-1">{{ entrada.fechaEntrada }}</p>
                </div>

                <div>
                  <p class="text-slate-500 text-xs">Proveedor</p>
                  <p class="text-sm font-semibold text-slate-900 mt-1">{{ entrada.proveedor }}</p>
                </div>

                <div>
                  <p class="text-slate-500 text-xs">Almacén destino</p>
                  <p class="text-sm font-semibold text-slate-900 mt-1">{{ entrada.almacenDestino }}</p>
                </div>

                <div>
                  <p class="text-slate-500 text-xs">Estado</p>
                  <p class="text-sm font-semibold text-slate-900 mt-1">{{ entrada.estado }}</p>
                </div>

                <div>
                  <p class="text-slate-500 text-xs">Recibido por</p>
                  <p class="text-sm font-semibold text-slate-900 mt-1">{{ entrada.recibidoPor }}</p>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div class="px-5 py-4 border-b border-slate-200">
                <h3 class="text-base font-semibold text-slate-900">Artículos de la Entrada</h3>
              </div>

              <div class="overflow-x-auto">
                <table class="w-full text-left">
                  <thead class="text-slate-500 text-xs uppercase border-b">
                    <tr>
                      <th class="px-5 py-4">ID Artículo</th>
                      <th class="px-5 py-4">Número de parte</th>
                      <th class="px-5 py-4">Descripción</th>
                      <th class="px-5 py-4">Cantidad</th>
                      <th class="px-5 py-4">Ubicación</th>
                      <th class="px-5 py-4">Precio Unitario</th>
                    </tr>
                  </thead>

                  <tbody class="divide-y">
                    <tr v-for="item in entrada.detalles" :key="item.idArticulo">
                      <td class="px-5 py-4 text-sm">{{ item.idArticulo }}</td>
                      <td class="px-5 py-4 text-sm font-medium">{{ item.codigo }}</td>
                      <td class="px-5 py-4 text-sm">{{ item.descripcion }}</td>
                      <td class="px-5 py-4 text-sm">{{ item.cantidad }}</td>
                      <td class="px-5 py-4 text-sm">{{ item.ubicacion }}</td>
                      <td class="px-5 py-4 text-sm">${{ item.precioUnitario }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div
              v-if="errorExport"
              class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {{ errorExport }}
            </div>
          </div>

          <div class="flex flex-wrap justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-white">
            <button
              type="button"
              @click="abrirExportacion('pdf')"
              class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-700"
            >
              <FileText class="w-4 h-4" />
              Exportar PDF
            </button>

            <button
              type="button"
              @click="abrirExportacion('excel')"
              class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700"
            >
              <Download class="w-4 h-4" />
              Exportar Excel
            </button>

            <button
              type="button"
              @click="close"
              class="px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm font-medium hover:bg-slate-50"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  </teleport>

  <ExportarEntradaModal
    :open="openExportModal"
    :entrada="entrada"
    :tipo="tipoExportacion"
    :loading="exportando"
    @close="cerrarExportacion"
    @confirm="confirmarExportacion"
  />
</template>