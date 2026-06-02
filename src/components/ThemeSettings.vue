<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { Button, ColorPicker, Slider, Switch } from 'tdesign-vue-next'
import { ArrowLeftIcon, ArrowRightIcon, Brightness1Icon, SettingIcon } from 'tdesign-icons-vue-next'
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
const dockSide = computed(() => themeStore.dockSide)
const dockToggleTitle = computed(() => (dockSide.value === 'right' ? '切换到左侧' : '切换到右侧'))
const modeToggleTitle = computed(() => (isDarkMode.value ? '切换到浅色模式' : '切换到暗色模式'))
const DockToggleIcon = computed(() => (dockSide.value === 'right' ? ArrowLeftIcon : ArrowRightIcon))

const onModeSwitchChange = (value: unknown) => {
  themeStore.setMode(Boolean(value) ? 'dark' : 'light')
}

const toggleMode = () => {
  themeStore.toggleMode()
}

const toggleDockSide = () => {
  themeStore.toggleDockSide()
}

const onFilterChange = (value: ThemeFilter) => {
  filterValue.value = value
}

const toggleVisible = () => {
  visible.value = !visible.value
}

const closeVisible = () => {
  visible.value = false
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
  <Teleport to="body">
    <div class="theme-settings" :class="[`is-${dockSide}`]">
      <button
        v-if="visible"
        class="theme-settings-backdrop"
        type="button"
        aria-label="关闭主题设置"
        style="position: fixed; inset: 0; margin: 0; padding: 0; border: 0; background: transparent; pointer-events: auto;"
        @click="closeVisible"
      />

      <div class="theme-settings-hover-tools">
        <Button
          class="theme-hover-tool-btn"
          theme="default"
          variant="outline"
          shape="circle"
          :title="modeToggleTitle"
          @click="toggleMode"
        >
          <Brightness1Icon />
        </Button>
        <Button
          class="theme-hover-tool-btn"
          theme="default"
          variant="outline"
          shape="circle"
          :title="dockToggleTitle"
          @click="toggleDockSide"
        >
          <component :is="DockToggleIcon" />
        </Button>
      </div>

      <div v-show="visible" class="theme-settings-panel">
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

      <div class="theme-settings-trigger-wrap">
        <Button theme="primary" shape="circle" class="theme-settings-trigger" @click.stop="toggleVisible">
          <SettingIcon />
        </Button>
      </div>
    </div>
  </Teleport>
</template>
