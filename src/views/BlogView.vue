<script setup lang="ts">
import { onMounted, ref } from 'vue'
import ContentLayout from '../components/ContentLayout.vue'
import PageSection from '../components/PageSection.vue'
import ArticleCard from '../components/ArticleCard.vue'
import PaginationBar from '../components/PaginationBar.vue'
import { getArticles, type Article } from '../data/site'
import { pageText } from '../data/ui'

const articles = ref<Article[]>([])

onMounted(async () => {
  articles.value = await getArticles()
})
</script>

<template>
  <ContentLayout>
    <PageSection>
      <template #title>
        <h2>{{ pageText.blogTitle }}</h2>
      </template>
      <div class="card-grid">
        <ArticleCard v-for="item in articles" :key="item.id" v-bind="item" />
      </div>
      <PaginationBar />
    </PageSection>
  </ContentLayout>
</template>
