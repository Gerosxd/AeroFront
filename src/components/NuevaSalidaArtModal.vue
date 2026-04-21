<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { Search, Trash2, X } from 'lucide-vue-next'
import http from '../api/http'

interface ArticuloBusqueda {
  idArticulo: number | string
  noParte: string
  descripcion: string
  noSerie: string
  condicion: string
  stock: number
}

interface ArticuloSeleccionado extends ArticuloBusqueda {
  cantidad: number
  observaciones: string
}

export interface PayloadNuevaSalidaArtDetalle {
  idArticulo: number
  cantidad: number
  observaciones: string
}

export interface PayloadNuevaSalidaArt {
  fecha: string
  noSalida: string
  destinatario: string
  direccionDestinatario: string
  encargadoAlmacen: string
  traslada: string
  recibe: string
  detalles: PayloadNuevaSalidaArtDetalle[]
}

const props = defineProps<{
  open: boolean
  inventario?: ArticuloBusqueda[]
  entrada: any
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'created', payload: PayloadNuevaSalidaArt): void
}>()

const today = () => {
  // YYYY-MM-DD en hora local
  const d = new Date()
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

const form = reactive({
  fecha: today(),
  noSalida: '',
  destinatario: '',
  direccionDestinatario: '',
  encargadoAlmacen: '',
  traslada: '',
  recibe: ''
})

const terminoNoParte = ref('')
const terminoNoSerie = ref('')
const resultados = ref<ArticuloBusqueda[]>([])
const cargando = ref(false)
const guardando = ref(false)
const seleccionados = reactive<ArticuloSeleccionado[]>([])

const resetAll = () => {
  form.fecha = today()
  form.noSalida = ''
  form.destinatario = ''
  form.direccionDestinatario = ''
  form.encargadoAlmacen = ''
  form.traslada = ''
  form.recibe = ''
  terminoNoParte.value = ''
  terminoNoSerie.value = ''
  resultados.value = []
  seleccionados.splice(0, seleccionados.length)
  cargando.value = false
  guardando.value = false
}

watch(
  () => props.open,
  (value) => {
    if (value) resetAll()
  }
)

let debounceId: ReturnType<typeof setTimeout> | undefined
watch([terminoNoParte, terminoNoSerie], ([noParte, noSerie]) => {
  if (debounceId) clearTimeout(debounceId)
  debounceId = setTimeout(() => {
    void buscarArticulos(noParte, noSerie)
  }, 250)
})

const buscarArticulos = async (noParteRaw?: string, noSerieRaw?: string) => {
  const noParte = (noParteRaw ?? terminoNoParte.value).trim()
  const noSerie = (noSerieRaw ?? terminoNoSerie.value).trim()

  if (noParte.length < 2 && noSerie.length < 2) {
    resultados.value = []
    return
  }

  // Preferimos búsqueda local si el inventario fue inyectado desde la vista.
  if (props.inventario && props.inventario.length) {
    const np = noParte.toLowerCase()
    const ns = noSerie.toLowerCase()
    resultados.value = props.inventario
      .filter(a => {
        const matchNP = np.length >= 2 ? a.noParte.toLowerCase().includes(np) : true
        const matchNS = ns.length >= 2 ? a.noSerie.toLowerCase().includes(ns) : true
        return matchNP && matchNS
      })
      .slice(0, 30)
    return
  }

  // Fallback al backend (si existe endpoint); enviamos ambos términos compactados.
  const termino = [noParte, noSerie].filter(Boolean).join(' ').trim()
  if (termino.length < 2) {
    resultados.value = []
    return
  }

  cargando.value = true
  try {
    const { data } = await http.get<any[]>('/api/articulos/buscar', {
      params: { termino }
    })
    const normalizados: ArticuloBusqueda[] = Array.isArray(data)
      ? data.map((item: any) => ({
        idArticulo: item.idArticulo,
        noParte: String(item.noParte ?? item.numeroParte ?? item.partNumber ?? ''),
        descripcion: String(item.descripcion ?? ''),
        noSerie: String(item.noSerie ?? ''),
        condicion: String(item.condicionNombre ?? item.condicionTexto ?? item.condicion ?? ''),
        stock: Number(item.stock ?? 0),
      }))
      : []
    resultados.value = normalizados
  } catch (error) {
    console.error('Error en búsqueda', error)
    resultados.value = []
  } finally {
    cargando.value = false
  }
}

const agregarArticulo = (art: ArticuloBusqueda) => {
  if (art.stock <= 0) {
    alert('No hay stock disponible para este artículo.')
    return
  }

  const existe = seleccionados.find(a => a.idArticulo === art.idArticulo)

  if (existe) {
    existe.cantidad = Math.min(existe.cantidad + 1, existe.stock)
    terminoNoParte.value = ''
    terminoNoSerie.value = ''
    resultados.value = []
    return
  }

  seleccionados.push({
    ...art,
    cantidad: 1,
    observaciones: ''
  })

  terminoNoParte.value = ''
  terminoNoSerie.value = ''
  resultados.value = []
}

const eliminarArticulo = (id: number | string) => {
  const idx = seleccionados.findIndex(a => a.idArticulo === id)
  if (idx >= 0) seleccionados.splice(idx, 1)
}

const close = () => emit('close')

const canGenerate = computed(() => {
  if (guardando.value) return false
  if (seleccionados.length === 0) return false
  return true
})

const validarFormulario = () => {
  if (!form.fecha.trim()) {
    alert('La fecha es obligatoria.')
    return false
  }
  if (!form.noSalida.trim()) {
    alert('El No. de salida es obligatorio.')
    return false
  }
  if (!form.destinatario.trim()) {
    alert('El destinatario es obligatorio.')
    return false
  }
  if (!form.direccionDestinatario.trim()) {
    alert('La dirección es obligatoria.')
    return false
  }
  if (!form.encargadoAlmacen.trim()) {
    alert('El encargado de almacén es obligatorio.')
    return false
  }
  if (!form.traslada.trim()) {
    alert('Quién traslada es obligatorio.')
    return false
  }
  if (!form.recibe.trim()) {
    alert('Quién recibe es obligatorio.')
    return false
  }
  if (seleccionados.length === 0) {
    alert('Agrega al menos un artículo a la salida.')
    return false
  }

  const invalido = seleccionados.find(a => !Number.isFinite(a.cantidad) || a.cantidad < 1)
  if (invalido) {
    alert('La cantidad debe ser mayor o igual a 1.')
    return false
  }

  const excedido = seleccionados.find(a => a.cantidad > a.stock)
  if (excedido) {
    alert('La cantidad no puede exceder el stock.')
    return false
  }

  return true
}

const generarSalida = async () => {
  if (!validarFormulario()) return

  guardando.value = true
  try {
    const detalles: PayloadNuevaSalidaArtDetalle[] = seleccionados.map(a => {
      const id = Number(a.idArticulo)
      if (!Number.isFinite(id) || id <= 0) {
        throw new Error('ID de artículo inválido.')
      }
      return {
        idArticulo: id,
        cantidad: Number(a.cantidad),
        observaciones: String(a.observaciones ?? '').trim()
      }
    })

    const payload: PayloadNuevaSalidaArt = {
      fecha: form.fecha.trim(),
      noSalida: form.noSalida.trim(),
      destinatario: form.destinatario.trim(),
      direccionDestinatario: form.direccionDestinatario.trim(),
      encargadoAlmacen: form.encargadoAlmacen.trim(),
      traslada: form.traslada.trim(),
      recibe: form.recibe.trim(),
      detalles
    }

    await http.post('/api/salidas', payload)
    emit('created', payload)
    resetAll()
    close()
  } catch (error) {
    console.error('Error al generar salida', error)
    alert('No se pudo generar la salida. Revisa la conexión o intenta más tarde.')
  } finally {
    guardando.value = false
  }
}
</script>

<template>
  <teleport to="body">
    <div v-if="props.open" class="fixed inset-0 z-[9999]">
      <div class="absolute inset-0 bg-black/35 backdrop-blur-[1px]" @click="close"></div>

      <div class="absolute inset-0 flex items-center justify-center p-4">
        <div class="w-full max-w-5xl max-h-[92vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
          <div class="flex items-start justify-between px-6 py-5 border-b border-slate-200 bg-white">
            <div>
              <h2 class="text-xl font-semibold text-slate-900">Generar salida de artículos</h2>
              <p class="text-slate-500 mt-1 text-sm">Selecciona artículos y captura los datos del destinatario</p>
            </div>

            <button type="button" class="p-2 rounded-lg hover:bg-slate-100 text-slate-700" @click="close">
              <X class="w-5 h-5" />
            </button>
          </div>

          <div class="flex-1 overflow-y-auto px-6 py-6 bg-slate-50 space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-slate-800 mb-2">Fecha *</label>
                <input
                  v-model="form.fecha"
                  type="date"
                  class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm disabled:bg-slate-100"
                  disabled
                />
                <p class="text-xs text-slate-500 mt-1">Se usa la fecha del día.</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-800 mb-2">No. de salida *</label>
                <input
                  v-model="form.noSalida"
                  type="text"
                  class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm"
                  placeholder="Ej. SAL-000123"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-slate-800 mb-2">Destinatario *</label>
                <input v-model="form.destinatario" type="text" class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm" />
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-800 mb-2">Dirección *</label>
                <input v-model="form.direccionDestinatario" type="text" class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm" />
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-800 mb-2">Encargado almacén *</label>
                <input v-model="form.encargadoAlmacen" type="text" class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm" />
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-800 mb-2">Quién traslada *</label>
                <input v-model="form.traslada" type="text" class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm" />
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-800 mb-2">Quién recibe *</label>
                <input v-model="form.recibe" type="text" class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm" />
              </div>
            </div>

            <div class="space-y-2">
              <h3 class="text-sm font-semibold text-slate-900">Buscar artículo</h3>

              <div class="flex gap-3 items-start">
                <div class="relative flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div class="relative">
                    <input
                      v-model="terminoNoParte"
                      type="text"
                      placeholder="Buscar por No. parte..."
                      class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm pr-10"
                      @keydown.enter.prevent="buscarArticulos()"
                    />
                    <div class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                      <Search class="w-4 h-4" />
                    </div>
                  </div>

                  <div class="relative">
                    <input
                      v-model="terminoNoSerie"
                      type="text"
                      placeholder="Buscar por No. serie..."
                      class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm pr-10"
                      @keydown.enter.prevent="buscarArticulos()"
                    />
                    <div class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                      <Search class="w-4 h-4" />
                    </div>
                  </div>

                  <div v-if="terminoNoParte.trim().length >= 2 || terminoNoSerie.trim().length >= 2" class="absolute left-0 right-0 mt-28 z-10">
                    <div class="rounded-xl border border-slate-200 bg-white shadow-lg overflow-hidden">
                      <div v-if="cargando" class="px-4 py-3 text-sm text-slate-500">Buscando...</div>
                      <div v-else-if="resultados.length === 0" class="px-4 py-3 text-sm text-slate-500">Sin resultados</div>

                      <button
                        v-for="art in resultados"
                        :key="String(art.idArticulo)"
                        type="button"
                        class="w-full text-left px-4 py-3 hover:bg-slate-50 flex items-start justify-between gap-4"
                        @click="agregarArticulo(art)"
                      >
                        <div>
                          <div class="text-sm font-semibold text-slate-900">{{ art.noParte }}</div>
                          <div class="text-xs text-slate-500 mt-0.5">
                            {{ art.descripcion }}
                            <span class="text-slate-300">|</span>
                            Serie: {{ art.noSerie }}
                            <span class="text-slate-300">|</span>
                            Condición: {{ art.condicion || '-' }}
                          </div>
                        </div>
                        <div class="text-xs text-slate-500 whitespace-nowrap">Stock: {{ art.stock }}</div>
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0f172a] text-white text-sm font-medium hover:bg-slate-800"
                  @click="buscarArticulos()"
                >
                  <Search class="w-4 h-4" />
                  Buscar
                </button>
              </div>

              <p class="text-xs text-slate-500">Tip: puedes buscar por No. parte, No. serie, o ambos (mín. 2 caracteres).</p>
            </div>

            <div v-if="seleccionados.length" class="space-y-3">
              <h3 class="text-sm font-semibold text-slate-900">Artículos en salida</h3>

              <div class="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
                <table class="w-full text-sm">
                  <thead class="bg-slate-50 text-slate-700">
                    <tr>
                      <th class="text-left p-3 font-semibold">No. parte</th>
                      <th class="text-left p-3 font-semibold">Descripción</th>
                      <th class="text-left p-3 font-semibold">No. serie</th>
                      <th class="text-left p-3 font-semibold">Condición</th>
                      <th class="text-left p-3 font-semibold">QTY</th>
                      <th class="text-left p-3 font-semibold">Observaciones</th>
                      <th class="p-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="art in seleccionados" :key="art.idArticulo" class="border-t border-slate-200">
                      <td class="p-3 font-medium text-slate-900">{{ art.noParte }}</td>
                      <td class="p-3 text-slate-700">{{ art.descripcion }}</td>
                      <td class="p-3 text-slate-700">{{ art.noSerie }}</td>
                      <td class="p-3 text-slate-700">{{ art.condicion || '-' }}</td>
                      <td class="p-3">
                        <input
                          v-model.number="art.cantidad"
                          type="number"
                          min="1"
                          :max="art.stock"
                          class="w-24 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
                        />
                      </td>
                      <td class="p-3">
                        <input
                          v-model="art.observaciones"
                          type="text"
                          class="w-full min-w-[220px] rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
                        />
                      </td>
                      <td class="p-3 text-right">
                        <button
                          type="button"
                          class="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50"
                          @click="eliminarArticulo(art.idArticulo)"
                        >
                          <Trash2 class="w-4 h-4" />
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div v-else class="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600">
              Aún no hay artículos seleccionados.
            </div>
          </div>

          <div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-white">
            <button
              type="button"
              class="px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-sm font-medium hover:bg-slate-50"
              @click="close"
            >
              Cancelar
            </button>

            <button
              type="button"
              class="px-4 py-2.5 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed"
              :disabled="!canGenerate"
              @click="generarSalida"
            >
              {{ guardando ? 'Generando...' : 'Generar salida' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>
