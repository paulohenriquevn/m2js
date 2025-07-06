# 📁 ./examples/ecommerce-api/src/services/PaymentService.ts

## 📦 Exports
- **Functions**: 1 exported function
- **Classes**: 1 exported class

## 🔧 Functions

### createPaymentService
/**
 * Creates a new payment service instance
 * @param apiKey - API key for payment provider
 * @param environment - Environment (sandbox or production)
 * @returns PaymentService instance
 */


**Parameters:**
- apiKey: string
- environment?: 'sandbox' | 'production'

**Returns:** PaymentService

```typescript
export function createPaymentService(apiKey: string, environment?: 'sandbox' | 'production'): PaymentService
```

## 🏗️ Classes

### PaymentService
/**
 * Main payment service class
 * Integrates with external payment providers
 */

**Methods:**
- processPayment
- processRefund
- getPaymentStatus

```typescript
export class PaymentService {
  processPayment(request: PaymentRequest): Promise<PaymentResult>
  processRefund(transactionId: string, amount: number): Promise<PaymentResult>
  getPaymentStatus(transactionId: string): Promise<{ ... }>
}
```

#### processPayment

**Parameters:**
- request: PaymentRequest

**Returns:** Promise<PaymentResult>

```typescript
processPayment(request: PaymentRequest): Promise<PaymentResult>
```

#### processRefund

**Parameters:**
- transactionId: string
- amount: number

**Returns:** Promise<PaymentResult>

```typescript
processRefund(transactionId: string, amount: number): Promise<PaymentResult>
```

#### getPaymentStatus

**Parameters:**
- transactionId: string

**Returns:** Promise<{ ... }>

```typescript
getPaymentStatus(transactionId: string): Promise<{ ... }>
```