# 🔌 VS Code Extension

M2JS VS Code Extension brings AI-ready code documentation directly to your editor workflow.

## Installation

### From VS Code Marketplace

```bash
# Install from VS Code marketplace
ext install paulohenriquevn.m2js

# Or install via command line
code --install-extension paulohenriquevn.m2js
```

### Manual Installation

```bash
# Clone and build extension
git clone https://github.com/paulohenriquevn/m2js-vscode.git
cd m2js-vscode
npm install
npm run build

# Install locally
code --install-extension m2js-vscode.vsix
```

## Features

### 🚀 Quick Actions

**1. Right-click Context Menu**
```
Right-click on any .ts/.js file
→ "Generate M2JS Documentation"
→ Creates .md file alongside source
```

**2. Command Palette**
```
Ctrl+Shift+P (Cmd+Shift+P on Mac)
→ "M2JS: Generate Documentation"
→ "M2JS: Generate for Workspace"
→ "M2JS: Show Dependency Graph"
```

**3. Editor Integration**
```
Open any TypeScript/JavaScript file
→ Click M2JS icon in editor toolbar
→ Instant documentation generation
```

### 📊 Dependency Visualization

**Mermaid Diagrams in VS Code**
```typescript
// Generates interactive dependency graphs
m2js src/ --graph --mermaid

// Opens in VS Code preview pane
// Clickable nodes navigate to files
```

### ⚡ Batch Processing

**Workspace Integration**
```
Explorer → Right-click folder
→ "Generate M2JS for Folder"
→ Processes all TypeScript/JavaScript files
→ Creates organized documentation structure
```

## Configuration

### Extension Settings

Access via `File → Preferences → Settings → Extensions → M2JS`:

```json
{
  "m2js.outputDirectory": "docs/ai",
  "m2js.autoGenerate": true,
  "m2js.includeComments": true,
  "m2js.showProgressNotifications": true,
  "m2js.excludePatterns": [
    "node_modules/**",
    "dist/**",
    "build/**",
    "*.test.ts",
    "*.spec.ts"
  ]
}
```

### Setting Descriptions

| Setting | Default | Description |
|---------|---------|-------------|
| `outputDirectory` | `docs/ai` | Where to save generated documentation |
| `autoGenerate` | `true` | Generate docs automatically on file save |
| `includeComments` | `true` | Extract JSDoc comments |
| `showProgressNotifications` | `true` | Show progress in VS Code notifications |
| `excludePatterns` | `["node_modules/**", "*.test.ts"]` | Files to ignore |

## Usage Examples

### Single File Processing

```typescript
// 1. Open UserService.ts
// 2. Right-click in editor
// 3. Select "Generate M2JS Documentation"
// 4. UserService.md created automatically

export class UserService {
  /**
   * Authenticates user credentials
   * @param email - User email address
   * @param password - User password
   * @returns Authentication result
   */
  async authenticate(email: string, password: string): Promise<AuthResult> {
    // Implementation
  }
}
```

**Generated Output:**
```markdown
# 📝 UserService.ts

## 🏗️ Classes

### UserService

#### authenticate
/**
 * Authenticates user credentials
 * @param email - User email address
 * @param password - User password
 * @returns Authentication result
 */
```typescript
async authenticate(email: string, password: string): Promise<AuthResult>
```

### Project Documentation

```bash
# Via Command Palette
Ctrl+Shift+P → "M2JS: Generate for Workspace"

# Creates structure:
docs/ai/
├── UserService.md
├── PaymentService.md
├── OrderService.md
└── dependency-graph.md
```

### Dependency Analysis

```typescript
// 1. Open project root
// 2. Command Palette → "M2JS: Show Dependency Graph"
// 3. Interactive Mermaid diagram opens
// 4. Click nodes to navigate to files

// Example output:
graph TD
    A[UserService] --> B[DatabaseService]
    A --> C[ValidationService]
    D[PaymentService] --> B
    D --> E[ExternalApiService]
