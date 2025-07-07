# Getting Started

Get up and running with M2JS in under 2 minutes! Choose your path:

- **AI Documentation** - Transform code into LLM-friendly docs
- **Dead Code Detection** - Find and safely remove unused code 

## Installation

::: code-group

```bash [NPM (Recommended)]
# Install globally
npm install -g @paulohenriquevn/m2js

# Verify installation
m2js --version
```

```bash [Yarn]
# Install globally
yarn global add @paulohenriquevn/m2js

# Verify installation
m2js --version
```

```bash [VS Code Extension]
# Install from marketplace
code --install-extension paulohenriquevn.m2js-vscode

# Or search "M2JS" in VS Code Extensions
```

:::

## Choose Your Path

### AI Documentation

```bash
# Analyze a single TypeScript file
m2js UserService.ts

# Output will be saved as UserService.md
```

### Dead Code Detection

```bash
# Analyze your project for unused code
m2js src/ --detect-unused

# Generate configuration for better performance
m2js --init-config

# Get detailed help
m2js --help-dead-code
```

### VS Code Extension

1. **Right-click** any `.ts`, `.tsx`, `.js`, or `.jsx` file
2. Select **"Generate M2JS Documentation"** or **"Analyze Dead Code"**
3. View results in interactive webview
4. **Copy to clipboard** for your AI assistant

## Example Output

Let's see M2JS in action with a real TypeScript file:

### Input File (`UserService.ts`)

```typescript
export interface User {
id: number;
email: string;
name: string;
isActive: boolean;
}

/**
* Service for managing user operations
* Handles CRUD operations with validation
*/
export class UserService {
private users: User[] = [];

/**
* Create a new user with validation
* @param userData - User data to create
* @returns Promise resolving to created user
*/
async createUser(userData: Omit<User, 'id'>): Promise<User> {
const user: User = {
id: Date.now(),
...userData
};

this.users.push(user);
return user;
}

/**
* Find user by email address
* @param email - User email to search for
* @returns Promise resolving to user or null
*/
async findByEmail(email: string): Promise<User | null> {
return this.users.find(user => user.email === email) || null;
}
}
```

### M2JS Output (`UserService.md`)

```markdown
# UserService.ts

## Business Context
**Domain**: User Management (95% confidence)
**Framework**: TypeScript
**Patterns**: Service Layer, Repository Pattern
**Architecture**: Clean Architecture

## Architecture Insights
**Layer**: Service Layer
**Responsibility**: User CRUD operations with validation
**Dependencies**: None (self-contained)
**Data Flow**: In-memory storage with array-based operations

## Types

### User
```typescript
interface User {
id: number;
email: string;
name: string;
isActive: boolean;
}
```

## Functions

### createUser
```typescript
async createUser(userData: Omit<User, 'id'>): Promise<User>
```
**Purpose**: Create a new user with validation
**Business Rules**: Auto-generates ID using timestamp
**Usage Pattern**: User registration workflow

### findByEmail
```typescript
async findByEmail(email: string): Promise<User | null>
```
**Purpose**: Find user by email address
**Usage Pattern**: User lookup and authentication
**Returns**: User object or null if not found
```

**Result**: Original file was 847 tokens, M2JS output is 267 tokens (**68% reduction**)

## Common Use Cases

### For AI Coding Assistants

```bash
# Generate optimized context for ChatGPT/Claude
m2js src/services/ --ai-enhanced --batch

# Copy results to AI assistant for better responses
```

### For Code Maintenance

```bash
# Quick cleanup before refactoring
m2js src/ --detect-unused

# Safe removal workflow
m2js src/ --detect-unused | grep "SAFE TO REMOVE" -A2

# CI/CD integration
m2js src/ --detect-unused --format json > dead-code-report.json
```

### For Documentation

```bash
# Generate project documentation
m2js src/ --batch --output docs/api/

# Include dependency graphs
m2js src/ --graph --mermaid
```

### For Team Onboarding

```bash
# Create comprehensive analysis for new developers
m2js src/ --ai-enhanced --architecture-insights --semantic-analysis

# Understand code health
m2js src/ --detect-unused
```

## Configuration

Create a `.m2jsrc` file in your project root:

```bash
# Generate configuration file
m2js --init-config
```

**Example .m2jsrc:**
```json
{
  "deadCode": {
    "enableCache": true,
    "maxCacheSize": 1000,
    "chunkSize": 50,
    "showProgress": true,
    "format": "table"
  },
  "files": {
    "ignorePatterns": [
      "**/node_modules/**",
      "**/dist/**",
      "**/*.test.*",
      "**/*.spec.*"
    ],
    "maxFileSize": 10
  },
  "aiEnhanced": true,
  "businessContext": true,
  "outputDirectory": "docs/api"
}
```

## Next Steps

::: tip AI Documentation
- **[CLI Reference](/reference/cli)** - Learn all available commands and options
- **[VS Code Extension](/extension/overview)** - Explore IDE integration features 
- **[AI Enhancement](/guide/ai-enhancement)** - Deep dive into AI-powered features
- **[Examples](/examples/basic)** - See real-world usage scenarios
:::

::: tip Dead Code Detection
- **[Dead Code Detection Guide](/guide/dead-code-detection)** - Complete guide to smart cleanup
- **[CLI Reference](/reference/cli)** - All dead code detection commands
- **[Best Practices](/guide/best-practices)** - Team workflows and patterns
:::

## Quick Examples

### AI Documentation Workflow
```bash
# 1. Transform code for AI
m2js UserService.ts

# 2. Copy output to ChatGPT/Claude
# 3. Get better AI responses with context
```

### Dead Code Cleanup Workflow
```bash
# 1. Analyze project
m2js src/ --detect-unused

# 2. Remove safe items immediately
# Follow "SAFE TO REMOVE" suggestions

# 3. Review medium-risk items
# Check "REVIEW BEFORE REMOVING" warnings

# 4. Keep high-risk items
# Document "HIGH RISK" decisions
```

## Need Help?

- **Issues**: [GitHub Issues](https://github.com/paulohenriquevn/m2js/issues)
- **Discussions**: [GitHub Discussions](https://github.com/paulohenriquevn/m2js/discussions) 
- **Documentation**: You're reading it! 
- **Star the project**: [GitHub Repository](https://github.com/paulohenriquevn/m2js)
- **Dead Code Help**: `m2js --help-dead-code`