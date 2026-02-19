<script setup lang="ts">
import { useRoute } from 'vue-router';
import { 
  Home, Package, Users, Wrench, Settings, 
  //ShoppingCart, FileText, CheckSquare,
   Plane 
} from 'lucide-vue-next';

interface MenuItem {
  name: string;
  icon: any;
  path: string;
}


const menuItems: MenuItem[] = [
  { name: 'Home', icon: Home, path: '/app/dashboard' },
  { name: 'Almacen', icon: Package, path: '/app/almacen' },
  { name: 'Proveedores', icon: Users, path: '/app/proveedores' },
  { name: 'Articulos', icon: Wrench, path: '/app/articulos' },
  { name: 'Ingenieria', icon: Settings, path: '/app/ingenieria' },
  //{ name: 'Compras', icon: ShoppingCart, path: '/app/compras' },
  // { name: 'Requisiciones', icon: FileText, path: '/app/requisiciones' },
  // { name: 'Autorizaciones', icon: CheckSquare, path: '/app/autorizaciones' },
];

const route = useRoute();
// Función para saber si el botón debe estar azul (activo)
// Compara si la ruta actual empieza con el path del item
const isActive = (path: string) => route.path.startsWith(path);
</script>

<template>
  <header class="bg-[#0f172a] text-white py-3 px-4 sm:px-6 shadow-md sticky top-0 z-50">
    <div class="flex items-center justify-between mx-auto w-full gap-2">
      
      <div class="flex items-center gap-3 shrink-0">
        <div class="bg-blue-600 p-2 rounded-lg">
          <Plane class="w-5 h-5 text-white" />
        </div>
        <div class="hidden sm:block leading-tight">
          <h1 class="font-bold text-lg tracking-wide">AeroMaintain</h1>
          <p class="text-[10px] text-gray-400 font-light">Taller Aeronáutico</p>
        </div>
      </div>

      <nav class="flex items-center gap-1 md:gap-2 overflow-x-auto no-scrollbar flex-1 justify-center px-2">
        <router-link 
          v-for="item in menuItems" 
          :key="item.name"
          :to="item.path"
          class="flex items-center gap-2 p-2 xl:px-3 xl:py-2 rounded-md transition-colors text-sm font-medium shrink-0 group relative"
          :class="isActive(item.path) ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-300 hover:text-white hover:bg-white/10'"
          :title="item.name"
        >
          <component :is="item.icon" class="w-5 h-5 xl:w-4 xl:h-4" />
          
          <span class="hidden xl:block">{{ item.name }}</span>

          <span class="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 xl:hidden pointer-events-none transition-opacity whitespace-nowrap z-50">
            {{ item.name }}
          </span>
        </router-link>
      </nav>

      <div class="flex items-center shrink-0 justify-end">
        <div class="flex items-center gap-3 sm:pl-4 sm:border-l border-gray-700">
          <div class="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-blue-200 cursor-pointer hover:bg-slate-600 transition-colors">
            JD
          </div>
          <div class="hidden lg:block text-right">
            <p class="text-sm font-semibold text-white">Juan Delgado</p>
            <p class="text-[10px] text-gray-400">Supervisor</p>
          </div>
        </div>
      </div>

    </div>
  </header>
</template>

<style scoped>
/* Oculta la barra de scroll horizontal en la navegación para que se vea limpio */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>