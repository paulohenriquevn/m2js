# 📁 ./examples/utils.ts

## 📦 Exports
- **Functions**: 5 exported functions
- **Default Export**: function function

## 🔧 Functions

### calculateTotal
/***
 * Utility functions for common operations
 */


**Parameters:**
- items: number[]

**Returns:** number

```typescript
export function calculateTotal(items: number[]): number
```

### formatCurrency

**Parameters:**
- amount: number
- currency?: unknown

**Returns:** string

```typescript
export function formatCurrency(amount: number, currency?): string
```

### fetchUserData

**Parameters:**
- userId: string

**Returns:** Promise

```typescript
export function fetchUserData(userId: string): Promise
```

### validateEmail

**Parameters:**
- email: string

**Returns:** boolean

```typescript
export const validateEmail = (email: string): boolean => {}
```

### default

**Parameters:**
- func: T
- delay: number

**Returns:** unknown

```typescript
export default function(func: T, delay: number): unknown
```