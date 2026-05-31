<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { ChevronDownIcon } from 'tdesign-icons-vue-next'
import ContentLayout from '../components/ContentLayout.vue'
import PageSection from '../components/PageSection.vue'
import ArticleCard from '../components/ArticleCard.vue'
import GalleryCard from '../components/GalleryCard.vue'
import PaginationBar from '../components/PaginationBar.vue'
import { getArticles, getDailyWord, getGalleryItems, type Article, type GalleryItem } from '../data/site'
import { heroConfig, pageText } from '../data/ui'

const HOME_CONTENT_ANIMATED_KEY = 'home-content-animated'
const HOME_PAGE_SIZE = 10

const typedQuote = ref('')
const articles = ref<Article[]>([])
const galleryItems = ref<GalleryItem[]>([])
const featuredGalleryItems = computed(() => galleryItems.value.filter((item) => item.isFeatured))
const articlePage = ref(1)
const galleryPage = ref(1)
const enableContentAnimation = ref(false)
const heroScrollClicked = ref(false)

let timer: number | undefined
let index = 0
let dailyQuote = ''

const pagedArticles = computed(() => {
  const start = (articlePage.value - 1) * HOME_PAGE_SIZE
  return articles.value.slice(start, start + HOME_PAGE_SIZE)
})

const pagedFeaturedGalleryItems = computed(() => {
  const start = (galleryPage.value - 1) * HOME_PAGE_SIZE
  return featuredGalleryItems.value.slice(start, start + HOME_PAGE_SIZE)
})

const step = () => {
  if (index <= dailyQuote.length) {
    typedQuote.value = dailyQuote.slice(0, index)
    index += 1
    timer = window.setTimeout(step, 120)
    return
  }

  timer = window.setTimeout(() => {
    typedQuote.value = ''
    index = 0
    timer = window.setTimeout(step, 120)
  }, 1800)
}

onMounted(() => {
  enableContentAnimation.value = !window.sessionStorage.getItem(HOME_CONTENT_ANIMATED_KEY)
  void (async () => {
    const [word, articleList, galleryList] = await Promise.all([getDailyWord(), getArticles(), getGalleryItems()])
    dailyQuote = word
    articles.value = articleList
    galleryItems.value = galleryList
    step()
  })()
})

onBeforeUnmount(() => {
  if (timer) {
    window.clearTimeout(timer)
  }
})

watch(articles, (list) => {
  const totalPages = Math.max(1, Math.ceil(list.length / HOME_PAGE_SIZE))
  if (articlePage.value > totalPages) {
    articlePage.value = totalPages
  }
})

watch(featuredGalleryItems, (list) => {
  const totalPages = Math.max(1, Math.ceil(list.length / HOME_PAGE_SIZE))
  if (galleryPage.value > totalPages) {
    galleryPage.value = totalPages
  }
})

const handleEnterContent = () => {
  if (heroScrollClicked.value) {
    return
  }
  heroScrollClicked.value = true
  enableContentAnimation.value = false
  window.sessionStorage.setItem(HOME_CONTENT_ANIMATED_KEY, '1')
}
</script>

<template>
  <div class="home-page">
    <section class="hero-panel">
      <div class="hero-overlay">
        <p class="hero-kicker">{{ heroConfig.kicker }}</p>
        <h1>{{ heroConfig.title }}</h1>
        <div class="hero-typing">
          <span class="typing-line">{{ typedQuote }}</span><span class="typing-caret">|</span>
        </div>
      </div>
      <a class="hero-scroll" href="#home-content" :aria-label="heroConfig.enterText" @click="handleEnterContent">
        <ChevronDownIcon />
      </a>
    </section>

    <section id="home-content" class="content-area" :class="{ 'home-content-static': !enableContentAnimation }">
      <ContentLayout>
        <PageSection>
          <template #title>
            <h2>{{ pageText.pinnedTitle }}</h2>
          </template>
          <div class="card-grid card-grid-spacious">
            <ArticleCard v-for="item in pagedArticles" :key="item.id" v-bind="item" />
          </div>
          <div class="page-list-footer">
            <PaginationBar v-model="articlePage" :total="articles.length" :page-size="HOME_PAGE_SIZE" />
          </div>
        </PageSection>

        <PageSection>
          <template #title>
            <h2>{{ pageText.featuredGalleryTitle }}</h2>
          </template>
          <div class="card-grid card-grid-spacious">
            <GalleryCard v-for="item in pagedFeaturedGalleryItems" :key="item.id" v-bind="item" />
          </div>
          <div class="page-list-footer">
            <PaginationBar
              v-model="galleryPage"
              :total="featuredGalleryItems.length"
              :page-size="HOME_PAGE_SIZE"
            />
          </div>
        </PageSection>
      </ContentLayout>
    </section>
  </div>
</template>
