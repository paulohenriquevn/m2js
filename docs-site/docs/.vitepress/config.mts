import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'M2JS',
  description: 'Transform TypeScript/JavaScript into LLM-friendly Markdown documentation',
  lang: 'en-US',
  
  // GitHub Pages config
  base: '/m2js/',
  
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
    ['meta', { name: 'theme-color', content: '#ff6600' }],
    ['meta', { name: 'og:type', content: 'website' }],
    ['meta', { name: 'og:locale', content: 'en' }],
    ['meta', { name: 'og:title', content: 'M2JS | Transform Code into AI-Ready Docs' }],
    ['meta', { name: 'og:site_name', content: 'M2JS' }],
    ['meta', { name: 'og:image', content: '/m2js/og-image.png' }],
    ['meta', { name: 'og:url', content: 'https://paulohenriquevn.github.io/m2js/' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:title', content: 'M2JS | Transform Code into AI-Ready Docs' }],
    ['meta', { name: 'twitter:description', content: 'CLI tool that transforms TypeScript/JavaScript into LLM-friendly Markdown with 60-90% token reduction' }],
    ['meta', { name: 'twitter:image', content: '/m2js/og-image.png' }]
  ],
  
  // Build options
  cleanUrls: true,
  
  // Markdown config
  markdown: {
    theme: 'github-dark',
    lineNumbers: true
  }
})