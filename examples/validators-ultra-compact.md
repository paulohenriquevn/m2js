# 📁 ./examples/ecommerce-api/src/utils/validators.ts

## 📦 Exports
- **Functions**: 10 exported functions
- **Classes**: 1 exported class

## 🔧 Functions

| Function | Parameters | Returns | Description |
|----------|------------|---------|-------------|
| `validateEmail` | `email: string` | `boolean` | email address format |
| `validatePassword` | `password: string` | `{ ... }` | password strength |
| `validatePhone` | `phone: string` | `boolean` | phone number format |
| `validateZipCode` | `zipCode: string, country?: string` | `boolean` | postal/zip code format |
| `validateCreditCard` | `cardNumber: string` | `boolean` | credit card number using Luhn algorithm |
| `validateURL` | `url: string` | `boolean` | URL format |
| `validateRequired` | `value: string, minLength?: number` | `boolean` | that a string is not empty or whitespace |
| `validateRange` | `value: number, min: number, max: number` | `boolean` | numeric value within range |
| `validateArrayLength` | `array: T[], minItems?: number` | `boolean` | array has minimum number of items |
| `createValidator` | `` | `Validator` | a new validator instance |

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

*Method details available in source code*