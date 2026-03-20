<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { X, Plus, Trash2, Save } from 'lucide-vue-next'
import type { CatalogoItem } from '../types/catalogo'
import type {
  EntradaArticuloDetalleRequest,
  EntradaArticuloRegistroRequest
} from '../types/entrada-articulo'

const props = defineProps<{
  open: boolean
  categorias: CatalogoItem[]
  unidades: CatalogoItem[]
  proveedores: CatalogoItem[]
  almacenes: CatalogoItem[]
  condiciones: CatalogoItem[]
  estadosEntrada: CatalogoItem[]
  usuarioId: number
  nombreUsuario: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', payload: EntradaArticuloRegistroRequest): void
}>()

const fechaActual = computed(() => {
  const hoy = new Date()
  const dia = String(hoy.getDate()).padStart(2, '0')
  const mes = String(hoy.getMonth() + 1).padStart(2, '0')
  const anio = hoy.getFullYear()
  return `${dia}/${mes}/${anio}`
})

const formEntrada = reactive({
  proveedor: 0,
  almacenDestino: 0,
  estadoEntrada: 0,
  observaciones: ''
})

const crearDetalleVacio = (): EntradaArticuloDetalleRequest => ({
  codigo: '',
  noSerie: '',
  descripcion: '',
  categoria: 0,
  unidadMedida: 0,
  cantidad: 1,
  ubicacion: '',
  precioCompra: 0,
  condicion: 0
})

const formDetalle = reactive<EntradaArticuloDetalleRequest>(crearDetalleVacio())
const detalles = ref<EntradaArticuloDetalleRequest[]>([])

const totalArticulos = computed(() => detalles.value.length)

const resetDetalle = () => {
  Object.assign(formDetalle, crearDetalleVacio())
  formDetalle.condicion = props.condiciones[0]?.id ?? 0
}

const resetEntrada = () => {
  formEntrada.proveedor = 0
  formEntrada.almacenDestino = 0
  formEntrada.estadoEntrada = props.estadosEntrada[0]?.id ?? 0
  formEntrada.observaciones = ''
}

const resetAll = () => {
  detalles.value = []
  resetEntrada()
  resetDetalle()
}

watch(
  () => props.open,
  (value) => {
    if (value) {
      console.log('categorias =>', props.categorias)
      console.log('unidades =>', props.unidades)
      console.log('proveedores =>', props.proveedores)
      console.log('almacenes =>', props.almacenes)
      console.log('condiciones =>', props.condiciones)
      console.log('estadosEntrada =>', props.estadosEntrada)
      resetAll()
    }
  }
)

const buscarNombre = (lista: CatalogoItem[], id: number) => {
  return lista.find(item => item.id === id)?.nombre ?? '-'
}

const validarDetalle = () => {
  if (!formDetalle.codigo.trim()) {
    alert('El código es obligatorio.')
    return false
  }
  if (!formDetalle.noSerie.trim()) {
    alert('El número de serie es obligatorio.')
    return false
  }
  if (!formDetalle.descripcion.trim()) {
    alert('La descripción es obligatoria.')
    return false
  }
  if (!formDetalle.categoria) {
    alert('Selecciona una categoría.')
    return false
  }
  if (!formDetalle.unidadMedida) {
    alert('Selecciona una unidad de medida.')
    return false
  }
  if (!formDetalle.cantidad || formDetalle.cantidad <= 0) {
    alert('La cantidad debe ser mayor a cero.')
    return false
  }
  if (!formDetalle.ubicacion.trim()) {
    alert('La ubicación es obligatoria.')
    return false
  }
  if (formDetalle.precioCompra < 0) {
    alert('El precio no puede ser negativo.')
    return false
  }
  if (!formDetalle.condicion) {
    alert('Selecciona una condición.')
    return false
  }
  return true
}

const validarEntrada = () => {
  if (!formEntrada.proveedor) {
    alert('Selecciona un proveedor.')
    return false
  }
  if (!formEntrada.almacenDestino) {
    alert('Selecciona un almacén destino.')
    return false
  }
  if (!formEntrada.estadoEntrada) {
    alert('Selecciona un estado.')
    return false
  }
  if (detalles.value.length === 0) {
    alert('Agrega al menos un artículo a la entrada.')
    return false
  }
  return true
}

const agregarDetalle = () => {
  if (!validarDetalle()) return

  detalles.value.push({
    codigo: formDetalle.codigo.trim(),
    noSerie: formDetalle.noSerie.trim(),
    descripcion: formDetalle.descripcion.trim(),
    categoria: Number(formDetalle.categoria),
    unidadMedida: Number(formDetalle.unidadMedida),
    cantidad: Number(formDetalle.cantidad),
    ubicacion: formDetalle.ubicacion.trim(),
    precioCompra: Number(formDetalle.precioCompra),
    condicion: Number(formDetalle.condicion)
  })

  resetDetalle()
}

