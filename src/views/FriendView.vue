<script setup lang="ts">
import ContentLayout from '../components/ContentLayout.vue'
import PageSection from '../components/PageSection.vue'
import { friendLinks, pageText } from '../data/ui'
</script>

<template>
  <ContentLayout>
    <PageSection>
      <template #title>
        <h2>{{ pageText.friendTitle }}</h2>
      </template>
      <div class="friend-list">
        <a v-for="item in friendLinks" :key="item.name" :href="item.href" class="friend-card">{{ item.name }}</a>
      </div>
    </PageSection>
  </ContentLayout>
</template>
