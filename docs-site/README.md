# M2JS Documentation Site

This directory contains the VitePress-powered documentation website for M2JS.

## 🚀 Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Project Structure

```
docs-site/
├── docs/                          # Documentation content
│   ├── .vitepress/               # VitePress configuration
│   │   ├── config.mts           # Main config file
│   │   └── theme/               # Custom theme
│   ├── guide/                   # User guides
│   ├── reference/               # API reference
│   ├── architecture/            # Architecture docs
│   ├── extension/               # VS Code extension docs
│   ├── deployment/              # Deployment guides
│   └── public/                  # Static assets
├── package.json                 # Dependencies and scripts
└── README.md                    # This file
```

## 📚 Documentation Sections

### Guide (User Documentation)
- **Quick Start**: 5-minute getting started guide
- **Best Practices**: Maximize M2JS effectiveness
- **Configuration**: Customize for your workflow

### Reference (Technical Documentation)
- **CLI Commands**: Complete command reference
- **AI Analyzers**: Deep dive into AI enhancement features

### Architecture (Developer Documentation)
- **Overview**: System design and components
- **Contributing Guide**: How to contribute to M2JS
- **Deployment Guide**: Release and deployment process

### Extension (VS Code Integration)
- **Overview**: VS Code extension documentation

### Deployment (Infrastructure)
- **GitHub Pages**: Complete deployment guide

## 🔧 Configuration

### VitePress Configuration

Key configuration in `docs/.vitepress/config.mts`:

```typescript
export default defineConfig({
  title: 'M2JS',
  description: 'Transform TypeScript/JavaScript into LLM-friendly Markdown',
  base: '/m2js/',  // GitHub Pages base URL
  
  themeConfig: {
    nav: [...],     // Top navigation
    sidebar: {...}, // Sidebar navigation
    socialLinks: [...], // Social media links
    editLink: {...}     // GitHub edit links
  }
})
```

### GitHub Pages Configuration

The site is automatically deployed to GitHub Pages via GitHub Actions:

- **URL**: https://paulohenriquevn.github.io/m2js/
- **Workflow**: `.github/workflows/deploy-docs.yml`
- **Trigger**: Pushes to `main` branch affecting `docs-site/**`

## 🚀 Deployment

### Automatic Deployment

Documentation is automatically deployed when:

1. Changes are pushed to `main` branch
2. Changes affect files in `docs-site/**` directory
3. GitHub Actions workflow builds and deploys the site

### Manual Deployment

You can trigger manual deployment:

```bash
# Via GitHub Actions UI
1. Go to repository Actions tab
2. Select "Deploy M2JS Documentation"
3. Click "Run workflow"
4. Select branch: main
5. Click "Run workflow"
```

### Local Deployment Test

```bash
# Build and preview locally
npm run build
npm run preview

# Test production build
cd docs/.vitepress/dist
python -m http.server 8080
```

## 📝 Content Management

### Adding New Documentation

1. **Create markdown file** in appropriate directory:
   ```bash
   # User guides
   docs/guide/new-feature.md
   
   # Technical reference
   docs/reference/new-api.md
   
   # Developer docs
   docs/architecture/new-component.md
   ```

2. **Update navigation** in `config.mts`:
   ```typescript
   sidebar: {
     '/guide/': [
       {
         text: 'Getting Started',
         items: [
           { text: 'New Feature', link: '/guide/new-feature' }
         ]
       }
     ]
   }
   ```

3. **Test locally**:
   ```bash
   npm run dev
   ```

4. **Commit and push**:
   ```bash
   git add docs-site/
   git commit -m "docs: add new feature documentation"
   git push origin main
   ```

### Content Guidelines

- **Use clear headings** with emoji prefixes
- **Include code examples** for all features
- **Link related sections** using relative links
- **Update navigation** when adding new pages
- **Test all links** before publishing

### Markdown Features

VitePress supports enhanced markdown:

```markdown
# Standard markdown
**bold**, *italic*, `code`

# Code blocks with syntax highlighting
```typescript
export function example() {
  return 'Hello World';
}
```

# Custom containers
::: tip
This is a tip
:::

::: warning
This is a warning
:::

::: danger
This is a danger notice
:::

# Links
[Internal link](/guide/quick-start)
[External link](https://github.com/paulohenriquevn/m2js)
```

## 🛠️ Development

### Local Development Workflow

1. **Start development server**:
   ```bash
   npm run dev
   ```

2. **Edit documentation** in `docs/` directory

3. **Preview changes** in browser at http://localhost:5173

4. **Build and test**:
   ```bash
   npm run build
   npm run preview
   ```

### Common Tasks

#### Update Navigation

Edit `docs/.vitepress/config.mts`:

```typescript
nav: [
  { text: 'New Section', link: '/new-section/' }
],

sidebar: {
  '/new-section/': [
    {
      text: 'New Section',
      items: [
        { text: 'Overview', link: '/new-section/overview' }
      ]
    }
  ]
}
```

#### Add Custom Styling

Create `docs/.vitepress/theme/custom.css`:

```css
:root {
  --vp-c-brand-1: #ff6600;
  --vp-c-brand-2: #ff8533;
}
```

#### Configure Search

Search is enabled by default with local search:

```typescript
themeConfig: {
  search: {
    provider: 'local'
  }
}
```

## 🔍 Troubleshooting

### Common Issues

#### Build Fails
```bash
Error: Cannot resolve module
Solution: Check package.json dependencies
```

#### Links Don't Work
```bash
Error: 404 on internal links
Solution: Check base URL configuration and link paths
```

#### Images Don't Load
```bash
Error: Images show 404
Solution: Place images in docs/public/ directory
```

### Debug Mode

Enable debug logging:

```bash
# Development
DEBUG=vitepress:* npm run dev

# Build
DEBUG=vitepress:* npm run build
```

## 📊 Performance

### Build Metrics

Typical build performance:
- **Build time**: 30-60 seconds
- **Bundle size**: 2-5MB
- **Pages**: 20-50 pages
- **Assets**: Optimized images and CSS

### Optimization Tips

1. **Optimize images** in `docs/public/`
2. **Use code splitting** for large pages
3. **Enable caching** in production
4. **Minimize bundle size** with tree shaking

## 🤝 Contributing

To contribute to documentation:

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b docs/new-feature`
3. **Make changes** in `docs-site/docs/`
4. **Test locally**: `npm run dev`
5. **Commit changes**: `git commit -m "docs: add new feature guide"`
6. **Push to fork**: `git push origin docs/new-feature`
7. **Create Pull Request**

### Documentation Standards

- **Follow existing structure** and naming conventions
- **Include complete examples** for all features
- **Test all code examples** before submitting
- **Update navigation** when adding new sections
- **Use consistent formatting** and emoji prefixes

For technical questions, see the main [Contributing Guide](/architecture/contributing).