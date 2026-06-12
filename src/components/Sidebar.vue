<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { navIconMap, navItems } from '../data/ui'
import { getDailyWord } from '../data/site'
import { useSiteConfigStore } from '../stores/siteConfig'

const route = useRoute()
const siteConfigStore = useSiteConfigStore()
const dailyWord = ref('')
const branding = computed(() => siteConfigStore.config.branding)

const isActive = (to: string) => {
  if (to === '/') return route.path === '/'
  return route.path === to || route.path.startsWith(`${to}/`)
}

onMounted(async () => {
  dailyWord.value = await getDailyWord()
})
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar-brand">
      <div class="brand-mark">{{ branding.brandMark }}</div>
      <div>
        <p class="brand-title">{{ branding.siteName }}</p>
        <p class="brand-subtitle">{{ branding.subtitle }}</p>
      </div>
    </div>

    <section class="sidebar-panel">
      <h3>每日一言</h3>
      <p>{{ dailyWord }}</p>
    </section>

    <nav class="sidebar-nav">
      <RouterLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="sidebar-link"
        :class="{ active: isActive(item.to) }"
      >
        <component :is="navIconMap[item.icon]" class="nav-icon" />
        {{ item.label }}
      </RouterLink>
    </nav>
  </aside>
</template>
