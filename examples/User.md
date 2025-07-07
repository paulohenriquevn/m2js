# ./examples/User.ts

## Exports
- **Functions**: 1 exported function
- **Classes**: 3 exported classes

## Functions

### createUser
/**
 * Factory function to create new User with validation and business rules
 * Implements all business rules: email validation, password requirements
 */


**Parameters:**
- data: CreateUserData & { ... }

**Returns:** Promise<User>

```typescript
export function createUser(data: CreateUserData & { ... }): Promise<User>
```

## Classes

### BusinessRuleViolationError
```typescript
export class BusinessRuleViolationError {}
```

### InvalidStateTransitionError
```typescript
export class InvalidStateTransitionError {}
```

### User
/**
 * User aggregate - Customer account with authentication and profile management
 * Implements business rules: Email uniqueness, password requirements, active user validation
 */

**Methods:**
- authenticate
- updateProfile
- changePassword
- updatePreferences
- getFullName
- deactivate
- reactivate
- toJSON

```typescript
export class User {
  authenticate(password: string): Promise<boolean>
  updateProfile(updates: Partial<Pick<User, 'firstName' | 'lastName' | 'address'>>): void
  changePassword(currentPassword: string, newPassword: string): void
  updatePreferences(newPreferences: Partial<UserPreferences>): void
  getFullName(): string
  deactivate(): void
  reactivate(): void
  toJSON(): Omit<User, 'passwordHash'>
}
```

*Method details available in source code*