const eliminarDetalle = (index: number) => {
  detalles.value.splice(index, 1)
}

const guardarEntrada = () => {
  if (!validarEntrada()) return

  emit('submit', {
    usuario: Number(props.usuarioId),
    proveedor: Number(formEntrada.proveedor),
    almacenDestino: Number(formEntrada.almacenDestino),
    estadoEntrada: Number(formEntrada.estadoEntrada),
    observaciones: formEntrada.observaciones.trim(),
    detalles: [...detalles.value]
  })
}

const close = () => emit('close')
</script>

<template>
  <teleport to="body">
    <div v-if="open" class="fixed inset-0 z-[9999]">
      <div class="absolute inset-0 bg-black/35 backdrop-blur-[1px]" @click="close"></div>

      <div class="absolute inset-0 flex items-center justify-center p-4">
        <div class="w-full max-w-7xl max-h-[95vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
          <div class="flex items-start justify-between px-6 py-5 border-b border-slate-200 bg-white">
            <div>
              <h2 class="text-xl font-semibold text-slate-900">Nueva Entrada de Artículos</h2>
              <p class="text-slate-500 mt-1 text-sm">
                Artículos agregados: {{ totalArticulos }}
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
            <div class="bg-slate-100/70 rounded-2xl border border-slate-200 p-5">
              <h3 class="text-base font-semibold text-slate-900 mb-5">Datos de la Entrada</h3>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label class="block text-sm font-medium text-slate-800 mb-2">Folio</label>
                  <input
                    type="text"
                    value="Se genera automáticamente"
                    disabled
                    class="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-2.5 text-sm text-slate-500"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-slate-800 mb-2">Fecha</label>
                  <input
                    type="text"
                    :value="fechaActual"
                    disabled
                    class="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-2.5 text-sm text-slate-500"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-slate-800 mb-2">Recibido por</label>
                  <input
                    type="text"
                    :value="nombreUsuario"
                    disabled
                    class="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-2.5 text-sm text-slate-500"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-slate-800 mb-2">Proveedor *</label>
                  <select
                    v-model.number="formEntrada.proveedor"
                    class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900"
                  >
                    <option :value="0" disabled>Seleccionar proveedor</option>
                    <option v-for="item in proveedores" :key="item.id" :value="item.id">
                      {{ item.nombre }}
                    </option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-slate-800 mb-2">Almacén destino *</label>
                  <select
                    v-model.number="formEntrada.almacenDestino"
                    class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900"
                  >
                    <option :value="0" disabled>Seleccionar almacén</option>
                    <option v-for="item in almacenes" :key="item.id" :value="item.id">
                      {{ item.nombre }}
                    </option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-slate-800 mb-2">Estado *</label>
                  <select
                    v-model.number="formEntrada.estadoEntrada"
                    class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900"
                  >
                    <option :value="0" disabled>Seleccionar estado</option>
                    <option v-for="item in estadosEntrada" :key="item.id" :value="item.id">
                      {{ item.nombre }}
                    </option>
                  </select>
                </div>

                <div class="md:col-span-3">
                  <label class="block text-sm font-medium text-slate-800 mb-2">Observaciones</label>
                  <textarea
                    v-model="formEntrada.observaciones"
                    rows="3"
                    class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none"
                  ></textarea>
                </div>
              </div>
            </div>

            <div class="bg-slate-100/70 rounded-2xl border border-slate-200 p-5">
              <h3 class="text-base font-semibold text-slate-900 mb-5">Agregar Artículo</h3>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label class="block text-sm font-medium text-slate-800 mb-2">Número de parte *</label>
                  <input
                    v-model="formDetalle.codigo"
                    type="text"
                    class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-slate-800 mb-2">No. Serie *</label>
                  <input
                    v-model="formDetalle.noSerie"
                    type="text"
                    class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-slate-800 mb-2">Cantidad *</label>
                  <input
                    v-model.number="formDetalle.cantidad"
                    type="number"
                    min="1"
                    class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900"
                  />
                </div>

                <div class="md:col-span-3">
                  <label class="block text-sm font-medium text-slate-800 mb-2">Descripción *</label>
                  <input
                    v-model="formDetalle.descripcion"
                    type="text"
                    class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-slate-800 mb-2">Categoría *</label>
                  <select
                    v-model.number="formDetalle.categoria"
                    class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900"
                  >
                    <option :value="0" disabled>Seleccionar categoría</option>
                    <option v-for="item in categorias" :key="item.id" :value="item.id">
                      {{ item.nombre }}
                    </option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-slate-800 mb-2">Unidad de medida *</label>
                  <select
                    v-model.number="formDetalle.unidadMedida"
                    class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900"
                  >
                    <option :value="0" disabled>Seleccionar unidad</option>
                    <option v-for="item in unidades" :key="item.id" :value="item.id">
                      {{ item.nombre }}
                    </option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-slate-800 mb-2">Condición *</label>
                  <select
                    v-model.number="formDetalle.condicion"
                    class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900"
                  >
                    <option :value="0" disabled>Seleccionar condición</option>
                    <option v-for="item in condiciones" :key="item.id" :value="item.id">
                      {{ item.nombre }}
                    </option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-slate-800 mb-2">Ubicación *</label>
                  <input
                    v-model="formDetalle.ubicacion"
                    type="text"
                    class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-slate-800 mb-2">Precio compra *</label>
                  <input
                    v-model.number="formDetalle.precioCompra"
                    type="number"
                    min="0"
                    step="0.01"
                    class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900"
                  />
                </div>
              </div>

              <div class="flex justify-end mt-5">
                <button
                  type="button"
                  @click="agregarDetalle"
                  class="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 hover:bg-slate-50 shadow-sm"
                >
                  <Plus class="w-4 h-4" />
                  Agregar Artículo a la Entrada
                </button>
              </div>
            </div>

            <div>
              <h3 class="text-base font-semibold text-slate-900 mb-4">
                Artículos Agregados ({{ totalArticulos }})
              </h3>

              <div
                v-if="detalles.length === 0"
                class="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center text-slate-500 text-sm"
              >
                Aún no has agregado artículos a la entrada.
              </div>

              <div v-else class="space-y-3">
                <div
                  v-for="(item, index) in detalles"
                  :key="`${item.codigo}-${index}`"
                  class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div class="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                    <div>
                      <p class="text-slate-500 text-xs">Número de parte:</p>
                      <p class="text-sm font-semibold text-slate-900 mt-1">{{ item.codigo }}</p>
                    </div>

                    <div>
                      <p class="text-slate-500 text-xs">No. Serie:</p>
                      <p class="text-sm font-semibold text-slate-900 mt-1">{{ item.noSerie }}</p>
                    </div>

                    <div>
                      <p class="text-slate-500 text-xs">Descripción:</p>
                      <p class="text-sm font-semibold text-slate-900 mt-1 break-words">{{ item.descripcion }}</p>
                    </div>

                    <div class="flex justify-end">
                      <button
                        type="button"
                        @click="eliminarDetalle(index)"
                        class="p-2 rounded-lg text-red-500 hover:bg-red-50"
                      >
                        <Trash2 class="w-4 h-4" />
                      </button>
                    </div>

                    <div>
                      <p class="text-slate-500 text-xs">Cantidad:</p>
                      <p class="text-sm font-semibold text-slate-900 mt-1">{{ item.cantidad }}</p>
                    </div>

                    <div>
                      <p class="text-slate-500 text-xs">Precio:</p>
                      <p class="text-sm font-semibold text-slate-900 mt-1">${{ item.precioCompra }}</p>
                    </div>

                    <div>
                      <p class="text-slate-500 text-xs">Ubicación:</p>
                      <p class="text-sm font-semibold text-slate-900 mt-1">{{ item.ubicacion }}</p>
                    </div>

                    <div>
                      <p class="text-slate-500 text-xs">Categoría:</p>
                      <p class="text-sm font-semibold text-slate-900 mt-1">
                        {{ buscarNombre(categorias, item.categoria) }}
                      </p>
                    </div>

                    <div>
                      <p class="text-slate-500 text-xs">Unidad:</p>
                      <p class="text-sm font-semibold text-slate-900 mt-1">
                        {{ buscarNombre(unidades, item.unidadMedida) }}
                      </p>
                    </div>

                    <div>
                      <p class="text-slate-500 text-xs">Condición:</p>
                      <p class="text-sm font-semibold text-slate-900 mt-1">
                        {{ buscarNombre(condiciones, item.condicion) }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-white">
            <p class="text-sm text-slate-500">
              {{
                totalArticulos === 0
                  ? 'Agrega al menos un artículo para guardar la entrada'
                  : `${totalArticulos} artículos listos para registrar`
              }}
            </p>

            <div class="flex items-center gap-3">
              <button
                type="button"
                @click="close"
                class="px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm font-medium hover:bg-slate-50"
              >
                Cancelar
              </button>

              <button
                type="button"
                @click="guardarEntrada"
                class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0f172a] text-white text-sm font-medium hover:bg-slate-800"
              >
                <Save class="w-4 h-4" />
                Guardar Entrada Completa
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>