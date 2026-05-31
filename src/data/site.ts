export type Article = {
  id: number;
  createdAt: string;
  title: string;
  coverUrl: string;
  tagIds: number[];
  tags: string[];
  isToped: boolean;
  readTime: number;
  introduction: string;
  markdown: string;
};

export type GalleryItem = {
  id: number;
  title: string;
  imageUrl: string;
  isFeatured: boolean;
  tagIds: number[];
  tags: string[];
  createdAt: string;
};

export type TagSample = {
  id: number;
  name: string;
};

export type BloggerProfile = {
  name: string;
  bio: string;
  avatar: string;
  location: string;
  status: string;
  links: BloggerLink[];
};

export type BloggerLinkPlatform = 'github' | 'bilibili' | 'wechat' | 'tiktok' | 'website';

export type BloggerLink = {
  platform: BloggerLinkPlatform;
  label: string;
  url: string;
};

export type FriendLink = {
  name: string;
  href: string;
  icon?: string;
};

type FriendLinkSource = {
  name?: string;
  href?: string;
  url?: string;
  icon?: string;
};

export type TimelineEntry = {
  id: string;
  title: string;
  date: string;
  year: number;
  type: 'article' | 'gallery';
  href: string;
  tags: string[];
  summary: string;
  imageUrl: string;
};

type DataList<T> = {
  items: T[];
};

type WordList = {
  words: string[];
};

type TagArticleMapItem = {
  tagId: number;
  articleIds: number[];
};

type TagGalleryMapItem = {
  tagId: number;
  galleryIds: number[];
};

type TagArticleMap = {
  items: TagArticleMapItem[];
};

type TagGalleryMap = {
  items: TagGalleryMapItem[];
};

type TimelineEntryRecord = TimelineEntry & {
  sortTime: number;
};

const articlesPath = 'articles.json';
const galleryPath = 'gallery-items.json';
const everydayWordsPath = 'everyday-words.json';
const tagSamplesPath = 'tag-samples.json';
const tagArticleMapPath = 'tag-article-map.json';
const tagGalleryMapPath = 'tag-gallery-map.json';
const bloggerPath = 'blogger.json';
const friendLinksPath = 'friend-links.json';
const resolvePostsPath = (path: string) => `${import.meta.env.BASE_URL}posts/${path}`;

let articlesCache: Article[] | null = null;
let galleryCache: GalleryItem[] | null = null;
let everydayWordsCache: string[] | null = null;
let tagSamplesCache: TagSample[] | null = null;
let tagArticleMapCache: Record<number, number[]> | null = null;
let tagGalleryMapCache: Record<number, number[]> | null = null;
let bloggerCache: BloggerProfile | null = null;
let friendLinksCache: FriendLink[] | null = null;
let timelineCache: TimelineEntry[] | null = null;

const loadJsonList = async <T>(path: string): Promise<T[]> => {
  try {
    const response = await fetch(resolvePostsPath(path), { cache: 'no-store' });
    if (!response.ok) return [];
    const data = (await response.json()) as DataList<T>;
    return Array.isArray(data.items) ? data.items : [];
  } catch {
    return [];
  }
};

const loadWordList = async (path: string): Promise<string[]> => {
  try {
    const response = await fetch(resolvePostsPath(path), { cache: 'no-store' });
    if (!response.ok) return [];
    const data = (await response.json()) as WordList;
    return Array.isArray(data.words) ? data.words : [];
  } catch {
    return [];
  }
};

const loadTagArticleMap = async () => {
  if (tagArticleMapCache) return tagArticleMapCache;
  try {
    const response = await fetch(resolvePostsPath(tagArticleMapPath), { cache: 'no-store' });
    if (!response.ok) {
      tagArticleMapCache = {};
      return tagArticleMapCache;
    }
    const data = (await response.json()) as TagArticleMap;
    tagArticleMapCache = Object.fromEntries((data.items ?? []).map((item) => [item.tagId, item.articleIds ?? []]));
    return tagArticleMapCache;
  } catch {
    tagArticleMapCache = {};
    return tagArticleMapCache;
  }
};

const loadTagGalleryMap = async () => {
  if (tagGalleryMapCache) return tagGalleryMapCache;
  try {
    const response = await fetch(resolvePostsPath(tagGalleryMapPath), { cache: 'no-store' });
    if (!response.ok) {
      tagGalleryMapCache = {};
      return tagGalleryMapCache;
    }
    const data = (await response.json()) as TagGalleryMap;
    tagGalleryMapCache = Object.fromEntries((data.items ?? []).map((item) => [item.tagId, item.galleryIds ?? []]));
    return tagGalleryMapCache;
  } catch {
    tagGalleryMapCache = {};
    return tagGalleryMapCache;
  }
};

const resolveTagNames = async (tagIds: number[]) => {
  const tags = await getTagSamples();
  const nameMap = new Map(tags.map((item) => [item.id, item.name]));
  return tagIds.map((id) => nameMap.get(id)).filter((name): name is string => Boolean(name));
};

