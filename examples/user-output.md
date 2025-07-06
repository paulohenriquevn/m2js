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
- userData: unknown

**Returns:** Promise

```typescript
export function createUser(userData: unknown): Promise
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
  updateProfile(updates: Partial): Promise
  validatePassword(password: string): Promise
  getFullName(): string
  updatePreferences(newPreferences: Partial): unknown
  toJSON(): Omit
}
```

#### updateProfile

**Parameters:**
- updates: Partial

**Returns:** Promise

```typescript
updateProfile(updates: Partial): Promise
```

#### validatePassword

**Parameters:**
- password: string

**Returns:** Promise

```typescript
validatePassword(password: string): Promise
```

#### getFullName

**Returns:** string

```typescript
getFullName(): string
```

#### updatePreferences

**Parameters:**
- newPreferences: Partial

**Returns:** unknown

```typescript
updatePreferences(newPreferences: Partial): unknown
```

#### toJSON

**Returns:** Omit

```typescript
toJSON(): Omit
```