<script setup lang="ts">
import Topbar from '../components/Topbar.vue'
import ThemeSettings from '../components/ThemeSettings.vue'
</script>

<template>
  <div class="app-shell">
    <Topbar />
    <div class="app-content">
      <main class="app-main">
        <RouterView v-slot="{ Component, route }">
          <Transition name="route-fade" mode="out-in">
            <component
              :is="Component"
              :key="route.fullPath"
              class="animate__animated animate__fadeIn animate__faster route-page"
            />
          </Transition>
        </RouterView>
      </main>
    </div>
    <ThemeSettings />
  </div>
</template>
