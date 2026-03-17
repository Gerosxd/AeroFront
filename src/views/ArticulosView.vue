<script setup lang="ts">
import { ref } from 'vue'
import { Plus, Search, Filter, Box, ArrowDownCircle } from 'lucide-vue-next'
import NuevoArticuloModal from '../components/NuevoArticuloModal.vue'
import { guardarArticulos } from '../services/articulo.service'
import NuevaSalidaArtModal, { type PayloadNuevaSalidaArt } from '../components/NuevaSalidaArtModal.vue'

interface Articulo {
  id: string
  noParte: string
  codigo: string
  noSerie: string
  descripcion: string
  categoria: string
  unidadMedida: string
  stock: number
  almacen: string
  ubicacion: string
  proveedor: string
  precio: number
  condicion: 'Nuevo' | 'Reparado' | 'Overhaul' | 'Reacondicionado'
}

interface Entrada {
  id: string
  fecha: string
  codigoArticulo: string
  descripcion: string
  cantidad: number
  unidadMedida: string
  proveedor: string
  almacen: string
  ubicacion: string
  recibidoPor: string
  estado: 'Completado' | 'Pendiente'
}

interface Salida {
  id: string
  fecha: string
  noSalida: string
  destinatario: string
  direccion: string
  articulos: number
  estado: 'Completado' | 'Pendiente'
}

const showNuevoArticulo = ref(false)
const showNuevaSalida = ref(false)
const activeTab = ref<'listado' | 'entradas' | 'salidas'>('listado')

const makeId = () => `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`

const articulos = ref<Articulo[]>([])

const entradas = ref<Entrada[]>([])

const salidas = ref<Salida[]>([])

const catalogos = ref({
  categorias: [
    { id: 1, nombre: 'Componentes' },
    { id: 2, nombre: 'Fluidos' },
    { id: 3, nombre: 'Kits' },
    { id: 4, nombre: 'Lubricantes' }
  ],
  unidades: [
    { id: 1, nombre: 'Pza' },
    { id: 2, nombre: 'Gal' },
    { id: 3, nombre: 'Lts' }
  ],
  almacenes: [
    { id: 1, nombre: 'Principal' },
    { id: 2, nombre: 'Secundario' },
    { id: 3, nombre: 'Componentes' }
  ],
  proveedores: [
    { id: 1, nombre: 'AeroPartes S.A.' },
    { id: 2, nombre: 'Química Aero' },
    { id: 3, nombre: 'SKF Aerospace' }
  ],
  condiciones: [
    { id: 1, nombre: 'Nuevo' },
    { id: 2, nombre: 'Reparado' },
    { id: 3, nombre: 'Overhaul' },
    { id: 4, nombre: 'Reacondicionado' }
  ]
})

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value)

const getConditionStyle = (condicion: string) => {
  switch (condicion) {
    case 'Nuevo': return 'bg-green-100 text-green-700'
    case 'Reparado': return 'bg-blue-100 text-blue-700'
    case 'Overhaul': return 'bg-purple-100 text-purple-700'
    case 'Reacondicionado': return 'bg-indigo-100 text-indigo-700'
    default: return 'bg-gray-100 text-gray-700'
  }
}

const getEntryStatusStyle = (estado: string) => {
  switch (estado) {
    case 'Completado': return 'bg-green-100 text-green-700'
    case 'Pendiente': return 'bg-yellow-100 text-yellow-800'
    default: return 'bg-gray-100 text-gray-700'
  }
}

