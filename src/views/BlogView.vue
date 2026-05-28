<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import ContentLayout from '../components/ContentLayout.vue'
import PageSection from '../components/PageSection.vue'
import ArticleCard from '../components/ArticleCard.vue'
import PaginationBar from '../components/PaginationBar.vue'
import { getArticles, type Article } from '../data/site'
import { pageText } from '../data/ui'

const pageSize = 10
const currentPage = ref(1)
const articles = ref<Article[]>([])
const pagedArticles = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return articles.value.slice(start, start + pageSize)
})

onMounted(async () => {
  articles.value = await getArticles()
})

watch(articles, () => {
  currentPage.value = 1
})
</script>

<template>
  <ContentLayout>
    <PageSection>
      <template #title>
        <h2>{{ pageText.blogTitle }}</h2>
      </template>
      <div class="card-grid">
        <ArticleCard v-for="item in pagedArticles" :key="item.id" v-bind="item" />
      </div>
      <PaginationBar v-model="currentPage" :total="articles.length" :page-size="pageSize" />
    </PageSection>
  </ContentLayout>
</template>
