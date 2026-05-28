import type { ThemeFilter } from '../stores/theme'

export type NavItem = {
  label: string
  to: string
}

export type FriendLink = {
  name: string
  href: string
}

export const siteMeta = {
  title: 'Gallery Blog',
  subtitle: '静态博客 / 画廊站点',
  brandMark: 'G',
}

export const navItems: NavItem[] = [
  { label: '首页', to: '/' },
  { label: '博文', to: '/blog' },
  { label: '画廊', to: '/gallery' },
  { label: '标签', to: '/tag/城市' },
  { label: '友情链接', to: '/friend' },
]

export const everydayWords = [
  '把今天的颜色，留给明天。',
  '创作是和自己耐心相处。',
  '慢一点，灵感会跟上来。',
]

export const getDailyWord = (date = new Date()) => {
  const key = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
  let hash = 0
  for (let i = 0; i < key.length; i += 1) {
    hash = (hash * 31 + key.charCodeAt(i)) >>> 0
  }
  return everydayWords[hash % everydayWords.length]
}

export const heroConfig = {
  kicker: 'Gallery Blog',
  title: 'Gallery Blog',
  enterText: '进入内容区',
}

export const pageText = {
  blogTitle: '博文',
  galleryTitle: '画廊',
  friendTitle: '友情链接',
  pinnedTitle: '置顶博文',
  featuredGalleryTitle: '精选画廊',
  tagTitle: (tagName: string) => `标签：${tagName}`,
  drawerTitle: '导航',
  previousPage: '上一页',
  nextPage: '下一页',
}

export const modeText = {
  article: '文章模式',
  gallery: '图片模式',
}

export const themePanelText = {
  title: '主题设置',
  mode: '模式',
  light: '浅色',
  dark: '深色',
  themeColor: '主题色',
  filter: '滤镜',
  radius: '圆角',
  shadow: '阴影',
  trigger: '设',
}

export const themeFilterOptions: Array<{ label: string; value: ThemeFilter }> = [
  { label: '无滤镜', value: 'none' },
  { label: '暖色', value: 'warm' },
  { label: '灰度', value: 'gray' },
  { label: '柔和', value: 'soft' },
]

export const friendLinks: FriendLink[] = [
  { name: '友站 A', href: '#' },
  { name: '友站 B', href: '#' },
]

