<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { ChevronDownIcon } from 'tdesign-icons-vue-next'
import ContentLayout from '../components/ContentLayout.vue'
import PageSection from '../components/PageSection.vue'
import ArticleCard from '../components/ArticleCard.vue'
import GalleryCard from '../components/GalleryCard.vue'
import { getArticles, getDailyWord, getGalleryItems, type Article, type GalleryItem } from '../data/site'
import { heroConfig, pageText } from '../data/ui'

const HOME_CONTENT_ANIMATED_KEY = 'home-content-animated'

const typedQuote = ref('')
const articles = ref<Article[]>([])
const galleryItems = ref<GalleryItem[]>([])
const featuredGalleryItems = computed(() => galleryItems.value.filter((item) => item.isFeatured))
const enableContentAnimation = ref(false)
const heroScrollClicked = ref(false)

let timer: number | undefined
let index = 0
let dailyQuote = ''

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
          <div class="card-grid">
            <ArticleCard v-for="item in articles" :key="item.id" v-bind="item" />
          </div>
        </PageSection>

        <PageSection>
          <template #title>
            <h2>{{ pageText.featuredGalleryTitle }}</h2>
          </template>
          <div class="card-grid">
            <GalleryCard v-for="item in featuredGalleryItems" :key="item.id" v-bind="item" />
          </div>
        </PageSection>
      </ContentLayout>
    </section>
  </div>
</template>
