<script setup lang="ts">
defineProps<{
  title: string
  imageUrl: string
  tags: string[]
  createdAt: string
}>()
</script>

<template>
  <article class="content-card gallery-card">
    <div class="card-cover" :style="{ backgroundImage: `url(${imageUrl})` }" />
    <div class="card-body">
      <h3>{{ title }}</h3>
      <p class="meta">{{ createdAt }}</p>
      <div class="tag-row">
        <span v-for="tag in tags" :key="tag" class="tag-chip">{{ tag }}</span>
      </div>
    </div>
  </article>
</template>
