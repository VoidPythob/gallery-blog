<script setup lang="ts">
import Topbar from '../components/Topbar.vue'
import ThemeSettings from '../components/ThemeSettings.vue'
</script>

<template>
  <div class="app-shell">
    <Topbar />
    <div class="app-content">
      <main class="app-main">
        <RouterView />
      </main>
    </div>
    <ThemeSettings />
  </div>
</template>
