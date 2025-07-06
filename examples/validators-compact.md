# 📁 ./examples/ecommerce-api/src/utils/validators.ts

## 📦 Exports
- **Functions**: 10 exported functions
- **Classes**: 1 exported class

## 🔧 Functions

| Function | Parameters | Returns | Description |
|----------|------------|---------|-------------|
| `validateEmail` | `email: string` | `boolean` | * |
| `validatePassword` | `password: string` | `{ ... }` | * |
| `validatePhone` | `phone: string` | `boolean` | * |
| `validateZipCode` | `zipCode: string, country?: string` | `boolean` | * |
| `validateCreditCard` | `cardNumber: string` | `boolean` | * |
| `validateURL` | `url: string` | `boolean` | * |
| `validateRequired` | `value: string, minLength?: number` | `boolean` | * |
| `validateRange` | `value: number, min: number, max: number` | `boolean` | * |
| `validateArrayLength` | `array: T[], minItems?: number` | `boolean` | * |
| `createValidator` | `` | `Validator` | * |

*Compact format used for utility functions - see source for implementation details*

## 🏗️ Classes

### Validator
/**
 * Validation utility class for complex validation scenarios
 */

**Methods:**
- field
- required
- email
- minLength
- getResult

```typescript
export class Validator {
  field(fieldName: string): Validator
  required(value: any, message?: string): Validator
  email(email: string, message?: string): Validator
  minLength(value: string, minLength: number, message?: string): Validator
  getResult(): ValidationResult
}
```

#### field

**Parameters:**
- fieldName: string

**Returns:** Validator

```typescript
field(fieldName: string): Validator
```

#### required

**Parameters:**
- value: any
- message?: string

**Returns:** Validator

```typescript
required(value: any, message?: string): Validator
```

#### email

**Parameters:**
- email: string
- message?: string

**Returns:** Validator

```typescript
email(email: string, message?: string): Validator
```

#### minLength

**Parameters:**
- value: string
- minLength: number
- message?: string

**Returns:** Validator

```typescript
minLength(value: string, minLength: number, message?: string): Validator
```

#### getResult

**Returns:** ValidationResult

```typescript
getResult(): ValidationResult
```