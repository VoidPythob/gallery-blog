<script setup lang="ts">
import { computed, onBeforeUnmount, watch } from 'vue'
import MouseParticles from '../components/MouseParticles.vue'
import RouteLoadingOverlay from '../components/RouteLoadingOverlay.vue'
import Topbar from '../components/Topbar.vue'
import ThemeSettings from '../components/ThemeSettings.vue'
import { useRouteLoading } from '../composables/useRouteLoading'
import { useSiteConfigStore } from '../stores/siteConfig'
import { useThemeStore } from '../stores/theme'

const themeStore = useThemeStore()
const siteConfigStore = useSiteConfigStore()
const { isRouteLoading } = useRouteLoading()

const pageBackgroundImage = computed(() => {
  const raw = themeStore.mode === 'dark'
    ? siteConfigStore.config.backgrounds.dark
    : siteConfigStore.config.backgrounds.light
  return raw?.trim() ?? ''
})

const applyPageBackground = (imageUrl: string) => {
  const root = document.documentElement
  root.style.setProperty('--page-background-image', imageUrl ? `url("${imageUrl}")` : 'none')
}

watch(pageBackgroundImage, (value) => applyPageBackground(value), { immediate: true })

onBeforeUnmount(() => {
  document.documentElement.style.setProperty('--page-background-image', 'none')
})
</script>

<template>
  <div class="app-shell">
    <MouseParticles />
    <Topbar />
    <div class="app-content">
      <main class="app-main">
        <RouterView v-slot="{ Component, route: currentRoute }">
          <Transition :name="currentRoute.name === 'timeline' || currentRoute.name === 'home' ? 'route-none' : 'route-fade'" mode="out-in">
            <component
              :is="Component"
              :key="currentRoute.fullPath"
              :class="[
                'route-page',
                currentRoute.name === 'timeline'
                  ? 'route-page-timeline'
                  : currentRoute.name === 'home'
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
