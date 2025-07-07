import { defineConfig } from 'vitepress'

// M2JS Documentation Configuration

export default defineConfig({
  title: 'M2JS',
  description: 'Transform TypeScript/JavaScript into LLM-friendly Markdown + Smart Dead Code Detection with confidence levels',
  lang: 'en-US',
  
  // GitHub Pages config - CRITICAL: Must match repository name  
  base: '/m2js/',
  
  // Force override default site data
  transformPageData(pageData) {
    pageData.title = pageData.title?.replace('VitePress', 'M2JS') || 'M2JS';
    return pageData;
  },
  
  // Ensure proper asset path handling
  outDir: '../dist',
  assetsDir: 'assets',
  
  // Theme config
  themeConfig: {
    // Site identity
    logo: '/logo.svg',
    siteTitle: 'M2JS',
    
    // Navigation
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/quick-start' },
      { text: 'Reference', link: '/reference/cli' },
      { text: 'Architecture', link: '/architecture/overview' },
      { text: 'Extension', link: '/extension/overview' },
      {
        text: 'v1.0.1',
        items: [
          { text: 'GitHub', link: 'https://github.com/paulohenriquevn/m2js' },
          { text: 'NPM Package', link: 'https://www.npmjs.com/package/@paulohenriquevn/m2js' },
          { text: 'Deployment', link: '/deployment/github-pages' },
          { text: 'VS Code Marketplace', link: 'https://marketplace.visualstudio.com/items?itemName=paulohenriquevn.m2js-vscode' }
        ]
      }
    ],
    
    // Sidebar
    sidebar: {
      '/guide/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'Quick Start', link: '/guide/quick-start' },
            { text: 'Getting Started', link: '/guide/getting-started' },
            { text: 'Dead Code Detection', link: '/guide/dead-code-detection' },
            { text: 'Best Practices', link: '/guide/best-practices' },
            { text: 'Configuration', link: '/guide/configuration' }
          ]
        }
      ],
      '/reference/': [
        {
          text: 'Reference',
          items: [
            { text: 'CLI Commands', link: '/reference/cli' },
            { text: 'AI Analyzers', link: '/reference/ai-analyzers' }
          ]
        }
      ],
      '/architecture/': [
        {
          text: 'Architecture & Development',
          items: [
            { text: 'Overview', link: '/architecture/overview' },
            { text: 'Contributing Guide', link: '/architecture/contributing' },
            { text: 'Deployment Guide', link: '/architecture/deployment' }
          ]
        }
      ],
      '/extension/': [
        {
          text: 'VS Code Extension',
          items: [
            { text: 'Overview', link: '/extension/overview' }
          ]
        }
      ],
      '/deployment/': [
        {
          text: 'Deployment',
          items: [
            { text: 'GitHub Pages', link: '/deployment/github-pages' }
          ]
        }
      ]
    },
    
    // Social links
    socialLinks: [
      { icon: 'github', link: 'https://github.com/paulohenriquevn/m2js' },
      { icon: 'npm', link: 'https://www.npmjs.com/package/@paulohenriquevn/m2js' }
    ],
    
    // Footer
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2025 Paulo Henrique'
    },
    
    // Search
    search: {
      provider: 'local'
    },
    
    // Edit link
    editLink: {
      pattern: 'https://github.com/paulohenriquevn/m2js/edit/main/docs-site/docs/:path',
      text: 'Edit this page on GitHub'
    },
    
    // Last updated
    lastUpdated: {
      text: 'Updated at',
      formatOptions: {
        dateStyle: 'full',
        timeStyle: 'medium'
      }
    }
  },
  
  // Head tags
  head: [
    ['link', { rel: 'icon', href: '/m2js/favicon.ico' }],
    ['meta', { name: 'theme-color', content: '#646cff' }],
    ['meta', { name: 'viewport', content: 'width=device-width,initial-scale=1' }],
    ['meta', { name: 'og:type', content: 'website' }],
    ['meta', { name: 'og:locale', content: 'en' }],
    ['meta', { name: 'og:title', content: 'M2JS | AI-Ready Docs + Smart Dead Code Detection' }],
    ['meta', { name: 'og:site_name', content: 'M2JS' }],
    ['meta', { name: 'og:image', content: '/m2js/og-image.png' }],
    ['meta', { name: 'og:url', content: 'https://paulohenriquevn.github.io/m2js/' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:title', content: 'M2JS | AI-Ready Docs + Smart Dead Code Detection' }],
    ['meta', { name: 'twitter:description', content: 'CLI tool that transforms TypeScript/JavaScript into LLM-friendly Markdown + intelligently detects and removes dead code with confidence levels' }],
    ['meta', { name: 'twitter:image', content: '/m2js/og-image.png' }]
  ],
  
  // Build options
  cleanUrls: true,
  
  // Vite config for proper asset handling
  vite: {
    base: '/m2js/',
    build: {
      assetsDir: 'assets',
      rollupOptions: {
        output: {
          assetFileNames: 'assets/[name].[hash][extname]'
        }
      }
    }
  },
  
  // Markdown config
  markdown: {
    theme: {
      light: 'github-light',
      dark: 'github-dark'
    },
    lineNumbers: true
  },
  
  // Appearance
  appearance: 'auto'
})