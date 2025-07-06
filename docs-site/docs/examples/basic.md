# Basic Examples

Real-world examples of using M2JS for different scenarios.

## Simple TypeScript Class

### Input

```typescript
export class Calculator {
add(a: number, b: number): number {
return a + b;
}

multiply(a: number, b: number): number {
return a * b;
}
}
```

### Output

```markdown
# Calculator.ts

## Functions

### add
```typescript
add(a: number, b: number): number
```

### multiply 
```typescript
multiply(a: number, b: number): number
```
```

## Service Layer Example

### Input

```typescript
export interface User {
id: string;
email: string;
}

export class UserService {
async createUser(email: string): Promise<User> {
// Implementation
}
}
```

### AI-Enhanced Output

```markdown
# UserService.ts

## Business Context
**Domain**: User Management (95% confidence)
**Patterns**: Service Layer

## Types

### User
```typescript
interface User {
id: string;
email: string;
}
```

## Functions

### createUser
```typescript
async createUser(email: string): Promise<User>
```
**Usage Pattern**: User registration workflow
```

**Token Reduction**: 78% fewer tokens for AI assistants!