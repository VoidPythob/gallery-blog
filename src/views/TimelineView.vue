<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, type ComponentPublicInstance } from 'vue'
import { useRouter } from 'vue-router'
import { getTimelineEntries, type TimelineEntry } from '../data/site'

const router = useRouter()
const timelineEntries = ref<TimelineEntry[]>([])
const activeBackground = ref('')
const activeEntryId = ref('')
const timelineRows = ref<HTMLElement[]>([])
const defaultTimelineBackground = 'linear-gradient(180deg, rgba(24, 32, 53, 0.86) 0%, rgba(44, 50, 74, 0.82) 100%)'

let observer: IntersectionObserver | null = null
let scrollRaf = 0

type RowRefTarget = Element | (ComponentPublicInstance & { $el?: Element | null }) | null

const positionedEntries = computed(() =>
  timelineEntries.value.map((entry, index) => ({
    ...entry,
    imageAlign: index % 2 === 0 ? 'left' : 'right',
  })),
)

const setRowRef = (el: RowRefTarget, index: number) => {
  if (!el) return
  const instance = el as ComponentPublicInstance & { $el?: Element | null }
  const candidate = el instanceof HTMLElement ? el : instance.$el instanceof HTMLElement ? instance.$el : null
  if (!candidate) return
  timelineRows.value[index] = candidate
}

const openEntry = (href: string) => {
  void router.push(href)
}

const pickActiveByViewportCenter = () => {
  if (!timelineRows.value.length) {
    activeEntryId.value = ''
    activeBackground.value = ''
    return
  }

  const viewportCenter = window.innerHeight / 2
  const bestRow = timelineRows.value.reduce<HTMLElement | null>((best, row) => {
    const rect = row.getBoundingClientRect()
    const center = rect.top + rect.height / 2
    const dist = Math.abs(center - viewportCenter)
    if (!best) return row
    const bestRect = best.getBoundingClientRect()
    const bestCenter = bestRect.top + bestRect.height / 2
    const bestDist = Math.abs(bestCenter - viewportCenter)
    return dist < bestDist ? row : best
  }, null)

  if (!bestRow) return
  activeEntryId.value = bestRow.dataset.entryId ?? ''
  activeBackground.value = bestRow.dataset.imageUrl ?? ''
}

const onScroll = () => {
  if (scrollRaf) return
  scrollRaf = window.requestAnimationFrame(() => {
    pickActiveByViewportCenter()
    scrollRaf = 0
  })
}

const setupObserver = () => {
  observer?.disconnect()
  observer = new IntersectionObserver(() => pickActiveByViewportCenter(), {
    threshold: [0, 0.25, 0.5, 0.75, 1],
    rootMargin: '-45% 0px -45% 0px',
  })
  timelineRows.value.forEach((row) => observer?.observe(row))
  pickActiveByViewportCenter()
}

onMounted(async () => {
  timelineEntries.value = await getTimelineEntries()
  await nextTick()
  setupObserver()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll, { passive: true })
})

onBeforeUnmount(() => {
  observer?.disconnect()
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
  if (scrollRaf) window.cancelAnimationFrame(scrollRaf)
})
</script>

<template>
  <section class="timeline-page">
    <div
      class="timeline-background"
      :style="activeBackground ? { backgroundImage: `url(${activeBackground})` } : { background: defaultTimelineBackground }"
    />
    <div class="timeline-mask" />
    <div class="timeline-inner">
      <div class="timeline-layout">
        <div class="timeline-main">
          <div class="timeline-track">
            <div class="timeline-line" />
            <div class="timeline-stack">
              <article
                v-for="(entry, index) in positionedEntries"
                :key="entry.id"
                :ref="(el) => setRowRef(el as RowRefTarget, index)"
                class="timeline-row"
                :class="[entry.imageAlign === 'left' ? 'timeline-row-left' : 'timeline-row-right', { 'is-active': activeEntryId === entry.id }]"
                :data-image-url="entry.imageUrl"
                :data-entry-id="entry.id"
                role="button"
                tabindex="0"
                @click="openEntry(entry.href)"
                @keyup.enter="openEntry(entry.href)"
              >
                <div class="timeline-node">
                  <div class="timeline-pane timeline-pane-image" :class="entry.imageAlign === 'left' ? 'is-left' : 'is-right'">
                    <img v-if="entry.imageUrl" :src="entry.imageUrl" :alt="entry.title" class="timeline-image" />
                  </div>
                  <div class="timeline-pane timeline-pane-content" :class="entry.imageAlign === 'left' ? 'is-right' : 'is-left'">
                    <div class="timeline-item">
                      <div class="timeline-content">
                        <p class="timeline-date">{{ entry.date }}</p>
                        <h3 class="timeline-title">{{ entry.title }}</h3>
                        <p class="timeline-summary">{{ entry.summary }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
              <div class="timeline-tail-spacer" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