const guardarNuevoArticulo = async (payload: any[]) => {
  try {
    const response = await guardarArticulos(payload)

    const nuevos = response.map((item: any) => ({
      id: String(item.idArticulo),
      noParte: String(item.noParte ?? ''),
      codigo: item.codigo,
      noSerie: item.noSerie,
      descripcion: item.descripcion,
      categoria: String(item.categoria),
      unidadMedida: String(item.unidadMedida),
      stock: item.stock,
      almacen: String(item.almacen),
      ubicacion: item.ubicacion,
      proveedor: String(item.proveedor),
      precio: Number(item.precioCompra),
      condicion: 'Nuevo'
    }))

    articulos.value.unshift(...nuevos)
    showNuevoArticulo.value = false
  } catch (error: any) {
    console.error(error)
    alert(error?.response?.data?.message ?? 'No se pudieron guardar los artículos')
  }

  const nuevos: Articulo[] = payload.map(item => ({
    id: makeId(),
    noParte: item.noParte,
    codigo: item.codigo,
    noSerie: item.noSerie,
    descripcion: item.descripcion,
    categoria: item.categoria,
    unidadMedida: item.unidadMedida,
    stock: item.stock,
    almacen: item.almacen,
    ubicacion: item.ubicacion,
    proveedor: item.proveedor,
    precio: item.precio,
    condicion: item.condicion
  }))

  articulos.value.unshift(...nuevos)
  showNuevoArticulo.value = false
}

const registrarSalidaCreada = (payload: PayloadNuevaSalidaArt) => {
  salidas.value.unshift({
    id: payload.noSalida || makeId(),
    fecha: payload.fecha,
    noSalida: payload.noSalida,
    destinatario: payload.destinatario,
    direccion: payload.direccionDestinatario,
    articulos: payload.detalles.length,
    estado: 'Pendiente'
  })
  showNuevaSalida.value = false
}
</script>

