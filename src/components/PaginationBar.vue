<script setup lang="ts">
import { computed } from 'vue'
import { pageText } from '../data/ui'

const props = withDefaults(
  defineProps<{
    modelValue: number
    total: number
    pageSize?: number
  }>(),
  {
    pageSize: 10,
  },
)

const emit = defineEmits<{
  (event: 'update:modelValue', value: number): void
}>()

const totalPages = computed(() => Math.max(1, Math.ceil(props.total / props.pageSize)))
const currentPage = computed(() => Math.min(Math.max(1, props.modelValue), totalPages.value))
const pages = computed(() => Array.from({ length: totalPages.value }, (_, i) => i + 1))

const setPage = (page: number) => {
  const next = Math.min(Math.max(1, page), totalPages.value)
  emit('update:modelValue', next)
}
</script>

<template>
  <div class="pagination-bar">
    <button class="page-btn" :disabled="currentPage <= 1" @click="setPage(currentPage - 1)">
      {{ pageText.previousPage }}
    </button>
    <button
      v-for="page in pages"
      :key="page"
      class="page-btn"
      :class="{ active: page === currentPage }"
      @click="setPage(page)"
    >
      {{ page }}
    </button>
    <button class="page-btn" :disabled="currentPage >= totalPages" @click="setPage(currentPage + 1)">
      {{ pageText.nextPage }}
    </button>
  </div>
</template>
