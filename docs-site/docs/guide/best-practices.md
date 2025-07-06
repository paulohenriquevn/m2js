# 🎯 Best Practices

Maximize M2JS effectiveness and get the most value from your AI-ready documentation.

## Code Organization

### Export Strategy

**✅ Do:**
```typescript
// Clear, descriptive exports
export class UserAuthenticationService {
  async authenticateUser(credentials: LoginCredentials): Promise<AuthResult> {
    // Implementation
  }
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export type AuthResult = {
  success: boolean;
  user?: User;
  token?: string;
};
```

**❌ Avoid:**
```typescript
// Unclear internal functions
function helper() { } // Won't be extracted
const utils = { }; // Internal utility

// Non-descriptive exports
export const a = () => { }; // Unclear naming
export default function() { }; // Anonymous default
```

### JSDoc Best Practices

**✅ Comprehensive Documentation:**
```typescript
/**
 * Processes user payment with fraud detection and validation
 * 
 * @param payment - Payment details including amount and method
 * @param user - User making the payment for fraud detection
 * @returns Promise resolving to payment result with transaction ID
 * 
 * @throws {PaymentValidationError} When payment data is invalid
 * @throws {FraudDetectionError} When suspicious activity detected
 * @throws {InsufficientFundsError} When user has insufficient balance
 * 
 * @example
 * ```typescript
 * const result = await processPayment(
 *   { amount: 99.99, method: 'credit_card' },
 *   { id: '123', email: 'user@example.com' }
 * );
 * console.log(result.transactionId);
 * ```
 */
export async function processPayment(
  payment: PaymentRequest,
  user: User
): Promise<PaymentResult> {
  // Implementation
}
```

**❌ Minimal Documentation:**
```typescript
/**
 * Process payment
 */
export function processPayment(data: any): any {
  // Implementation
}
```

## File Organization

### Modular Structure

**✅ Organized by Feature:**
```
src/
├── auth/
│   ├── AuthService.ts       # Main service
│   ├── AuthTypes.ts         # Types and interfaces
│   └── AuthValidation.ts    # Validation utilities
├── payment/
│   ├── PaymentProcessor.ts
│   ├── PaymentTypes.ts
│   └── FraudDetection.ts
└── user/
    ├── UserService.ts
    └── UserTypes.ts
```

**❌ Monolithic Files:**
```
src/
├── everything.ts     # 2000+ lines
├── utils.ts          # Mixed utilities
└── types.ts          # All types together
```

### Batch Processing Strategy

```bash
# Process by logical groupings
m2js src/auth/ --batch --output docs/auth/
m2js src/payment/ --batch --output docs/payment/
m2js src/user/ --batch --output docs/user/

# Avoid processing everything together
# m2js src/ --batch  # Less organized output
```

## AI Integration Workflows

### Code Review Preparation

**1. Generate Context for Complex Changes:**
```bash
# Get files changed in current branch
git diff --name-only main...HEAD | grep -E '\.(ts|js)$' > changed_files.txt

# Process only changed files
cat changed_files.txt | xargs m2js

# Create review summary
echo "## Changed Components" > review.md
cat *.md >> review.md
```

**2. Focus on Public APIs:**
```bash
# Process service layers (high-level architecture)
m2js src/services/ --batch --output docs/api/

# Process specific interfaces
m2js src/types/PublicAPI.ts --output docs/public-api.md
```

### AI Pair Programming

**1. Provide Focused Context:**
```typescript
// When asking AI to extend this class:
m2js src/UserService.ts --no-comments

// Result shows clean interface:
// class UserService {
//   createUser(data: CreateUserData): Promise<User>
//   updateUser(id: string, updates: Partial<User>): Promise<User>
//   deleteUser(id: string): Promise<void>
// }
```

**2. Architecture Discussions:**
```bash
# Show system relationships
m2js src/ --graph --mermaid

# Focus on specific modules
m2js src/core/ --graph --output core-architecture.md
```

### Documentation Generation

**1. API Documentation:**
```bash
# Generate public API docs
find src/ -name "*Service.ts" -o -name "*API.ts" | xargs m2js
mv *.md docs/api/

# Process interfaces separately
find src/ -name "*Types.ts" -o -name "*Interface.ts" | xargs m2js
mv *.md docs/types/
```

**2. Onboarding Documentation:**
```bash
# Create newcomer-friendly docs
m2js src/core/ --batch --output docs/onboarding/core/
m2js src/services/ --batch --output docs/onboarding/services/

# Focus on entry points
m2js src/index.ts src/app.ts --output docs/getting-started.md
```

## Performance Optimization

### File Size Management

