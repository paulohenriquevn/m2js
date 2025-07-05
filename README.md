# 🚀 M2JS - Markdown from JavaScript

[![npm version](https://badge.fury.io/js/m2js.svg)](https://badge.fury.io/js/m2js)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)](https://nodejs.org/)

Transform TypeScript/JavaScript code into LLM-friendly Markdown summaries with **60%+ token reduction**. Perfect for ChatGPT, Claude, and other AI coding assistants.

## ✨ Features

- 🎯 **Smart Extraction**: Only exported functions, classes, and methods
- 📊 **60%+ Token Reduction**: Optimized for LLM context windows
- 🏗️ **Hierarchical Structure**: Clean, navigable markdown format
- 📁 **Batch Processing**: Process entire directories at once
- 🔍 **Path Context**: Full file paths and export metadata
- 📝 **JSDoc Preservation**: Maintains important documentation
- ⚡ **Fast & Simple**: One command, instant results
- 🌐 **Cross-Platform**: Works on Windows, macOS, and Linux

## 🚀 Quick Start

### Installation

```bash
# Install globally
npm install -g m2js

# Or use with npx (no installation needed)
npx m2js your-file.ts
```

### Basic Usage

```bash
# Process a single file
m2js src/auth.ts
# Creates: src/auth.md

# Process entire directory
m2js ./src
# Creates markdown files next to each TypeScript/JavaScript file

# Custom output location (single files only)
m2js src/utils.ts -o docs/utils-api.md

# Skip JSDoc comments
m2js src/service.ts --no-comments
```

## 📖 Usage Examples

### Single File Processing

```bash
m2js src/user-service.ts
```

**Input (`user-service.ts`):**
```typescript
/**
 * User management service
 */
export class UserService {
  /**
   * Get user by ID
   */
  async getUser(id: string): Promise<User> {
    // Implementation details...
    return await this.repository.findById(id);
  }

  private validateUser(user: User): boolean {
    // Private method - won't be extracted
    return user.email && user.name;
  }
}

export function createUser(data: CreateUserData): Promise<User> {
  // Function implementation...
}
```

**Output (`user-service.md`):**
```markdown
# 📁 ./src/user-service.ts

## 📦 Exports
- **Functions**: 1 exported function
- **Classes**: 1 exported class

## 🔧 Functions

### createUser
**Parameters:**
- data: CreateUserData

**Returns:** Promise<User>

```typescript
export function createUser(data: CreateUserData): Promise<User>
```

## 🏗️ Classes

### UserService
/**
 * User management service
 */

**Methods:**
- getUser

```typescript
export class UserService {
  getUser(id: string): Promise<User>
}
```

#### getUser
/**
 * Get user by ID
 */

**Parameters:**
- id: string

**Returns:** Promise<User>

```typescript
getUser(id: string): Promise<User>
```
```

### Directory Processing

```bash
m2js ./src
```

**Output:**
```
📁 Scanning directory src...
📊 Processing files (1/5): auth.ts
✅ Generated auth.md
📊 Processing files (2/5): user-service.ts
✅ Generated user-service.md
📊 Processing files (3/5): utils.ts
✅ Generated utils.md
📊 Processing files (4/5): types.ts
✅ Generated types.md
📊 Processing files (5/5): api.ts
✅ Generated api.md
📋 Batch processing complete:
📊 Total files: 5
✅ Successful: 5
🎯 Generated 5 markdown files in the same directory as source files
```

## 🎛️ CLI Options

| Option | Description | Example |
|--------|-------------|---------|
| `<path>` | File or directory to process | `m2js src/auth.ts` |
| `-o, --output <file>` | Custom output file (single files only) | `m2js auth.ts -o docs/auth.md` |
| `--no-comments` | Skip JSDoc comment extraction | `m2js auth.ts --no-comments` |
| `--help` | Show help information | `m2js --help` |
| `--version` | Show version number | `m2js --version` |

## 🎯 Why M2JS?

### Perfect for AI Coding Assistants

- **Token Efficiency**: 60%+ reduction in token usage
- **Clean Context**: Only relevant exported code
- **Structured Format**: Easy for LLMs to understand
- **Path Context**: Clear file organization

### Before M2JS
```
❌ Copy entire 500-line file to ChatGPT
❌ Include private functions and implementation details
❌ Exceed context window with unnecessary code
❌ Manual cleanup and formatting
```

### After M2JS
```
✅ Generate clean 200-line markdown summary
✅ Only exported functions and classes
✅ Hierarchical structure with parameters
✅ One command, instant results
```

## 🔧 Supported File Types

- `.ts` - TypeScript files
- `.tsx` - TypeScript React files  
- `.js` - JavaScript files
- `.jsx` - JavaScript React files

## 📊 Performance

- **Speed**: < 2 seconds for files under 1MB
- **Memory**: Efficient sequential processing
- **Scalability**: Handles large codebases with batch processing
- **Reliability**: Individual file failures don't stop batch processing

## 🛠️ Development

### Prerequisites

- Node.js >= 16.0.0
- TypeScript >= 5.0.0

### Local Development

```bash
# Clone repository
git clone https://github.com/m2js/m2js.git
cd m2js

# Install dependencies
npm install

# Build project
npm run build

# Run tests
npm test

# Link for local testing
npm link
m2js --help
```

### Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage

# Type checking
npm run type-check
```

## 📋 Roadmap

- [x] Core TypeScript/JavaScript parsing
- [x] Hierarchical markdown generation
- [x] Batch directory processing
- [x] Enhanced path and export metadata
- [ ] Test file filtering and reporting
- [ ] Advanced CLI options and error handling
- [ ] Plugin system for custom extractors
- [ ] Integration with popular IDEs

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Quick Contribution Steps

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and add tests
4. Ensure all tests pass: `npm test`
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to your branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 💬 Support

- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/m2js/m2js/issues)
- 💡 **Feature Requests**: [GitHub Discussions](https://github.com/m2js/m2js/discussions)
- 📧 **Email**: support@m2js.dev

## 🌟 Show Your Support

If M2JS helps you work more efficiently with AI coding assistants, please consider:

- ⭐ Starring this repository
- 🐦 Sharing on social media
- 📝 Writing a blog post about your experience
- 🤝 Contributing to the project

---

**Made with ❤️ for the developer community**

*Reduce tokens, increase productivity, enhance AI interactions.*