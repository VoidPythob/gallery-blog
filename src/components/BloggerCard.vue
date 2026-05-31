<script setup lang="ts">
import { computed } from 'vue'
import type { BloggerLink, BloggerProfile } from '../data/site'

const props = defineProps<{
  profile: BloggerProfile
}>()

const iconBase = `${import.meta.env.BASE_URL}icons`

const platformIconMap: Record<string, string> = {
  github: `${iconBase}/github.svg`,
  bilibili: `${iconBase}/bilibili.svg`,
  wechat: `${iconBase}/wechat.svg`,
  tiktok: `${iconBase}/tiktok.svg`,
}

const links = computed(() => props.profile.links ?? [])

const resolveIcon = (link: BloggerLink) => platformIconMap[link.platform] ?? ''
</script>

<template>
  <section class="blogger-panel">
    <div class="blogger-card-core">
      <div class="blogger-avatar">{{ profile.avatar }}</div>
      <div class="blogger-body">
        <p class="blogger-name">{{ profile.name }}</p>
        <p class="blogger-bio">{{ profile.bio }}</p>
        <p class="blogger-meta">{{ profile.location }} · {{ profile.status }}</p>
      </div>
    </div>

    <div v-if="links.length" class="blogger-socials">
      <a
        v-for="link in links"
        :key="`${link.platform}-${link.url}`"
        class="blogger-social-link"
        :href="link.url"
        :aria-label="link.label"
        :title="link.label"
        target="_blank"
        rel="noreferrer"
      >
        <img
          v-if="resolveIcon(link)"
          class="blogger-social-icon"
          :src="resolveIcon(link)"
          :alt="link.label"
        />
        <span v-else class="blogger-social-fallback">{{ link.label.slice(0, 1) }}</span>
      </a>
    </div>
  </section>
</template>