const resolveYear = (value: string, fallback: number) => {
  const parsed = Number.parseInt(value.slice(0, 4), 10);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const getArticles = async () => {
  if (articlesCache) return articlesCache;
  const [rawArticles, tagArticleMap] = await Promise.all([
    loadJsonList<Omit<Article, 'tags'>>(articlesPath),
    loadTagArticleMap(),
  ]);
  const mapByArticle = new Map<number, number[]>();
  Object.entries(tagArticleMap).forEach(([tagId, articleIds]) => {
    articleIds.forEach((articleId) => {
      const prev = mapByArticle.get(articleId) ?? [];
      mapByArticle.set(articleId, [...prev, Number(tagId)]);
    });
  });
  articlesCache = await Promise.all(
    rawArticles.map(async (item) => {
      const tagIds = item.tagIds?.length ? item.tagIds : mapByArticle.get(item.id) ?? [];
      return {
        ...item,
        tagIds,
        tags: await resolveTagNames(tagIds),
      };
    }),
  );
  return articlesCache;
};

export const getGalleryItems = async () => {
  if (galleryCache) return galleryCache;
  const [rawGallery, tagGalleryMap] = await Promise.all([
    loadJsonList<Omit<GalleryItem, 'tags'>>(galleryPath),
    loadTagGalleryMap(),
  ]);
  const mapByGallery = new Map<number, number[]>();
  Object.entries(tagGalleryMap).forEach(([tagId, galleryIds]) => {
    galleryIds.forEach((galleryId) => {
      const prev = mapByGallery.get(galleryId) ?? [];
      mapByGallery.set(galleryId, [...prev, Number(tagId)]);
    });
  });
  galleryCache = await Promise.all(
    rawGallery.map(async (item) => {
      const tagIds = item.tagIds?.length ? item.tagIds : mapByGallery.get(item.id) ?? [];
      return {
        ...item,
        isFeatured: Boolean(item.isFeatured),
        tagIds,
        tags: await resolveTagNames(tagIds),
      };
    }),
  );
  return galleryCache;
};

export const getDailyWord = async (date = new Date()) => {
  if (!everydayWordsCache) {
    everydayWordsCache = await loadWordList(everydayWordsPath);
  }
  if (!everydayWordsCache.length) return '';

  const key = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  let hash = 0;
  for (let i = 0; i < key.length; i += 1) {
    hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  }
  return everydayWordsCache[hash % everydayWordsCache.length];
};

export const getTagSamples = async () => {
  if (tagSamplesCache) return tagSamplesCache;
  tagSamplesCache = await loadJsonList<TagSample>(tagSamplesPath);
  return tagSamplesCache;
};

export const getTagRelations = async (tagId: number) => {
  const [articleMap, galleryMap] = await Promise.all([loadTagArticleMap(), loadTagGalleryMap()]);
  return {
    articleIds: articleMap[tagId] ?? [],
    galleryIds: galleryMap[tagId] ?? [],
  };
};

export const getBlogger = async () => {
  if (bloggerCache) return bloggerCache;
  try {
    const response = await fetch(resolvePostsPath(bloggerPath), { cache: 'no-store' });
    if (!response.ok) {
      bloggerCache = { name: '', bio: '', avatar: '', location: '', status: '', links: [] };
      return bloggerCache;
    }
    const data = (await response.json()) as Partial<BloggerProfile>;
    bloggerCache = {
      name: data.name ?? '',
      bio: data.bio ?? '',
      avatar: data.avatar ?? '',
      location: data.location ?? '',
      status: data.status ?? '',
      links: Array.isArray(data.links)
        ? data.links.filter(
            (item): item is BloggerLink =>
              Boolean(item) &&
              typeof item.platform === 'string' &&
              typeof item.label === 'string' &&
              typeof item.url === 'string',
          )
        : [],
    };
  } catch {
    bloggerCache = { name: '', bio: '', avatar: '', location: '', status: '', links: [] };
  }
  return bloggerCache;
};

export const getFriendLinks = async () => {
  if (friendLinksCache) return friendLinksCache;
  const rawLinks = await loadJsonList<FriendLinkSource>(friendLinksPath);
  friendLinksCache = rawLinks
    .map((item) => ({
      name: item.name ?? '',
      href: item.href ?? item.url ?? '',
      icon: item.icon,
    }))
    .filter((item) => Boolean(item.name) && Boolean(item.href) && item.href !== '#');
  return friendLinksCache;
};

export const getTimelineEntries = async () => {
  if (timelineCache) return timelineCache;
  const [articles, galleryItems] = await Promise.all([getArticles(), getGalleryItems()]);
  const articleEntries: TimelineEntryRecord[] = articles.map((item) => ({
    id: `article-${item.id}`,
    title: item.title,
    date: item.createdAt || '',
    year: resolveYear(item.createdAt || '', item.id),
    type: 'article',
    href: `/blog/${item.id}`,
    tags: item.tags,
    summary: item.introduction,
    imageUrl: item.coverUrl,
    sortTime: Date.parse(item.createdAt) || item.id,
  }));
  const galleryEntries: TimelineEntryRecord[] = galleryItems.map((item) => ({
    id: `gallery-${item.id}`,
    title: item.title,
    date: item.createdAt,
    year: resolveYear(item.createdAt, item.id),
    type: 'gallery',
    href: `/gallery/${item.id}`,
    tags: item.tags,
    summary: item.isFeatured ? '精选画廊' : '画廊作品',
    imageUrl: item.imageUrl,
    sortTime: Date.parse(item.createdAt) || item.id,
  }));
  timelineCache = [...articleEntries, ...galleryEntries]
    .sort((a, b) => b.sortTime - a.sortTime)
    .map(({ sortTime: _sortTime, ...entry }) => entry);
  return timelineCache;
};
