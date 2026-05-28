<script setup lang="ts">
import ContentLayout from '../components/ContentLayout.vue'
import PageSection from '../components/PageSection.vue'
import GalleryCard from '../components/GalleryCard.vue'
import PaginationBar from '../components/PaginationBar.vue'
import { galleryItems } from '../data/site'
import { pageText } from '../data/ui'
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
