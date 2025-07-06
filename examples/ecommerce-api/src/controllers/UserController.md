# 📁 ./examples/ecommerce-api/src/controllers/UserController.ts

## 📦 Exports
- **Functions**: 1 exported function
- **Classes**: 1 exported class

## 🔧 Functions

### createUserController
/**
 * Creates a new user controller instance
 * @param orderService - Order service dependency
 * @returns UserController instance
 */


**Parameters:**
- orderService: OrderService

**Returns:** UserController

```typescript
export function createUserController(orderService: OrderService): UserController
```

## 🏗️ Classes

### UserController
/**
 * Main user controller class
 * Handles all user-related API endpoints
 */

**Methods:**
- registerUser
- loginUser
- updateProfile
- getUserProfile
- getUserOrders
- updatePreferences
- deleteUser

```typescript
export class UserController {
  registerUser(request: UserRegistrationRequest): Promise<Omit<User, 'passwordHash'>>
  loginUser(request: UserLoginRequest): Promise<{ ... }>
  updateProfile(userId: string, request: UserProfileUpdateRequest): Promise<Omit<User, 'passwordHash'>>
  getUserProfile(userId: string): Promise<Omit<User, 'passwordHash'>>
  getUserOrders(userId: string): Promise<any[]>
  updatePreferences(userId: string, preferences: Partial<unknown>): Promise<Omit<User, 'passwordHash'>>
  deleteUser(userId: string): Promise<{ ... }>
}
```

*Method details available in source code*