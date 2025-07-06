# 🚀 GitHub Pages Deployment

Complete guide for deploying M2JS documentation to GitHub Pages using VitePress.

## Overview

M2JS documentation is built with VitePress and deployed automatically to GitHub Pages at:
- **Production**: `https://paulohenriquevn.github.io/m2js/`
- **Repository**: `https://github.com/paulohenriquevn/m2js`

## Prerequisites

### Repository Setup

```bash
# Ensure your repository has GitHub Pages enabled
# Repository Settings → Pages → Source: GitHub Actions
```

### Required Files

```
docs-site/
├── .github/workflows/deploy-docs.yml  # GitHub Actions workflow
├── docs/                              # Documentation content
├── package.json                       # VitePress dependencies
└── .vitepress/
    ├── config.mts                     # VitePress configuration
    └── theme/                         # Custom theme files
```

## GitHub Actions Workflow

### Create Deployment Workflow

Create `.github/workflows/deploy-docs.yml`:

```yaml
name: Deploy M2JS Documentation

on:
  # Trigger on pushes to main branch
  push:
    branches: [main]
    paths: ['docs-site/**']
  
  # Allow manual deployment
  workflow_dispatch:

# Set permissions for GitHub Pages deployment
permissions:
  contents: read
  pages: write
  id-token: write

# Ensure only one deployment runs at a time
concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    name: Build Documentation
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 0  # Full history for VitePress lastUpdated
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: npm
          cache-dependency-path: docs-site/package-lock.json
      
      - name: Install Dependencies
        run: |
          cd docs-site
          npm ci
      
      - name: Build Documentation
        run: |
          cd docs-site
          npm run build
        env:
          # Set base URL for GitHub Pages
          NODE_ENV: production
      
      - name: Upload Build Artifacts
        uses: actions/upload-pages-artifact@v2
        with:
          path: docs-site/docs/.vitepress/dist

  deploy:
    name: Deploy to GitHub Pages
    needs: build
    runs-on: ubuntu-latest
    
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v2
```

### Workflow Features

- ✅ **Automatic deployment** on pushes to main branch
- ✅ **Manual deployment** via workflow_dispatch
- ✅ **Path filtering** - only runs when docs-site/ changes
- ✅ **Concurrency control** - prevents conflicting deployments
- ✅ **Full git history** for VitePress lastUpdated timestamps
- ✅ **Node.js caching** for faster builds
- ✅ **Production optimization** with NODE_ENV

## VitePress Configuration

### Base Configuration

Update `docs-site/docs/.vitepress/config.mts`:

```typescript
import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'M2JS Documentation',
  description: 'Transform TypeScript/JavaScript into AI-ready Markdown',
  
  // GitHub Pages configuration
  base: '/m2js/',  // Repository name
  
  // Build configuration
  outDir: '../dist',
  cacheDir: '../.vitepress/cache',
  
  // GitHub Pages optimizations
  cleanUrls: true,
  metaChunk: true,
  
  head: [
    // Favicon
    ['link', { rel: 'icon', href: '/m2js/favicon.ico' }],
    
    // Meta tags for SEO
    ['meta', { name: 'theme-color', content: '#646cff' }],
    ['meta', { name: 'og:type', content: 'website' }],
    ['meta', { name: 'og:locale', content: 'en' }],
    ['meta', { name: 'og:site_name', content: 'M2JS Documentation' }],
    ['meta', { name: 'og:image', content: '/m2js/og-image.png' }],
  ],
  
  themeConfig: {
    // GitHub integration
    editLink: {
      pattern: 'https://github.com/paulohenriquevn/m2js/edit/main/docs-site/docs/:path',
      text: 'Edit this page on GitHub'
    },
    
    socialLinks: [
      { icon: 'github', link: 'https://github.com/paulohenriquevn/m2js' },
      { icon: 'npm', link: 'https://www.npmjs.com/package/@paulohenriquevn/m2js' }
    ],
    
    // Footer
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024 Paulo Henrique'
    },
    
    // Search
    search: {
      provider: 'local'
    },
    
    // Navigation
    nav: [
      { text: 'Guide', link: '/guide/quick-start' },
      { text: 'Reference', link: '/reference/cli' },
      { text: 'Architecture', link: '/architecture/overview' },
      { 
        text: 'v1.0.1', 
        items: [
          { text: 'Changelog', link: '/changelog' },
          { text: 'Migration Guide', link: '/migration' }
        ]
      }
    ],
    
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
          text: 'Architecture',
          items: [
            { text: 'Overview', link: '/architecture/overview' },
            { text: 'Contributing', link: '/architecture/contributing' },
            { text: 'Deployment', link: '/architecture/deployment' }
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
      ]
    }
  },
  
  // Markdown configuration
  markdown: {
    theme: 'github-dark',
    lineNumbers: true
  },
  
  // Last updated timestamps
  lastUpdated: true
})
```

## Package Configuration

### Update package.json

```json
{
  "name": "m2js-docs",
  "private": true,
  "scripts": {
    "dev": "vitepress dev docs",
    "build": "vitepress build docs",
    "preview": "vitepress preview docs",
    "deploy": "npm run build && gh-pages -d docs/.vitepress/dist"
  },
  "devDependencies": {
    "vitepress": "^1.0.0",
    "gh-pages": "^6.0.0"
  }
}
```

### Local Development

