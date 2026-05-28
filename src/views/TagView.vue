<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import ContentLayout from '../components/ContentLayout.vue'
import PageSection from '../components/PageSection.vue'
import ModeSwitch from '../components/ModeSwitch.vue'
import ArticleCard from '../components/ArticleCard.vue'
import GalleryCard from '../components/GalleryCard.vue'
import PaginationBar from '../components/PaginationBar.vue'
import { getArticles, getGalleryItems, type Article, type GalleryItem } from '../data/site'
import { pageText } from '../data/ui'

const props = defineProps<{
  tag: string
}>()

const mode = ref<'article' | 'gallery'>('article')
const pageSize = 10
const articlePage = ref(1)
const galleryPage = ref(1)
const articles = ref<Article[]>([])
const galleryItems = ref<GalleryItem[]>([])

const filteredArticles = computed(() => articles.value.filter((item) => item.tags.includes(props.tag)))
const filteredGallery = computed(() => galleryItems.value.filter((item) => item.tags.includes(props.tag)))
const pagedArticles = computed(() => {
  const start = (articlePage.value - 1) * pageSize
  return filteredArticles.value.slice(start, start + pageSize)
})
const pagedGallery = computed(() => {
  const start = (galleryPage.value - 1) * pageSize
  return filteredGallery.value.slice(start, start + pageSize)
})

onMounted(async () => {
  const [articleList, galleryList] = await Promise.all([getArticles(), getGalleryItems()])
  articles.value = articleList
  galleryItems.value = galleryList
})
</script>

<template>
  <ContentLayout>
    <PageSection>
      <template #title>
        <h2>{{ pageText.tagTitlePrefix }}{{ props.tag }}</h2>
      </template>
      <template #action>
        <ModeSwitch v-model="mode" />
      </template>

      <div v-if="mode === 'article'" class="card-grid">
        <ArticleCard v-for="item in pagedArticles" :key="item.id" v-bind="item" />
      </div>

      <div v-else class="card-grid">
        <GalleryCard v-for="item in pagedGallery" :key="item.id" v-bind="item" />
      </div>

      <PaginationBar
        v-if="mode === 'article'"
        v-model="articlePage"
        :total="filteredArticles.length"
        :page-size="pageSize"
      />
      <PaginationBar v-else v-model="galleryPage" :total="filteredGallery.length" :page-size="pageSize" />
    </PageSection>
  </ContentLayout>
</template>
