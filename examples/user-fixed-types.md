# 📁 ./examples/ecommerce-api/src/models/User.ts

## 📦 Exports
- **Functions**: 1 exported function
- **Classes**: 1 exported class

## 🔧 Functions

### createUser
/***
 * Creates a new user instance with validation
 * @param userData - User creation data
 * @returns Promise resolving to new User instance
 */


**Parameters:**
- userData: { ... }

**Returns:** Promise<User>

```typescript
export function createUser(userData: { ... }): Promise<User>
```

## 🏗️ Classes

### User
/***
 * Main User class representing a customer in the e-commerce system
 * Provides methods for user management and authentication
 */

**Methods:**
- updateProfile
- validatePassword
- getFullName
- updatePreferences
- toJSON

```typescript
export class User {
  updateProfile(updates: Partial<Pick<User, 'firstName' | 'lastName' | 'address'>>): Promise<User>
  validatePassword(password: string): Promise<boolean>
  getFullName(): string
  updatePreferences(newPreferences: Partial<UserPreferences>): void
  toJSON(): Omit<User, 'passwordHash'>
}
```

#### updateProfile

**Parameters:**
- updates: Partial<Pick<User, 'firstName' | 'lastName' | 'address'>>

**Returns:** Promise<User>

```typescript
updateProfile(updates: Partial<Pick<User, 'firstName' | 'lastName' | 'address'>>): Promise<User>
```

#### validatePassword

**Parameters:**
- password: string

**Returns:** Promise<boolean>

```typescript
validatePassword(password: string): Promise<boolean>
```

#### getFullName

**Returns:** string

```typescript
getFullName(): string
```

#### updatePreferences

**Parameters:**
- newPreferences: Partial<UserPreferences>

**Returns:** void

```typescript
updatePreferences(newPreferences: Partial<UserPreferences>): void
```

#### toJSON

**Returns:** Omit<User, 'passwordHash'>

```typescript
toJSON(): Omit<User, 'passwordHash'>
```