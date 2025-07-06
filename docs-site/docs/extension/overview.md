# VS Code Extension

🔧 **Native IDE integration with interactive webviews and one-click documentation generation**

The M2JS VS Code Extension brings the power of intelligent code analysis directly into your development environment, making it effortless to generate AI-optimized documentation.

## ✨ Features

### 🎯 Core Functionality
- **📝 Generate Documentation**: Right-click any TypeScript/JavaScript file to create optimized Markdown
- **🧠 AI-Enhanced Analysis**: Get business context, architecture insights, and semantic relationships
- **🎯 Template Wizard**: Interactive creation of LLM implementation guides
- **📊 Project Analysis**: Comprehensive dependency and architecture analysis

### 🎮 User Experience
- **Right-click Context Menus**: Generate docs directly from Explorer and Editor
- **Interactive Webviews**: Beautiful result display with VS Code theming
- **Auto-save to Workspace**: Organized output in configurable project directories
- **Command Palette Integration**: All features accessible via `Ctrl+Shift+P`

## 🚀 Installation

### From VS Code Marketplace

1. Open VS Code
2. Go to Extensions (`Ctrl+Shift+X`)
3. Search for **"M2JS"**
4. Click **"Install"**

### From Command Line

```bash
code --install-extension paulohenriquevn.m2js-vscode
```

### Manual Installation

```bash
# Download the .vsix file and install
code --install-extension m2js-vscode-0.1.0.vsix
```

## 🎮 How to Use

### Quick Start Workflow

1. **Right-click** any `.ts`, `.tsx`, `.js`, or `.jsx` file in the Explorer
2. Select **"🧠 Generate AI-Enhanced Analysis"** from the context menu
3. View the results in an **interactive webview panel**
4. **Copy to clipboard** for your AI assistant
5. **Auto-save** to your project workspace

### Available Commands

Access these via Command Palette (`Ctrl+Shift+P`):

#### 📝 `M2JS: Generate Documentation`
- Basic code documentation generation
- Fast processing with essential information
- Perfect for quick reference

#### 🧠 `M2JS: Generate AI-Enhanced Analysis`
- Full AI-powered analysis with business context
- Architecture insights and semantic relationships
- Optimized for AI coding assistants

#### 🎯 `M2JS: Create LLM Template`
- Generate implementation guides for AI assistants
- Domain-specific templates (e-commerce, blog, API)
- Interactive template wizard

#### 📊 `M2JS: Analyze Project Dependencies`
- Project-wide dependency analysis
- Architecture visualization with Mermaid diagrams
- Cross-file relationship mapping

#### 🪄 `M2JS: Template Wizard`
- Interactive template creation interface
- Step-by-step guidance for complex templates
- Business rule specification

#### 🎯 `M2JS: Show Available Domains`
- Browse available domain templates
- Preview template structures
- Quick domain selection

## ⚙️ Configuration

Access settings via `File > Preferences > Settings > Extensions > M2JS`:

### 🎯 Core Settings

```json
{
  "m2js.enableAutoAnalysis": false,
  "m2js.defaultOutputFormat": "ai-enhanced",
  "m2js.outputDirectory": "m2js-output",
  "m2js.autoOpenResults": true,
  "m2js.cliPath": ""
}
```

### 🧠 AI Enhancement Options

```json
{
  "m2js.enableBusinessContext": true,
  "m2js.enableArchitectureInsights": true,
  "m2js.enableSemanticAnalysis": true,
  "m2js.tokenOptimization": "balanced",
  "m2js.preferredDomain": "auto"
}
```

### 🎨 Display Preferences

```json
{
  "m2js.webview": {
    "theme": "auto",
    "fontSize": "14px",
    "showLineNumbers": true,
    "enableSyntaxHighlighting": true
  },
  "m2js.notifications": {
    "showProgress": true,
    "showSuccess": true,
    "showWarnings": true
  }
}
```

