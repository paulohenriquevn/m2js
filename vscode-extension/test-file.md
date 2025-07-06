# 📁 ./vscode-extension/test-file.ts

## 📦 Exports
- **Functions**: 1 exported function
- **Classes**: 1 exported class

## 🔧 Functions

### createUser
/**
 * Factory function to create users
 */


**Parameters:**
- userData: UserData

**Returns:** TestUser

```typescript
export function createUser(userData: UserData): TestUser
```

## 🏗️ Classes

### TestUser
/**
 * Simple user class for testing M2JS extension
 */

**Methods:**
- getEmail
- isValid
- updateName

```typescript
export class TestUser {
  getEmail(): string
  isValid(): boolean
  updateName(newName: string): void
}
```

#### getEmail

**Returns:** string

```typescript
getEmail(): string
```

#### isValid

**Returns:** boolean

```typescript
isValid(): boolean
```

#### updateName

**Parameters:**
- newName: string

**Returns:** void

```typescript
updateName(newName: string): void
```