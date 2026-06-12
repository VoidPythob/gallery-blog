import type { ThemeFilter } from "../stores/theme";
import navItemsJson from "./ui/nav-items.json";
import pageTextJson from "./ui/page-text.json";
import modeTextJson from "./ui/mode-text.json";
import themePanelTextJson from "./ui/theme-panel-text.json";
import themeFilterOptionsJson from "./ui/theme-filter-options.json";
import { ArticleIcon, HomeIcon, ImageIcon, LinkIcon, TagIcon, TimeIcon } from "tdesign-icons-vue-next";

export type NavItem = {
  label: string;
  to: string;
  icon: NavIconName;
};

export type NavIconName = "HomeIcon" | "ArticleIcon" | "ImageIcon" | "TagIcon" | "LinkIcon" | "TimeIcon";

export type FriendLinkCompat = {
  name: string;
  href: string;
  icon?: string;
};

export const navItems = navItemsJson.items as NavItem[];
export const navIconMap = {
  HomeIcon,
  ArticleIcon,
  ImageIcon,
  TagIcon,
  LinkIcon,
  TimeIcon,
} as const;

export const pageText = pageTextJson as {
  blogTitle: string;
  galleryTitle: string;
  friendTitle: string;
  pinnedTitle: string;
  featuredGalleryTitle: string;
  timelineTitle: string;
  tagTitlePrefix: string;
  drawerTitle: string;
  previousPage: string;
  nextPage: string;
};

export const modeText = modeTextJson as {
  article: string;
  gallery: string;
};

export const themePanelText = themePanelTextJson as {
  title: string;
  mode: string;
  light: string;
  dark: string;
  themeColor: string;
  filter: string;
  radius: string;
  shadow: string;
  trigger: string;
};

export const themeFilterOptions = themeFilterOptionsJson.options as Array<{
  label: string;
  value: ThemeFilter;
}>;

export const friendLinks: FriendLinkCompat[] = [];
