<script setup lang="ts">
import ContentLayout from '../components/ContentLayout.vue'
import PageSection from '../components/PageSection.vue'
import ArticleCard from '../components/ArticleCard.vue'
import PaginationBar from '../components/PaginationBar.vue'
import { articles } from '../data/site'
import { pageText } from '../data/ui'
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
