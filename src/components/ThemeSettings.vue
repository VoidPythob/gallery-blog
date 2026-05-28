<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { Button, ColorPicker, Popup, RadioGroup, Slider, Switch } from 'tdesign-vue-next'
import { useThemeStore, type ThemeFilter } from '../stores/theme'
import { themeFilterOptions, themePanelText } from '../data/ui'

const themeStore = useThemeStore()
const visible = ref(false)
const colorDraft = ref(themeStore.accentColor)

let colorTimer: number | undefined

const filterOptions = themeFilterOptions

const filterValue = computed({
  get: () => themeStore.filter,
  set: (value: string | number) => themeStore.setFilter(value as ThemeFilter),
})

const radiusValue = computed({
  get: () => themeStore.radius,
  set: (value: number) => themeStore.setRadius(value),
})

const shadowValue = computed({
  get: () => themeStore.shadow,
  set: (value: number) => themeStore.setShadow(value),
})

const isDarkMode = computed(() => themeStore.mode === 'dark')

const onModeSwitchChange = (value: unknown) => {
  themeStore.setMode(Boolean(value) ? 'dark' : 'light')
}

const commitColor = (value: string) => {
  if (colorTimer) {
    window.clearTimeout(colorTimer)
  }
  colorTimer = window.setTimeout(() => {
    themeStore.setAccentColor(value)
  }, 180)
}

watch(
  () => themeStore.accentColor,
  (value) => {
    colorDraft.value = value
  },
  { immediate: true },
)

watch(colorDraft, (value) => {
  commitColor(value)
})

onBeforeUnmount(() => {
  if (colorTimer) {
    window.clearTimeout(colorTimer)
  }
})
</script>

<template>
  <div class="theme-settings">
    <Popup
      v-model:visible="visible"
      trigger="click"
      attach="body"
      placement="top-right"
      :show-arrow="false"
      overlay-class-name="theme-settings-popup"
      overlay-inner-class-name="theme-settings-popup-inner"
    >
      <template #content>
        <div class="theme-settings-panel">
          <div class="theme-settings-scroll narrow-scrollbar">
            <p class="theme-settings-title">{{ themePanelText.title }}</p>

            <div class="theme-settings-block">
              <p class="theme-settings-label">{{ themePanelText.mode }}</p>
              <div class="theme-mode-switch">
                <span>{{ themePanelText.light }}</span>
                <Switch :model-value="isDarkMode" @change="onModeSwitchChange" />
                <span>{{ themePanelText.dark }}</span>
              </div>
            </div>

            <div class="theme-settings-block">
              <p class="theme-settings-label">{{ themePanelText.themeColor }}</p>
              <ColorPicker
                v-model="colorDraft"
                class="theme-color-picker"
                enable-alpha
                :show-primary-color-preview="true"
                :input-props="{ readonly: true, autoWidth: false }"
              />
            </div>

            <div class="theme-settings-block">
              <p class="theme-settings-label">{{ themePanelText.filter }}</p>
              <RadioGroup v-model="filterValue" variant="default-filled" :options="filterOptions" />
            </div>

            <div class="theme-settings-block">
              <p class="theme-settings-label">{{ themePanelText.radius }} {{ radiusValue }}px</p>
              <Slider v-model="radiusValue" :min="8" :max="28" :step="1" :label="false" />
            </div>

            <div class="theme-settings-block">
              <p class="theme-settings-label">{{ themePanelText.shadow }} {{ shadowValue }}px</p>
              <Slider v-model="shadowValue" :min="8" :max="36" :step="1" :label="false" />
            </div>
          </div>
        </div>
      </template>

      <Button theme="primary" shape="circle" class="theme-settings-trigger">{{ themePanelText.trigger }}</Button>
    </Popup>
  </div>
</template>