**✅ Optimal File Sizes:**
- **Functions**: 50-200 lines → Best M2JS output
- **Classes**: 100-300 lines → Good extraction
- **Modules**: < 500 lines → Manageable context

**❌ Problematic Sizes:**
- **Giant files**: > 1000 lines → Consider splitting
- **Tiny files**: < 20 lines → Consider combining

### Processing Efficiency

**1. Selective Processing:**
```bash
# Process only what you need
m2js src/services/UserService.ts  # Single important file
m2js src/core/ --batch             # Core module only

# Avoid unnecessary processing
# m2js node_modules/ --batch       # Never do this
# m2js dist/ --batch               # Skip compiled files
```

**2. Parallel Processing:**
```bash
# Use find + xargs for large projects
find src/ -name "*.ts" -not -path "*/test/*" | xargs -P 4 -I {} m2js {}

# Process directories in parallel (if you have GNU parallel)
ls src/ | parallel m2js src/{} --batch --output docs/{}/
```

## Quality Guidelines

### Type Annotations

**✅ Explicit Types:**
```typescript
export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: {
    email: boolean;
    push: boolean;
    frequency: 'immediate' | 'daily' | 'weekly';
  };
  privacy: {
    profileVisibility: 'public' | 'friends' | 'private';
    dataSharing: boolean;
  };
}

export class UserService {
  async updatePreferences(
    userId: string,
    preferences: Partial<UserPreferences>
  ): Promise<UserPreferences> {
    // Clear input/output types for AI understanding
  }
}
```

**❌ Implicit Types:**
```typescript
export function updateUser(id, data) {  // AI can't understand intent
  return doSomething(id, data);         // Unclear behavior
}
```

### Business Logic Documentation

**✅ Business Rules in Comments:**
```typescript
export class OrderService {
  /**
   * Processes order with business validation
   * 
   * Business Rules:
   * - Orders over $500 require manager approval
   * - International orders have 2-day processing delay
   * - Subscription orders auto-renew unless cancelled
   * - Promotional codes expire at midnight UTC
   */
  async processOrder(order: OrderRequest): Promise<OrderResult> {
    // Implementation with clear business context
  }
}
```

**❌ Implementation-Only Comments:**
```typescript
export function processOrder(order: any) {
  // Call database
  // Validate input
  // Send email
  // Return result
}
```

## Integration Patterns

### CI/CD Documentation

```yaml
# .github/workflows/docs.yml
name: Generate AI Documentation
on:
  pull_request:
    paths: ['src/**/*.ts', 'src/**/*.js']

jobs:
  generate-docs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install -g @paulohenriquevn/m2js
      
      # Generate docs for changed files only
      - run: |
          git diff --name-only ${{ github.event.pull_request.base.sha }} | \
          grep -E '\.(ts|js)$' | \
          xargs m2js
          
      # Upload as PR artifact
      - uses: actions/upload-artifact@v3
        with:
          name: ai-documentation
          path: "*.md"
```

### VS Code Integration

```json
// .vscode/tasks.json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Generate M2JS Documentation",
      "type": "shell",
      "command": "m2js",
      "args": ["${file}"],
      "group": "build",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "shared"
      }
    }
  ]
}
```

### Team Workflows

**1. Code Review Process:**
```bash
# Reviewer preparation
m2js $(git diff --name-only main...feature-branch | grep -E '\.(ts|js)$')

# Share context with reviewer
cat *.md > review-context.md
```

**2. Architecture Reviews:**
```bash
# Generate system overview
m2js src/core/ src/services/ --graph --mermaid > architecture-review.md

# Focus on interfaces
find src/ -name "*Interface.ts" -o -name "*API.ts" | xargs m2js > interfaces.md
```

## Common Antipatterns

### ❌ What NOT to do

**1. Processing Everything:**
```bash
# Don't process unnecessary files
m2js node_modules/ --batch     # External dependencies
m2js dist/ --batch             # Compiled output
m2js coverage/ --batch         # Test coverage
m2js .git/ --batch             # Version control
```

**2. Ignoring Organization:**
```bash
# Don't dump everything together
m2js src/ --batch --output docs/everything.md  # Unorganized
```

**3. Over-Processing:**
```bash
# Don't regenerate docs constantly
# Set up smart workflows that only process changed files
```

### ✅ Best Practices Summary

1. **Organize by feature** - Keep related files together
2. **Write clear JSDoc** - Business rules and examples
3. **Use explicit types** - Help AI understand intent
4. **Process selectively** - Only what you need
5. **Integrate with workflows** - CI/CD and code review
6. **Focus on public APIs** - Core interfaces and services
7. **Document business logic** - Rules and constraints
8. **Optimize for AI** - Clear, structured output

Following these practices will maximize the value you get from M2JS and create documentation that truly enhances your AI-assisted development workflow.