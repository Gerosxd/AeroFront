<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  Home, Package, Users, Wrench, Settings,
  Plane, LogOut, ChevronDown, User, Bell, LifeBuoy,
  ShoppingCart, ClipboardCheck, Construction // Iconos para los nuevos módulos y pantalla de desarrollo
} from 'lucide-vue-next';
import { getSessionUser, logout as clearSession } from '../services/auth.service';

interface MenuItem {
  name: string;
  icon: any;
  path: string;
  enDesarrollo?: boolean;
}

const menuItems: MenuItem[] = [
  { name: 'Home', icon: Home, path: '/app/dashboard' },
  { name: 'Almacen', icon: Package, path: '/app/almacen' },
  { name: 'Proveedores', icon: Users, path: '/app/proveedores' },
  { name: 'Componente / Parte', icon: Wrench, path: '/app/articulos' },
  { name: 'Ingenieria', icon: Settings, path: '/app/ingenieria' },
  // MÓDULOS EN DESARROLLO CONFIGURADOS CON RUTA VIRTUAL
  { name: 'Compras', icon: ShoppingCart, path: '/app/compras-virtual', enDesarrollo: true },
  { name: 'Requisiciones', icon: ClipboardCheck, path: '/app/requisiciones-virtual', enDesarrollo: true },
];

const route = useRoute();
const router = useRouter();

// Estado reactivo para controlar qué pestaña virtual está activa en pantalla
const pestañaVirtualActiva = ref<string | null>(null);

// Si el usuario navega a una ruta real desde el menú de perfil, cerramos la pestaña virtual
watch(() => route.path, () => {
  pestañaVirtualActiva.value = null;
});

// Controla el bloqueo del scroll del body de la página trasera mientras el módulo esté abierto
watch(pestañaVirtualActiva, (nuevoValor) => {
  if (nuevoValor) {
    document.body.classList.add('overflow-hidden');
  } else {
    document.body.classList.remove('overflow-hidden');
  }
});

// Determina qué botón de la barra de navegación debe iluminarse en azul
const isActive = (item: MenuItem) => {
  if (item.enDesarrollo) {
    return pestañaVirtualActiva.value === item.path;
  }
  return pestañaVirtualActiva.value === null && route.path.startsWith(item.path);
};

const isMenuOpen = ref(false);
const sessionUser = computed(() => getSessionUser());

const avatar = computed(() => {
  const nombre = sessionUser.value?.Nombre?.trim();
  if (!nombre) return 'U';
  return nombre.split(' ').map((p) => p.charAt(0).toUpperCase()).join('').slice(0, 2);
});

const rolTexto = computed(() => {
  const rolId = Number(sessionUser.value?.rol);
  switch (rolId) {
    case 1: return 'Administrador';
    case 2: return 'Encargado de almacén';
    case 3: return 'Ingeniero';
    case 4: return 'Almacén';
    case 5: return 'Director de ingeniería';
    default: return 'Usuario';
  }
});

// Maneja el comportamiento del clic: abre la pantalla simulada o navega de forma real
const handleModuloClick = (item: MenuItem) => {
  if (item.enDesarrollo) {
    pestañaVirtualActiva.value = item.path;
    return;
  }
  pestañaVirtualActiva.value = null;
  router.push(item.path);
};

const logout = () => {
  isMenuOpen.value = false;
  clearSession();
  router.push('/');
};
</script>

