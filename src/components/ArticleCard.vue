<script setup lang="ts">
defineProps<{
  title: string
  introduction: string
  coverUrl: string
  tags: string[]
  isToped: boolean
  readTime: number
}>()
</script>

<template>
  <article class="content-card article-card">
    <div class="card-cover" :style="{ backgroundImage: `url(${coverUrl})` }">
      <span v-if="isToped" class="badge">置顶</span>
    </div>
    <div class="card-body">
      <h3>{{ title }}</h3>
      <p class="meta">阅读 {{ Math.ceil(readTime / 60) }} 分钟</p>
      <p class="desc">{{ introduction }}</p>
      <div class="tag-row">
        <span v-for="tag in tags" :key="tag" class="tag-chip">{{ tag }}</span>
      </div>
    </div>
  </article>
</template>
