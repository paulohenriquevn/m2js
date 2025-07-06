# AI Enhancement

Deep dive into M2JS AI-powered features that transform simple code extraction into intelligent analysis.

## Overview

M2JS goes beyond basic code extraction by understanding your code's business purpose, architectural patterns, and semantic relationships. This intelligence enables dramatically better AI coding assistant interactions.

## Business Context Analysis

### Domain Detection

M2JS automatically detects the business domain of your code:

```bash
m2js EcommerceService.ts --business-context
```

**Detected Domains:**
- **E-commerce** (Product, Order, Cart, Payment)
- **Blog** (Post, Author, Comment, Category)  
- **API** (Controller, Service, Repository)
- **Authentication** (User, Auth, Token, Session)

### Framework Recognition

Automatically identifies frameworks and libraries:
- **React** (Components, Hooks, Context)
- **Express** (Routes, Middleware, Controllers)
- **TypeScript** (Interfaces, Types, Generics)

## Architecture Analysis

### Pattern Detection

M2JS recognizes common design patterns:

```typescript
// Detected: Repository Pattern
export class UserRepository {
  async findById(id: string): Promise<User> {}
  async save(user: User): Promise<void> {}
}

// Detected: Service Layer Pattern  
export class UserService {
  constructor(private userRepo: UserRepository) {}
  async createUser(data: CreateUserData): Promise<User> {}
}
```

### Layer Architecture

Identifies architectural layers:
- **Controller Layer** (HTTP handling, validation)
- **Service Layer** (Business logic, orchestration)
- **Repository Layer** (Data access, persistence)
- **Utility Layer** (Helpers, validators, formatters)

## Semantic Analysis

### Entity Relationships

Maps business entity relationships:

```markdown
## 🔗 Entity Relationships
- **User** → *has many* → **Orders**
- **Order** → *contains* → **Products**  
- **User** → *authenticates via* → **AuthService**
```

### Workflow Detection

Identifies business workflows:

```markdown
## 🔄 Business Workflows
1. **User Registration**: validation → creation → email verification
2. **Order Processing**: cart → payment → fulfillment → notification
3. **Authentication**: login → token generation → session management
```

## Token Optimization

### Optimization Levels

Choose the right level for your use case:

```bash
# Minimal (90% reduction)
m2js file.ts --token-optimization minimal

# Balanced (70% reduction) - Recommended  
m2js file.ts --token-optimization balanced

# Detailed (50% reduction)
m2js file.ts --token-optimization detailed
```

### Smart Content Selection

M2JS intelligently chooses what to include:

**Always Included:**
- Public interfaces and types
- Exported function signatures  
- Business rules from JSDoc
- Error types and handling

**Conditionally Included:**
- Implementation details (only if architecturally significant)
- Private methods (only if they reveal business logic)
- Constants and configurations (only if business-relevant)

## Real-World Impact

### Before AI Enhancement

```markdown
# UserService.ts

export class UserService {
  async createUser(data: any): Promise<any> {
    // 50 lines of implementation
  }
}
```

**Issues:**
- No business context
- Unclear purpose
- Generic types
- Missing relationships

### After AI Enhancement

```markdown
# 📝 UserService.ts

## 🧠 Business Context
**Domain**: User Management (95% confidence)
**Patterns**: Service Layer, Validation Pattern
**Framework**: Express + TypeScript + JWT

## 🏗️ Architecture Insights  
**Layer**: Service Layer
**Responsibility**: User lifecycle management with validation
**Dependencies**: UserRepository, EmailService, AuthService
**Security**: Input validation, JWT token generation

## 🔗 Entity Relationships
- **User** → *managed by* → **UserService**
- **UserService** → *depends on* → **UserRepository**
- **UserService** → *uses* → **EmailService** for notifications

## 🔧 Functions

### createUser
```typescript
async createUser(data: CreateUserData): Promise<User>
```
**Business Rules:**
- Email must be unique across system
- Password must meet security requirements
- Email verification required before activation

**Usage Pattern**: User registration workflow
**Error Handling**: ValidationError, DuplicateEmailError
**Side Effects**: Sends verification email, logs audit event
```

**Benefits:**
- 83% token reduction
- Complete business context
- Clear architectural purpose
- Actionable insights for AI

## Configuration

Enable AI features in your config:

```json
{
  "aiEnhanced": true,
  "businessContext": true,
  "architectureInsights": true,
  "semanticAnalysis": true,
  "confidenceThreshold": 80
}
```

## Best Practices

### For AI Coding Assistants

1. **Use AI-enhanced mode** for complex business logic
2. **Include semantic analysis** for entity-heavy code
3. **Set confidence threshold** to 80+ for reliable insights
4. **Combine with examples** for better AI understanding

### For Documentation

1. **Enable architecture insights** for design documentation
2. **Use business context** for stakeholder communication
3. **Include workflows** for process documentation
4. **Generate regularly** to keep documentation current

### For Team Onboarding

1. **Full AI enhancement** for comprehensive understanding
2. **Include all relationships** to show system connections
3. **Document workflows** to explain business processes
4. **Provide examples** to demonstrate usage patterns