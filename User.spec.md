# 📁 ./src/models/User.ts

> **🤖 LLM IMPLEMENTATION GUIDE**
> This is a specification template for AI-guided development.
> Follow the structure and business rules to implement the component.

## 🎯 Business Context
**Domain**: Business Domain
**Component Type**: class (aggregate)
**Layer**: business
**Business Purpose**: Implements User entity with business logic and state management

**Dependencies**:
- Address
- UserPreferences

## 📋 Component Overview
**Name**: User
**Description**: Customer account with authentication and profile management

### 📦 Exports to Implement
This component should export 3 item(s):
- **User** (class): Customer account with authentication and profile management
- **createUser** (function): Creates new User with validation and business rules
- **CreateUserData** (interface): Type definition for User creation data

## 🔧 Functions to Implement

### createUser
**Purpose**: Creates new User with validation and business rules

**Parameters**:
- **data**: `CreateUserData` - Data required to create User
  - *Business meaning*: Enforces business rules and validation during creation
  - *Validation*: Required field validation, Business rule validation, Data format validation

**Returns**: `Promise<User>`

**Business Rules**:
- Email must be unique
- Password must meet security requirements
- Active users must have valid email

**Implementation Signature**:
```typescript
export function createUser(data: CreateUserData): Promise<User>
```

## 🏗️ Classes to Implement

### User
**Purpose**: Customer account with authentication and profile management

**Business Rules**:
- Email must be unique
- Password must meet security requirements
- Active users must have valid email

**Implementation Template**:
```typescript
export class User {
  constructor(data: EntityData) {
    // Initialize properties and validate business rules
  }

  authenticate(): void {
    // Implement business logic
  }

  updateProfile(updates: Partial<User>): void {
    // Implement business logic
  }

  changePassword(updates: Partial<User>): void {
    // Implement business logic
  }

  manageAddresses(): void {
    // Implement business logic
  }

}
```

## 📋 Interfaces to Implement

### CreateUserData
**Purpose**: Type definition for User creation data

**Interface Definition**:
```typescript
export interface CreateUserData {
  id: string; // Unique user identifier
  email: string; // User email address
  firstName: string; // Customer first name
  lastName: string; // Customer last name
  address?: Address; // Default shipping address
  preferences?: UserPreferences; // User settings and preferences
}
```


## 🔨 Implementation Guide
**Approach**: Rich domain model with encapsulated business logic

**Key Considerations**:
- Encapsulate business rules within the entity
- Maintain data consistency through invariants
- Use value objects for complex data types
- Implement proper state transitions

**Business Logic Implementation**:
1. **Email must be unique**
   - Implementation: Validate in constructor and setter methods
   - Validation: Throw error if invariant is violated
   - Edge cases: Concurrent modifications, Partial updates, State transitions
2. **Password must meet security requirements**
   - Implementation: Validate in constructor and setter methods
   - Validation: Throw error if invariant is violated
   - Edge cases: Concurrent modifications, Partial updates, State transitions
3. **Active users must have valid email**
   - Implementation: Validate in constructor and setter methods
   - Validation: Throw error if invariant is violated
   - Edge cases: Concurrent modifications, Partial updates, State transitions

**Error Handling**:
- Strategy: throw
- Error types: BusinessRuleViolationError, InvalidStateTransitionError

## 📖 Usage Examples

> **Note**: These are example usage patterns to guide implementation

### createUser Usage
**Create new User**:
```typescript
const user = await createUser({
    id: "example",
  email: "example",
  firstName: "example",
  lastName: "example"
});
```
*Creates a new User with proper validation*
*Expected: Returns valid User instance or throws business rule violation*


## 🧪 Testing Guide
**Testing Approach**: State-based testing with business scenario validation

**Test Scenarios**:
- **Create valid User**: Test User creation with valid data
  - Input: `valid entity data`
  - Expected: `User instance`
  - Validation: All invariants satisfied
- **Test User business rules**: Verify business rule enforcement
  - Input: `data violating business rules`
  - Expected: `business rule error`
  - Validation: Proper error with business context

**Mocking Strategy**: Mock repositories and external services, test domain logic directly