# 📁 ./examples/ecommerce-api/src/models/Product.ts

## 📦 Exports
- **Functions**: 1 exported function
- **Classes**: 1 exported class

## 🔧 Functions

### createProduct
/**
 * Creates a new product with validation
 * @param productData - Product creation data
 * @returns Promise resolving to new Product instance
 */


**Parameters:**
- productData: { ... }

**Returns:** Promise<Product>

```typescript
export function createProduct(productData: { ... }): Promise<Product>
```

## 🏗️ Classes

### Product
/**
 * Main Product class representing items in the e-commerce catalog
 * Handles product information, pricing, and inventory
 */

**Methods:**
- updatePrice
- addStock
- removeStock
- isAvailable
- addReview
- getAverageRating
- getSummary

```typescript
export class Product {
  updatePrice(newPrice: number, reason?: string): void
  addStock(quantity: number): number
  removeStock(quantity: number): number
  isAvailable(requestedQuantity?: number): boolean
  addReview(review: Omit<ProductReview, 'id' | 'createdAt'>): void
  getAverageRating(): number
  getSummary(): { ... }
}
```

*Method details available in source code*