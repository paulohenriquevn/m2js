# 📁 ./tests/fixtures/with-classes.ts

## 📦 Exports
- **Functions**: 1 exported function
- **Classes**: 2 exported classes
- **Default Export**: class class

## 🔧 Functions

### calculateTotal
/**
 * Calculates the sum of an array of numbers
 * @param items Array of numbers to sum
 * @returns The total sum
 */

**Parameters:**
- items: number[]

**Returns:** number

```typescript
export function calculateTotal(items: number[]): number
```

## 🏗️ Classes

### AuthService
/**
 * Service for handling user authentication and authorization
 */

**Methods:**
- login
- logout

```typescript
export class AuthService {
  login(email: string, password: string): Promise
  logout(): void
}
```

#### login
/**
   * Authenticates a user with email and password
   * @param email User's email address
   * @param password User's password
   * @returns Promise resolving to authentication token
   */

**Parameters:**
- email: string
- password: string

**Returns:** Promise

```typescript
login(email: string, password: string): Promise
```

#### logout
/**
   * Logs out the current user
   */

**Returns:** void

```typescript
logout(): void
```

### default
/**
 * Default export class for data processing
 */

**Methods:**
- process

```typescript
export class default {
  process(data: unknown[]): ProcessedData
}
```

#### process

**Parameters:**
- data: unknown[]

**Returns:** ProcessedData

```typescript
process(data: unknown[]): ProcessedData
```