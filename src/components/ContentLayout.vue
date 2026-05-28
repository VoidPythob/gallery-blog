<script setup lang="ts">
import Sidebar from './Sidebar.vue'
</script>

<template>
  <div class="content-layout">
    <Sidebar />
    <div class="content-main">
      <slot />
    </div>
  </div>
</template>
