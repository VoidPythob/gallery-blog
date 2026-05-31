<script setup lang="ts">
defineProps<{
  visible: boolean
}>()
</script>

<template>
  <Transition name="route-loading-overlay">
    <div v-if="visible" class="route-loading-overlay" aria-live="polite" aria-label="页面切换中">
      <div class="route-loading-overlay__backdrop" />
      <div class="route-loading-overlay__panel">
        <span class="route-loading-overlay__pulse" />
        <span class="route-loading-overlay__pulse route-loading-overlay__pulse--delay" />
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.route-loading-overlay {
  position: fixed;
  inset: 0;
  z-index: 80;
  display: grid;
  place-items: center;
  pointer-events: none;
}

.route-loading-overlay__backdrop {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at top, color-mix(in srgb, var(--accent-text-color) 8%, transparent), transparent 52%),
    color-mix(in srgb, var(--page-base-bg) 86%, transparent);
}

.route-loading-overlay__panel {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 20px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--panel-bg) 98%, transparent);
  border: 1px solid color-mix(in srgb, var(--surface-border) 88%, transparent);
  box-shadow: 0 10px 22px rgba(15, 23, 42, 0.14);
}

.route-loading-overlay__pulse {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: var(--accent-text-color);
  animation: route-loading-pulse 0.6s ease-in-out infinite;
  will-change: transform, opacity;
}

.route-loading-overlay__pulse--delay {
  animation-delay: 0.14s;
}

.route-loading-overlay-enter-active,
.route-loading-overlay-leave-active {
  transition: opacity 0.16s ease;
}

.route-loading-overlay-enter-from,
.route-loading-overlay-leave-to {
  opacity: 0;
}

@keyframes route-loading-pulse {
  0%,
  100% {
    transform: translateY(0) scale(0.92);
    opacity: 0.54;
  }

  50% {
    transform: translateY(-4px) scale(1);
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .route-loading-overlay__pulse {
    animation: none;
    opacity: 0.82;
  }

  .route-loading-overlay-enter-active,
  .route-loading-overlay-leave-active {
    transition-duration: 0.01s;
  }
}
</style>
