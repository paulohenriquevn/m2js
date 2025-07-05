# 📚 M2JS Documentation Strategy

## 🎯 Escolha: **VitePress + GitHub Pages**

### Por que VitePress?
- ✅ **Markdown-first** - Alinhado com a proposta do M2JS
- ✅ **TypeScript nativo** - Perfeito para projeto TS
- ✅ **Rápido e moderno** - Vite-powered, hot reload
- ✅ **GitHub Pages integration** - Deploy automático
- ✅ **Community-friendly** - Contribuições via PR
- ✅ **Zero custo** - Completamente gratuito

### Alternatives Consideradas
| Tool | Pros | Cons | Verdict |
|------|------|------|---------|
| **VitePress** | Moderno, TS support, markdown | Learning curve | ✅ **ESCOLHIDO** |
| Docusaurus | Robusto, React-based | Mais complexo | ❌ Overkill para CLI |
| GitBook | Visual, bonito | Pago, vendor lock-in | ❌ Não sustainable |
| README only | Simples, direto | Limitado para growth | ❌ Não escalável |

---

## 🏗️ Estrutura da Documentação

```
docs/
├── .vitepress/
│   ├── config.ts           # VitePress configuration
│   └── theme/
│       └── custom.css      # Custom styling
├── public/
│   ├── logo.svg           # M2JS logo
│   └── favicon.ico        # Site favicon
├── guide/
│   ├── getting-started.md # Quick start guide
│   ├── installation.md    # Detailed installation
│   ├── cli-reference.md   # Command reference
│   └── examples.md        # Usage examples
├── advanced/
│   ├── configuration.md   # Config options
│   ├── contributing.md    # Contribution guide
│   └── troubleshooting.md # Common issues
├── api/
│   └── library-api.md     # Future: programmatic API
├── blog/
│   └── index.md          # Future: project updates
└── index.md              # Homepage
```

---

## ⚙️ Implementation Plan

### Phase 1: Basic Setup (Week 1)
1. **Initialize VitePress**
2. **Configure GitHub Pages**
3. **Create core documentation pages**
4. **Setup automated deployment**

### Phase 2: Content Creation (Week 2)
1. **Write comprehensive guides**
2. **Add interactive examples**
3. **Create troubleshooting section**
4. **Add contributing guidelines**

### Phase 3: Enhancement (Week 3+)
1. **Custom styling and branding**
2. **Community feedback integration**
3. **Blog section for updates**
4. **Analytics and monitoring**

---

## 🛠️ Step-by-Step Implementation

### Step 1: Repository Setup

```bash
# In your M2JS project root
mkdir docs
cd docs

# Initialize VitePress
npm init -y
npm install -D vitepress
```

### Step 2: VitePress Configuration

**`.vitepress/config.ts`:**
```typescript
import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'M2JS',
  description: 'Transform TypeScript/JavaScript into LLM-friendly Markdown',
  
  // GitHub Pages configuration
  base: '/m2js/',
  
  // Theme configuration
  themeConfig: {
    // Logo
    logo: '/logo.svg',
    
    // Navigation
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'CLI Reference', link: '/guide/cli-reference' },
      { text: 'Examples', link: '/guide/examples' },
      { text: 'GitHub', link: 'https://github.com/yourusername/m2js' }
    ],

    // Sidebar
    sidebar: {
      '/guide/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'Introduction', link: '/guide/getting-started' },
            { text: 'Installation', link: '/guide/installation' },
            { text: 'CLI Reference', link: '/guide/cli-reference' },
            { text: 'Examples', link: '/guide/examples' }
          ]
        }
      ],
      '/advanced/': [
        {
          text: 'Advanced',
          items: [
            { text: 'Configuration', link: '/advanced/configuration' },
            { text: 'Contributing', link: '/advanced/contributing' },
            { text: 'Troubleshooting', link: '/advanced/troubleshooting' }
          ]
        }
      ]
    },

    // Social links
    socialLinks: [
      { icon: 'github', link: 'https://github.com/yourusername/m2js' },
      { icon: 'npm', link: 'https://npmjs.com/package/m2js' }
    ],

    // Footer
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2025 M2JS Contributors'
    },

    // Search
    algolia: {
      appId: 'YOUR_APP_ID',
      apiKey: 'YOUR_API_KEY',
      indexName: 'm2js'
    }
  },

  // Head tags
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'theme-color', content: '#3c4043' }],
    ['meta', { property: 'og:title', content: 'M2JS' }],
    ['meta', { property: 'og:description', content: 'Transform TypeScript/JavaScript into LLM-friendly Markdown' }]
  ]
})
```

