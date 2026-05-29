<template>
  <div class="container mt-4">
    <h2>Catálogo de Programadas</h2>
    <button class="btn btn-primary mb-3" @click="mostrarModal = true">Nueva Programada</button>

    <table class="table table-bordered">
      <thead>
      <tr>
        <th>ID/Código</th>
        <th>Descripción</th>
        <th>Modelo</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="t in tareas" :key="t.codigo">
        <td>{{ t.codigo }}</td>
        <td>{{ t.descripcion }}</td>
        <td>{{ t.modelo }}</td>
      </tr>
      </tbody>
    </table>

    <FormProgramadaModal
        v-if="mostrarModal"
        @cerrar="mostrarModal = false"
        @actualizar="cargarTareas"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import FormProgramadaModal from '../components/FormProgramadaModal.vue';

const tareas = ref([]);
const mostrarModal = ref(false);

const cargarTareas = async () => {
  const res = await axios.get('http://localhost:8080/api/programadas');
  tareas.value = res.data;
};

onMounted(cargarTareas);
</script>