<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import ContentLayout from '../components/ContentLayout.vue'
import PageSection from '../components/PageSection.vue'
import { getGalleryItems, type GalleryItem } from '../data/site'
import { pageText } from '../data/ui'

const batchSize = 12
const galleryItems = ref<GalleryItem[]>([])
const visibleCount = ref(batchSize)
const loadMoreTrigger = ref<HTMLElement | null>(null)
const failedImageIds = ref<number[]>([])
let observer: IntersectionObserver | null = null

const visibleGalleryItems = computed(() => galleryItems.value.slice(0, visibleCount.value))
const isImageFailed = (id: number) => failedImageIds.value.includes(id)

const handleImageError = (item: GalleryItem) => {
  if (!failedImageIds.value.includes(item.id)) {
    failedImageIds.value = [...failedImageIds.value, item.id]
  }
}

const loadMore = () => {
  if (visibleCount.value >= galleryItems.value.length) return
  visibleCount.value = Math.min(visibleCount.value + batchSize, galleryItems.value.length)
}

onMounted(async () => {
  galleryItems.value = await getGalleryItems()
  visibleCount.value = Math.min(batchSize, galleryItems.value.length || batchSize)

  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0]?.isIntersecting) {
        loadMore()
      }
    },
    { rootMargin: '160px 0px' },
  )

  if (loadMoreTrigger.value) {
    observer.observe(loadMoreTrigger.value)
  }
})

onBeforeUnmount(() => {
  observer?.disconnect()
  observer = null
})
</script>

<template>
  <ContentLayout>
    <PageSection>
      <template #title>
        <h2>{{ pageText.galleryTitle }}</h2>
      </template>
      <div class="page-list-body">
        <div class="waterfall-grid waterfall-grid-spacious">
          <div v-for="item in visibleGalleryItems" :key="item.id" class="gallery-image-frame">
            <img
              v-if="!isImageFailed(item.id)"
              class="gallery-image"
              :src="item.imageUrl"
              :alt="item.title"
              loading="lazy"
              decoding="async"
              @error="handleImageError(item)"
            />
            <div v-else class="gallery-image-fallback">
              <span class="gallery-image-fallback-title">{{ item.title }}</span>
              <span class="gallery-image-fallback-text">图片加载失败</span>
            </div>
          </div>
        </div>
        <div ref="loadMoreTrigger" class="gallery-load-more-trigger" aria-hidden="true" />
      </div>
    </PageSection>
  </ContentLayout>
</template>
