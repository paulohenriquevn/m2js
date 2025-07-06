import DefaultTheme from 'vitepress/theme'
import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app, router, siteData }) {
    // Override site title to fix VitePress default
    if (siteData.title === 'VitePress') {
      siteData.title = 'M2JS'
    }
    if (siteData.description === 'A VitePress site') {
      siteData.description = 'Transform TypeScript/JavaScript into LLM-friendly Markdown documentation'
    }
  }
}