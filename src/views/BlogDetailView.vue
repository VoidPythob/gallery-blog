<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import MarkdownIt from 'markdown-it'
import { ArrowLeftIcon } from 'tdesign-icons-vue-next'
import ContentLayout from '../components/ContentLayout.vue'
import { getArticles, getTagSamples, type Article, type TagSample } from '../data/site'

const props = defineProps<{
  id: number
}>()

const router = useRouter()
const article = ref<Article | null>(null)
const tags = ref<TagSample[]>([])
const articleId = computed(() => props.id)
const markdownIt = new MarkdownIt({
  html: false,
  linkify: true,
  breaks: true,
})

const tagNameMap = computed(() => new Map(tags.value.map((item) => [item.id, item.name])))
const renderedMarkdown = computed(() => {
  if (!article.value) return ''
  return markdownIt.render(article.value.markdown)
})
const articleTags = computed(() => article.value?.tagIds.map((id) => ({ id, name: tagNameMap.value.get(id) ?? `标签${id}` })) ?? [])

onMounted(async () => {
  const [list, tagList] = await Promise.all([getArticles(), getTagSamples()])
  article.value = list.find((item) => item.id === articleId.value) ?? null
  tags.value = tagList
})
</script>

<template>
  <ContentLayout>
    <div v-if="article" class="content-card" style="padding: 18px">
      <button class="icon-btn" type="button" @click="router.back()">
        <ArrowLeftIcon />
      </button>
      <h2 style="margin-top: 12px">{{ article.title }}</h2>
      <p class="meta">阅读 {{ Math.ceil(article.readTime / 60) }} 分钟</p>
      <div class="card-cover" style="margin: 12px 0; height: 260px" :style="{ backgroundImage: `url(${article.coverUrl})` }" />
      <p class="desc">{{ article.introduction }}</p>
      <div class="tag-row" style="margin: 10px 0 14px">
        <button
          v-for="tag in articleTags"
          :key="tag.id"
          class="tag-chip tag-chip-link"
          type="button"
          @click="router.push(`/tag/${tag.id}`)"
        >
          {{ tag.name }}
        </button>
      </div>
      <article class="markdown-content" v-html="renderedMarkdown" />
    </div>

    <div v-else class="content-card" style="padding: 18px">
      <button class="icon-btn" type="button" @click="router.back()">
        <ArrowLeftIcon />
      </button>
      <p style="margin-top: 12px">未找到对应博文。</p>
    </div>
  </ContentLayout>
</template>
