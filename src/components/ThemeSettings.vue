<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { Button, ColorPicker, Popup, Slider, Switch } from 'tdesign-vue-next'
import { SettingIcon } from 'tdesign-icons-vue-next'
import { useThemeStore, type ThemeFilter } from '../stores/theme'
import { themeFilterOptions, themePanelText } from '../data/ui'

const themeStore = useThemeStore()
const visible = ref(false)
const colorDraft = ref(themeStore.accentColor)

let colorTimer: number | undefined

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
const modeStatusLabel = computed(() => (isDarkMode.value ? themePanelText.dark : themePanelText.light))

const onModeSwitchChange = (value: unknown) => {
  themeStore.setMode(Boolean(value) ? 'dark' : 'light')
}

const onFilterChange = (value: ThemeFilter) => {
  filterValue.value = value
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
                <span class="theme-mode-switch-label">{{ modeStatusLabel }}</span>
                <Switch :model-value="isDarkMode" @change="onModeSwitchChange" />
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
                :popup-props="{
                  overlayClassName: 'theme-color-picker-popup',
                  overlayInnerClassName: 'theme-color-picker-popup-inner',
                }"
              />
            </div>

            <div class="theme-settings-block">
              <p class="theme-settings-label">{{ themePanelText.filter }}</p>
              <div class="theme-filter-actions">
                <Button
                  v-for="item in themeFilterOptions"
                  :key="item.value"
                  class="theme-filter-btn"
                  :theme="filterValue === item.value ? 'primary' : 'default'"
                  variant="outline"
                  size="small"
                  @click="onFilterChange(item.value)"
                >
                  {{ item.label }}
                </Button>
              </div>
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

      <Button theme="primary" shape="circle" class="theme-settings-trigger">
        <SettingIcon />
      </Button>
    </Popup>
  </div>
</template>
