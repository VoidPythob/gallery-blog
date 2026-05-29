<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import ContentLayout from '../components/ContentLayout.vue'
import PageSection from '../components/PageSection.vue'
import ModeSwitch from '../components/ModeSwitch.vue'
import ArticleCard from '../components/ArticleCard.vue'
import GalleryCard from '../components/GalleryCard.vue'
import PaginationBar from '../components/PaginationBar.vue'
import { getArticles, getGalleryItems, getTagRelations, getTagSamples, type Article, type GalleryItem, type TagSample } from '../data/site'
import { pageText } from '../data/ui'

const props = defineProps<{
  tagId: number
}>()

const mode = ref<'article' | 'gallery'>('article')
const pageSize = 10
const articlePage = ref(1)
const galleryPage = ref(1)
const articles = ref<Article[]>([])
const galleryItems = ref<GalleryItem[]>([])
const tags = ref<TagSample[]>([])
const relatedArticleIds = ref<number[]>([])
const relatedGalleryIds = ref<number[]>([])

const currentTagName = computed(() => tags.value.find((item) => item.id === props.tagId)?.name ?? `标签${props.tagId}`)
const filteredArticles = computed(() => {
  const idSet = new Set(relatedArticleIds.value)
  return articles.value.filter((item) => idSet.has(item.id))
})
const filteredGallery = computed(() => {
  const idSet = new Set(relatedGalleryIds.value)
  return galleryItems.value.filter((item) => idSet.has(item.id))
})

const pagedArticles = computed(() => {
  const start = (articlePage.value - 1) * pageSize
  return filteredArticles.value.slice(start, start + pageSize)
})

const pagedGallery = computed(() => {
  const start = (galleryPage.value - 1) * pageSize
  return filteredGallery.value.slice(start, start + pageSize)
})

const refreshRelations = async () => {
  const relations = await getTagRelations(props.tagId)
  relatedArticleIds.value = relations.articleIds
  relatedGalleryIds.value = relations.galleryIds
  articlePage.value = 1
  galleryPage.value = 1
}

onMounted(async () => {
  const [articleList, galleryList, tagList] = await Promise.all([getArticles(), getGalleryItems(), getTagSamples()])
  articles.value = articleList
  galleryItems.value = galleryList
  tags.value = tagList
  await refreshRelations()
})

watch(
  () => props.tagId,
  () => {
    void refreshRelations()
  },
)
</script>

<template>
  <ContentLayout>
    <PageSection>
      <template #title>
        <h2>{{ pageText.tagTitlePrefix }}{{ currentTagName }}</h2>
      </template>
      <template #action>
        <ModeSwitch v-model="mode" />
      </template>

      <div class="page-list-body">
        <div v-if="mode === 'article'" class="card-grid card-grid-spacious">
          <ArticleCard v-for="item in pagedArticles" :key="item.id" v-bind="item" />
        </div>

        <div v-else class="card-grid card-grid-spacious">
          <GalleryCard v-for="item in pagedGallery" :key="item.id" v-bind="item" />
        </div>
      </div>

      <div class="page-list-footer">
        <PaginationBar
          v-if="mode === 'article'"
          v-model="articlePage"
          :total="filteredArticles.length"
          :page-size="pageSize"
        />
        <PaginationBar v-else v-model="galleryPage" :total="filteredGallery.length" :page-size="pageSize" />
      </div>
    </PageSection>
  </ContentLayout>
</template>
