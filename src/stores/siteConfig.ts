import { defineStore } from 'pinia'
import { defaultSiteConfig, getSiteConfig, type SiteConfig } from '../data/site'

type SiteConfigState = {
  config: SiteConfig
  loaded: boolean
}

export const useSiteConfigStore = defineStore('site-config', {
  state: (): SiteConfigState => ({
    config: defaultSiteConfig,
    loaded: false,
  }),
  actions: {
    async load() {
      this.config = await getSiteConfig()
      this.loaded = true
    },
  },
})
