# 📁 ./examples/User.ts

## 📦 Exports
- **Functions**: 1 exported function
- **Classes**: 3 exported classes

## 🔧 Functions

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

## 🏗️ Classes

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

## 🎯 Business Context
**Domain**: E-commerce Platform (95% confidence)
**Description**: E-commerce Platform system with object-oriented architecture handling user management, product catalog, and order processing
**Tech Stack**: React Frontend, Angular Frontend, Logging System
**Architecture**: MVC/Controller Pattern, Service Layer Pattern, Design Patterns

**Business Entities**:
- Business Rule Violation Error
- Invalid State Transition Error
- User
- User Controller
- Product
- Order Service
- Payment Service
- Validator
- Auth Service
- User Service

## 📖 Usage Examples
### Validation
**.validateEmail**
```typescript
function(param)
```
*Call validateEmail() on  instance*

**.validateRequiredFields**
```typescript
function(param)
```
*Call validateRequiredFields() on  instance*

### Query
**.getDefaultPreferences**
```typescript
function()
```
*Call getDefaultPreferences() on  instance*

### Business logic
**.hashPassword**
```typescript
function(param)
```
*Call hashPassword() on  instance*

**user.updateProfile**
```typescript
function(param)
```
*Call updateProfile() on user instance*


## 🏗️ Architecture Insights
**Pattern**: Custom Architecture
**Rationale**: Architecture pattern determined by file organization and dependencies

**Data Flow Patterns**:
- **Validation Pipeline**: Input validation and error handling workflow
- **Async Operation Flow**: Asynchronous operation handling pattern

**Error Handling**: Return Value Error Handling
**Patterns**: Input Validation, Boolean Return Pattern

## 🔗 Domain Analysis
### BusinessRuleViolationError Entity
**Type**: entity
**Description**: Business Rule Violation Error entity from User.ts module
### InvalidStateTransitionError Entity
**Type**: entity
**Description**: Invalid State Transition Error entity from User.ts module
### User Entity
**Type**: aggregate
**Description**: User entity from User.ts module

**States**: inactive → active → suspended → deleted

**Business Rules**:
- User must pass validation before persistence
- Required properties must be set: fullname, defaultpreferences
- User must pass validation before persistence
- Required properties must be set: fullname
### User Entity
**Type**: aggregate
**Description**: User entity from User.ts module

**States**: inactive → active → suspended → deleted

**Business Rules**:
- User must pass validation before persistence
- Required properties must be set: fullname, defaultpreferences
- User must pass validation before persistence
- Required properties must be set: fullname