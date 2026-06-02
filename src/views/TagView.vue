<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Button, Input, Popup } from 'tdesign-vue-next'
import { SearchIcon } from 'tdesign-icons-vue-next'
import ContentLayout from '../components/ContentLayout.vue'
import PageSection from '../components/PageSection.vue'
import ModeSwitch from '../components/ModeSwitch.vue'
import ArticleCard from '../components/ArticleCard.vue'
import GalleryCard from '../components/GalleryCard.vue'
import PaginationBar from '../components/PaginationBar.vue'
import {
  getArticles,
  getGalleryItems,
  getTagSamples,
  type Article,
  type GalleryItem,
  type TagSample,
} from '../data/site'
import { pageText } from '../data/ui'

const route = useRoute()
const router = useRouter()

const mode = ref<'article' | 'gallery'>('article')
const pageSize = 9
const tagPageSize = 9
const articlePage = ref(1)
const galleryPage = ref(1)
const tagPage = ref(1)
const tagPopupVisible = ref(false)
const tagKeyword = ref('')
const articles = ref<Article[]>([])
const galleryItems = ref<GalleryItem[]>([])
const tags = ref<TagSample[]>([])

const selectedTagId = computed<number | null>(() => {
  const raw = route.params.tagId
  const value = typeof raw === 'string' ? Number(raw) : Number(Array.isArray(raw) ? raw[0] : raw)
  return Number.isFinite(value) && value > 0 ? value : null
})

const currentTagName = computed(() => {
  if (selectedTagId.value === null) return '全部'
  return tags.value.find((item) => item.id === selectedTagId.value)?.name ?? `标签${selectedTagId.value}`
})

const normalizedKeyword = computed(() => tagKeyword.value.trim().toLowerCase())

const filteredTagOptions = computed(() => {
  const keyword = normalizedKeyword.value
  const list = keyword ? tags.value.filter((item) => item.name.toLowerCase().includes(keyword)) : tags.value

  return [
    {
      id: 0,
      name: '全部',
    },
    ...list,
  ]
})

const pagedTagOptions = computed(() => {
  const start = (tagPage.value - 1) * tagPageSize
  return filteredTagOptions.value.slice(start, start + tagPageSize)
})

const filteredArticles = computed(() => {
  const tagId = selectedTagId.value
  if (tagId === null) return articles.value
  return articles.value.filter((item) => item.tagIds.includes(tagId))
})

const filteredGallery = computed(() => {
  const tagId = selectedTagId.value
  if (tagId === null) return galleryItems.value
  return galleryItems.value.filter((item) => item.tagIds.includes(tagId))
})

const pagedArticles = computed(() => {
  const start = (articlePage.value - 1) * pageSize
  return filteredArticles.value.slice(start, start + pageSize)
})

const pagedGallery = computed(() => {
  const start = (galleryPage.value - 1) * pageSize
  return filteredGallery.value.slice(start, start + pageSize)
})

const selectTag = async (tagId: number | null) => {
  const target = tagId === null ? '/tag' : `/tag/${tagId}`
  tagPopupVisible.value = false
  if (route.path === target) return
  await router.push(target)
}

onMounted(async () => {
  const [articleList, galleryList, tagList] = await Promise.all([getArticles(), getGalleryItems(), getTagSamples()])
  articles.value = articleList
  galleryItems.value = galleryList
  tags.value = tagList
})

watch(selectedTagId, () => {
  articlePage.value = 1
  galleryPage.value = 1
})

watch(tagKeyword, () => {
  tagPage.value = 1
})

watch(filteredTagOptions, (list) => {
  const totalPages = Math.max(1, Math.ceil(list.length / tagPageSize))
  if (tagPage.value > totalPages) {
    tagPage.value = totalPages
  }
})
</script>

<template>
  <ContentLayout>
    <PageSection class="tag-page-section">
      <template #title>
        <h2>{{ pageText.tagTitlePrefix }}{{ currentTagName }}</h2>
      </template>
      <template #action>
        <div class="tag-page-actions">
          <Popup v-model:visible="tagPopupVisible" placement="bottom-right" trigger="click">
            <template #content>
              <div class="tag-popup-panel">
                <div class="tag-popup-head">
                  <p class="tag-popup-title">标签筛选</p>
                  <Input v-model="tagKeyword" class="tag-popup-search" clearable placeholder="搜索标签">
                    <template #prefix-icon>
                      <SearchIcon />
                    </template>
                  </Input>
                </div>

                <div class="tag-popup-grid">
                  <button
                    v-for="tag in pagedTagOptions"
                    :key="tag.id"
                    class="tag-chip tag-chip-link tag-filter-btn"
                    :class="{ active: (tag.id || null) === selectedTagId }"
                    type="button"
                    @click="selectTag(tag.id || null)"
                  >
                    {{ tag.name }}
                  </button>
                </div>

                <div class="tag-popup-footer">
                  <PaginationBar v-model="tagPage" :total="filteredTagOptions.length" :page-size="tagPageSize" />
                </div>
              </div>
            </template>

            <Button class="tag-popup-trigger" theme="default" variant="outline">选择标签</Button>
          </Popup>

          <ModeSwitch v-model="mode" />
        </div>
      </template>

      <div class="tag-filter-summary">
        <span class="tag-chip tag-filter-current">{{ currentTagName }}</span>
      </div>

      <div class="page-list-body">
        <div v-if="mode === 'article'" class="card-grid card-grid-spacious">
          <ArticleCard v-for="item in pagedArticles" :key="item.id" v-bind="item" />
        </div>

        <div v-else class="card-grid card-grid-spacious">
          <GalleryCard v-for="item in pagedGallery" :key="item.id" v-bind="item" />
        </div>
      </div>

      <div class="page-list-footer">
        <PaginationBar
          v-if="mode === 'article'"
          v-model="articlePage"
          :total="filteredArticles.length"
          :page-size="pageSize"
        />
        <PaginationBar v-else v-model="galleryPage" :total="filteredGallery.length" :page-size="pageSize" />
      </div>
    </PageSection>
  </ContentLayout>
</template>
