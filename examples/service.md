# 📝 service.ts

## 🔧 Functions

### validateEmail
/***
 * Validates an email address format
 * @param email The email address to validate
 * @returns True if email is valid, false otherwise
 */
```typescript
export function validateEmail(email: string): boolean
```

## 🏗️ Classes

### AuthService
/***
 * Service class for handling user authentication and session management
 */
```typescript
export class AuthService {
  login(email: string, password: string): Promise
  refreshToken(refreshToken: string): Promise
  logout(token: string): Promise
}
```

#### login
```typescript
login(email: string, password: string): Promise
```

#### refreshToken
```typescript
refreshToken(refreshToken: string): Promise
```

#### logout
```typescript
logout(token: string): Promise
```

### UserService
/***
 * User management service for handling user profiles
 */
```typescript
export class UserService {
  getProfile(userId: string): Promise
  updateProfile(userId: string, profile: Partial): Promise
}
```

#### getProfile
```typescript
getProfile(userId: string): Promise
```

#### updateProfile
```typescript
updateProfile(userId: string, profile: Partial): Promise
```