<script setup lang="ts">
import RouteLoadingOverlay from '../components/RouteLoadingOverlay.vue'
import Topbar from '../components/Topbar.vue'
import ThemeSettings from '../components/ThemeSettings.vue'
import { useRouteLoading } from '../composables/useRouteLoading'

const { isRouteLoading } = useRouteLoading()
</script>

<template>
  <div class="app-shell">
    <Topbar />
    <div class="app-content">
      <main class="app-main">
        <RouterView v-slot="{ Component, route }">
          <Transition :name="route.name === 'timeline' ? 'route-none' : 'route-fade'" mode="out-in">
            <component
              :is="Component"
              :key="route.fullPath"
              :class="[
                'route-page',
                route.name === 'timeline' ? 'route-page-timeline' : 'animate__animated animate__fadeIn animate__faster',
              ]"
            />
          </Transition>
        </RouterView>
      </main>
    </div>
    <RouteLoadingOverlay :visible="isRouteLoading" />
    <ThemeSettings />
  </div>
</template>
