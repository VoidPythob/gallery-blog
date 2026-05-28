<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { Drawer } from 'tdesign-vue-next'
import SearchBar from './SearchBar.vue'
import { navItems, pageText, siteMeta } from '../data/ui'

const route = useRoute()
const drawerOpen = ref(false)
const scrolled = ref(false)

const isActive = (to: string) => {
  if (to === '/') return route.path === '/'
  return route.path === to || route.path.startsWith(`${to}/`)
}

const onScroll = () => {
  scrolled.value = window.scrollY > 32
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <header class="topbar" :class="{ scrolled }">
    <div class="topbar-left">
      <button class="icon-btn topbar-menu" type="button" @click="drawerOpen = true">=</button>
      <RouterLink to="/" class="topbar-brand">
        <p class="brand-title">{{ siteMeta.title }}</p>
      </RouterLink>
    </div>

    <nav class="topbar-nav">
      <RouterLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="topbar-link"
        :class="{ active: isActive(item.to) }"
      >
        {{ item.label }}
      </RouterLink>
    </nav>

    <div class="topbar-right">
      <SearchBar class="desktop-search" />
      <SearchBar class="mobile-searchbar" />
    </div>
  </header>

  <Drawer
    v-model:visible="drawerOpen"
    placement="left"
    :show-overlay="true"
    :header="false"
    :footer="false"
    size="320px"
  >
    <div class="drawer-panel">
      <div class="drawer-head">
        <p class="drawer-title">{{ pageText.drawerTitle }}</p>
        <button class="icon-btn" type="button" @click="drawerOpen = false">x</button>
      </div>

      <RouterLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="drawer-link"
        :class="{ active: isActive(item.to) }"
        @click="drawerOpen = false"
      >
        {{ item.label }}
      </RouterLink>
    </div>
  </Drawer>
</template>
