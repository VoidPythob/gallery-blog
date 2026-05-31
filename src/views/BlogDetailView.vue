<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import MarkdownIt from 'markdown-it'
import { ImageViewer } from 'tdesign-vue-next'
import { ArrowLeftIcon } from 'tdesign-icons-vue-next'
import ContentLayout from '../components/ContentLayout.vue'
import { getArticles, getTagSamples, type Article, type TagSample } from '../data/site'

const props = defineProps<{
  id: number
}>()

const router = useRouter()
const article = ref<Article | null>(null)
const tags = ref<TagSample[]>([])
const markdownRef = ref<HTMLElement | null>(null)
const viewerVisible = ref(false)
const viewerImages = ref<string[]>([])
const viewerIndex = ref(0)
const articleId = computed(() => props.id)
const markdownIt = new MarkdownIt({
  html: false,
  linkify: true,
  breaks: true,
})

markdownIt.renderer.rules.image = (tokens, index) => {
  const token = tokens[index]
  const src = token.attrGet('src') ?? ''
  const alt = token.content ?? ''
  const title = token.attrGet('title')

  const escapedSrc = markdownIt.utils.escapeHtml(src)
  const escapedAlt = markdownIt.utils.escapeHtml(alt)
  const escapedTitle = title ? ` title="${markdownIt.utils.escapeHtml(title)}"` : ''

  return `<img class="markdown-preview-image" src="${escapedSrc}" alt="${escapedAlt}" data-preview-src="${escapedSrc}"${escapedTitle}>`
}

const tagNameMap = computed(() => new Map(tags.value.map((item) => [item.id, item.name])))
const renderedMarkdown = computed(() => {
  if (!article.value) return ''
  return markdownIt.render(article.value.markdown)
})
const articleTags = computed(() => article.value?.tagIds.map((id) => ({ id, name: tagNameMap.value.get(id) ?? `标签${id}` })) ?? [])

const collectViewerImages = () => {
  const coverImages = article.value?.coverUrl ? [article.value.coverUrl] : []
  const markdownImages = Array.from(markdownRef.value?.querySelectorAll<HTMLImageElement>('.markdown-preview-image') ?? [])
    .map((item) => item.dataset.previewSrc || item.src)
    .filter(Boolean)

  return [...coverImages, ...markdownImages]
}

const openPreview = (targetSrc: string) => {
  const images = collectViewerImages()
  const currentIndex = images.findIndex((item) => item === targetSrc)

  viewerImages.value = images.length ? images : [targetSrc]
  viewerIndex.value = currentIndex >= 0 ? currentIndex : 0
  viewerVisible.value = true
}

const openMarkdownImage = (event: MouseEvent) => {
  const target = event.target
  if (!(target instanceof HTMLElement)) return

  const image = target.closest('.markdown-preview-image')
  if (!(image instanceof HTMLImageElement)) return

  openPreview(image.dataset.previewSrc || image.src)
}

const openCoverPreview = () => {
  if (!article.value?.coverUrl) return
  openPreview(article.value.coverUrl)
}

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
      <img
        :src="article.coverUrl"
        :alt="article.title"
        class="gallery-detail-image markdown-preview-image"
        style="margin: 12px 0; height: 260px"
        @click="openCoverPreview"
      >
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
      <article ref="markdownRef" class="markdown-content" v-html="renderedMarkdown" @click="openMarkdownImage" />
    </div>

    <div v-else class="content-card" style="padding: 18px">
      <button class="icon-btn" type="button" @click="router.back()">
        <ArrowLeftIcon />
      </button>
      <p style="margin-top: 12px">未找到对应博文。</p>
    </div>

    <ImageViewer
      v-model:visible="viewerVisible"
      :images="viewerImages"
      :default-index="viewerIndex"
      mode="modal"
      :show-overlay="true"
    />
  </ContentLayout>
</template>
