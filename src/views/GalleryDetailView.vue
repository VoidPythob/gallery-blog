<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeftIcon } from 'tdesign-icons-vue-next'
import { ImageViewer } from 'tdesign-vue-next'
import ContentLayout from '../components/ContentLayout.vue'
import { getGalleryItems, getTagSamples, type GalleryItem, type TagSample } from '../data/site'

const props = defineProps<{
  id: number
}>()

const router = useRouter()
const galleryItem = ref<GalleryItem | null>(null)
const tags = ref<TagSample[]>([])
const viewerVisible = ref(false)
const galleryId = computed(() => props.id)
const tagNameMap = computed(() => new Map(tags.value.map((item) => [item.id, item.name])))
const galleryTags = computed(
  () => galleryItem.value?.tagIds.map((id) => ({ id, name: tagNameMap.value.get(id) ?? `标签${id}` })) ?? [],
)

onMounted(async () => {
  const [list, tagList] = await Promise.all([getGalleryItems(), getTagSamples()])
  galleryItem.value = list.find((item) => item.id === galleryId.value) ?? null
  tags.value = tagList
})
</script>

<template>
  <ContentLayout>
    <div v-if="galleryItem" class="content-card" style="padding: 18px">
      <button class="icon-btn" type="button" @click="router.back()">
        <ArrowLeftIcon />
      </button>
      <h2 style="margin-top: 12px">{{ galleryItem.title }}</h2>
      <p class="meta">创建时间 {{ galleryItem.createdAt }}</p>

      <img
        :src="galleryItem.imageUrl"
        :alt="galleryItem.title"
        class="gallery-detail-image"
        @click="viewerVisible = true"
      />

      <div class="tag-row" style="margin: 14px 0 6px">
        <button
          v-for="tag in galleryTags"
          :key="tag.id"
          class="tag-chip tag-chip-link"
          type="button"
          @click="router.push(`/tag/${tag.id}`)"
        >
          {{ tag.name }}
        </button>
      </div>
    </div>

    <div v-else class="content-card" style="padding: 18px">
      <button class="icon-btn" type="button" @click="router.back()">
        <ArrowLeftIcon />
      </button>
      <p style="margin-top: 12px">未找到对应图片。</p>
    </div>

    <ImageViewer
      v-model:visible="viewerVisible"
      :images="galleryItem ? [galleryItem.imageUrl] : []"
      :default-index="0"
      mode="modal"
      :show-overlay="true"
    />
  </ContentLayout>
</template>