### Step 3: Homepage Content

**`docs/index.md`:**
```markdown
---
layout: home

hero:
  name: M2JS
  text: Markdown from JavaScript
  tagline: Transform TypeScript/JavaScript into LLM-friendly summaries
  image:
    src: /logo.svg
    alt: M2JS Logo
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    - theme: alt
      text: View on GitHub
      link: https://github.com/yourusername/m2js

features:
  - icon: 🚀
    title: LLM Optimized
    details: Save 60%+ tokens when feeding code to AI assistants like ChatGPT and Claude
  
  - icon: ⚡
    title: Simple CLI
    details: One command to transform any TypeScript/JavaScript file into clean Markdown
  
  - icon: 🎯
    title: Smart Extraction
    details: Extracts only exported functions, classes, and comments - no noise
  
  - icon: 🌟
    title: Open Source
    details: MIT licensed, community-driven, and built for developers by developers
---

## Quick Example

Transform this TypeScript:

```typescript
/**
 * Calculates user statistics
 */
export class UserStats {
  calculateAverage(numbers: number[]): number {
    return numbers.reduce((a, b) => a + b) / numbers.length;
  }
}

// Private helper - won't be extracted
function internalHelper() { /* ... */ }
```

Into this clean Markdown:

```markdown
## 🏗️ Classes

### UserStats
/**
 * Calculates user statistics
 */
\`\`\`typescript
export class UserStats {
  calculateAverage(numbers: number[]): number {
    return numbers.reduce((a, b) => a + b) / numbers.length;
  }
}
\`\`\`
```

**Perfect for LLM consumption with 60% fewer tokens!**
```

### Step 4: Core Documentation Pages

**`docs/guide/getting-started.md`:**
```markdown
# Getting Started

M2JS transforms TypeScript and JavaScript files into clean, LLM-optimized Markdown summaries.

## What is M2JS?

M2JS extracts only the essential parts of your code that LLMs need:
- ✅ Exported functions and classes
- ✅ JSDoc comments and docstrings  
- ✅ Type annotations and signatures
- ❌ Private functions and implementation details
- ❌ Complex nested logic
- ❌ Import/export noise

## Why Use M2JS?

### Save Money on LLM Tokens
- **60%+ token reduction** when sharing code with AI
- **Cleaner context** leads to better AI responses
- **Focus on what matters** for code review and debugging

### Perfect for AI Workflows
- Code reviews with ChatGPT/Claude
- Documentation generation
- Debugging assistance
- Refactoring guidance

## Installation

::: code-group
```bash [npm]
npm install -g m2js
```

```bash [yarn]
yarn global add m2js
```

```bash [pnpm]
pnpm add -g m2js
```
:::

## Quick Start

```bash
# Transform a single file
m2js ./src/utils.ts

# Specify output location
m2js ./src/api.ts -o ./docs/api-summary.md

# Skip comments
m2js ./src/helpers.ts --no-comments
```

::: tip Next Steps
- Read the [CLI Reference](/guide/cli-reference) for all options
- Check out [Examples](/guide/examples) for real-world usage
- Learn about [Configuration](/advanced/configuration) for advanced setups
:::
```

**`docs/guide/cli-reference.md`:**
```markdown
# CLI Reference

Complete reference for the M2JS command-line interface.

## Basic Usage

```bash
m2js <file> [options]
```

## Arguments

| Argument | Type | Description |
|----------|------|-------------|
| `<file>` | string | Input TypeScript or JavaScript file |

## Options

| Option | Alias | Type | Default | Description |
|--------|-------|------|---------|-------------|
| `--output` | `-o` | string | `<file>.md` | Output markdown file |
| `--no-comments` | | boolean | false | Skip comment extraction |
| `--help` | `-h` | | | Show help information |
| `--version` | `-V` | | | Show version number |

## Examples

### Basic Transformation
```bash
m2js ./src/utils.ts
# Output: ./src/utils.md
```

