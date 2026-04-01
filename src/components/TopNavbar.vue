<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { 
  Home, Package, Users, Wrench, Settings, 
  Plane, LogOut, ChevronDown, User, Bell, LifeBuoy 
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
  { name: 'Componente / Parte', icon: Wrench, path: '/app/articulos' },
  { name: 'Ingenieria', icon: Settings, path: '/app/ingenieria' },
];

const route = useRoute();
const router = useRouter();
const isActive = (path: string) => route.path.startsWith(path);

// Control del menú de usuario
const isMenuOpen = ref(false);

const logout = () => {
  isMenuOpen.value = false;
  router.push('/'); 
};
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
        </router-link>
      </nav>

      <div class="flex items-center shrink-0 justify-end relative">
        <div @click="isMenuOpen = !isMenuOpen" class="flex items-center gap-3 sm:pl-4 sm:border-l border-gray-700 cursor-pointer hover:bg-slate-800 p-1.5 rounded-lg transition-colors z-50 relative">
          <div class="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-blue-200">
            JD
          </div>
          <div class="hidden lg:block text-right">
            <p class="text-sm font-semibold text-white select-none">Juan Delgado</p>
            <p class="text-[10px] text-gray-400 select-none">Supervisor</p>
          </div>
          <ChevronDown class="w-4 h-4 text-gray-400 hidden lg:block transition-transform duration-200" :class="isMenuOpen ? 'rotate-180' : ''" />
        </div>

        <div v-if="isMenuOpen" class="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 focus:outline-none z-50">
          
          <div class="px-4 py-3 border-b border-gray-100 lg:hidden block">
            <p class="text-sm font-semibold text-gray-900">Juan Delgado</p>
            <p class="text-[10px] text-gray-500">Supervisor</p>
          </div>

          <div class="py-1">
            <button @click="router.push('/app/profile'); isMenuOpen = false" class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-slate-50 hover:text-blue-600 transition-colors">
              <User class="w-4 h-4 mr-3 text-gray-400" /> Mi Perfil
            </button>
            <button @click="router.push('/app/settings'); isMenuOpen = false" class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-slate-50 hover:text-blue-600 transition-colors">
              <Settings class="w-4 h-4 mr-3 text-gray-400" /> Preferencias
            </button>
            <button class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-slate-50 hover:text-blue-600 transition-colors">
              <Bell class="w-4 h-4 mr-3 text-gray-400" /> Notificaciones
            </button>
          </div>

          <div class="border-t border-gray-100 my-1"></div>

          <div class="py-1">
            <button @click="router.push('/app/help'); isMenuOpen = false" class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-slate-50 transition-colors">
              <LifeBuoy class="w-4 h-4 mr-3 text-gray-400" /> Soporte Técnico
            </button>
            <button @click="logout" class="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium">
              <LogOut class="w-4 h-4 mr-3 text-red-500" /> Cerrar Sesión
            </button>
          </div>
        </div>

        <div v-if="isMenuOpen" @click="isMenuOpen = false" class="fixed inset-0 z-40"></div>
      </div>

    </div>
  </header>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>