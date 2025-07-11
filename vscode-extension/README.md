# M2JS - VS Code Extension

🐻 **Transform TypeScript/JavaScript into LLM-friendly Markdown documentation**

M2JS VS Code Extension brings the power of intelligent code analysis directly to your IDE, making it effortless to generate AI-optimized documentation with significant token reduction.

## ✨ Features

### 🎯 **Core Functionality**
- **📝 Generate Documentation**: Right-click any TypeScript/JavaScript file to create optimized Markdown
- **🧠 AI-Enhanced Analysis**: Get business context, architecture insights, and semantic relationships
- **🎯 Template Wizard**: Interactive creation of LLM implementation guides
- **📊 Project Analysis**: Comprehensive dependency and architecture analysis

### 🚀 **Key Benefits**
- **60-90% Token Reduction**: Dramatically reduce LLM context size while preserving meaning
- **Business Intelligence**: Automatic domain detection (e-commerce, blog, API, etc.)
- **Architecture Insights**: Pattern recognition (MVC, Service Layer, Repository, etc.)
- **Zero Configuration**: Works out-of-the-box with smart defaults

## 🎮 How to Use

### Quick Start
1. **Right-click** any `.ts`, `.tsx`, `.js`, or `.jsx` file
2. Select **"🧠 Generate AI-Enhanced Analysis"**
3. View results in interactive webview
4. **Copy to clipboard** for your AI assistant
5. **Auto-save** to your project workspace

### Available Commands
- `M2JS: Generate Documentation` - Basic code documentation
- `M2JS: Generate AI-Enhanced Analysis` - Full AI analysis with business context
- `M2JS: Create LLM Template` - Generate implementation guides
- `M2JS: Analyze Project Dependencies` - Project-wide analysis
- `M2JS: Template Wizard` - Interactive template creation

## 📊 Real Results

### Before M2JS (2,847 tokens)
```typescript
// Full AuthService class with 150+ lines of implementation details
export class AuthService {
  private readonly jwtSecret: string;
  // ... all private implementation
}
```

### After M2JS (487 tokens - 83% reduction!)
```markdown
# 📝 AuthService.ts

## 🧠 Business Context
**Domain**: Authentication (98% confidence)
**Patterns**: Service Layer, Repository Pattern

## 🔧 Functions
### login
async login(email: string, password: string): Promise<AuthResult>
**Business Rules**: Rate limiting, password validation, active account required
```

## 🛠️ Requirements

- **VS Code**: Version 1.74.0 or higher
- **M2JS CLI**: Automatically detected or manually configured
- **Node.js**: 16.0.0+ (for CLI functionality)

## 🚀 Installation

### From VS Code Marketplace
1. Open VS Code
2. Go to Extensions (`Ctrl+Shift+X`)
3. Search for "M2JS"
4. Click "Install"

## 🔐 Privacy & Security

- **Zero cloud processing**: All analysis runs locally
- **No data collection**: Zero telemetry or usage tracking
- **Offline capable**: Works without internet connection

## ✨ Features

### 🎯 **Core Analysis**
- **📝 Standard Documentation**: Clean Markdown extraction from TypeScript/JavaScript
- **🧠 AI-Enhanced Analysis**: Business context, architecture insights, and semantic relationships
- **🎯 Template Generation**: LLM-guided development templates
- **📊 Project Analysis**: Dependency graphs and architectural patterns

### 🛠️ **IDE Integration**
- **Right-click Context Menu**: Generate documentation from any TypeScript/JavaScript file
- **Interactive Webviews**: Beautiful HTML panels with VS Code theming
- **Auto-save to Workspace**: Organized output in your project folder
- **Command Palette**: Full access to all M2JS features

### 🎨 **Smart Features**
- **Token Optimization**: 60-90% reduction in token usage for AI assistants
- **Business Domain Detection**: Automatic detection of e-commerce, blog, API patterns
- **Template Wizard**: Interactive creation of implementation guides
- **Copy for AI**: One-click copying optimized for AI assistants

## 🚀 Quick Start

### Installation
1. Install from VS Code Marketplace: `M2JS - Markdown from JavaScript`
2. Install M2JS CLI: `npm install -g @paulohenriquevn/m2js`
3. Right-click any TypeScript/JavaScript file → **M2JS: Generate Documentation**

### Usage
```typescript
// Your TypeScript file
export class UserService {
  /**
   * Create new user with validation
   * Business rule: Email must be unique
   */
  async createUser(userData: CreateUserData): Promise<User> {
    // Implementation...
  }
}
```

**Generated Output:**
```markdown
# 📝 UserService.ts

## 🧠 Business Context
**Domain**: User Management (95% confidence)
**Pattern**: Service Layer Architecture

## 🔧 Functions

### createUser
/**
 * Create new user with validation
 * Business rule: Email must be unique
 */
```

