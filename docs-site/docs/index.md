---
layout: home
title: M2JS | Transform Code into AI-Ready Docs

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
      link: /guide/quick-start
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

Transform verbose TypeScript code into clean, AI-ready documentation with massive token savings.

::: details Click to see the transformation

### 📋 Before M2JS (2,847 tokens)

The original code with all implementation details, comments, and boilerplate:

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

      // Fetch user from database
      const user = await this.userRepository.findByEmail(email);
      if (!user || !user.isActive) {
        this.loggerService.warn(`Login attempt for inactive user: ${email}`);
        throw new AuthenticationError('Invalid credentials');
      }

      // Validate password
      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
      if (!isPasswordValid) {
        await this.incrementRateLimitAttempts(email);
        this.loggerService.warn(`Invalid password for user: ${email}`);
        throw new AuthenticationError('Invalid credentials');
      }

      // Generate JWT token
      const payload = {
        userId: user.id,
        email: user.email,
        role: user.role,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + this.tokenExpiry
      };

      const token = jwt.sign(payload, this.jwtSecret);
      
      // Reset rate limiting on successful login
      await this.resetRateLimitAttempts(email);
      
      // Log successful authentication
      this.loggerService.info(`Successful login for user: ${email}`);
      
      // Return authentication result
      return {
        success: true,
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        },
        expiresAt: new Date(Date.now() + this.tokenExpiry * 1000)
      };
      
    } catch (error) {
      if (error instanceof AuthenticationError || error instanceof RateLimitError) {
        throw error;
      }
      
      this.loggerService.error('Unexpected error during authentication:', error);
      throw new AuthenticationError('Authentication failed');
    }
  }

  // ... 150+ more lines of helper methods
}
```

### ✨ After M2JS (487 tokens - 83% reduction!)

Clean, structured documentation focused on business value and API contracts:

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

:::

### 🎯 Why This Matters

**For AI Assistants**: The structured format helps ChatGPT, Claude, and GitHub Copilot understand your code's business intent, not just syntax.

**For Developers**: Focus on business logic and architecture patterns instead of implementation details.

**For Teams**: Share context-rich documentation that captures domain knowledge and design decisions.

## 🚀 Quick Start

Get up and running in under 2 minutes:

::: code-group

```bash [NPM Global]
# Install globally via NPM
npm install -g @paulohenriquevn/m2js

# Transform any TypeScript/JavaScript file
m2js src/UserService.ts
m2js src/ --batch  # Process entire directory

# Advanced: AI-enhanced analysis (temporarily disabled)
# m2js UserService.ts --ai-enhanced
```

```bash [Local Project]
# Install as dev dependency
npm install --save-dev @paulohenriquevn/m2js

# Add to package.json scripts
{
  "scripts": {
    "docs:ai": "m2js src/ --batch --output docs/ai/"
  }
}

# Generate documentation
npm run docs:ai
```

```bash [VS Code Extension]
# 1. Install "M2JS" from VS Code marketplace
# 2. Right-click any .ts/.js file
# 3. Select "Generate M2JS Documentation"
# 4. Copy optimized output to your AI assistant

# Or use Command Palette:
# Ctrl+Shift+P → "M2JS: Generate Documentation"
```

```yaml [GitHub Actions]
# .github/workflows/docs.yml
name: Generate AI Documentation
on: [push, pull_request]
jobs:
  generate-docs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install -g @paulohenriquevn/m2js
      - run: m2js src/ --batch --output docs/ai/
      - uses: actions/upload-artifact@v3
        with:
          name: ai-docs
          path: docs/ai/
```

:::

## 📊 Performance & Metrics

M2JS consistently delivers massive token savings across different project sizes:

| File Size | Processing Time | Token Reduction | Memory Usage |
|-----------|----------------|-----------------|--------------|
| **< 10KB** | ⚡ < 1s | **60-70%** | < 50MB |
| **10-100KB** | 🔥 1-5s | **70-80%** | 50-100MB |
| **100KB-1MB** | 🚀 5-15s | **80-90%** | 100-200MB |

## 🎯 Perfect Use Cases

::: tip ✅ Ideal For
- **Code Reviews** - Share concise summaries with your team
- **AI Pair Programming** - Give ChatGPT/Claude focused context  
- **Architecture Documentation** - Capture design patterns and business rules
- **Developer Onboarding** - Help new developers understand complex codebases
- **API Documentation** - Generate clean interface specifications
:::

::: warning ⚠️ Current Status
- **Core functionality** fully operational (code extraction, markdown generation)
- **AI-enhanced analysis** temporarily disabled (being rebuilt with better types)
- **Template generation** temporarily unavailable (will return in v2.0)
:::

## 🌟 Resources & Support

### 📚 Documentation
- [**Getting Started Guide**](/guide/quick-start) - Complete setup and usage
- [**CLI Reference**](/reference/cli) - All commands and options
- [**Best Practices**](/guide/best-practices) - Real-world usage patterns

### 🛠️ Tools & Extensions
- [**VS Code Extension**](/extension/overview) - One-click integration
- [**GitHub Pages Deployment**](/deployment/github-pages) - CI/CD integration
- [**NPM Package**](https://www.npmjs.com/package/@paulohenriquevn/m2js) - Latest releases

### 🤝 Community
- [**GitHub Repository**](https://github.com/paulohenriquevn/m2js) - Issues, features, source code
- [**Discussions**](https://github.com/paulohenriquevn/m2js/discussions) - Share use cases and feedback
- [**Changelog**](https://github.com/paulohenriquevn/m2js/blob/main/CHANGELOG.md) - Latest updates

---

### Ready to transform your development workflow?

**Get started in under 2 minutes:**

[Get Started →](/guide/quick-start){ .get-started-btn }
[VS Code Extension →](/extension/overview){ .extension-btn }

<style>
.get-started-btn, .extension-btn {
  display: inline-block;
  margin: 0.5rem 0.5rem 0.5rem 0;
  padding: 0.8rem 1.5rem;
  border-radius: 6px;
  font-weight: 600;
  text-decoration: none !important;
  transition: all 0.3s ease;
}

.get-started-btn {
  background: var(--vp-c-brand);
  color: var(--vp-c-white);
}

.extension-btn {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  border: 1px solid var(--vp-c-border);
}

.get-started-btn:hover {
  background: var(--vp-c-brand-darker);
  transform: translateY(-1px);
}

.extension-btn:hover {
  background: var(--vp-c-gray-light-2);
  transform: translateY(-1px);
}
</style>
