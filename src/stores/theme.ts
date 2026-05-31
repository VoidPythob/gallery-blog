import { defineStore } from 'pinia'

export type ThemeMode = 'light' | 'dark'
export type ThemeFilter = 'none' | 'warm' | 'gray' | 'soft'
export type ThemeDockSide = 'left' | 'right'

type ThemeState = {
  mode: ThemeMode
  accentColor: string
  filter: ThemeFilter
  radius: number
  shadow: number
  dockSide: ThemeDockSide
}

const STORAGE_KEY = 'gallery_blog_theme_v1'

const filterMap: Record<ThemeFilter, string> = {
  none: 'none',
  warm: 'saturate(1.08) contrast(1.02)',
  gray: 'grayscale(0.25)',
  soft: 'brightness(1.01) saturate(0.92)',
}

const lightPalette = {
  pageBaseBg: '#f4f7fb',
  pageBackground: 'linear-gradient(180deg, #eaf0ff 0%, #f8fbff 100%)',
  textColor: '#1f2937',
  mutedText: '#4b5563',
  surfaceBg: 'rgba(255, 255, 255, 0.88)',
  panelBg: 'rgba(247, 250, 255, 0.92)',
  surfaceBorder: '#dbe4ff',
  topbarGlassBackground: 'rgba(255, 255, 255, 0.72)',
  topbarGlassBorder: '#dbe4ff',
  shadowStyle: '0 8px 18px rgba(15, 23, 42, 0.16)',
}

const darkPalette = {
  pageBaseBg: '#0b1220',
  pageBackground: 'linear-gradient(180deg, #0b1220 0%, #111827 100%)',
  textColor: '#e5e7eb',
  mutedText: '#94a3b8',
  surfaceBg: 'rgba(15, 23, 42, 0.82)',
  panelBg: 'rgba(15, 23, 42, 0.9)',
  surfaceBorder: 'rgba(148, 163, 184, 0.18)',
  topbarGlassBackground: 'rgba(15, 23, 42, 0.68)',
  topbarGlassBorder: 'rgba(148, 163, 184, 0.18)',
  shadowStyle: '0 10px 24px rgba(0, 0, 0, 0.38)',
}

const getPalette = (mode: ThemeMode) => (mode === 'dark' ? darkPalette : lightPalette)

const extractTextAccentColor = (accentColor: string) => {
  if (!accentColor) return '#2962ff'

  const matched =
    accentColor.match(/#(?:[0-9a-fA-F]{3,8})/)?.[0] ??
    accentColor.match(/rgba?\([^)]+\)/)?.[0] ??
    accentColor.match(/hsla?\([^)]+\)/)?.[0]

  return matched ?? '#2962ff'
}

const applyThemeToDocument = (state: ThemeState) => {
  const palette = getPalette(state.mode)
  const root = document.documentElement
  const accentTextColor = extractTextAccentColor(state.accentColor)

  root.style.setProperty('--page-base-bg', palette.pageBaseBg)
  root.style.setProperty('--page-background', palette.pageBackground)
  root.style.setProperty('--text-color', palette.textColor)
  root.style.setProperty('--muted-text', palette.mutedText)
  root.style.setProperty('--surface-bg', palette.surfaceBg)
  root.style.setProperty('--panel-bg', palette.panelBg)
  root.style.setProperty('--surface-border', palette.surfaceBorder)
  root.style.setProperty('--topbar-glass-background', palette.topbarGlassBackground)
  root.style.setProperty('--topbar-glass-border', palette.topbarGlassBorder)
  root.style.setProperty('--accent-color', state.accentColor)
  root.style.setProperty('--accent-text-color', accentTextColor)
  root.style.setProperty('--radius-base', `${state.radius}px`)
  root.style.setProperty('--radius-soft', `${Math.max(8, state.radius - 4)}px`)
  root.style.setProperty('--shadow-style', palette.shadowStyle ?? `0 8px ${state.shadow}px rgba(15, 23, 42, 0.16)`)
  root.style.setProperty('--theme-filter', filterMap[state.filter])
  root.setAttribute('data-theme', state.mode)
}

export const useThemeStore = defineStore('theme', {
  state: (): ThemeState => ({
    mode: 'light',
    accentColor: '#2962ff',
    filter: 'none',
    radius: 16,
    shadow: 18,
    dockSide: 'right',
  }),
  actions: {
    apply() {
      applyThemeToDocument(this.$state)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.$state))
    },
    init() {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        try {
          const parsed = JSON.parse(raw) as Partial<ThemeState>
          this.mode = parsed.mode ?? this.mode
          this.accentColor = parsed.accentColor ?? this.accentColor
          this.filter = parsed.filter ?? this.filter
          this.radius = parsed.radius ?? this.radius
          this.shadow = parsed.shadow ?? this.shadow
          this.dockSide = parsed.dockSide ?? this.dockSide
        } catch {
          // ignore invalid local storage content
        }
      }
      this.apply()
    },
    setMode(mode: ThemeMode) {
      this.mode = mode
      this.apply()
    },
    toggleMode() {
      this.mode = this.mode === 'light' ? 'dark' : 'light'
      this.apply()
    },
    setAccentColor(color: string) {
      this.accentColor = color
      this.apply()
    },
    setFilter(filter: ThemeFilter) {
      this.filter = filter
      this.apply()
    },
    setRadius(radius: number) {
      this.radius = radius
      this.apply()
    },
    setShadow(shadow: number) {
      this.shadow = shadow
      this.apply()
    },
    setDockSide(side: ThemeDockSide) {
      this.dockSide = side
      this.apply()
    },
    toggleDockSide() {
      this.dockSide = this.dockSide === 'left' ? 'right' : 'left'
      this.apply()
    },
  },
})
