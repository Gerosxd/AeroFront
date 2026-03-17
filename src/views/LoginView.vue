<script setup lang="ts">
import { ref } from 'vue';
import { Plane, User, Lock, Loader2 } from 'lucide-vue-next';
import { useRouter } from 'vue-router';
const router = useRouter();

// --- LOGICA DE LOGIN ---
const username = ref('');
const password = ref('');
const rememberMe = ref(false);
const isLoading = ref(false);
const errorMessage = ref('');

const handleLogin = async () => {
  errorMessage.value = '';
  isLoading.value = true;

  try {
    console.log("Conectando a Java con:", { user: username.value, pass: password.value });
    // Simulacion de espera
    await new Promise(resolve => setTimeout(resolve, 1500));
    router.push('/app/dashboard');
  } catch (error) {
    errorMessage.value = 'Error de conexión.';
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center relative overflow-hidden p-4 bg-[#0f172a] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-950 via-[#0f172a] to-slate-900">
    
    <div class="absolute inset-0 opacity-[0.15] bg-plus-pattern pointer-events-none"></div>

    <div class="relative z-10 w-full max-w-[420px] flex flex-col items-center gap-8">

      <div class="text-center text-white">
        <div class="bg-blue-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-2xl shadow-blue-500/50 ring-4 ring-blue-600/30">
          <Plane class="w-10 h-10 text-white transform -rotate-12" stroke-width="1.5" />
        </div>
        <h1 class="text-4xl font-extrabold tracking-tight">AeroMaintain</h1>
        <p class="text-blue-200 mt-2 text-lg font-medium">Gestión de Taller Aeronáutico</p>
      </div>

      <div class="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl w-full p-8 md:p-10">
        
        <div class="mb-8">
          <h2 class="text-2xl font-bold text-gray-900">Iniciar Sesión</h2>
          <p class="text-sm text-gray-500 mt-1">Ingresa tus credenciales para acceder.</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-6">
          
          <div class="space-y-2">
            <label class="text-sm font-semibold text-gray-700 ml-1">Usuario</label>
            <div class="relative group">
              <User class="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-blue-600 transition-colors" />
              <input 
                v-model="username"
                type="text" 
                placeholder="Ingresa tu usuario" 
                required
                class="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-gray-800 font-medium"
              />
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-semibold text-gray-700 ml-1">Contraseña</label>
            <div class="relative group">
              <Lock class="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-blue-600 transition-colors" />
              <input 
                v-model="password"
                type="password" 
                placeholder="Ingresa tu contraseña" 
                required
                class="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-gray-800 font-medium"
              />
            </div>
          </div>

          <button 
            type="submit" 
            :disabled="isLoading"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-600/30 hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed text-lg mt-4"
          >
            <Loader2 v-if="isLoading" class="w-6 h-6 animate-spin" />
            <span v-else>Ingresar</span>
          </button>

        </form>
      </div>

       <div class="text-center text-blue-200/60 text-sm mt-4">
        <p>© 2026 AeroMaintain. Todos los derechos reservados.</p>
      </div>

    </div>
  </div>
</template>

<style scoped>
.bg-plus-pattern {
  /* Cruces */
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}
</style>