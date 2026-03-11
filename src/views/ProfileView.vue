<script setup lang="ts">
import { ref } from 'vue';
import { User, Mail, Shield, BadgeCheck, Camera } from 'lucide-vue-next';

// Simulación de datos que vendrán del backend
const usuario = ref({
  nombre: 'Juan Delgado',
  puesto: 'Supervisor de Mantenimiento',
  correo: 'j.delgado@aeromaintain.com',
  departamento: 'MRO - Ingeniería',
  avatar: 'JD'
});
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <h1 class="text-2xl font-bold text-gray-900">Mi Perfil</h1>
    
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div class="h-32 bg-gradient-to-r from-blue-600 to-indigo-700 relative">
        <div class="absolute -bottom-12 left-8 flex items-end gap-4">
          <div class="w-24 h-24 rounded-2xl bg-slate-800 border-4 border-white flex items-center justify-center text-3xl font-bold text-blue-200 shadow-lg relative group cursor-pointer">
            {{ usuario.avatar }}
            <div class="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <Camera class="w-6 h-6 text-white" />
            </div>
          </div>
          <div class="mb-2">
            <h2 class="text-xl font-bold text-white drop-shadow-sm">{{ usuario.nombre }}</h2>
            <p class="text-blue-100 text-sm font-medium">{{ usuario.puesto }}</p>
          </div>
        </div>
      </div>

      <div class="pt-16 p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="space-y-4">
          <h3 class="text-sm font-bold text-gray-400 uppercase tracking-wider">Información de Contacto</h3>
          <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Mail class="w-5 h-5 text-blue-600" />
            <div>
              <p class="text-xs text-gray-500">Correo Electrónico</p>
              <p class="text-sm font-medium">{{ usuario.correo }}</p>
            </div>
          </div>
          <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Shield class="w-5 h-5 text-blue-600" />
            <div>
              <p class="text-xs text-gray-500">Departamento</p>
              <p class="text-sm font-medium">{{ usuario.departamento }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>