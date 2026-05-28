<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import ContentLayout from '../components/ContentLayout.vue'
import PageSection from '../components/PageSection.vue'
import GalleryCard from '../components/GalleryCard.vue'
import PaginationBar from '../components/PaginationBar.vue'
import { getGalleryItems, type GalleryItem } from '../data/site'
import { pageText } from '../data/ui'

const pageSize = 10
const currentPage = ref(1)
const galleryItems = ref<GalleryItem[]>([])
const pagedGalleryItems = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return galleryItems.value.slice(start, start + pageSize)
})

onMounted(async () => {
  galleryItems.value = await getGalleryItems()
})

watch(galleryItems, () => {
  currentPage.value = 1
})
</script>

<template>
  <ContentLayout>
    <PageSection>
      <template #title>
        <h2>{{ pageText.galleryTitle }}</h2>
      </template>
      <div class="card-grid">
        <GalleryCard v-for="item in pagedGalleryItems" :key="item.id" v-bind="item" />
      </div>
      <PaginationBar v-model="currentPage" :total="galleryItems.length" :page-size="pageSize" />
    </PageSection>
  </ContentLayout>
</template>
