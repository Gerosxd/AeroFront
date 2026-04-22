<script setup lang="ts">
import TopNavbar from '../components/TopNavbar.vue';
</script>

<template>
  <div class="min-h-screen bg-slate-50 font-sans">
    <TopNavbar />
    <main class="p-6">
      <router-view />
    </main>
  </div>
</template>