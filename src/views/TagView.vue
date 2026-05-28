<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import ContentLayout from '../components/ContentLayout.vue'
import PageSection from '../components/PageSection.vue'
import ModeSwitch from '../components/ModeSwitch.vue'
import ArticleCard from '../components/ArticleCard.vue'
import GalleryCard from '../components/GalleryCard.vue'
import PaginationBar from '../components/PaginationBar.vue'
import { articles, galleryItems } from '../data/site'
import { pageText } from '../data/ui'

const route = useRoute()
const mode = ref<'article' | 'gallery'>('article')
const tagName = computed(() => String(route.params.tagName || ''))

const filteredArticles = computed(() => articles.filter((item) => item.tags.includes(tagName.value)))
const filteredGallery = computed(() => galleryItems.filter((item) => item.tags.includes(tagName.value)))
</script>

<template>
  <ContentLayout>
    <PageSection>
      <template #title>
        <h2>{{ pageText.tagTitle(tagName) }}</h2>
      </template>
      <template #action>
        <ModeSwitch v-model="mode" />
      </template>

      <div v-if="mode === 'article'" class="card-grid">
        <ArticleCard v-for="item in filteredArticles" :key="item.id" v-bind="item" />
      </div>

      <div v-else class="card-grid">
        <GalleryCard v-for="item in filteredGallery" :key="item.id" v-bind="item" />
      </div>

      <PaginationBar />
    </PageSection>
  </ContentLayout>
</template>
