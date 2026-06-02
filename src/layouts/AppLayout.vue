<script setup lang="ts">
import MouseParticles from '../components/MouseParticles.vue'
import RouteLoadingOverlay from '../components/RouteLoadingOverlay.vue'
import Topbar from '../components/Topbar.vue'
import ThemeSettings from '../components/ThemeSettings.vue'
import { useRouteLoading } from '../composables/useRouteLoading'

const { isRouteLoading } = useRouteLoading()
</script>

<template>
  <div class="app-shell">
    <MouseParticles />
    <Topbar />
    <div class="app-content">
      <main class="app-main">
        <RouterView v-slot="{ Component, route }">
          <Transition :name="route.name === 'timeline' || route.name === 'home' ? 'route-none' : 'route-fade'" mode="out-in">
            <component
              :is="Component"
              :key="route.fullPath"
              :class="[
                'route-page',
                route.name === 'timeline'
                  ? 'route-page-timeline'
                  : route.name === 'home'
                    ? 'route-page-home'
                    : 'route-page-standard',
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