## 📋 Commands

| Command | Description | Access |
|---------|-------------|--------|
| `M2JS: Generate Documentation` | Standard analysis | Right-click menu |
| `M2JS: Generate AI-Enhanced Analysis` | Full AI analysis with business context | Right-click menu |
| `M2JS: Create LLM Template` | Generate implementation template | Command Palette |
| `M2JS: Analyze Project Dependencies` | Project-wide dependency analysis | Command Palette |
| `M2JS: Open Template Wizard` | Interactive template creation | Command Palette |

## ⚙️ Configuration

Customize M2JS behavior in VS Code Settings:

### Analysis Options
- **Enable Business Context**: Automatic domain detection (default: `true`)
- **Enable Architecture Insights**: Pattern and layer analysis (default: `true`) 
- **Enable Semantic Analysis**: Entity relationships (default: `true`)
- **Include Private Members**: Analyze private class members (default: `false`)

### Output Settings
- **Output Directory**: Custom folder name (default: `m2js-output`)
- **Auto Open Results**: Automatically open generated files (default: `true`)
- **Token Optimization**: `minimal` | `balanced` | `detailed` (default: `balanced`)

### UI Preferences
- **Notifications**: Control progress, success, and warning messages
- **Webview Theme**: `auto` | `light` | `dark`
- **Auto Analysis**: Analyze files when opened (default: `false`)

## 🎯 Use Cases

### For AI Coding Assistants
- **Token Efficiency**: Reduce context size by 60-90%
- **Better Context**: Include business rules and architecture patterns
- **Template-Driven Development**: Generate implementation guides

### For Documentation
- **Clean Extraction**: Only exported functionality
- **Business Rules**: Capture domain knowledge from JSDoc
- **Architecture Insights**: Understand code organization

### For Code Reviews
- **Quick Understanding**: Get instant overview of complex files
- **Pattern Detection**: Identify design patterns and anti-patterns
- **Dependency Analysis**: Visualize project structure

## 📊 Example Output

### Standard Analysis (50% token reduction)
```markdown
# 📝 AuthService.ts
## 🔧 Functions
### login(email: string, password: string): Promise<AuthResult>
```

### AI-Enhanced Analysis (80% token reduction)
```markdown
# 📝 AuthService.ts

## 🧠 Business Context
**Domain**: Authentication (98% confidence)
**Framework**: Express.js + JWT
**Patterns**: Service Layer, Repository Pattern

## 🏗️ Architecture Insights
**Layer**: Service Layer
**Responsibility**: Authentication business logic
**Dependencies**: UserRepository, TokenService

## 🔗 Entity Relationships
- **User** → *authenticates via* → **AuthService**
- **AuthResult** → *contains* → **JWT Token**

## 🔧 Functions
### login
**Usage Pattern**: Authentication workflow
**Business Rule**: Rate limiting (5 attempts/hour)
```

## 🛡️ Security & Privacy

- **Local Processing**: All analysis runs locally on your machine
- **No Data Collection**: Zero telemetry or usage tracking
- **Open Source**: Full transparency and community-driven

## 📦 Requirements

- **VS Code**: Version 1.74.0 or higher
- **Node.js**: Version 16.0.0 or higher
- **M2JS CLI**: Automatically detected or specify custom path

## 🐛 Troubleshooting

### Extension Not Working?
1. Check M2JS CLI installation: `m2js --version`
2. Verify file extensions: `.ts`, `.tsx`, `.js`, `.jsx`
3. Check Output panel for error messages
4. Set custom CLI path in settings if needed

### Performance Issues?
1. Adjust token optimization to "minimal"
2. Disable auto-analysis for large projects
3. Use standard analysis instead of AI-enhanced

### Missing Features?
1. Update to latest version of M2JS CLI
2. Check VS Code extension version
3. Report issues on [GitHub](https://github.com/paulohenriquevn/m2js/issues)

## 🌟 Contributing

We welcome contributions! See our [Contributing Guide](https://github.com/paulohenriquevn/m2js/blob/main/CONTRIBUTING.md).

- **Report Issues**: [GitHub Issues](https://github.com/paulohenriquevn/m2js/issues)
- **Feature Requests**: [GitHub Discussions](https://github.com/paulohenriquevn/m2js/discussions)
- **Community**: Join our community for support and tips

## 📄 License

MIT License - see [LICENSE](https://github.com/paulohenriquevn/m2js/blob/main/LICENSE) for details.

---

**Made with ❤️ for developers working with AI coding assistants**

[⭐ Star on GitHub](https://github.com/paulohenriquevn/m2js) | [📦 M2JS CLI](https://www.npmjs.com/package/@paulohenriquevn/m2js) | [🐛 Report Issue](https://github.com/paulohenriquevn/m2js/issues)