---
layout: home

hero:
  name: "M2JS"
  text: "Transform Code into AI-Ready Docs"
  tagline: "🐻 CLI tool that converts TypeScript/JavaScript into LLM-friendly Markdown with 60-90% token reduction"
  image:
    src: /logo-large.svg
    alt: M2JS Logo
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    - theme: alt
      text: VS Code Extension
      link: /extension/overview
    - theme: alt
      text: View on GitHub
      link: https://github.com/paulohenriquevn/m2js

features:
  - icon: 🚀
    title: 60-90% Token Reduction
    details: Dramatically reduce LLM context size while preserving complete meaning and business logic
  
  - icon: 🧠
    title: AI-Enhanced Analysis
    details: Automatic business domain detection, architecture insights, and semantic relationship mapping
  
  - icon: ⚡
    title: Zero Configuration
    details: Works out-of-the-box with smart defaults. Just install and run - no setup required
  
  - icon: 🔒
    title: Privacy First
    details: All processing runs locally. Zero cloud integration, no telemetry, works offline
  
  - icon: 🎯
    title: LLM-Optimized
    details: Perfect for ChatGPT, Claude, and GitHub Copilot. Structured for maximum AI understanding
  
  - icon: 🔧
    title: VS Code Integration
    details: Native IDE extension with interactive webviews and one-click documentation generation
---

## 🎮 See It In Action

### Before M2JS (2,847 tokens)

```typescript
export class AuthService {
  private readonly jwtSecret: string;
  private readonly tokenExpiry: number;
  private readonly userRepository: UserRepository;
  private readonly loggerService: LoggerService;
  
  constructor(
    userRepo: UserRepository,
    logger: LoggerService,
    config: AuthConfig
  ) {
    this.userRepository = userRepo;
    this.loggerService = logger;
    this.jwtSecret = config.jwtSecret;
    this.tokenExpiry = config.tokenExpiry || 3600;
  }

  /**
   * Authenticate user with email and password
   * Business rule: Rate limiting - max 5 attempts per hour
   * Security: Passwords must be validated with bcrypt
   */
  async login(email: string, password: string): Promise<AuthResult> {
    try {
      // Validate input parameters
      if (!email || !password) {
        this.loggerService.warn('Login attempt with missing credentials');
        throw new AuthenticationError('Email and password are required');
      }

      // Check rate limiting
      const attempts = await this.getRateLimitAttempts(email);
      if (attempts >= 5) {
        this.loggerService.warn(`Rate limit exceeded for email: ${email}`);
        throw new RateLimitError('Too many login attempts. Try again later.');
      }

      // ... 200+ more lines of implementation details
    } catch (error) {
      // Error handling logic...
    }
  }
}
```

### After M2JS (487 tokens - **83% reduction!**)

```markdown
# 📝 AuthService.ts

## 🧠 Business Context
**Domain**: Authentication (98% confidence)
**Framework**: Node.js + JWT + TypeScript
**Patterns**: Service Layer, Repository Pattern
**Architecture**: Clean Architecture

## 🏗️ Architecture Insights
**Layer**: Service Layer
**Responsibility**: User authentication and JWT management
**Dependencies**: UserRepository, LoggerService, AuthConfig
**Security**: Rate limiting, password hashing, token-based auth

## 🔗 Entity Relationships
- **User** → *authenticates via* → **AuthService**
- **AuthResult** → *contains* → **JWT Token + User Data**
- **AuthService** → *depends on* → **UserRepository**

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

**Example**:
```typescript
const result = await authService.login('user@example.com', 'password123');
if (result.success) {
  console.log('Logged in:', result.user.email);
}
```
```

## 🚀 Quick Start

::: code-group

```bash [NPM]
# Install globally
npm install -g @paulohenriquevn/m2js

# Transform your code
m2js UserService.ts --ai-enhanced
```

```bash [VS Code]
# 1. Install from marketplace
# 2. Right-click any .ts/.js file
# 3. Select "Generate AI-Enhanced Analysis"
# 4. Copy result to your AI assistant
```

```bash [GitHub]
# Add to your workflow
- name: Generate M2JS Documentation
  run: |
    npm install -g @paulohenriquevn/m2js
    m2js src/ --ai-enhanced --batch --output docs/ai/
```

:::

## 📊 Performance

| File Size | Processing Time | Token Reduction | Memory Usage |
|-----------|----------------|-----------------|--------------|
| < 10KB | < 1s | 60-70% | < 50MB |
| 10-100KB | 1-5s | 70-80% | 50-100MB |
| 100KB-1MB | 5-15s | 80-90% | 100-200MB |

---

<div style="text-align: center; margin: 2rem 0;">

### Ready to transform your development workflow?

[Get Started →](/guide/getting-started){ .vp-button .vp-button-brand .vp-button-medium }
[Try VS Code Extension →](/extension/overview){ .vp-button .vp-button-alt .vp-button-medium }

</div>