```

## Integration Workflows

### Code Review Process

```bash
# 1. Checkout feature branch
# 2. VS Code automatically detects changed files
# 3. Extension generates docs for modified files
# 4. Include generated docs in PR for AI review
```

### AI Assistant Integration

```markdown
# Generated documentation is optimized for:
- ChatGPT code analysis
- Claude code review
- GitHub Copilot context
- AI-powered debugging
```

### Team Documentation

```bash
# 1. Team member makes changes
# 2. Extension auto-generates docs on save
# 3. Documentation stays synchronized
# 4. AI assistants have current context
```

## Advanced Features

### Custom Templates

```json
// .vscode/settings.json
{
  "m2js.templates": {
    "functions": "## 🔧 Functions\n\n${functions}",
    "classes": "## 🏗️ Classes\n\n${classes}",
    "interfaces": "## 📋 Interfaces\n\n${interfaces}"
  }
}
```

### File Watching

```json
{
  "m2js.watchPatterns": [
    "src/**/*.ts",
    "src/**/*.js",
    "lib/**/*.ts"
  ],
  "m2js.autoGenerateOnSave": true
}
```

### Output Customization

```json
{
  "m2js.outputFormat": {
    "includePrivateMethods": false,
    "includeTypeDefinitions": true,
    "includeImports": true,
    "collapsibleSections": true
  }
}
```

## Keyboard Shortcuts

### Default Shortcuts

| Command | Windows/Linux | macOS |
|---------|---------------|--------|
| Generate for current file | `Ctrl+Alt+M` | `Cmd+Alt+M` |
| Generate for workspace | `Ctrl+Shift+Alt+M` | `Cmd+Shift+Alt+M` |
| Show dependency graph | `Ctrl+Alt+D` | `Cmd+Alt+D` |

### Custom Shortcuts

```json
// keybindings.json
[
  {
    "key": "ctrl+alt+g",
    "command": "m2js.generateCurrent",
    "when": "editorTextFocus"
  },
  {
    "key": "ctrl+alt+shift+g",
    "command": "m2js.generateWorkspace"
  }
]
```

## Status Bar Integration

The extension adds a status bar item showing:

```
📝 M2JS: Ready    # Extension ready
📝 M2JS: Busy     # Processing files
📝 M2JS: 12 files # Files processed
📝 M2JS: Error    # Processing error
```

Click the status bar item for quick actions menu.

## Performance Considerations

### Large Projects

```json
{
  "m2js.performance": {
    "maxFilesPerBatch": 50,
    "processingTimeout": 30000,
    "enableProgressReporting": true,
    "skipLargeFiles": true,
    "largeFileThreshold": "1MB"
  }
}
```

### Memory Usage

```typescript
// Extension monitors memory usage
// Automatically switches to streaming mode for large files
// Progress notifications for long operations
```

## Error Handling

### Common Issues

**1. TypeScript Compilation Errors**
```
Problem: Extension can't process files with syntax errors
Solution: Fix TypeScript errors first, then generate docs
```

**2. Permission Issues**
```
Problem: Can't write to output directory
Solution: Check folder permissions or change output directory
```

**3. Large File Processing**
```
Problem: Extension times out on very large files
Solution: Use selective processing or increase timeout
```

### Debug Mode

```json
{
  "m2js.debug": {
    "enabled": true,
    "logLevel": "verbose",
    "outputChannel": "M2JS Debug"
  }
}
```

## Development & Contributing

### Extension Development

```bash
# Clone extension repository
git clone https://github.com/paulohenriquevn/m2js-vscode.git
cd m2js-vscode

# Install dependencies
npm install

# Start development
npm run dev

# Launch extension host
F5 (or Run → Start Debugging)
```

### Extension Architecture

```typescript
// src/extension.ts - Main extension entry point
export function activate(context: vscode.ExtensionContext) {
  // Register commands
  const disposable = vscode.commands.registerCommand(
    'm2js.generateCurrent',
    () => generateForCurrentFile()
  );
  
  context.subscriptions.push(disposable);
}

// src/commands/
├── generateCurrent.ts    # Single file processing
├── generateWorkspace.ts  # Batch processing
├── showDependencyGraph.ts # Dependency analysis
└── configureSettings.ts  # Settings management
```

### Testing

```bash
# Run extension tests
npm test

# Integration tests
npm run test:integration

# Manual testing
npm run test:manual
```

## Roadmap

### Planned Features

**v1.1.0**
- [ ] Real-time documentation preview
- [ ] Integrated dependency graph viewer
- [ ] AI-powered code suggestions
- [ ] Custom output formats

**v1.2.0**
- [ ] Team collaboration features
- [ ] Documentation versioning
- [ ] Performance optimizations
- [ ] Plugin system

**v2.0.0**
- [ ] AI-enhanced analysis (when core features are re-enabled)
- [ ] Business context detection
- [ ] Architecture insights
- [ ] Usage pattern analysis

### Community Requests

Vote for features on [GitHub Issues](https://github.com/paulohenriquevn/m2js-vscode/issues) with 👍 reactions.

## Support

### Getting Help

- **GitHub Issues**: Bug reports and feature requests
- **VS Code Marketplace**: Extension reviews and ratings
- **Documentation**: Comprehensive guides and examples
- **Community**: GitHub Discussions for questions

### Common Questions

**Q: Does the extension work with JavaScript files?**
A: Yes, supports .js, .jsx, .ts, .tsx files.

**Q: Can I customize the output format?**
A: Yes, via extension settings and custom templates.

**Q: Does it work with monorepos?**
A: Yes, processes each workspace folder independently.

**Q: Can I exclude certain files?**
A: Yes, use the `excludePatterns` setting.

This VS Code extension makes M2JS documentation generation seamless and integrated into your development workflow.