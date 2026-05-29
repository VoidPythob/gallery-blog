<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import ContentLayout from '../components/ContentLayout.vue'
import PageSection from '../components/PageSection.vue'
import { getGalleryItems, type GalleryItem } from '../data/site'
import { pageText } from '../data/ui'

const batchSize = 12
const galleryItems = ref<GalleryItem[]>([])
const visibleCount = ref(batchSize)
const loadMoreTrigger = ref<HTMLElement | null>(null)
const failedImageIds = ref<number[]>([])
const loadedImageIds = ref<number[]>([])
const tiltStyles = ref<Record<number, { rx: number; ry: number; scale: number }>>({})
const router = useRouter()
let observer: IntersectionObserver | null = null

const visibleGalleryItems = computed(() => galleryItems.value.slice(0, visibleCount.value))
const isImageFailed = (id: number) => failedImageIds.value.includes(id)
const isImageLoaded = (id: number) => loadedImageIds.value.includes(id)
const getTiltStyle = (id: number) => {
  const tilt = tiltStyles.value[id] ?? { rx: 0, ry: 0, scale: 1 }
  return {
    '--tilt-rx': `${tilt.rx}deg`,
    '--tilt-ry': `${tilt.ry}deg`,
    '--tilt-scale': `${tilt.scale}`,
  }
}

const handleImageError = (item: GalleryItem) => {
  if (!failedImageIds.value.includes(item.id)) {
    failedImageIds.value = [...failedImageIds.value, item.id]
  }
}

const handleImageLoad = (item: GalleryItem) => {
  if (!loadedImageIds.value.includes(item.id)) {
    loadedImageIds.value = [...loadedImageIds.value, item.id]
  }
}

const onPointerMove = (event: MouseEvent, id: number) => {
  const element = event.currentTarget as HTMLElement | null
  if (!element) return
  const rect = element.getBoundingClientRect()
  const px = (event.clientX - rect.left) / rect.width
  const py = (event.clientY - rect.top) / rect.height
  const maxTilt = 14
  const ry = (px - 0.5) * maxTilt * 2
  const rx = (0.5 - py) * maxTilt * 2
  tiltStyles.value[id] = {
    rx,
    ry,
      scale: 1.08,
  }
}

const onPointerLeave = (id: number) => {
  tiltStyles.value[id] = {
    rx: 0,
    ry: 0,
    scale: 1,
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
          <div
            v-for="item in visibleGalleryItems"
            :key="item.id"
            class="gallery-image-frame"
            :style="getTiltStyle(item.id)"
            role="button"
            tabindex="0"
            @mousemove="onPointerMove($event, item.id)"
            @mouseleave="onPointerLeave(item.id)"
            @click="router.push(`/gallery/${item.id}`)"
            @keyup.enter="router.push(`/gallery/${item.id}`)"
          >
            <div v-if="!isImageLoaded(item.id) && !isImageFailed(item.id)" class="gallery-image-skeleton" />
            <img
              v-if="!isImageFailed(item.id)"
              class="gallery-image"
              :class="{ 'is-ready': isImageLoaded(item.id) }"
              :src="item.imageUrl"
              :alt="item.title"
              loading="lazy"
              decoding="async"
              @load="handleImageLoad(item)"
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
