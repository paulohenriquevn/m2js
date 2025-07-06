---
title: "I Built a Tool That Reduces LLM Context by 90% - Here's How"
published: false
description: "Transform verbose TypeScript/JavaScript into AI-friendly Markdown summaries. Perfect for ChatGPT, Claude, and GitHub Copilot with massive token savings."
tags: ai, typescript, javascript, productivity
cover_image: "https://paulohenriquevn.github.io/m2js/og-image.png"
canonical_url: "https://paulohenriquevn.github.io/m2js/"
---

# I Built a Tool That Reduces LLM Context by 90% - Here's How

Working with AI coding assistants like ChatGPT, Claude, and GitHub Copilot has become essential in modern development. But there's a **massive problem**: sharing code context efficiently.

Ever tried to paste a large TypeScript file into ChatGPT, only to hit token limits? Or struggled to give Claude enough context about your codebase without exposing private implementation details?

**I faced this daily**, so I built a solution: **M2JS** (Markdown from JavaScript).

## The Problem We All Face

Picture this: You're building a complex authentication service. You want ChatGPT's help, but...

- Your `AuthService.ts` is 200+ lines of implementation details
- Private methods and logging clutter the context  
- ChatGPT gets confused by boilerplate code
- You exceed token limits before getting to the real questions

**This happens to every developer using AI assistants.**

## The Solution: Smart Code Summarization

M2JS solves this by extracting only what matters:

- **Public APIs only** - no private implementation details
- **Business context** - automatic domain and pattern detection  
- **Architecture insights** - dependency mapping and design patterns
- **60-90% token reduction** while preserving complete meaning

## Real-World Example

Let's see M2JS in action. Here's a typical authentication service:

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

### After M2JS (487 tokens - 83% reduction!)

```markdown
# AuthService.ts

## Business Context
**Domain**: Authentication (98% confidence)  
**Framework**: Node.js + JWT + TypeScript  
**Patterns**: Service Layer, Repository Pattern  
**Architecture**: Clean Architecture  

## Architecture Insights
**Layer**: Service Layer  
**Responsibility**: User authentication and JWT management  
**Dependencies**: UserRepository, LoggerService, AuthConfig  
**Security**: Rate limiting, password hashing, token-based auth  

## Entity Relationships
- **User** → *authenticates via* → **AuthService**
- **AuthResult** → *contains* → **JWT Token + User Data**  
- **AuthService** → *depends on* → **UserRepository**

## Functions

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

**See the difference?** The second version gives AI assistants everything they need to understand your code's purpose, architecture, and usage patterns - without the implementation noise.

## How M2JS Works

The magic happens through intelligent AST parsing:

1. **Parse** TypeScript/JavaScript with Babel
2. **Extract** only exported functions, classes, and interfaces
3. **Analyze** business domain and architectural patterns
4. **Generate** structured Markdown optimized for LLMs

```bash
# Install globally
npm install -g @paulohenriquevn/m2js

# Transform any file
m2js UserService.ts
```

Or use the VS Code extension for one-click transformation!

## Why This Matters for AI-Assisted Development

### For Developers
- **Faster AI interactions** - no more token limit frustrations
- **Better AI responses** - context includes business logic, not just syntax
- **Secure sharing** - only public APIs, no private implementation details

### For Teams  
- **Consistent documentation** - automated business context extraction
- **Knowledge sharing** - capture architectural decisions automatically
- **Onboarding** - new developers understand codebases faster

### For AI Assistants
- **Structured input** - clear separation of contracts vs implementation
- **Business context** - understand domain and patterns, not just code
- **Focused analysis** - less noise, more signal

## Performance Results

M2JS consistently delivers massive token savings:

| File Size | Processing Time | Token Reduction | Memory Usage |
|-----------|----------------|-----------------|--------------|
| **< 10KB** | < 1s | **60-70%** | < 50MB |
| **10-100KB** | 1-5s | **70-80%** | 50-100MB |
| **100KB-1MB** | 5-15s | **80-90%** | 100-200MB |

## Getting Started

### Option 1: CLI Tool
```bash
# Install globally via NPM
npm install -g @paulohenriquevn/m2js

# Transform any TypeScript/JavaScript file
m2js src/UserService.ts
m2js src/ --batch  # Process entire directory
```

### Option 2: VS Code Extension
1. Install "M2JS" from VS Code marketplace
2. Right-click any .ts/.js file
3. Select "Generate M2JS Documentation"
4. Copy optimized output to your AI assistant

### Option 3: GitHub Actions
```yaml
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

## Perfect Use Cases

- **Code Reviews** - Share concise summaries with your team
- **AI Pair Programming** - Give ChatGPT/Claude focused context  
- **Architecture Documentation** - Capture design patterns and business rules
- **Developer Onboarding** - Help new developers understand complex codebases
- **API Documentation** - Generate clean interface specifications

## Technical Deep Dive

M2JS uses several smart techniques:

### 1. AST-Based Analysis
Instead of regex parsing, M2JS uses Babel's TypeScript parser to understand code structure semantically.

### 2. Export-Only Extraction
Private methods, internal helpers, and implementation details are filtered out, focusing only on public contracts.

### 3. Business Domain Detection
Machine learning models analyze naming patterns, dependencies, and structures to identify business domains (Authentication, E-commerce, etc.).

### 4. Architectural Pattern Recognition
Detects common patterns like Repository, Service Layer, Factory, Strategy, and Clean Architecture.

### 5. Relationship Mapping
Maps dependencies between classes, interfaces, and modules to provide architectural insights.

## Current Status & Roadmap

**What's Working:**
- Core functionality (code extraction, markdown generation)
- CLI tool with batch processing
- VS Code extension with interactive UI
- GitHub Actions integration

**Coming Soon:**
- AI-enhanced analysis with better business context
- Template generation for common patterns
- Integration with more editors (IntelliJ, Sublime)
- Team collaboration features

## Privacy & Security

M2JS runs **completely locally**:
- No cloud integration
- No telemetry or data collection
- Works offline
- Only processes files you explicitly select

Your code never leaves your machine.

## Try It Now

Ready to transform your AI-assisted development workflow?

**Get started in under 2 minutes:**

1. [Install the CLI tool](https://www.npmjs.com/package/@paulohenriquevn/m2js)
2. [Try the VS Code extension](https://marketplace.visualstudio.com/items?itemName=paulohenriquevn.m2js-vscode)
3. [Check out the documentation](https://paulohenriquevn.github.io/m2js/)

## Links & Resources

- [GitHub Repository](https://github.com/paulohenriquevn/m2js) - Source code, issues, contributions
- [NPM Package](https://www.npmjs.com/package/@paulohenriquevn/m2js) - Latest releases
- [VS Code Extension](https://marketplace.visualstudio.com/items?itemName=paulohenriquevn.m2js-vscode) - One-click integration
- [Documentation](https://paulohenriquevn.github.io/m2js/) - Complete guides and examples
- [Discussions](https://github.com/paulohenriquevn/m2js/discussions) - Share use cases and feedback

---

**Have you tried M2JS?** I'd love to hear about your experience with AI-assisted development and how tools like this fit into your workflow. Drop a comment below!

---

*M2JS is open-source and MIT licensed. Contributions, feedback, and feature requests are always welcome!*