# 🚀 Deployment Guide

Complete guide for releasing and deploying M2JS updates.

## Release Process

### Version Management

M2JS follows [Semantic Versioning](https://semver.org/):

```bash
# Patch release (bug fixes)
npm version patch    # 1.0.0 → 1.0.1

# Minor release (new features)
npm version minor    # 1.0.1 → 1.1.0

# Major release (breaking changes)
npm version major    # 1.1.0 → 2.0.0
```

### Pre-Release Checklist

**1. Code Quality Validation**
```bash
# Run complete validation suite
npm run validate      # type-check + lint + test + security
npm run build        # Ensure clean build
npm run test:coverage # Verify test coverage
```

**2. Manual Testing**
```bash
# Test CLI functionality
npm link
m2js --help
m2js examples/User.ts
m2js src/ --batch
m2js src/ --graph --mermaid

# Test with real projects
cd ../other-project
m2js src/components/Button.tsx
```

**3. Documentation Updates**
```bash
# Update version-specific docs
docs-site/docs/index.md           # Hero version number
package.json                      # Version metadata
CHANGELOG.md                      # Release notes
README.md                        # Installation instructions
```

### Release Workflow

**1. Prepare Release Branch**
```bash
# Create release branch
git checkout -b release/v1.1.0

# Update version and tag
npm version minor
# This automatically:
# - Updates package.json version
# - Creates git tag (e.g., v1.1.0)  
# - Commits the version change
```

**2. Update Documentation**
```bash
# Update CHANGELOG.md
echo "## [1.1.0] - $(date +%Y-%m-%d)

### Added
- New feature X
- Enhanced feature Y

### Fixed  
- Bug fix Z
- Performance improvement W

### Changed
- Updated dependency A to v2.0
" >> CHANGELOG.md

# Update README version examples
sed -i 's/1\.0\.1/1.1.0/g' README.md
```

**3. Publish to NPM**
```bash
# Final validation
npm run validate
npm run build

# Publish to NPM registry
npm publish

# Verify publication
npm view @paulohenriquevn/m2js
```

**4. GitHub Release**
```bash
# Push changes and tags
git push origin release/v1.1.0
git push --tags

# Create GitHub release via CLI
gh release create v1.1.0 \
  --title "M2JS v1.1.0" \
  --notes-file CHANGELOG.md \
  --generate-notes
```

**5. Documentation Deployment**
```bash
# Deploy GitHub Pages documentation
cd docs-site
npm run build
npm run deploy
```

## NPM Package Management

### Package Configuration

```json
// package.json essentials
{
  "name": "@paulohenriquevn/m2js",
  "version": "1.1.0",
  "description": "Transform TypeScript/JavaScript into LLM-friendly Markdown",
  "main": "dist/index.js",
  "bin": {
    "m2js": "dist/cli.js"
  },
  "files": [
    "dist/**/*",
    "README.md",
    "LICENSE",
    "CHANGELOG.md"
  ],
  "engines": {
    "node": ">=16.0.0"
  },
  "keywords": [
    "typescript", "javascript", "markdown", "llm", "ai",
    "chatgpt", "claude", "documentation", "cli"
  ]
}
```

### Pre-publish Validation

```bash
# package.json script
"prepublishOnly": "npm run type-check && npm run lint && npm run build"

# This runs automatically before npm publish
# Ensures only validated code reaches NPM
```

### Package Size Optimization

```bash
# Check package contents
npm pack --dry-run

# Monitor package size
npm view @paulohenriquevn/m2js dist.unpackedSize
npm view @paulohenriquevn/m2js dist.tarball
```

**Size Targets:**
- Compressed: < 100KB
- Uncompressed: < 500KB
- File count: < 100 files

## GitHub Pages Documentation

### VitePress Deployment

```bash
# docs-site/.github/workflows/deploy.yml
name: Deploy Documentation
on:
  push:
    branches: [main]
    paths: ['docs-site/**']

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0
      
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: npm
          cache-dependency-path: docs-site/package-lock.json
      
      - run: cd docs-site && npm ci
      - run: cd docs-site && npm run build
      
      - uses: actions/deploy-pages@v2
        with:
          folder: docs-site/docs/.vitepress/dist
```

### Documentation Versioning

```javascript
// docs-site/docs/.vitepress/config.mts
export default defineConfig({
  title: 'M2JS',
  description: 'Transform code into AI-ready documentation',
  base: '/m2js/',
  
  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'v1.1.0', items: [
        { text: 'v1.1.0 (Latest)', link: '/guide/getting-started' },
        { text: 'v1.0.1', link: '/v1.0.1/guide/getting-started' },
        { text: 'Changelog', link: '/changelog' }
      ]}
    ]
  }
});
```

## CI/CD Pipeline

### GitHub Actions Workflows

**1. Continuous Integration** (`.github/workflows/ci.yml`)
```yaml
name: CI
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [16, 18, 20]
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
          cache: npm
      
      - run: npm ci
      - run: npm run validate
      - run: npm run build
      - run: npm run test:coverage
      
      - uses: codecov/codecov-action@v3
        with:
          token: ${{ secrets.CODECOV_TOKEN }}
```

**2. Release Automation** (`.github/workflows/release.yml`)
```yaml
name: Release
on:
  push:
    tags: ['v*']

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          registry-url: https://registry.npmjs.org
      
      - run: npm ci
      - run: npm run validate
      - run: npm run build
      - run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
      
      - uses: actions/create-release@v1
        with:
          tag_name: ${{ github.ref }}
          release_name: M2JS ${{ github.ref }}
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

**3. Documentation Deploy** (`.github/workflows/docs.yml`)
```yaml
name: Deploy Docs
on:
  push:
    branches: [main]
    paths: ['docs-site/**']

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      pages: write
      id-token: write
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: cd docs-site && npm ci && npm run build
      - uses: actions/configure-pages@v3
      - uses: actions/upload-pages-artifact@v2
        with:
          path: docs-site/docs/.vitepress/dist
      - uses: actions/deploy-pages@v2
```

## Quality Gates

### Automated Checks

**Pre-commit Hooks** (`.husky/pre-commit`)
```bash
#!/usr/bin/env sh
npm run lint
npm run type-check
npm test
```

**Pre-push Hooks** (`.husky/pre-push`)  
```bash
#!/usr/bin/env sh
npm run validate
npm run build
```

### Security Scanning

```bash
# Dependency vulnerability scanning
npm audit --audit-level=high

# License compliance check
npx license-checker --onlyAllow 'MIT;Apache-2.0;BSD-3-Clause'

# Package health monitoring
npx package-check
```

## Monitoring & Analytics

### NPM Package Statistics

```bash
# Download statistics
npm view @paulohenriquevn/m2js --json | jq '.time'

# Version adoption
npm view @paulohenriquevn/m2js dist-tags

# Dependency analysis
npm view @paulohenriquevn/m2js dependencies
```

### GitHub Analytics

- **Stars/Forks**: Community adoption metrics
- **Issues/PRs**: Community engagement
- **Downloads**: NPM registry statistics
- **Dependencies**: Security and maintenance status

### Documentation Analytics

```javascript
// Google Analytics 4 integration
// docs-site/docs/.vitepress/config.mts
export default defineConfig({
  head: [
    ['script', { 
      async: true, 
      src: 'https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX' 
    }],
    ['script', {}, `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-XXXXXXXXXX');
    `]
  ]
});
```

## Rollback Procedures

### NPM Package Rollback

```bash
# Deprecate problematic version
npm deprecate @paulohenriquevn/m2js@1.1.0 "Critical bug - use 1.0.1 instead"

# Publish hotfix
npm version patch  # 1.1.0 → 1.1.1
npm publish

# Update latest tag if needed
npm dist-tag add @paulohenriquevn/m2js@1.0.1 latest
```

### Git Rollback

```bash
# Revert to previous version
git revert v1.1.0
git tag v1.1.1
git push --tags

# Force rollback if necessary
git reset --hard v1.0.1
git tag -f v1.1.1
git push --force-with-lease --tags
```

## Release Communication

### Changelog Format

```markdown
# Changelog

## [1.1.0] - 2024-01-15

### Added
- 🎯 New dependency graph visualization with Mermaid diagrams
- 🔧 Enhanced CLI with progress reporting and colored output
- 📊 Performance metrics and token reduction statistics

### Fixed
- 🐛 Fixed parsing of arrow functions in class properties
- 🔧 Improved error messages for unsupported file types
- ⚡ Optimized memory usage for large files (50% reduction)

### Changed
- 📝 Updated documentation with comprehensive examples
- 🏗️ Refactored parser engine for better maintainability
- 🎨 Enhanced Markdown output formatting

### Deprecated
- ⚠️ Legacy --simple flag (use --no-comments instead)

### Security
- 🔒 Updated dependencies to fix vulnerability CVE-2024-XXXX
```

### Release Announcements

**1. GitHub Release Notes**
- Comprehensive changelog
- Migration guide for breaking changes
- Known issues and workarounds

**2. NPM Package Description**
- Updated keywords and metadata
- Version-specific documentation links

**3. Community Updates**
- Twitter/social media announcements
- Developer community forums
- Documentation website banner

This deployment process ensures reliable, traceable releases while maintaining high quality standards and community trust.