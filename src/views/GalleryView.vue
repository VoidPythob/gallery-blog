<script setup lang="ts">
import { onMounted, ref } from 'vue'
import ContentLayout from '../components/ContentLayout.vue'
import PageSection from '../components/PageSection.vue'
import GalleryCard from '../components/GalleryCard.vue'
import PaginationBar from '../components/PaginationBar.vue'
import { getGalleryItems, type GalleryItem } from '../data/site'
import { pageText } from '../data/ui'

const galleryItems = ref<GalleryItem[]>([])

onMounted(async () => {
  galleryItems.value = await getGalleryItems()
})
</script>

<template>
  <ContentLayout>
    <PageSection>
      <template #title>
        <h2>{{ pageText.galleryTitle }}</h2>
      </template>
      <div class="card-grid">
        <GalleryCard v-for="item in galleryItems" :key="item.id" v-bind="item" />
      </div>
      <PaginationBar />
    </PageSection>
  </ContentLayout>
</template>
