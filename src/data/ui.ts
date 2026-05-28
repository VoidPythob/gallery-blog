import type { ThemeFilter } from "../stores/theme";
import siteMetaJson from "./ui/site-meta.json";
import navItemsJson from "./ui/nav-items.json";
import heroConfigJson from "./ui/hero-config.json";
import pageTextJson from "./ui/page-text.json";
import modeTextJson from "./ui/mode-text.json";
import themePanelTextJson from "./ui/theme-panel-text.json";
import themeFilterOptionsJson from "./ui/theme-filter-options.json";
import friendLinksJson from "./ui/friend-links.json";

export type NavItem = {
  label: string;
  to: string;
};

export type FriendLink = {
  name: string;
  href: string;
};

export const siteMeta = siteMetaJson as {
  title: string;
  subtitle: string;
  brandMark: string;
};

export const navItems = navItemsJson.items as NavItem[];

export const heroConfig = heroConfigJson as {
  kicker: string;
  title: string;
  enterText: string;
};

export const pageText = pageTextJson as {
  blogTitle: string;
  galleryTitle: string;
  friendTitle: string;
  pinnedTitle: string;
  featuredGalleryTitle: string;
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

export const friendLinks = friendLinksJson.items as FriendLink[];