### Custom Output File
```bash
m2js ./src/api.ts -o ./docs/api-reference.md
```

### Skip Comments
```bash
m2js ./src/helpers.ts --no-comments
```

### Multiple Files (Future)
```bash
# Coming in v1.2
m2js ./src/*.ts
```

## Supported File Types

| Extension | Language | Status |
|-----------|----------|---------|
| `.ts` | TypeScript | ✅ Supported |
| `.tsx` | TypeScript JSX | ✅ Supported |
| `.js` | JavaScript | ✅ Supported |
| `.jsx` | JavaScript JSX | ✅ Supported |

## Error Handling

M2JS provides clear error messages for common issues:

```bash
❌ Error: Only .ts, .js, .tsx, .jsx files supported
❌ Error: File not found: ./src/missing.ts
❌ Error: Permission denied writing to output file
```

::: warning File Size Limits
M2JS has a 5MB file size limit for optimal performance. For larger files, consider splitting them into smaller modules.
:::
```

### Step 5: GitHub Pages Setup

**`.github/workflows/docs.yml`:**
```yaml
name: Deploy Documentation

on:
  push:
    branches: [main]
    paths: ['docs/**']
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: npm
          cache-dependency-path: docs/package-lock.json
          
      - name: Install dependencies
        run: |
          cd docs
          npm ci
          
      - name: Build documentation
        run: |
          cd docs
          npm run docs:build
          
      - name: Setup Pages
        uses: actions/configure-pages@v3
        
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v2
        with:
          path: docs/.vitepress/dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v2
```

**`docs/package.json`:**
```json
{
  "name": "m2js-docs",
  "version": "1.0.0",
  "description": "M2JS Documentation",
  "scripts": {
    "docs:dev": "vitepress dev",
    "docs:build": "vitepress build",
    "docs:preview": "vitepress preview"
  },
  "devDependencies": {
    "vitepress": "^1.0.0"
  }
}
```

---

## 🎨 Customization & Branding

### Custom CSS
**`.vitepress/theme/custom.css`:**
```css
:root {
  /* M2JS Brand Colors */
  --vp-c-brand-1: #2563eb;
  --vp-c-brand-2: #3b82f6;
  --vp-c-brand-3: #60a5fa;
  
  /* Custom spacing */
  --vp-hero-name-font-size: 48px;
  --vp-hero-tagline-font-size: 20px;
}

/* Custom hero styling */
.VPHero .name {
  background: linear-gradient(120deg, #2563eb 30%, #3b82f6);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Code block enhancements */
.vp-code-group {
  margin: 20px 0;
}

/* Custom badges */
.badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  background: var(--vp-c-brand-1);
  color: white;
}
```

### Logo Design
- **Format**: SVG for scalability
- **Size**: 120x40px for navigation
- **Style**: Simple, tech-focused, readable
- **Colors**: Match brand palette

---

## 📊 Analytics & Monitoring

### Google Analytics 4
```typescript
// In .vitepress/config.ts
export default defineConfig({
  head: [
    ['script', { 
      async: '', 
      src: 'https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID' 
    }],
    ['script', {}, `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'GA_MEASUREMENT_ID');
    `]
  ]
})
```

### GitHub Stars Badge
```markdown
[![GitHub stars](https://img.shields.io/github/stars/yourusername/m2js?style=social)](https://github.com/yourusername/m2js)
[![npm version](https://img.shields.io/npm/v/m2js.svg)](https://npmjs.com/package/m2js)
[![npm downloads](https://img.shields.io/npm/dm/m2js.svg)](https://npmjs.com/package/m2js)
```

---

## 🚀 Launch Checklist

### Before Going Live
- [ ] All core pages written and reviewed
- [ ] Examples tested and working
- [ ] GitHub Pages deployment configured
- [ ] Custom domain setup (optional)
- [ ] Analytics configured
- [ ] SEO meta tags added
- [ ] Social media cards configured

### Post-Launch
- [ ] Submit to search engines
- [ ] Share on developer communities
- [ ] Monitor analytics and user feedback
- [ ] Iterate based on community needs

**URL**: `https://yourusername.github.io/m2js/`

**Total Setup Time**: 4-6 hours for complete documentation site