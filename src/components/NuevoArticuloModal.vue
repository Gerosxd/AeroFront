<script setup lang="ts">
import { reactive, computed, watch } from 'vue'
import { X, Plus, Trash2, Save } from 'lucide-vue-next'
import type { CatalogoItem, Catalogos } from '../services/catalogo.service'
import type { PayloadNuevoArticuloBackend } from '../services/articulo.service'

type CondicionTexto = 'Nuevo' | 'Reparado' | 'Overhaul' | 'Reacondicionado'

interface ArticuloPreview {
  noParte: string
  codigo: string
  noSerie: string
  descripcion: string
  categoria: number
  unidadMedida: number
  stock: number
  almacen: number
  ubicacion: string
  proveedor: number
  precioCompra: number
  moneda: String
  condicion: number
}

const props = defineProps<{
  open: boolean
  catalogos: Catalogos
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', payload: PayloadNuevoArticuloBackend[]): void
}>()

const crearArticuloVacio = (): ArticuloPreview => ({
  noParte: '',
  codigo: '',
  noSerie: '',
  descripcion: '',
  categoria: 0,
  unidadMedida: 0,
  stock: 0,
  almacen: 0,
  ubicacion: '',
  proveedor: 0,
  precioCompra: 0,
  moneda: 'MXN',
  condicion: 0,
})

const form = reactive<ArticuloPreview>(crearArticuloVacio())
const articulosAgregados = reactive<ArticuloPreview[]>([])

const totalArticulos = computed(() => articulosAgregados.length)

const buscarNombre = (lista: CatalogoItem[], id: number) => {
  return lista.find((item) => item.id === id)?.nombre ?? '-'
}

const condicionTexto = (id: number): CondicionTexto | '-' => {
  const nombre = buscarNombre(props.catalogos.condiciones, id)
  if (
    nombre === 'Nuevo' ||
    nombre === 'Reparado' ||
    nombre === 'Overhaul' ||
    nombre === 'Reacondicionado'
  ) {
    return nombre
  }
  return '-'
}

const resetForm = () => {
  Object.assign(form, {
    noParte: '',
    codigo: '',
    noSerie: '',
    descripcion: '',
    categoria: 0,
    unidadMedida: 0,
    stock: 0,
    almacen: 0,
    ubicacion: '',
    proveedor: 0,
    precioCompra: 0,
    condicion: props.catalogos.condiciones[0]?.id ?? 0,
  })
}

const resetAll = () => {
  articulosAgregados.splice(0, articulosAgregados.length)
  resetForm()
}

watch(
  () => props.open,
  (value) => {
    if (value) resetAll()
  }
)

const close = () => emit('close')

const validarFormulario = () => {
  if (!form.noParte.trim()) {
    alert('El No. parte es obligatorio.')
    return false
  }
  if (!form.codigo.trim()) {
    alert('El código es obligatorio.')
    return false
  }
  if (!form.noSerie.trim()) {
    alert('El número de serie es obligatorio.')
    return false
  }
  if (!form.descripcion.trim()) {
    alert('La descripción es obligatoria.')
    return false
  }
  if (!form.categoria) {
    alert('Selecciona una categoría.')
    return false
  }
  if (!form.unidadMedida) {
    alert('Selecciona una unidad de medida.')
    return false
  }
  if (!form.almacen) {
    alert('Selecciona un almacén.')
    return false
  }
  if (!form.proveedor) {
    alert('Selecciona un proveedor.')
    return false
  }
  if (!form.condicion) {
    alert('Selecciona una condición.')
    return false
  }
  if (form.stock < 0) {
    alert('El stock no puede ser negativo.')
    return false
  }
  if (form.precioCompra < 0) {
    alert('El precio no puede ser negativo.')
    return false
  }
  return true
}

const agregarArticulo = () => {
  if (!validarFormulario()) return

  articulosAgregados.push({
    noParte: form.noParte.trim(),
    codigo: form.codigo.trim(),
    noSerie: form.noSerie.trim(),
    descripcion: form.descripcion.trim(),
    categoria: Number(form.categoria),
    unidadMedida: Number(form.unidadMedida),
    stock: Number(form.stock),
    almacen: Number(form.almacen),
    ubicacion: form.ubicacion.trim(),
    proveedor: Number(form.proveedor),
    precioCompra: Number(form.precioCompra),
    condicion: Number(form.condicion),
  })

  resetForm()
}

