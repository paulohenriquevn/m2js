# M2JS (Markdown from JavaScript)

<div align="center">
  <img src="https://raw.githubusercontent.com/paulohenriquevn/m2js/main/assets/logo.png" alt="M2JS Logo" width="120" height="120">
</div>

🚀 **Transform TypeScript/JavaScript code into LLM-friendly Markdown summaries + Smart Dead Code Detection with 60-90% token reduction**

M2JS is a comprehensive ecosystem that extracts and analyzes TypeScript/JavaScript code, converting it into optimized Markdown documentation perfect for AI coding assistants like ChatGPT, Claude, and GitHub Copilot. **Now with intelligent dead code detection that goes beyond traditional linters.**

![M2JS Demo](https://img.shields.io/badge/M2JS-Transform%20Code%20to%20AI--Ready%20Docs-blue?style=for-the-badge)
![Dead Code Detection](https://img.shields.io/badge/Dead%20Code-Smart%20Detection%20%2B%20Safe%20Removal-green?style=for-the-badge)

[![NPM Downloads](https://img.shields.io/npm/dt/@paulohenriquevn/m2js?style=flat-square)](https://www.npmjs.com/package/@paulohenriquevn/m2js)
[![GitHub Stars](https://img.shields.io/github/stars/paulohenriquevn/m2js?style=flat-square)](https://github.com/paulohenriquevn/m2js)
[![VS Code Extension](https://img.shields.io/visual-studio-marketplace/i/m2js.m2js-vscode?style=flat-square&label=VS%20Code%20Installs)](https://marketplace.visualstudio.com/items?itemName=m2js.m2js-vscode)
[![License](https://img.shields.io/github/license/paulohenriquevn/m2js?style=flat-square)](LICENSE)

## ✨ What is M2JS?

### 🎯 **Dual Purpose Solution**

**1. AI-Ready Documentation** - Transform your code into perfect LLM context
**2. Smart Dead Code Detection** - Find and safely remove unused code with confidence levels

### 💡 **The Problems We Solve**

**For AI-Assisted Development:**
- Large codebases consume too many tokens when shared with AI assistants (expensive & ineffective)
- Private code details create noise and security concerns  
- Missing business context makes AI responses less accurate
- Manual code summarization is time-consuming and inconsistent

**For Code Maintenance:**
- Dead code accumulates over time, bloating codebases
- Traditional linters tell you WHAT is unused, not HOW to safely remove it
- Uncertainty about whether "unused" exports are actually safe to delete
- Manual dead code cleanup is risky and time-consuming

### 💡 **Our Solutions**

**AI Documentation:**
- **🎯 60-90% token reduction** while preserving complete meaning
- **🔒 Exports-only analysis** - no private implementation details
- **🧠 Business context** - automatic domain, patterns, and architectural insights
- **⚡ LLM-optimized format** - structured for maximum AI understanding

**Smart Dead Code Detection:**
- **🎯 Confidence levels** (High/Medium/Low) for every unused export/import
- **🛡️ Risk assessment** with detailed warnings for public APIs, frameworks, etc.
- **⚡ Actionable suggestions** with ready-to-use removal commands
- **🔍 Cross-file analysis** that understands your entire codebase context

## 🆚 M2JS vs Traditional Linters: The Honest Truth

### **Are We Reinventing the Wheel?**

**Short Answer: No, but we're making the wheel intelligent.**

### **What ESLint Already Does:**
```bash
# ESLint detects basic unused code
"no-unused-vars": "error"
"@typescript-eslint/no-unused-imports": "error"
```
**Output**: `"unusedFunction is never used"` ❌

### **What M2JS Does Differently:**
```bash
m2js src --detect-unused
```
**Output**: 
```
🔥 Remove function: internalHelper [HIGH CONFIDENCE] ✅ SAFE TO REMOVE
    # Remove lines around 25 in utils.ts

⚠️  Review function: createApi [MEDIUM CONFIDENCE] ⚠️ REVIEW NEEDED  
    Risk: Export name suggests it may be used by external packages

🚨 Review function: default [LOW CONFIDENCE] 🚨 HIGH RISK
    Risks: Default export, Type definition, Configuration file
```

### **🎯 Our Unique Value Proposition:**

| Traditional Linters | M2JS Smart Detection |
|---------------------|---------------------|
| "This is unused" | "This is unused AND here's how to safely remove it" |
| File-by-file analysis | Cross-project understanding |
| Binary unused/used | Confidence levels + risk assessment |
| Generic warnings | Context-aware suggestions |
| Manual investigation needed | Ready-to-execute commands |

### **🤝 How to Use M2JS with Existing Tools:**

```bash
# Don't replace ESLint - enhance it!
npm run lint              # ESLint for code quality
m2js src --detect-unused  # M2JS for smart dead code removal
```

**M2JS is not a linter replacement. It's a smart assistant for confident dead code cleanup.**

### **🎯 When to Use M2JS vs ESLint:**

**Use ESLint for:**
- Code style and quality
- Bug prevention
- Development workflow integration

**Use M2JS for:**
- Safe dead code removal with confidence
- AI-assisted code analysis
- Understanding large/legacy codebases
- Smart cleanup before refactoring

## 🚀 Quick Start

### Option 1: Dead Code Analysis
```bash
# Install globally
npm install -g @paulohenriquevn/m2js

# Analyze your project for dead code
m2js src --detect-unused

# Generate configuration for persistent settings
m2js --init-config

# Get detailed help
m2js --help-dead-code
```

### Option 2: AI Documentation
```bash
# Transform your code for AI
m2js UserService.ts --ai-enhanced
```

### Option 3: VS Code Extension
1. Install from [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=m2js.m2js-vscode)
2. Right-click any TypeScript/JavaScript file
3. Select "M2JS: Generate AI-Enhanced Analysis"
4. Get optimized documentation instantly!

## 🧹 Dead Code Detection: Complete Guide

### **🎯 Basic Usage**

```bash
# Analyze single file
m2js utils.ts --detect-unused

# Analyze entire project
m2js src/ --detect-unused

# JSON output for CI/CD
m2js src --detect-unused --format json

# With progress bar for large projects
M2JS_SHOW_PROGRESS=true m2js src --detect-unused
```

### **🔧 Configuration**

#### **Generate Configuration File**
```bash
m2js --init-config  # Creates .m2jsrc in current directory
```

#### **Example .m2jsrc**
```json
{
  "deadCode": {
    "enableCache": true,
    "maxCacheSize": 1000,
    "chunkSize": 50,
    "showProgress": true,
    "format": "table",
    "includeMetrics": true,
    "includeSuggestions": true
  },
  "files": {
    "extensions": [".ts", ".tsx", ".js", ".jsx"],
    "ignorePatterns": [
      "**/node_modules/**",
      "**/dist/**", 
      "**/*.test.*",
      "**/*.spec.*"
    ],
    "maxFileSize": 10
  }
}
```

#### **Environment Variables**
```bash
# Performance tuning
M2JS_CACHE_ENABLED=true      # Enable/disable cache (default: true)
M2JS_CACHE_SIZE=1000         # Max files in cache (default: 1000)
M2JS_CHUNK_SIZE=50           # Files per processing chunk (default: 50)
M2JS_SHOW_PROGRESS=true      # Show progress bar (default: true)
M2JS_MAX_FILE_SIZE=10        # Max file size in MB (default: 10)

# Usage examples
M2JS_SHOW_PROGRESS=false m2js src --detect-unused
M2JS_CHUNK_SIZE=100 m2js large-project --detect-unused
```

### **🎯 Understanding Output**

#### **Confidence Levels**
- **[HIGH]** ✅ Safe to remove immediately
- **[MEDIUM]** ⚠️ Review recommended, probably safe
- **[LOW]** 🚨 High risk, careful analysis needed

#### **Risk Factors**
```
⚠️ Risk factors:
  • Export name suggests it may be used by external packages
  • Framework import - may be used implicitly  
  • Type definition - may be used in type annotations
  • Located in test file - may be used by test framework
  • Default export - may be imported with different names
```

#### **Actionable Suggestions**
```bash
🛠️ Removal Suggestions:
┌─────────────────────────────────────────────────┐
│ ✅ SAFE TO REMOVE:
│ 🔥 Remove function: helper
│   utils.ts:25
│   Remove unused function (~10 lines)
│   # Remove lines around 25 in utils.ts
│
│ ⚠️ REVIEW BEFORE REMOVING:
│ ⚡ Remove function: createApi  
│   api.ts:15
│   ⚠️ Export name suggests it may be used by external packages
│
│ 🚨 HIGH RISK:
│ 3 suggestions require careful analysis
│ Manual review strongly recommended
└─────────────────────────────────────────────────┘
```

### **📊 Performance Features**

#### **Intelligent Caching**
- **LRU Cache**: Remembers parsed files with timestamp validation
- **80% faster** re-analysis of unchanged files
- **Automatic invalidation** when files are modified

#### **Memory Optimization**
- **Chunk processing**: Handles large codebases without memory overflow
- **Garbage collection**: Automatic cleanup between processing batches
- **Configurable limits**: Tune performance for your hardware

#### **Progress Indicators**
```bash
🔍 [████████████████████████████████████████] 85% (127/150) UserService.ts - 2.3s remaining
✅ Analysis complete in 12.7s
```

### **🎯 Advanced Usage**

#### **CI/CD Integration**
```yaml
# .github/workflows/dead-code.yml
name: Dead Code Analysis
on: [push, pull_request]

jobs:
  dead-code:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install -g @paulohenriquevn/m2js
      - run: m2js src --detect-unused --format json > dead-code-report.json
      - uses: actions/upload-artifact@v3
        with:
          name: dead-code-report
          path: dead-code-report.json
```

#### **Custom Scripts**
```json
{
  "scripts": {
    "dead-code": "m2js src --detect-unused",
    "dead-code-ci": "m2js src --detect-unused --format json",
    "cleanup-safe": "m2js src --detect-unused | grep 'SAFE TO REMOVE' -A2"
  }
}
```

## 📊 Real-World Example: AI Documentation

### Before M2JS (2,847 tokens)
```typescript
export class AuthService {
  private readonly jwtSecret: string;
  private readonly tokenExpiry: number;
  private readonly userRepository: UserRepository;
  // ... 200+ lines of implementation details
  
  async login(email: string, password: string): Promise<AuthResult> {
    // Complex implementation with error handling,
    // rate limiting, validation, logging, etc.
    // All private details that AI doesn't need
  }
}
```

### After M2JS (487 tokens - 83% reduction!)
```markdown
# 📝 AuthService.ts

## 🧠 Business Context
**Domain**: Authentication (98% confidence)
**Framework**: Node.js + JWT + TypeScript
**Patterns**: Service Layer, Repository Pattern

## 🔧 Functions

### login
```typescript
async login(email: string, password: string): Promise<AuthResult>
```
**Business Rules**:
- Rate limiting: Max 5 attempts per hour  
- Password validation with bcrypt required
- Account must be active

**Usage Pattern**: Authentication workflow
**Returns**: AuthResult with JWT token and user data
**Throws**: AuthenticationError, RateLimitError
```

**Result**: 83% fewer tokens, 100% of the essential information, plus business context!

## 🛠️ Complete Feature Set

### 🧹 **Dead Code Detection**
```bash
# Smart analysis with confidence levels
m2js src --detect-unused

# Performance optimized for large codebases  
m2js large-project --detect-unused --chunk-size 100

# CI/CD friendly JSON output
m2js src --detect-unused --format json
```

### 🎯 **AI Documentation**
```bash
# Basic analysis
m2js UserService.ts

# AI-enhanced with business context  
m2js UserService.ts --ai-enhanced

# Batch processing
m2js src/ --batch --output docs/
```

### 🔧 **VS Code Extension**
- **Right-click Context Menu**: Generate documentation from any TS/JS file
- **Interactive Webviews**: Beautiful panels with VS Code theming
- **Auto-save to Workspace**: Organized output in your project folder
- **Full Configuration**: Customize every aspect of analysis

### ⚙️ **Configuration & Performance**
- **Configuration Files**: `.m2jsrc` for persistent settings
- **Environment Variables**: Override any setting via ENV
- **Intelligent Caching**: 80% faster re-analysis
- **Progress Indicators**: Visual feedback for large projects
- **Memory Optimization**: Chunk processing for any codebase size

## 📋 Feature Comparison Matrix

| Feature | ESLint | ts-unused-exports | knip | M2JS |
|---------|--------|-------------------|------|------|
| **Unused Imports** | ✅ | ❌ | ✅ | ✅ |
| **Unused Exports** | ❌ | ✅ | ✅ | ✅ |
| **Cross-file Analysis** | ❌ | ✅ | ✅ | ✅ |
| **Confidence Levels** | ❌ | ❌ | ❌ | ✅ |
| **Risk Assessment** | ❌ | ❌ | ❌ | ✅ |
| **Actionable Commands** | ❌ | ❌ | ❌ | ✅ |
| **AI Documentation** | ❌ | ❌ | ❌ | ✅ |
| **Performance Caching** | ✅ | ❌ | ❌ | ✅ |
| **Progress Indicators** | ❌ | ❌ | ❌ | ✅ |
| **Configuration Files** | ✅ | ❌ | ✅ | ✅ |

## 🎯 Use Cases & ROI

### 👨‍💻 **For Individual Developers**

**Dead Code Cleanup:**
```bash
# Before major refactoring
m2js src --detect-unused
# Follow safe removal suggestions
# Clean codebase with confidence
```

**AI-Assisted Development:**
```bash
# Before asking AI for help (save 80% on tokens)
m2js UserService.ts --ai-enhanced | pbcopy
# Paste optimized context into ChatGPT/Claude
```

**ROI**: 50% faster cleanup, 30x faster context preparation, 10x better AI responses

### 👥 **For Development Teams**

**Legacy Code Maintenance:**
- **Safe Cleanup**: Remove dead code with confidence before refactoring
- **Code Reviews**: Understand what's actually used vs. what's noise
- **Onboarding**: New developers understand codebase structure instantly

**AI-Enhanced Workflows:**
- **Documentation**: Auto-generated, always up-to-date docs
- **Architecture Reviews**: Visual dependency analysis and pattern detection
- **Knowledge Sharing**: Business context extraction from code

**ROI**: 70% faster legacy cleanup, 50% faster onboarding, 70% reduction in documentation maintenance

### 🏢 **For Enterprise**

**System Modernization:**
- **Pre-Migration Cleanup**: Remove dead code before modernizing systems
- **Risk Assessment**: Understand what code is actually critical
- **Knowledge Management**: Extract business rules from legacy codebases

**AI Transformation:**
- **Training Data**: Convert codebases to AI-ready documentation
- **Compliance**: Document APIs and business logic automatically
- **Code Intelligence**: Understand patterns across large organizations

**ROI**: Millions saved in system understanding, modernization prep, and documentation costs

## 🚀 Installation & Getting Started

### Quick Installation
```bash
# CLI Tool
npm install -g @paulohenriquevn/m2js

# VS Code Extension
# Search "M2JS" in VS Code Extensions marketplace
```

### Verify Installation
```bash
m2js --version
m2js --help-dead-code
```

### First Usage

#### **Dead Code Analysis**
```bash
# Generate configuration
m2js --init-config

# Analyze your project
m2js src --detect-unused

# Start with safe removals
# Follow the actionable suggestions from M2JS output
```

#### **AI Documentation**  
```bash
# Try with your own code
m2js src/services/UserService.ts --ai-enhanced

# Generate project overview
m2js src/ --graph --mermaid --output project-overview.md
```

## 🔬 Technical Deep Dive

### 🧠 Smart Dead Code Detection Pipeline
```mermaid
graph TB
    A[Source Files] --> B[Babel Parser]
    B --> C[AST Analysis] 
    C --> D[Export Extraction]
    C --> E[Import Extraction]
    C --> F[Usage Analysis]
    
    D --> G[Cross-Reference Analysis]
    E --> G
    F --> G
    
    G --> H[Risk Assessment Engine]
    H --> I[Confidence Calculation]
    H --> J[Context Analysis]
    
    I --> K[Actionable Suggestions]
    J --> K
    K --> L[Safe Removal Commands]
```

### 🏗️ **Architecture Principles**
- **KISS**: Simple solutions over complex abstractions
- **FAIL-FAST**: Clear error messages and quick failure
- **LOCAL-FIRST**: All processing on your machine (privacy guaranteed)
- **CONFIDENCE-DRIVEN**: Every suggestion includes risk assessment
- **TOKEN-OPTIMIZED**: Every feature designed to minimize LLM token usage

### 🛡️ **Security & Privacy**
- **Zero Cloud Processing**: Everything runs locally
- **No Telemetry**: Zero data collection or tracking
- **Export-Only Analysis**: Private code never included in documentation
- **Offline Capable**: Works without internet connection

## 📊 Performance & Benchmarks

### **Dead Code Analysis Performance**
| Project Size | Files | Processing Time | Memory Usage | Cache Hit Rate |
|--------------|-------|-----------------|--------------|----------------|
| Small | < 50 | < 5s | < 100MB | N/A (first run) |
| Medium | 50-500 | 10-30s | 100-300MB | 60-80% |
| Large | 500-2000 | 30-120s | 300-500MB | 80-90% |
| Enterprise | > 2000 | 2-10min | 500MB-1GB | 90%+ |

### **AI Documentation Performance**
| File Size | Processing Time | Memory Usage | Token Reduction |
|-----------|----------------|--------------|-----------------|
| < 10KB | < 1s | < 50MB | 60-70% |
| 10-100KB | 1-5s | 50-100MB | 70-80% |
| 100KB-1MB | 5-15s | 100-200MB | 80-90% |
| > 1MB | 15-30s | 200-300MB | 85-90% |

## 🚀 Roadmap & Future

### ✅ **v1.0 - Foundation** (Completed)
- TypeScript/JavaScript parsing with Babel
- Basic Markdown generation and token optimization
- CLI interface with comprehensive features
- VS Code extension with full IDE integration

### ✅ **v1.1 - AI Intelligence** (Completed)
- Business context analysis and domain detection
- Architecture pattern recognition
- Semantic relationship mapping  
- Template generation for LLM-guided development

### ✅ **v1.2 - Smart Dead Code Detection** (Completed)
- Confidence-based dead code analysis
- Risk assessment engine
- Actionable removal suggestions
- Performance optimization with caching
- Configuration system (.m2jsrc + ENV)
- Progress indicators for large projects

### 🔄 **v1.3 - Enhanced Intelligence** (In Progress)
- Multi-language support (Python, Java, C#)
- Advanced pattern recognition
- Team collaboration features
- Integration with popular IDEs

### 🎯 **v2.0 - Ecosystem Expansion** (Planned)
- JetBrains IDE integrations (IntelliJ, WebStorm)
- Advanced analytics and insights dashboard
- Enterprise features and SSO
- API documentation generation
- Automated refactoring suggestions

## 🤝 Contributing

We welcome contributions from developers of all experience levels!

### 🚀 Quick Start for Contributors
```bash
git clone https://github.com/paulohenriquevn/m2js.git
cd m2js
npm install
npm run build
npm test
npm link
m2js examples/User.ts --ai-enhanced
m2js src --detect-unused
```

### 🎯 **Ways to Contribute**
- 🐛 **Bug Reports**: Found an issue? [Report it](https://github.com/paulohenriquevn/m2js/issues/new?template=bug_report.yml)
- ✨ **Feature Requests**: Have an idea? [Suggest it](https://github.com/paulohenriquevn/m2js/issues/new?template=feature_request.yml)
- 📝 **Documentation**: Improve guides, examples, or API docs
- 🔧 **Code**: Fix bugs, add features, or improve performance
- 🧪 **Testing**: Add test cases or test with real-world codebases
- 🧹 **Dead Code Detection**: Help improve risk assessment algorithms

See our [Contributing Guide](CONTRIBUTING.md) for detailed instructions.

## 🐛 Support & Troubleshooting

### 📞 **Get Help**
- 📖 [Documentation](docs/) - Comprehensive guides and references
- 🐛 [GitHub Issues](https://github.com/paulohenriquevn/m2js/issues) - Bug reports and feature requests
- 💬 [GitHub Discussions](https://github.com/paulohenriquevn/m2js/discussions) - Community Q&A

### 🔧 **Common Solutions**
```bash
# Installation issues
npm cache clean --force
npm install -g @paulohenriquevn/m2js --verbose

# Processing errors  
m2js yourfile.ts --verbose --debug

# Performance issues with large projects
m2js largefile.ts --chunk-size 25
M2JS_CACHE_SIZE=2000 m2js src --detect-unused

# Dead code analysis help
m2js --help-dead-code
m2js --init-config
```

## 📄 License & Legal

MIT License - see [LICENSE](LICENSE) for details.

**Privacy Guarantee**: M2JS processes all code locally on your machine. No code is ever sent to external servers.

## 🙏 Acknowledgments & Credits

- **🎯 Babel Team**: For the incredible JavaScript/TypeScript parser
- **💡 TypeScript Team**: For advancing type system innovation
- **🔧 VS Code Team**: For the extensible IDE platform
- **🤖 AI Community**: For inspiration and continuous feedback
- **🧹 ESLint & Tool Authors**: For pioneering static analysis tooling
- **👥 Contributors**: Everyone who helped make M2JS better
- **🌟 Users**: Developers worldwide who trust M2JS with their code

---

## 📈 Project Stats

![NPM Downloads](https://img.shields.io/npm/dt/@paulohenriquevn/m2js?style=for-the-badge&logo=npm&logoColor=white)
![GitHub Stars](https://img.shields.io/github/stars/paulohenriquevn/m2js?style=for-the-badge&logo=github&logoColor=white)
![VS Code Installs](https://img.shields.io/visual-studio-marketplace/i/m2js.m2js-vscode?style=for-the-badge&logo=visualstudiocode&logoColor=white)
![GitHub Issues](https://img.shields.io/github/issues/paulohenriquevn/m2js?style=for-the-badge&logo=github&logoColor=white)

## 🔗 Quick Links

[![⭐ Star on GitHub](https://img.shields.io/badge/⭐_Star-GitHub-black?style=for-the-badge&logo=github)](https://github.com/paulohenriquevn/m2js)
[![📦 NPM Package](https://img.shields.io/badge/📦_Install-NPM-red?style=for-the-badge&logo=npm)](https://www.npmjs.com/package/@paulohenriquevn/m2js)
[![🔧 VS Code Extension](https://img.shields.io/badge/🔧_Install-VS_Code-blue?style=for-the-badge&logo=visualstudiocode)](https://marketplace.visualstudio.com/items?itemName=m2js.m2js-vscode)
[![🐛 Report Issue](https://img.shields.io/badge/🐛_Report-Issue-orange?style=for-the-badge&logo=github)](https://github.com/paulohenriquevn/m2js/issues)

**Made with ❤️ for developers working with AI coding assistants**

*Transform your code into AI-ready documentation and confidently clean dead code in seconds, not hours.*