<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import ContentLayout from '../components/ContentLayout.vue'
import { getArticles, type Article } from '../data/site'

const props = defineProps<{
  id: number
}>()

const router = useRouter()
const article = ref<Article | null>(null)
const articleId = computed(() => props.id)

onMounted(async () => {
  const list = await getArticles()
  article.value = list.find((item) => item.id === articleId.value) ?? null
})
</script>

<template>
  <ContentLayout>
    <div v-if="article" class="content-card" style="padding: 18px">
      <button class="icon-btn" type="button" @click="router.back()">返回</button>
      <h2 style="margin-top: 12px">{{ article.title }}</h2>
      <p class="meta">阅读 {{ Math.ceil(article.readTime / 60) }} 分钟</p>
      <div class="card-cover" style="margin: 12px 0; height: 260px" :style="{ backgroundImage: `url(${article.coverUrl})` }" />
      <p class="desc">{{ article.introduction }}</p>
      <div class="tag-row" style="margin: 10px 0 14px">
        <span v-for="tag in article.tags" :key="tag" class="tag-chip">{{ tag }}</span>
      </div>
      <pre style="white-space: pre-wrap; margin: 0">{{ article.markdown }}</pre>
    </div>

    <div v-else class="content-card" style="padding: 18px">
      <button class="icon-btn" type="button" @click="router.back()">返回</button>
      <p style="margin-top: 12px">未找到对应博文。</p>
    </div>
  </ContentLayout>
</template>
