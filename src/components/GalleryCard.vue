<script setup lang="ts">
import { useRouter } from 'vue-router'

defineProps<{
  id: number
  title: string
  imageUrl: string
  tagIds: number[]
  tags: string[]
  createdAt: string
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
    class="content-card gallery-card article-card"
    role="button"
    tabindex="0"
    @click="router.push(`/gallery/${id}`)"
    @keyup.enter="router.push(`/gallery/${id}`)"
  >
    <div class="card-cover" :style="{ backgroundImage: `url(${imageUrl})` }" />
    <div class="card-body">
      <h3>{{ title }}</h3>
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
      <p class="meta">{{ createdAt }}</p>
    </div>
  </article>
</template>
