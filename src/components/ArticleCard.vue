<script setup lang="ts">
import { useRouter } from 'vue-router'

defineProps<{
  id: number
  title: string
  introduction: string
  coverUrl: string
  tagIds: number[]
  tags: string[]
  isToped: boolean
  readTime: number
}>()

const router = useRouter()

const onTagClick = (event: MouseEvent, tagId: number) => {
  event.stopPropagation()
  if (!tagId) return
  void router.push(`/tag/${tagId}`)
}
</script>

<template>
  <article
    class="content-card article-card"
    role="button"
    tabindex="0"
    @click="router.push(`/blog/${id}`)"
    @keyup.enter="router.push(`/blog/${id}`)"
  >
    <div class="card-cover" :style="{ backgroundImage: `url(${coverUrl})` }">
      <span v-if="isToped" class="badge">置顶</span>
    </div>
    <div class="card-body">
      <h3>{{ title }}</h3>
      <p class="meta">阅读 {{ Math.ceil(readTime / 60) }} 分钟</p>
      <p class="desc">{{ introduction }}</p>
      <div class="tag-row">
        <button
          v-for="(tag, index) in tags"
          :key="`${tag}-${tagIds[index] ?? index}`"
          class="tag-chip tag-chip-link"
          type="button"
          @click="onTagClick($event, tagIds[index] ?? 0)"
        >
          {{ tag }}
        </button>
      </div>
    </div>
  </article>
</template>
