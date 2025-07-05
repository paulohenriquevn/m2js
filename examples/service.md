# 📁 ./examples/service.ts

## 📦 Exports
- **Functions**: 1 exported function
- **Classes**: 2 exported classes

## 🔧 Functions

### validateEmail
/***
 * Validates an email address format
 * @param email The email address to validate
 * @returns True if email is valid, false otherwise
 */


**Parameters:**
- email: string

**Returns:** boolean

```typescript
export function validateEmail(email: string): boolean
```

## 🏗️ Classes

### AuthService
/***
 * Service class for handling user authentication and session management
 */

**Methods:**
- login
- refreshToken
- logout

```typescript
export class AuthService {
  login(email: string, password: string): Promise
  refreshToken(refreshToken: string): Promise
  logout(token: string): Promise
}
```

#### login

**Parameters:**
- email: string
- password: string

**Returns:** Promise

```typescript
login(email: string, password: string): Promise
```

#### refreshToken

**Parameters:**
- refreshToken: string

**Returns:** Promise

```typescript
refreshToken(refreshToken: string): Promise
```

#### logout

**Parameters:**
- token: string

**Returns:** Promise

```typescript
logout(token: string): Promise
```

### UserService
/***
 * User management service for handling user profiles
 */

**Methods:**
- getProfile
- updateProfile

```typescript
export class UserService {
  getProfile(userId: string): Promise
  updateProfile(userId: string, profile: Partial): Promise
}
```

#### getProfile

**Parameters:**
- userId: string

**Returns:** Promise

```typescript
getProfile(userId: string): Promise
```

#### updateProfile

**Parameters:**
- userId: string
- profile: Partial

**Returns:** Promise

```typescript
updateProfile(userId: string, profile: Partial): Promise
```