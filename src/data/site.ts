export type Article = {
  id: string
  title: string
  coverUrl: string
  tags: string[]
  isToped: boolean
  readTime: number
  introduction: string
  markdown: string
}

export type GalleryItem = {
  id: string
  title: string
  imageUrl: string
  tags: string[]
  createdAt: string
}

export const articles: Article[] = [
  {
    id: 'a-001',
    title: '雨后街景',
    coverUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
    tags: ['城市', '夜景'],
    isToped: true,
    readTime: 180,
    introduction: '记录一场雨后城市夜景的光影变化。',
    markdown: '# 雨后街景',
  },
  {
    id: 'a-002',
    title: '色彩练习',
    coverUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1200&q=80',
    tags: ['练习', '人物'],
    isToped: false,
    readTime: 240,
    introduction: '一次关于色彩层次和人物结构的练习。',
    markdown: '# 色彩练习',
  },
]

export const galleryItems: GalleryItem[] = [
  {
    id: 'g-001',
    title: '黄昏山路',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    tags: ['风景', '黄昏'],
    createdAt: '2026-05-28',
  },
  {
    id: 'g-002',
    title: '蓝色海岸',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    tags: ['海边', '风景'],
    createdAt: '2026-05-27',
  },
]

export const tagSamples = ['城市', '夜景', '练习', '人物', '风景', '黄昏', '海边']

