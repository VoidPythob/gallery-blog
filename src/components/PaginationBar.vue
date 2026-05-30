<script setup lang="ts">
import { computed } from 'vue'
import { Pagination } from 'tdesign-vue-next'

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

const current = computed({
  get: () => props.modelValue,
  set: (value: number) => emit('update:modelValue', value),
})
</script>

<template>
  <div class="pagination-bar">
    <Pagination
      v-model:current="current"
      class="theme-pagination"
      :page-size="pageSize"
      :total="total"
      :show-page-number="true"
      :show-page-size="false"
      :show-jumper="false"
      :show-first-and-last-page-btn="false"
      theme="simple"
    />
  </div>
</template>