```bash
# Start development server
cd docs-site
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Repository Settings

### Enable GitHub Pages

1. **Go to Repository Settings**
   ```
   https://github.com/paulohenriquevn/m2js/settings
   ```

2. **Navigate to Pages Section**
   ```
   Settings → Pages
   ```

3. **Configure Source**
   ```
   Source: GitHub Actions
   ✅ Enforce HTTPS
   ```

4. **Custom Domain (Optional)**
   ```
   Custom domain: docs.m2js.dev
   ✅ Enforce HTTPS
   ```

### Environment Protection

```bash
# Repository Settings → Environments → github-pages
Required reviewers: [maintainer-list]
Deployment branches: main only
```

## Deployment Process

### Automatic Deployment

```bash
# Any push to main branch with docs-site/ changes triggers deployment
git add docs-site/
git commit -m "docs: update documentation"
git push origin main

# GitHub Actions will:
# 1. Detect changes in docs-site/
# 2. Build VitePress documentation
# 3. Deploy to GitHub Pages
# 4. Update live site at https://paulohenriquevn.github.io/m2js/
```

### Manual Deployment

```bash
# Via GitHub Actions UI
1. Go to Actions tab
2. Select "Deploy M2JS Documentation"
3. Click "Run workflow"
4. Select branch: main
5. Click "Run workflow"
```

### Local Deployment (Alternative)

```bash
# Using gh-pages package (not recommended for production)
cd docs-site
npm run deploy

# This will:
# 1. Build documentation locally
# 2. Push to gh-pages branch
# 3. Trigger GitHub Pages deployment
```

## Custom Domain Setup

### Configure Custom Domain

1. **Add CNAME file**
   ```bash
   # docs-site/docs/public/CNAME
   docs.m2js.dev
   ```

2. **DNS Configuration**
   ```
   Type: CNAME
   Name: docs
   Value: paulohenriquevn.github.io
   ```

3. **GitHub Pages Settings**
   ```
   Custom domain: docs.m2js.dev
   ✅ Enforce HTTPS
   ```

### SSL Certificate

GitHub automatically provisions SSL certificates for custom domains:

```bash
# Certificate will be available within 24 hours
# Force HTTPS will be enabled automatically
```

## Monitoring Deployment

### GitHub Actions Logs

```bash
# Monitor deployment status
1. Go to repository Actions tab
2. Click on latest "Deploy M2JS Documentation" workflow
3. View build and deploy logs
4. Check for any errors or warnings
```

### Deployment Status

```bash
# Check deployment URL
curl -I https://paulohenriquevn.github.io/m2js/

# Expected response
HTTP/2 200
content-type: text/html
```

### Performance Monitoring

```bash
# VitePress build metrics
Build time: ~30-60 seconds
Bundle size: ~2-5MB
Pages generated: ~20-50 pages
```

## Troubleshooting

### Common Issues

**1. Build Fails - Missing Dependencies**
```bash
Error: Cannot resolve module 'vitepress'
Solution: Ensure package.json has correct dependencies
```

**2. 404 on GitHub Pages**
```bash
Error: Page not found
Solution: Check base URL in config.mts matches repository name
```

**3. Images Not Loading**
```bash
Error: Images show 404
Solution: Ensure images are in docs/public/ directory
```

**4. CSS/JS Not Loading**
```bash
Error: Styles missing
Solution: Verify base URL configuration in VitePress config
```

### Debug Mode

```typescript
// config.mts - Enable debug mode
export default defineConfig({
  // Add debug configuration
  vite: {
    logLevel: 'info',
    build: {
      sourcemap: true
    }
  }
})
```

### GitHub Actions Debug

```yaml
# Enable debug logging in workflow
- name: Build Documentation
  run: |
    cd docs-site
    npm run build
  env:
    NODE_ENV: production
    DEBUG: vitepress:*
```

## Security Considerations

### Workflow Permissions

```yaml
# Minimal required permissions
permissions:
  contents: read    # Read repository content
  pages: write      # Write to GitHub Pages
  id-token: write   # OIDC token for deployment
```

### Environment Variables

```yaml
# No sensitive data in workflows
# All configuration via VitePress config
# No API keys or secrets required
```

### Content Security

```typescript
// config.mts - Security headers
head: [
  ['meta', { 'http-equiv': 'Content-Security-Policy', content: "default-src 'self'" }],
  ['meta', { name: 'robots', content: 'index,follow' }]
]
```

## Performance Optimization

### Build Optimization

```typescript
// config.mts - Performance settings
export default defineConfig({
  cleanUrls: true,         // Clean URLs for better SEO
  metaChunk: true,         // Extract meta info to separate chunk
  mpa: false,              # SPA mode for better performance
  
  vite: {
    build: {
      minify: 'terser',    // Better minification
      rollupOptions: {
        output: {
          manualChunks: {
            // Code splitting for faster loading
            'group-user': ['./src/user']
          }
        }
      }
    }
  }
})
```

### Caching Strategy

```yaml
# GitHub Actions caching
- name: Cache Node Modules
  uses: actions/cache@v3
  with:
    path: docs-site/node_modules
    key: ${{ runner.os }}-node-${{ hashFiles('docs-site/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-node-
```

## Maintenance

### Regular Updates

```bash
# Update VitePress and dependencies
cd docs-site
npm update

# Update GitHub Actions
# Monitor for new versions of actions/checkout, actions/setup-node, etc.
```

### Content Updates

```bash
# Documentation content
1. Edit files in docs-site/docs/
2. Test locally with npm run dev
3. Commit and push to main
4. Automatic deployment via GitHub Actions
```

### Analytics Integration

```typescript
// config.mts - Add Google Analytics
head: [
  ['script', { async: true, src: 'https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID' }],
  ['script', {}, `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'GA_MEASUREMENT_ID');
  `]
]
```

This deployment setup ensures reliable, automated documentation deployment with optimal performance and security.