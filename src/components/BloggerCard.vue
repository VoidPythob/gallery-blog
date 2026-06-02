<script setup lang="ts">
import { computed, ref, watch } from 'vue'
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
const avatarValue = computed(() => props.profile.avatar?.trim() ?? '')
const avatarLoadFailed = ref(false)
const isAvatarImage = computed(() => /^(https?:\/\/|data:image\/|\/)/i.test(avatarValue.value))
const avatarFallbackText = computed(() => {
  const name = props.profile.name.trim()
  if (name) return name.slice(0, 1)

  return '?'
})

watch(avatarValue, () => {
  avatarLoadFailed.value = false
})

const resolveIcon = (link: BloggerLink) => platformIconMap[link.platform] ?? ''
</script>

<template>
  <section class="blogger-panel">
    <div class="blogger-card-core">
      <div class="blogger-avatar">
        <img
          v-if="isAvatarImage && !avatarLoadFailed"
          class="blogger-avatar-image"
          :src="avatarValue"
          :alt="profile.name"
          @error="avatarLoadFailed = true"
        >
        <span v-else>{{ avatarFallbackText }}</span>
      </div>
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