const eliminarArticulo = (index: number) => {
  articulosAgregados.splice(index, 1)
}

const guardarTodos = () => {
  if (articulosAgregados.length === 0) {
    alert('Agrega al menos un artículo a la lista.')
    return
  }

  emit('submit', [...articulosAgregados])
}
</script>

<template>
  <teleport to="body">
    <div v-if="open" class="fixed inset-0 z-[9999]">
      <div class="absolute inset-0 bg-black/35 backdrop-blur-[1px]" @click="close"></div>

      <div class="absolute inset-0 flex items-center justify-center p-4">
        <div class="w-full max-w-6xl max-h-[94vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
          <div class="flex items-start justify-between px-6 py-5 border-b border-slate-200 bg-white">
            <div>
              <h2 class="text-xl font-semibold text-slate-900">Nuevo Componente / Parte</h2>
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

          <div class="flex-1 overflow-y-auto px-5 py-5 bg-slate-50">
            <div class="bg-slate-100/70 rounded-2xl border border-slate-200 p-5">
              <h3 class="text-base font-semibold text-slate-900 mb-5">Datos del Componente / Parte</h3>

              <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label class="block text-sm font-medium text-slate-800 mb-2">No. Parte *</label>
                  <input
                    v-model="form.noParte"
                    type="text"
                    class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-slate-800 mb-2">Código *</label>
                  <input
                    v-model="form.codigo"
                    type="text"
                    class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-slate-800 mb-2">No. Serie *</label>
                  <input
                    v-model="form.noSerie"
                    type="text"
                    class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-slate-800 mb-2">Stock *</label>
                  <input
                    v-model.number="form.stock"
                    type="number"
                    min="0"
                    class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div class="md:col-span-4">
                  <label class="block text-sm font-medium text-slate-800 mb-2">Descripción *</label>
                  <input
                    v-model="form.descripcion"
                    type="text"
                    class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-slate-800 mb-2">Categoría *</label>
                  <select
                    v-model.number="form.categoria"
                    class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option :value="0" disabled>Seleccionar categoría</option>
                    <option
                      v-for="item in catalogos.categorias"
                      :key="item.id"
                      :value="item.id"
                    >
                      {{ item.nombre }}
                    </option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-slate-800 mb-2">Unidad de Medida *</label>
                  <select
                    v-model.number="form.unidadMedida"
                    class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option :value="0" disabled>Seleccionar unidad</option>
                    <option
                      v-for="item in catalogos.unidades"
                      :key="item.id"
                      :value="item.id"
                    >
                      {{ item.nombre }}
                    </option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-slate-800 mb-2">Almacén *</label>
                  <select
                    v-model.number="form.almacen"
                    class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option :value="0" disabled>Seleccionar almacén</option>
                    <option
                      v-for="item in catalogos.almacenes"
                      :key="item.id"
                      :value="item.id"
                    >
                      {{ item.nombre }}
                    </option>
                  </select>
                </div>

                <div class="md:col-span-3">
                  <label class="block text-sm font-medium text-slate-800 mb-2">Ubicación</label>
                  <input
                    v-model="form.ubicacion"
                    type="text"
                    class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-slate-800 mb-2">Proveedor *</label>
                  <select
                    v-model.number="form.proveedor"
                    class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option :value="0" disabled>Seleccionar proveedor</option>
                    <option
                      v-for="item in catalogos.proveedores"
                      :key="item.id"
                      :value="item.id"
                    >
                      {{ item.nombre }}
                    </option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-slate-800 mb-2">Precio de Compra *</label>
                  <input
                    v-model.number="form.precioCompra"
                    type="number"
                    min="0"
                    step="0.01"
                    class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <select
                      v-model="form.moneda"
                      class="w-24 rounded-xl border border-slate-200 bg-white px-2 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="USD">USD</option>
                    <option value="MXN">MXN</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-slate-800 mb-2">Condición *</label>
                  <select
                    v-model.number="form.condicion"
                    class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option :value="0" disabled>Seleccionar condición</option>
                    <option
                      v-for="item in catalogos.condiciones"
                      :key="item.id"
                      :value="item.id"
                    >
                      {{ item.nombre }}
                    </option>
                  </select>
                </div>
              </div>

              <div class="flex justify-end mt-5">
                <button
                  type="button"
                  @click="agregarArticulo"
                  class="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 hover:bg-slate-50 shadow-sm"
                >
                  <Plus class="w-4 h-4" />
                  Agregar Artículo a la Lista
                </button>
              </div>
            </div>

            <div class="mt-6">
              <h3 class="text-base font-semibold text-slate-900 mb-4">
                Artículos Agregados ({{ totalArticulos }})
              </h3>

              <div
                v-if="articulosAgregados.length === 0"
                class="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center text-slate-500 text-sm"
              >
                Aún no has agregado artículos a la lista.
              </div>

              <div v-else class="space-y-3">
                <div
                  v-for="(articulo, index) in articulosAgregados"
                  :key="`${articulo.codigo}-${index}`"
                  class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div class="grid grid-cols-1 md:grid-cols-5 gap-4 items-start">
                    <div>
                      <p class="text-slate-500 text-xs">No. Parte:</p>
                      <p class="text-sm font-semibold text-slate-900 mt-1">{{ articulo.noParte }}</p>
                    </div>

                    <div>
                      <p class="text-slate-500 text-xs">Código:</p>
                      <p class="text-sm font-semibold text-slate-900 mt-1">{{ articulo.codigo }}</p>
                    </div>

                    <div>
                      <p class="text-slate-500 text-xs">No. Serie:</p>
                      <p class="text-sm font-semibold text-slate-900 mt-1">{{ articulo.noSerie }}</p>
                    </div>

                    <div>
                      <p class="text-slate-500 text-xs">Descripción:</p>
                      <p class="text-sm font-semibold text-slate-900 mt-1 break-words">{{ articulo.descripcion }}</p>
                    </div>

                    <div class="flex justify-end">
                      <button
                        type="button"
                        @click="eliminarArticulo(index)"
                        class="p-2 rounded-lg text-red-500 hover:bg-red-50"
                      >
                        <Trash2 class="w-4 h-4" />
                      </button>
                    </div>

                    <div>
                      <p class="text-slate-500 text-xs">Stock:</p>
                      <p class="text-sm font-semibold text-slate-900 mt-1">{{ articulo.stock }}</p>
                    </div>

                    <div>
                      <p class="text-slate-500 text-xs">Precio:</p>
                      <p class="text-sm font-semibold text-slate-900 mt-1">${{ articulo.precioCompra }}</p>
                    </div>

                    <div>
                      <p class="text-slate-500 text-xs">Ubicación:</p>
                      <p class="text-sm font-semibold text-slate-900 mt-1">{{ articulo.ubicacion || '-' }}</p>
                    </div>

                    <div>
                      <p class="text-slate-500 text-xs">Categoría:</p>
                      <p class="text-sm font-semibold text-slate-900 mt-1">
                        {{ buscarNombre(catalogos.categorias, articulo.categoria) }}
                      </p>
                    </div>

                    <div>
                      <p class="text-slate-500 text-xs">Unidad:</p>
                      <p class="text-sm font-semibold text-slate-900 mt-1">
                        {{ buscarNombre(catalogos.unidades, articulo.unidadMedida) }}
                      </p>
                    </div>

                    <div>
                      <p class="text-slate-500 text-xs">Almacén:</p>
                      <p class="text-sm font-semibold text-slate-900 mt-1">
                        {{ buscarNombre(catalogos.almacenes, articulo.almacen) }}
                      </p>
                    </div>

                    <div>
                      <p class="text-slate-500 text-xs">Proveedor:</p>
                      <p class="text-sm font-semibold text-slate-900 mt-1">
                        {{ buscarNombre(catalogos.proveedores, articulo.proveedor) }}
                      </p>
                    </div>

                    <div>
                      <p class="text-slate-500 text-xs">Condición:</p>
                      <p class="text-sm font-semibold text-slate-900 mt-1">
                        {{ condicionTexto(articulo.condicion) }}
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
                  ? 'Agrega al menos un artículo para guardar'
                  : `${totalArticulos} artículos listos para guardar`
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
                @click="guardarTodos"
                class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0f172a] text-white text-sm font-medium hover:bg-slate-800"
              >
                <Save class="w-4 h-4" />
                Guardar Todos ({{ totalArticulos }})
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>
