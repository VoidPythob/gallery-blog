<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { navItems, siteMeta } from '../data/ui'
import { getDailyWord } from '../data/site'

const route = useRoute()
const activePath = computed(() => route.path)
const dailyWord = ref('')

onMounted(async () => {
  dailyWord.value = await getDailyWord()
})
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