<template>
  <header class="bg-[#0f172a] text-white py-3 px-4 sm:px-6 shadow-md sticky top-0 z-50">
    <div class="flex items-center justify-between mx-auto w-full gap-2">

      <div class="flex items-center gap-3 shrink-0 cursor-pointer" @click="handleModuloClick(menuItems[0])">
        <div class="bg-blue-600 p-2 rounded-lg">
          <Plane class="w-5 h-5 text-white" />
        </div>
        <div class="hidden sm:block leading-tight">
          <h1 class="font-bold text-lg tracking-wide">AeroMaintain</h1>
          <p class="text-[10px] text-gray-400 font-light">Taller Aeronáutico</p>
        </div>
      </div>

      <nav class="flex items-center gap-1 md:gap-2 overflow-x-auto no-scrollbar flex-1 justify-center px-2">
        <button
            v-for="item in menuItems"
            :key="item.name"
            @click="handleModuloClick(item)"
            class="flex items-center gap-2 p-2 xl:px-3 xl:py-2 rounded-md transition-colors text-sm font-medium shrink-0 group relative outline-none"
            :class="isActive(item) ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-300 hover:text-white hover:bg-white/10'"
            :title="item.name"
        >
          <component :is="item.icon" class="w-5 h-5 xl:w-4 xl:h-4" />
          <span class="hidden xl:block">{{ item.name }}</span>

          <span v-if="item.enDesarrollo" class="absolute top-0.5 right-0.5 flex h-1.5 w-1.5">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500"></span>
          </span>
        </button>
      </nav>

      <div class="flex items-center shrink-0 justify-end relative">
        <div
            @click="isMenuOpen = !isMenuOpen"
            class="flex items-center gap-3 sm:pl-4 sm:border-l border-gray-700 cursor-pointer hover:bg-slate-800 p-1.5 rounded-lg transition-colors z-50 relative"
        >
          <div class="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-blue-200">
            {{ avatar }}
          </div>
          <div class="hidden lg:block text-right">
            <p class="text-sm font-semibold text-white select-none">{{ sessionUser?.nombre || 'Usuario' }}</p>
            <p class="text-[10px] text-gray-400 select-none">{{ rolTexto }}</p>
          </div>
          <ChevronDown class="w-4 h-4 text-gray-400 hidden lg:block transition-transform duration-200" :class="isMenuOpen ? 'rotate-180' : ''" />
        </div>

        <div v-if="isMenuOpen" class="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 focus:outline-none z-50">
          <div class="px-4 py-3 border-b border-gray-100 lg:hidden block">
            <p class="text-sm font-semibold text-gray-900">{{ sessionUser?.nombre || 'Usuario' }}</p>
            <p class="text-[10px] text-gray-500">{{ rolTexto }}</p>
          </div>
          <div class="px-4 py-2 border-b border-gray-100">
            <p class="text-xs text-gray-500">Usuario</p>
            <p class="text-sm font-medium text-gray-900">{{ sessionUser?.username || '-' }}</p>
            <p class="text-xs text-gray-500 mt-2">Correo</p>
            <p class="text-sm font-medium text-gray-900 break-all">{{ sessionUser?.correo || '-' }}</p>
          </div>
          <div class="py-1">
            <button @click="router.push('/app/profile'); isMenuOpen = false" class="w-full text-left p-2 hover:bg-gray-50 rounded text-xs flex items-center gap-2"><User class="w-3.5 h-3.5" /> Mi Perfil</button>
            <button @click="logout" class="w-full text-left p-2 hover:bg-red-50 text-red-600 rounded text-xs flex items-center gap-2"><LogOut class="w-3.5 h-3.5" /> Cerrar Sesión</button>
          </div>
        </div>
      </div>

    </div>
  </header>

  <Transition name="fade">
    <div
        v-if="pestañaVirtualActiva"
        class="fixed inset-0 top-[64px] bg-slate-50 flex flex-col items-center justify-center p-6 text-center z-[40] overflow-y-auto"
    >
      <div class="max-w-md bg-white border border-gray-200 rounded-2xl shadow-xl p-8 space-y-5 my-auto animate-fade-in">
        <div class="mx-auto w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner">
          <Construction class="w-8 h-8 animate-bounce" />
        </div>

        <div class="space-y-2">
          <h2 class="text-xl font-bold text-slate-900">
            Módulo {{ pestañaVirtualActiva.includes('compras') ? 'Compras' : 'Requisiciones' }}
          </h2>
          <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border bg-amber-50 text-amber-700 border-amber-200">
            Estatus: Fases de Maquetado y Diseño
          </div>
        </div>

        <p class="text-xs text-gray-500 leading-relaxed max-w-sm mx-auto">
          Este apartado se encuentra actualmente en proceso de reingeniería arquitectónica para el enlace automatizado de almacenes y órdenes de mantenimiento. Estará disponible para pruebas integrales en el siguiente Sprint de desarrollo.
        </p>

        <div class="pt-2">
          <button
              @click="handleModuloClick(menuItems[0])"
              class="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors shadow-sm"
          >
            Regresar al Tablero Principal
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.overflow-hidden {
  overflow: hidden !important;
}
.animate-fade-in {
  animation: fadeIn 0.35s ease-in-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>