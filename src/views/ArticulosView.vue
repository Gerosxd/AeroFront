<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { Plus, Search, Filter, Box, ArrowDownCircle } from 'lucide-vue-next'

import NuevaEntradaArticuloModal from '../components/NuevaEntradaArticuloModal.vue'
import DetalleEntradaArticuloModal from '../components/DetalleEntradaArticuloModal.vue'

import NuevaSalidaArtModal from '../components/NuevaSalidaArtModal.vue'

import { listarArticulos } from '../services/articulo.service'
import {
  obtenerTodosLosCatalogos,
  obtenerEstadosEntrada
} from '../services/catalogo.service'
import {
  registrarEntradaCompleta,
  listarEntradas,
  obtenerEntradaPorId
} from '../services/entrada-articulo.service'

import type { CatalogoItem } from '../types/catalogo'
import type {
  EntradaArticuloRegistroRequest,
  EntradaArticuloRegistroResponse,
  EntradaArticuloListadoResponse
} from '../types/entrada-articulo'

import { listarSalidas } from '../services/salida.service'

interface ArticuloTabla {
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
  moneda: String
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
const showNuevaEntrada = ref(false)
const showDetalleEntrada = ref(false)


const articulos = ref<ArticuloTabla[]>([])
const entradas = ref<EntradaArticuloListadoResponse[]>([])
const entradaSeleccionada = ref<EntradaArticuloRegistroResponse | null>(null)

const loadingDetalle = ref(false)

const busquedaArticulos = ref('')
const busquedaEntradas = ref('')

const salidas = ref<Salida[]>([])

const catalogos = ref({
  categorias: [] as CatalogoItem[],
  unidades: [] as CatalogoItem[],
  almacenes: [] as CatalogoItem[],
  proveedores: [] as CatalogoItem[],
  condiciones: [] as CatalogoItem[]
})

const estadosEntrada = ref<CatalogoItem[]>([])

const textoBotonPrincipal = computed(() => 'Nueva Entrada')

const buscarNombre = (lista: CatalogoItem[] = [], id: number | string) => {
  const idNumerico = Number(id)
  return lista.find(item => item.id === idNumerico)?.nombre ?? String(id)
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value)

const getConditionStyle = (condicion: string) => {
  switch (condicion) {
    case 'Nuevo':
      return 'bg-green-100 text-green-700'
    case 'Reparado':
      return 'bg-blue-100 text-blue-700'
    case 'Overhaul':
      return 'bg-purple-100 text-purple-700'
    case 'Reacondicionado':
      return 'bg-indigo-100 text-indigo-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

const getEntryStatusStyle = (estado: string) => {
  switch (estado) {
    case 'Completado':
      return 'bg-green-100 text-green-700'
    case 'Pendiente':
      return 'bg-yellow-100 text-yellow-800'
    case 'Cancelado':
      return 'bg-red-100 text-red-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

const abrirModalPrincipal = () => {
  showNuevaEntrada.value = true
}

const cargarArticulos = async () => {
  try {
    const data = await listarArticulos()

    articulos.value = data.map((item: any) => ({
      idArticulo: item.idArticulo,
      id: String(item.idArticulo),
      noParte: String(item.noParte ?? ''),
      codigo: item.codigo,
      noSerie: item.noSerie,
      descripcion: item.descripcion,
      categoria: buscarNombre(catalogos.value.categorias, item.categoria),
      unidadMedida: buscarNombre(catalogos.value.unidades, item.unidadMedida),
      stock: Number(item.stock),
      almacen: buscarNombre(catalogos.value.almacenes, item.almacen),
      ubicacion: item.ubicacion ?? '',
      proveedor: buscarNombre(catalogos.value.proveedores, item.proveedor),
      precio: Number(item.precioCompra),
      condicion: buscarNombre(catalogos.value.condiciones, item.condicion) as ArticuloTabla['condicion']
    }))
  } catch (error) {
    console.error('Error al cargar artículos:', error)
  }
}

const cargarEntradas = async () => {
  try {
    entradas.value = await listarEntradas()
  } catch (error) {
    console.error('Error al cargar entradas:', error)
  }
}

const cargarCatalogos = async () => {
  try {
    const data = await obtenerTodosLosCatalogos()
    const estados = await obtenerEstadosEntrada()

    console.log('catalogos cargados =>', data)
    console.log('estados cargados =>', estados)

    catalogos.value = {
      categorias: data?.categorias ?? [],
      unidades: data?.unidades ?? [],
      almacenes: data?.almacenes ?? [],
      proveedores: data?.proveedores ?? [],
      condiciones: data?.condiciones ?? []
    }

    estadosEntrada.value = estados ?? []
  } catch (error) {
    console.error('Error al cargar catálogos:', error)
  }
}

const guardarNuevaEntrada = async (payload: EntradaArticuloRegistroRequest) => {
  try {
    await registrarEntradaCompleta(payload)
    showNuevaEntrada.value = false

    await Promise.all([
      cargarArticulos(),
      cargarEntradas()
    ])

    activeTab.value = 'entradas'
  } catch (error: any) {
    console.error(error)
    alert(error?.response?.data?.message ?? 'No se pudo registrar la entrada completa')
  }
}

const registrarSalidaCreada = async () => {
  await Promise.all([
    cargarSalidas(),
    cargarArticulos() // Mantiene el stock sincronizado
  ])
  showNuevaSalida.value = false
}

const cargarSalidas = async () => {
  try {
    const data = await listarSalidas()

    // Mapeamos los datos para que coincidan con la interfaz 'Salida' de tu tabla
    salidas.value = data.map((s: any) => ({
      id: String(s.idSalida || s.id),
      fecha: s.fecha,
      noSalida: s.noSalida,
      destinatario: s.destinatario,
      direccion: s.direccionDestinatario, // Importante: el back manda direccionDestinatario
      articulos: s.totalArticulos || (s.detalles ? s.detalles.length : 0),
      estado: s.estado || 'Completado'
    }))
  } catch (error) {
    console.error('Error al cargar salidas:', error)
  }
}

const verDetalleEntrada = async (idEntrada: number) => {
  try {
    loadingDetalle.value = true
    entradaSeleccionada.value = await obtenerEntradaPorId(idEntrada)
    showDetalleEntrada.value = true
  } catch (error: any) {
    console.error(error)
    alert(error?.response?.data?.message ?? 'No se pudo cargar el detalle de la entrada')
  } finally {
    loadingDetalle.value = false
  }
}

const articulosFiltrados = computed(() => {
  const q = busquedaArticulos.value.trim().toLowerCase()
  if (!q) return articulos.value

  return articulos.value.filter(item =>
    item.codigo.toLowerCase().includes(q) ||
    item.noSerie.toLowerCase().includes(q) ||
    item.descripcion.toLowerCase().includes(q) ||
    item.categoria.toLowerCase().includes(q) ||
    item.unidadMedida.toLowerCase().includes(q) ||
    item.almacen.toLowerCase().includes(q) ||
    item.ubicacion.toLowerCase().includes(q) ||
    item.proveedor.toLowerCase().includes(q) ||
    item.condicion.toLowerCase().includes(q)
  )
})

const entradasFiltradas = computed(() => {
  const q = busquedaEntradas.value.trim().toLowerCase()
  if (!q) return entradas.value

  return entradas.value.filter(item =>
    item.folio.toLowerCase().includes(q) ||
    item.fechaEntrada.toLowerCase().includes(q) ||
    item.proveedor.toLowerCase().includes(q) ||
    item.almacenDestino.toLowerCase().includes(q) ||
    item.recibidoPor.toLowerCase().includes(q) ||
    item.estado.toLowerCase().includes(q)
  )
})

onMounted(async () => {
  await cargarCatalogos()
  await Promise.all([
    cargarArticulos(),
    cargarEntradas(),
    cargarSalidas()
  ])
})


</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Componente / Parte</h1>
        <p class="text-gray-500 text-sm">Gestión de Componente / Parte aeronáuticos</p>
      </div>

      <button
        @click="abrirModalPrincipal"
        class="bg-[#0f172a] hover:bg-slate-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm"
      >
        <Plus class="w-4 h-4" />
        {{ textoBotonPrincipal }}
      </button>
    </div>

    <div class="border-b border-gray-200">
      <nav class="flex gap-6">
        <button
          @click="activeTab = 'listado'"
          :class="[
            activeTab === 'listado'
              ? 'border-blue-600 text-blue-600 font-semibold'
              : 'border-transparent text-gray-500',
            'py-3 border-b-2 text-sm'
          ]"
        >
          Listado General
        </button>

        <button
          @click="activeTab = 'entradas'"
          :class="[
            activeTab === 'entradas'
              ? 'border-blue-600 text-blue-600 font-semibold'
              : 'border-transparent text-gray-500',
            'py-3 border-b-2 text-sm'
          ]"
        >
          Entradas de Componente / Parte
        </button>

        <button
          @click="activeTab='salidas'"
          :class="[activeTab==='salidas'?'border-blue-600 text-blue-600 font-semibold':'border-transparent text-gray-500','py-3 border-b-2 text-sm']"
        >
          Salidas de Componente / Parte
        </button>

      </nav>
    </div>

    <div v-if="activeTab === 'listado'" class="space-y-6">
      <div class="bg-white p-4 rounded-xl border flex gap-3">
        <div class="relative flex-1">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            v-model="busquedaArticulos"
            type="text"
            placeholder="Buscar artículos..."
            class="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-lg text-sm outline-none"
          />
        </div>

        <button class="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm">
          <Filter class="w-4 h-4" />
          Filtros
        </button>
      </div>

      <div class="bg-white border rounded-xl overflow-hidden shadow-sm overflow-x-auto">
        <div class="p-4 border-b bg-gray-50">
          <h3 class="font-semibold flex items-center gap-2">
            <Box class="w-4 h-4" />
            Catálogo de Componente / Parte
          </h3>
        </div>

        <table class="w-full text-left">
          <thead class="text-gray-500 text-xs uppercase border-b">
            <tr>

              <th class="px-6 py-4">Número de Parte</th>
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
            <tr v-for="art in articulosFiltrados" :key="art.id">
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

            <tr v-if="articulosFiltrados.length === 0">
              <td colspan="11" class="px-6 py-8 text-center text-sm text-gray-500">
                No hay Componente / Parte registrados.
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
          Salidas de Componente / Parte
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



    <div v-if="activeTab === 'entradas'" class="space-y-6">
      <div class="bg-white p-4 rounded-xl border flex gap-3">
        <div class="relative flex-1">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            v-model="busquedaEntradas"
            type="text"
            placeholder="Buscar entradas por folio, fecha o proveedor..."
            class="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-lg text-sm outline-none"
          />
        </div>

        <button class="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm">
          <Filter class="w-4 h-4" />
          Filtros
        </button>
      </div>

      <div class="bg-white border rounded-xl overflow-hidden shadow-sm overflow-x-auto">
        <div class="p-4 border-b bg-gray-50">
          <h3 class="font-semibold flex items-center gap-2">
            <ArrowDownCircle class="w-4 h-4" />
            Registro de Entradas
          </h3>
        </div>

        <table class="w-full text-left">
          <thead class="text-gray-500 text-xs uppercase border-b">
            <tr>
              <th class="px-6 py-4">Folio</th>
              <th class="px-6 py-4">Fecha</th>
              <th class="px-6 py-4">Proveedor</th>
              <th class="px-6 py-4">Almacén Destino</th>
              <th class="px-6 py-4">Recibido Por</th>
              <th class="px-6 py-4">Estado</th>
              <th class="px-6 py-4">No. Artículos</th>
              <th class="px-6 py-4">Acciones</th>
            </tr>
          </thead>

          <tbody class="divide-y">
            <tr v-for="entrada in entradasFiltradas" :key="entrada.idEntrada">
              <td class="px-6 py-4 text-sm font-medium">{{ entrada.folio }}</td>
              <td class="px-6 py-4 text-sm">{{ entrada.fechaEntrada }}</td>
              <td class="px-6 py-4 text-sm">{{ entrada.proveedor }}</td>
              <td class="px-6 py-4 text-sm">{{ entrada.almacenDestino }}</td>
              <td class="px-6 py-4 text-sm">{{ entrada.recibidoPor }}</td>
              <td class="px-6 py-4">
                <span
                  :class="`px-2 py-1 rounded-full text-xs font-semibold ${getEntryStatusStyle(entrada.estado)}`"
                >
                  {{ entrada.estado }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm">{{ entrada.totalArticulos }}</td>
              <td class="px-6 py-4 text-sm font-medium">
                <button
                  type="button"
                  class="text-slate-900 hover:text-blue-600"
                  @click="verDetalleEntrada(entrada.idEntrada)"
                >
                  {{ loadingDetalle ? 'Cargando...' : 'Ver' }}
                </button>
              </td>
            </tr>

            <tr v-if="entradasFiltradas.length === 0">
              <td colspan="8" class="px-6 py-8 text-center text-sm text-gray-500">
                No hay entradas registradas.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <NuevaEntradaArticuloModal
        v-if="showNuevaEntrada"
        :open="showNuevaEntrada"
      :categorias="catalogos.categorias"
      :unidades="catalogos.unidades"
      :proveedores="catalogos.proveedores"
      :almacenes="catalogos.almacenes"
      :condiciones="catalogos.condiciones"
      :estadosEntrada="estadosEntrada"
      :usuario-id="userStore?.id || 0"
      :nombre-usuario="userStore?.nombre || ''"
      @close="showNuevaEntrada = false"
      @submit="guardarNuevaEntrada"
    />

    <DetalleEntradaArticuloModal
      :open="showDetalleEntrada"
      :entrada="entradaSeleccionada"
      @close="showDetalleEntrada = false"
    />

    <NuevaSalidaArtModal
      :open="showNuevaSalida"
      :inventario="articulos"
      :entrada="entradaSeleccionada"
      @close="showNuevaSalida = false"
      @created="registrarSalidaCreada"
    />
  </div>

</template>