<template>
  <div class="space-y-6">

    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Artículos</h1>
        <p class="text-gray-500 text-sm">Gestión de artículos aeronáuticos</p>
      </div>

      <button
        @click="showNuevoArticulo = true"
        class="bg-[#0f172a] hover:bg-slate-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm"
      >
        <Plus class="w-4 h-4"/>
        Nuevo Artículo
      </button>
    </div>

    <div class="border-b border-gray-200">
      <nav class="flex gap-6">
        <button
          @click="activeTab='listado'"
          :class="[activeTab==='listado'?'border-blue-600 text-blue-600 font-semibold':'border-transparent text-gray-500','py-3 border-b-2 text-sm']"
        >
          Listado General
        </button>

        <button
          @click="activeTab='entradas'"
          :class="[activeTab==='entradas'?'border-blue-600 text-blue-600 font-semibold':'border-transparent text-gray-500','py-3 border-b-2 text-sm']"
        >
          Entradas de Artículos
        </button>

        <button
          @click="activeTab='salidas'"
          :class="[activeTab==='salidas'?'border-blue-600 text-blue-600 font-semibold':'border-transparent text-gray-500','py-3 border-b-2 text-sm']"
        >
          Salidas de Artículos
        </button>

      </nav>
    </div>

    <div v-if="activeTab==='listado'" class="space-y-6">

      <div class="bg-white p-4 rounded-xl border flex gap-3">
        <div class="relative flex-1">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4"/>
          <input
            type="text"
            placeholder="Buscar..."
            class="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-lg text-sm outline-none"
          />
        </div>

        <button class="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm">
          <Filter class="w-4 h-4"/>
          Filtros
        </button>
      </div>

      <div class="bg-white border rounded-xl overflow-hidden shadow-sm overflow-x-auto">

        <div class="p-4 border-b bg-gray-50">
          <h3 class="font-semibold flex items-center gap-2">
            <Box class="w-4 h-4"/>
            Catálogo de Artículos
          </h3>
        </div>

        <table class="w-full text-left">

          <thead class="text-gray-500 text-xs uppercase border-b">
            <tr>
              <th class="px-6 py-4">No. Parte</th>
              <th class="px-6 py-4">Código</th>
              <th class="px-6 py-4">Serie</th>
              <th class="px-6 py-4">Descripción</th>
              <th class="px-6 py-4">Categoría</th>
              <th class="px-6 py-4">Unidad</th>
              <th class="px-6 py-4">Stock</th>
              <th class="px-6 py-4">Almacén</th>
              <th class="px-6 py-4">Ubicación</th>
              <th class="px-6 py-4">Proveedor</th>
              <th class="px-6 py-4">Precio</th>
              <th class="px-6 py-4">Condición</th>
            </tr>
          </thead>

          <tbody class="divide-y">
            <tr v-for="art in articulos" :key="art.id">

              <td class="px-6 py-4 text-sm font-medium">{{ art.noParte }}</td>
              <td class="px-6 py-4 text-sm font-medium">{{ art.codigo }}</td>
              <td class="px-6 py-4 text-sm">{{ art.noSerie }}</td>
              <td class="px-6 py-4 text-sm">{{ art.descripcion }}</td>
              <td class="px-6 py-4 text-sm">{{ art.categoria }}</td>
              <td class="px-6 py-4 text-sm">{{ art.unidadMedida }}</td>
              <td class="px-6 py-4 text-sm">{{ art.stock }}</td>
              <td class="px-6 py-4 text-sm">{{ art.almacen }}</td>
              <td class="px-6 py-4 text-sm">{{ art.ubicacion }}</td>
              <td class="px-6 py-4 text-sm">{{ art.proveedor }}</td>
              <td class="px-6 py-4 text-sm">{{ formatCurrency(art.precio) }}</td>

              <td class="px-6 py-4">
                <span
                  :class="`px-2 py-1 rounded-full text-xs font-semibold ${getConditionStyle(art.condicion)}`"
                >
                  {{ art.condicion }}
                </span>
              </td>

            </tr>
          </tbody>

        </table>

      </div>
    </div>

    <div v-if="activeTab==='salidas'" class="space-y-6">

    <div class="flex justify-between items-center">

    <h3 class="font-semibold flex items-center gap-2">
    <ArrowDownCircle class="w-4 h-4"/>
    Salidas de Artículos
    </h3>

    <button
      @click="showNuevaSalida=true"
      class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0f172a] text-white text-sm font-medium hover:bg-slate-800"
    >
      <Plus class="w-4 h-4"/>
      Generar salida
    </button>

    </div>


    <div class="bg-white border rounded-xl overflow-hidden shadow-sm">

    <table class="w-full text-left">

    <thead class="text-gray-500 text-xs uppercase border-b">
    <tr>
    <th class="px-6 py-4">No. salida</th>
    <th class="px-6 py-4">Fecha</th>
    <th class="px-6 py-4">Destinatario</th>
    <th class="px-6 py-4">Dirección</th>
    <th class="px-6 py-4">Artículos</th>
    <th class="px-6 py-4">Estado</th>
    </tr>
    </thead>

    <tbody class="divide-y">

    <tr v-for="salida in salidas" :key="salida.id">

    <td class="px-6 py-4 text-sm font-medium">{{ salida.noSalida }}</td>
    <td class="px-6 py-4 text-sm">{{ salida.fecha }}</td>
    <td class="px-6 py-4 text-sm">{{ salida.destinatario }}</td>
    <td class="px-6 py-4 text-sm">{{ salida.direccion }}</td>
    <td class="px-6 py-4 text-sm">{{ salida.articulos }}</td>

    <td class="px-6 py-4">
    <span
    :class="`px-2 py-1 rounded-full text-xs font-semibold ${getEntryStatusStyle(salida.estado)}`"
    >
    {{ salida.estado }}
    </span>
    </td>

    </tr>

    </tbody>

    </table>

    </div>

    </div>

    <NuevoArticuloModal
      :open="showNuevoArticulo"
      :catalogos="catalogos"
      @close="showNuevoArticulo=false"
      @submit="guardarNuevoArticulo"
    />

    <NuevaSalidaArtModal
      :open="showNuevaSalida"
      @close="showNuevaSalida=false"
      @created="registrarSalidaCreada"
    />

  </div>
</template>
