<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import ContentLayout from '../components/ContentLayout.vue'
import PageSection from '../components/PageSection.vue'
import ArticleCard from '../components/ArticleCard.vue'
import GalleryCard from '../components/GalleryCard.vue'
import { articles, galleryItems } from '../data/site'
import { getDailyWord, heroConfig, pageText } from '../data/ui'

const dailyQuote = getDailyWord()
const typedQuote = ref('')

let timer: number | undefined
let index = 0

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
  step()
})

onBeforeUnmount(() => {
  if (timer) {
    window.clearTimeout(timer)
  }
})
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
        <a class="hero-scroll" href="#home-content">{{ heroConfig.enterText }}</a>
      </div>
    </section>

    <section id="home-content" class="content-area">
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
            <GalleryCard v-for="item in galleryItems" :key="item.id" v-bind="item" />
          </div>
        </PageSection>
      </ContentLayout>
    </section>
  </div>
</template>
