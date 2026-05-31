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
    radial-gradient(circle at top, color-mix(in srgb, var(--accent-text-color) 10%, transparent), transparent 48%),
    color-mix(in srgb, var(--page-base-bg) 78%, transparent);
  backdrop-filter: blur(18px);
}

.route-loading-overlay__panel {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 24px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--panel-bg) 96%, transparent);
  border: 1px solid color-mix(in srgb, var(--surface-border) 92%, transparent);
  box-shadow: var(--shadow-style);
}

.route-loading-overlay__pulse {
  width: 12px;
  height: 12px;
  border-radius: 999px;
  background: var(--accent-text-color);
  animation: route-loading-pulse 0.72s ease-in-out infinite;
}

.route-loading-overlay__pulse--delay {
  animation-delay: 0.18s;
}

.route-loading-overlay-enter-active,
.route-loading-overlay-leave-active {
  transition: opacity 0.24s ease;
}

.route-loading-overlay-enter-from,
.route-loading-overlay-leave-to {
  opacity: 0;
}

@keyframes route-loading-pulse {
  0%,
  100% {
    transform: translateY(0) scale(0.88);
    opacity: 0.52;
  }

  50% {
    transform: translateY(-6px) scale(1);
    opacity: 1;
  }
}
</style>
