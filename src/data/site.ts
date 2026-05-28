export type Article = {
  id: string;
  title: string;
  coverUrl: string;
  tags: string[];
  isToped: boolean;
  readTime: number;
  introduction: string;
  markdown: string;
};

export type GalleryItem = {
  id: string;
  title: string;
  imageUrl: string;
  tags: string[];
  createdAt: string;
};

export type TagSample = {
  id: number;
  name: string;
};

type DataList<T> = {
  items: T[];
};
type WordList = {
  words: string[];
};

const articlesPath = "articles.json";
const galleryPath = "gallery-items.json";
const everydayWordsPath = "everyday-words.json";
const tagSamplesPath = "tag-samples.json";
const resolvePostsPath = (path: string) => `${import.meta.env.BASE_URL}posts/${path}`;

let articlesCache: Article[] | null = null;
let galleryCache: GalleryItem[] | null = null;
let everydayWordsCache: string[] | null = null;
let tagSamplesCache: TagSample[] | null = null;

const loadJsonList = async <T>(path: string): Promise<T[]> => {
  try {
    const response = await fetch(resolvePostsPath(path), { cache: "no-store" });
    if (!response.ok) {
      return [];
    }
    const data = (await response.json()) as DataList<T>;
    return Array.isArray(data.items) ? data.items : [];
  } catch {
    return [];
  }
};

const loadWordList = async (path: string): Promise<string[]> => {
  try {
    const response = await fetch(resolvePostsPath(path), { cache: "no-store" });
    if (!response.ok) {
      return [];
    }
    const data = (await response.json()) as WordList;
    return Array.isArray(data.words) ? data.words : [];
  } catch {
    return [];
  }
};

export const getArticles = async () => {
  if (articlesCache) return articlesCache;
  articlesCache = await loadJsonList<Article>(articlesPath);
  return articlesCache;
};

export const getGalleryItems = async () => {
  if (galleryCache) return galleryCache;
  galleryCache = await loadJsonList<GalleryItem>(galleryPath);
  return galleryCache;
};

export const getDailyWord = async (date = new Date()) => {
  if (!everydayWordsCache) {
    everydayWordsCache = await loadWordList(everydayWordsPath);
  }
  if (!everydayWordsCache.length) return "";

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
