<script setup lang="ts">
import { pageText } from '../data/ui'
</script>

<template>
  <div class="pagination-bar">
    <button class="page-btn">{{ pageText.previousPage }}</button>
    <button class="page-btn active">1</button>
    <button class="page-btn">2</button>
    <button class="page-btn">{{ pageText.nextPage }}</button>
  </div>
</template>
