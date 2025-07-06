# 📁 ./examples/ecommerce-api/src/services/OrderService.ts

## 📦 Exports
- **Functions**: 1 exported function
- **Classes**: 1 exported class

## 🔧 Functions

### createOrderService
/**
 * Creates a new order service instance
 * @param paymentService - Payment service dependency
 * @returns OrderService instance
 */


**Parameters:**
- paymentService: PaymentService

**Returns:** OrderService

```typescript
export function createOrderService(paymentService: PaymentService): OrderService
```

## 🏗️ Classes

### OrderService
/**
 * Service class for managing e-commerce orders
 * Integrates with payment and inventory systems
 */

**Methods:**
- createOrder
- processPayment
- updateOrderStatus
- getUserOrders
- getOrderById
- cancelOrder
- getOrderStats

```typescript
export class OrderService {
  createOrder(userId: string, items: OrderItem[], shippingAddress: unknown): Promise<Order>
  processPayment(orderId: string, paymentMethod: { ... }): Promise<{ ... }>
  updateOrderStatus(orderId: string, newStatus: unknown): Promise<Order>
  getUserOrders(userId: string): Promise<Order[]>
  getOrderById(orderId: string): Promise<Order | null>
  cancelOrder(orderId: string): Promise<Order>
  getOrderStats(userId: string): Promise<{ ... }>
}
```

*Method details available in source code*