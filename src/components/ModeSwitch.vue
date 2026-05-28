<script setup lang="ts">
import { modeText } from '../data/ui'

defineProps<{
  modelValue: 'article' | 'gallery'
}>()

defineEmits<{
  (event: 'update:modelValue', value: 'article' | 'gallery'): void
}>()
</script>

<template>
  <div class="mode-switch">
    <button class="switch-btn" :class="{ active: modelValue === 'article' }" @click="$emit('update:modelValue', 'article')">
      {{ modeText.article }}
    </button>
    <button class="switch-btn" :class="{ active: modelValue === 'gallery' }" @click="$emit('update:modelValue', 'gallery')">
      {{ modeText.gallery }}
    </button>
  </div>
</template>
