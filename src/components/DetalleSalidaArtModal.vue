<script setup lang="ts">
import { X, Printer, FileDown } from 'lucide-vue-next'
import { exportarSalidaExcel, exportarSalidaPdf } from '../services/salida-articulo.service'


const openExportModal = ref(false)
const tipoExportacion = ref<'excel' | 'pdf'>('excel')
const exportando = ref(false)

const abrirExportacion = (tipo: 'excel' | 'pdf') => {
  tipoExportacion.value = tipo
  openExportModal.value = true [cite, 1897]
}



const props = defineProps<{
  open: boolean
  salida: any
}>()



const emit = defineEmits(['close'])
</script>

<template>
  <teleport to="body">
    <div v-if="open" class="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/35 backdrop-blur-[1px]" @click="emit('close')"></div>

      <div class="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        <div class="flex items-start justify-between px-6 py-4 border-b bg-white">
          <div>
            <h2 class="text-xl font-bold text-slate-900">Detalle de Salida</h2>
            <p class="text-sm text-gray-500">
              {{ salida?.noSalida }} · Artículos: {{ salida?.articulos?.length || 0 }}
            </p>
          </div>
          <button @click="emit('close')" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X class="w-5 h-5 text-slate-500"/>
          </button>
        </div>

        <div class="p-6 overflow-y-auto max-h-[70vh] space-y-6 bg-white">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-6 bg-slate-50 p-5 rounded-xl border border-slate-200">
            <div><p class="text-xs text-gray-500 uppercase font-bold mb-1">Destinatario</p><p class="font-medium text-slate-900">{{ salida?.destinatario }}</p></div>
            <div><p class="text-xs text-gray-500 uppercase font-bold mb-1">Fecha</p><p class="font-medium text-slate-900">{{ salida?.fecha }}</p></div>
            <div><p class="text-xs text-gray-500 uppercase font-bold mb-1">Traslada</p><p class="font-medium text-slate-900">{{ salida?.traslada }}</p></div>
            <div><p class="text-xs text-gray-500 uppercase font-bold mb-1">Recibe</p><p class="font-medium text-slate-900">{{ salida?.recibe }}</p></div>
          </div>

          <div class="border border-slate-200 rounded-xl overflow-hidden">
            <table class="w-full text-left border-collapse">
              <thead class="bg-slate-50 text-xs uppercase text-slate-500 border-b border-slate-200">
              <tr>
                <th class="px-4 py-3 font-semibold">No. Parte</th>
                <th class="px-4 py-3 font-semibold">Descripción</th>
                <th class="px-4 py-3 text-center font-semibold">Cantidad</th>
                <th class="px-4 py-3 font-semibold">Observaciones</th>
              </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
              <tr v-for="item in salida?.articulos" :key="item.idArticulo" class="hover:bg-slate-50/50">
                <td class="px-4 py-3 text-sm font-medium text-slate-700">{{ item.codigo }}</td>
                <td class="px-4 py-3 text-sm text-slate-600">{{ item.descripcion }}</td>
                <td class="px-4 py-3 text-sm text-center font-bold text-slate-900">{{ item.cantidad }}</td>
                <td class="px-4 py-3 text-sm italic text-slate-400">{{ item.observaciones || '-' }}</td>
              </tr>
              <tr v-if="!salida?.articulos?.length">
                <td colspan="4" class="px-4 py-8 text-center text-sm text-slate-500">
                  No hay artículos registrados en esta salida.
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="px-6 py-4 border-t bg-slate-50 flex justify-end gap-3">
          <button @click="abrirExportacion('pdf')" class="...">
            Exportar PDF
          </button>
          <button @click="abrirExportacion('excel')" class="...">
            Exportar Excel
          </button> [cite: 1914, 1916]
          <button @click="emit('close')" class="px-4 py-2 border border-slate-300 bg-white rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </teleport>
</template>