<script setup lang="ts">
import type { BloggerProfile } from '../data/site'

defineProps<{
  profile: BloggerProfile
}>()
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
  </section>
</template>