## 🎯 Use Cases

### 🤖 AI Coding Assistant Preparation

```typescript
// 1. Right-click your complex service file
// 2. Select "Generate AI-Enhanced Analysis"
// 3. Copy optimized context to ChatGPT/Claude
// 4. Get better AI responses with 80% fewer tokens
```

### 📚 Code Documentation

```typescript
// 1. Select multiple TypeScript files
// 2. Generate batch documentation
// 3. Auto-organized in your project structure
// 4. Always up-to-date with your code
```

### 👥 Team Onboarding

```typescript
// 1. Generate comprehensive project analysis
// 2. Include architecture insights and business context
// 3. Share clear understanding of codebase structure
// 4. Accelerate new developer productivity
```

### 🔍 Legacy Code Understanding

```typescript
// 1. Analyze complex legacy systems
// 2. Extract business rules and patterns
// 3. Understand dependencies and relationships
// 4. Plan refactoring strategies
```

## 🎨 Interactive Features

### Webview Panels

The extension displays results in beautiful, interactive webview panels featuring:

- **📋 Copy to Clipboard**: One-click copying optimized for AI assistants
- **💾 Save to File**: Auto-save to organized project directories
- **🎨 VS Code Theming**: Automatically matches your VS Code theme
- **🔍 Syntax Highlighting**: Beautiful code block rendering
- **📱 Responsive Design**: Adapts to panel size and layout

### Template Wizard

Interactive creation of LLM implementation guides:

1. **Domain Selection**: Choose from e-commerce, blog, API, or custom
2. **Entity Configuration**: Define business entities and relationships
3. **Workflow Definition**: Specify business processes and rules
4. **Template Generation**: Create comprehensive implementation guides

## 🛠️ Requirements

- **VS Code**: Version 1.74.0 or higher
- **Node.js**: 16.0.0+ (for M2JS CLI functionality)
- **M2JS CLI**: Automatically detected or manually configured

### Supported File Types
- TypeScript (`.ts`, `.tsx`)
- JavaScript (`.js`, `.jsx`)
- JSDoc comments and type annotations

## 🔧 Troubleshooting

### Common Issues

#### M2JS CLI Not Found
```bash
# Install M2JS CLI globally
npm install -g @paulohenriquevn/m2js

# Or set custom path in VS Code settings
"m2js.cliPath": "/path/to/m2js"
```

#### Permission Errors
- Ensure VS Code has write permissions to output directory
- Default output: `workspace-root/m2js-output/`

#### Analysis Fails
- Check file syntax is valid TypeScript/JavaScript
- Ensure file contains exported functions/classes
- Check VS Code Output panel for detailed error messages

### Getting Help

- **🐛 Report Issues**: [GitHub Issues](https://github.com/paulohenriquevn/m2js/issues)
- **💬 Ask Questions**: [GitHub Discussions](https://github.com/paulohenriquevn/m2js/discussions)
- **📖 Documentation**: [Full Documentation](https://paulohenriquevn.github.io/m2js/)

## 🎯 Tips & Best Practices

### ⚡ Performance Optimization
- Use **auto-analysis** sparingly for large projects
- Configure **output directory** to avoid clutter
- Set **token optimization** to "minimal" for large files

### 🧠 AI Enhancement
- Enable **business context** for better domain detection
- Use **architecture insights** for design pattern recognition
- Enable **semantic analysis** for complex business logic

### 👥 Team Collaboration
- Share **output directory** location with team
- Use consistent **preferred domain** settings
- Configure **notification preferences** for team workflows

---

## 🚀 What's Next?

Ready to explore more features?

- 📖 **[Extension Commands](/extension/commands)** - Detailed command reference
- ⚙️ **[Settings Guide](/extension/settings)** - Complete configuration options
- 🎯 **[Best Practices](/guide/configuration)** - Optimize your workflow
- 📊 **[Examples](/examples/basic)** - Real-world usage scenarios