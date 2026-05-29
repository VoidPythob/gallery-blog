<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getBlogger, type BloggerProfile } from '../data/site'
import Sidebar from './Sidebar.vue'
import BloggerCard from './BloggerCard.vue'

const blogger = ref<BloggerProfile | null>(null)

onMounted(async () => {
  blogger.value = await getBlogger()
})
</script>

<template>
  <div class="content-layout">
    <div class="content-aside">
      <BloggerCard v-if="blogger" :profile="blogger" />
      <Sidebar />
    </div>
    <div class="content-main">
      <slot />
    </div>
  </div>
</template>
