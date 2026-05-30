<script setup lang="ts">
import ContentLayout from '../components/ContentLayout.vue'
import PageSection from '../components/PageSection.vue'
import { friendLinks, pageText } from '../data/ui'

const getFriendMark = (name: string) => name.trim().slice(0, 1).toUpperCase()
</script>

<template>
  <ContentLayout>
    <PageSection>
      <template #title>
        <h2>{{ pageText.friendTitle }}</h2>
      </template>
      <div class="friend-list">
        <a
          v-for="item in friendLinks"
          :key="item.name"
          :href="item.href"
          class="friend-card"
          target="_blank"
          rel="noreferrer"
        >
          <span class="friend-card-icon">
            <img v-if="item.icon" :src="item.icon" :alt="`${item.name} 图标`" class="friend-card-icon-image" />
            <span v-else class="friend-card-icon-fallback">{{ getFriendMark(item.name) }}</span>
          </span>
          <span class="friend-card-name">{{ item.name }}</span>
        </a>
      </div>
    </PageSection>
  </ContentLayout>
</template>

