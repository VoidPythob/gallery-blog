<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { SearchIcon } from 'tdesign-icons-vue-next'
import { MessagePlugin } from 'tdesign-vue-next'
import { navItems, pageText } from '../data/ui'
import { getArticles, getGalleryItems } from '../data/site'

type SearchCandidate = {
  id: string
  label: string
  to: string
  type: 'page' | 'article' | 'gallery'
}

const router = useRouter()
const keyword = ref('')
const focused = ref(false)
const loading = ref(false)
const activeIndex = ref(-1)
const candidates = ref<SearchCandidate[]>([])

const normalize = (value: string) => value.trim().toLowerCase()

const baseCandidates: SearchCandidate[] = [
  { id: 'page-home', label: '首页', to: '/', type: 'page' },
  { id: 'page-blog', label: pageText.blogTitle, to: '/blog', type: 'page' },
  { id: 'page-gallery', label: pageText.galleryTitle, to: '/gallery', type: 'page' },
  { id: 'page-friend', label: pageText.friendTitle, to: '/friend', type: 'page' },
  ...navItems.map((item) => ({
    id: `nav-${item.to}`,
    label: item.label,
    to: item.to,
    type: 'page' as const,
  })),
]

const loadCandidates = async () => {
  loading.value = true
  const [articles, galleryItems] = await Promise.all([getArticles(), getGalleryItems()])
  const articleCandidates: SearchCandidate[] = articles.map((item) => ({
    id: `article-${item.id}`,
    label: item.title,
    to: `/blog/${item.id}`,
    type: 'article',
  }))
  const galleryCandidates: SearchCandidate[] = galleryItems.map((item) => ({
    id: `gallery-${item.id}`,
    label: item.title,
    to: '/gallery',
    type: 'gallery',
  }))
  candidates.value = [...baseCandidates, ...articleCandidates, ...galleryCandidates]
  loading.value = false
}

onMounted(() => {
  void loadCandidates()
})

const fuzzyIncludes = (source: string, query: string) => {
  if (!query) return true
  if (source.includes(query)) return true
  let i = 0
  for (const ch of source) {
    if (ch === query[i]) i += 1
    if (i >= query.length) return true
  }
  return false
}

const filteredCandidates = computed(() => {
  const query = normalize(keyword.value)
  if (!query) return []
  return candidates.value
    .filter((item) => fuzzyIncludes(normalize(item.label), query))
    .slice(0, 8)
})

const showSuggest = computed(() => {
  const query = normalize(keyword.value)
  if (!query) return false
  return focused.value && (loading.value || filteredCandidates.value.length > 0)
})

watch(filteredCandidates, (list) => {
  activeIndex.value = list.length ? 0 : -1
})

const goTo = async (item: SearchCandidate, text: string) => {
  keyword.value = text
  focused.value = false
  await router.push(item.to)
  MessagePlugin.success(`搜索成功：${item.label}`)
}

const pickByIndex = async () => {
  if (!filteredCandidates.value.length) return false
  const index = activeIndex.value >= 0 ? activeIndex.value : 0
  const item = filteredCandidates.value[index]
  if (!item) return false
  await goTo(item, item.label)
  return true
}

const moveActive = (delta: number) => {
  const total = filteredCandidates.value.length
  if (!total) return
  if (activeIndex.value < 0) {
    activeIndex.value = 0
    return
  }
  activeIndex.value = (activeIndex.value + delta + total) % total
}

const handleSearch = async () => {
  const query = keyword.value.trim()
  if (!query) {
    MessagePlugin.error('请输入搜索关键词')
    return
  }
  if (loading.value) {
    MessagePlugin.warning('搜索索引加载中，请稍后重试')
    return
  }

  const first = filteredCandidates.value[0]
  if (!first) {
    MessagePlugin.error(`搜索失败：未找到“${query}”`)
    return
  }
  await goTo(first, first.label)
}

const onKeydown = async (event: KeyboardEvent) => {
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    moveActive(1)
    return
  }
  if (event.key === 'ArrowUp') {
    event.preventDefault()
    moveActive(-1)
    return
  }
  if (event.key === 'Escape') {
    focused.value = false
    return
  }
  if (event.key === 'Enter') {
    event.preventDefault()
    const usedCandidate = await pickByIndex()
    if (!usedCandidate) {
      await handleSearch()
    }
  }
}
</script>

<template>
  <div class="search-bar" @focusin="focused = true" @focusout="focused = false">
    <input
      v-model="keyword"
      class="search-input"
      type="search"
      placeholder="搜索页面/博文/画廊"
      @keydown="onKeydown"
    />
    <button class="icon-btn search-btn" type="button" aria-label="搜索" @click="handleSearch">
      <SearchIcon />
    </button>

    <div v-if="showSuggest" class="search-suggest">
      <div v-if="loading" class="search-suggest-item muted">搜索索引加载中...</div>
      <button
        v-for="item in filteredCandidates"
        v-else
        :key="item.id"
        class="search-suggest-item"
        :class="{ active: filteredCandidates[activeIndex]?.id === item.id }"
        type="button"
        @mouseenter="activeIndex = filteredCandidates.findIndex((x) => x.id === item.id)"
        @mousedown.prevent="goTo(item, item.label)"
      >
        <span>{{ item.label }}</span>
        <small>{{ item.type }}</small>
      </button>
    </div>
  </div>
</template>
