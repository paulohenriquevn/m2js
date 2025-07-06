# 📁 ./examples/ecommerce-api/src/models/Product.ts

## 📦 Exports
- **Functions**: 1 exported function
- **Classes**: 1 exported class

## 🔧 Functions

### createProduct
/***
 * Creates a new product with validation
 * @param productData - Product creation data
 * @returns Promise resolving to new Product instance
 */


**Parameters:**
- productData: unknown

**Returns:** Promise

```typescript
export function createProduct(productData: unknown): Promise
```

## 🏗️ Classes

### Product
/***
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
  updatePrice(newPrice: number, reason?: string): unknown
  addStock(quantity: number): number
  removeStock(quantity: number): number
  isAvailable(requestedQuantity?: number): boolean
  addReview(review: Omit): unknown
  getAverageRating(): number
  getSummary(): unknown
}
```

#### updatePrice

**Parameters:**
- newPrice: number
- reason?: string

**Returns:** unknown

```typescript
updatePrice(newPrice: number, reason?: string): unknown
```

#### addStock

**Parameters:**
- quantity: number

**Returns:** number

```typescript
addStock(quantity: number): number
```

#### removeStock

**Parameters:**
- quantity: number

**Returns:** number

```typescript
removeStock(quantity: number): number
```

#### isAvailable

**Parameters:**
- requestedQuantity?: number

**Returns:** boolean

```typescript
isAvailable(requestedQuantity?: number): boolean
```

#### addReview

**Parameters:**
- review: Omit

**Returns:** unknown

```typescript
addReview(review: Omit): unknown
```

#### getAverageRating

**Returns:** number

```typescript
getAverageRating(): number
```

#### getSummary

**Returns:** unknown

```typescript
getSummary(): unknown
```