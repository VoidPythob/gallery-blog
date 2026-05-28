<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { getDailyWord, navItems, siteMeta } from '../data/ui'

const route = useRoute()
const activePath = computed(() => route.path)
const dailyWord = getDailyWord()
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar-brand">
      <div class="brand-mark">{{ siteMeta.brandMark }}</div>
      <div>
        <p class="brand-title">{{ siteMeta.title }}</p>
        <p class="brand-subtitle">{{ siteMeta.subtitle }}</p>
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
        :class="{ active: activePath === item.to }"
      >
        {{ item.label }}
      </RouterLink>
    </nav>
  </aside>
</template>
