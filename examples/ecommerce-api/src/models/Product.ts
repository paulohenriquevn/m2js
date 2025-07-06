import { User } from './User';

/**
 * Product model for e-commerce catalog
 * Handles product data, pricing, and inventory management
 */

export interface ProductCategory {
  id: string;
  name: string;
  description: string;
}

export interface ProductImage {
  url: string;
  alt: string;
  isPrimary: boolean;
}

export interface ProductReview {
  id: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

/**
 * Main Product class representing items in the e-commerce catalog
 * Handles product information, pricing, and inventory
 */
export class Product {
  public readonly id: string;
  public name: string;
  public description: string;
  public price: number;
  public category: ProductCategory;
  public images: ProductImage[];
  public stock: number;
  public isActive: boolean;
  public reviews: ProductReview[];

  constructor(
    id: string,
    name: string,
    description: string,
    price: number,
    category: ProductCategory,
    stock: number = 0
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.category = category;
    this.stock = stock;
    this.isActive = true;
    this.images = [];
    this.reviews = [];
  }

  /**
   * Updates product pricing
   * @param newPrice - New price value
   * @param reason - Reason for price change
   */
  public updatePrice(newPrice: number, reason?: string): void {
    if (newPrice < 0) {
      throw new Error('Price cannot be negative');
    }
    this.price = newPrice;
    // Log price change in real implementation
    console.log(`Price updated for ${this.name}: $${newPrice}${reason ? ` - ${reason}` : ''}`);
  }

  /**
   * Adds stock to product inventory
   * @param quantity - Amount to add to stock
   * @returns Updated stock level
   */
  public addStock(quantity: number): number {
    if (quantity <= 0) {
      throw new Error('Stock quantity must be positive');
    }
    this.stock += quantity;
    return this.stock;
  }

  /**
   * Removes stock from product inventory
   * @param quantity - Amount to remove from stock
   * @returns Updated stock level
   */
  public removeStock(quantity: number): number {
    if (quantity <= 0) {
      throw new Error('Stock quantity must be positive');
    }
    if (this.stock < quantity) {
      throw new Error('Insufficient stock');
    }
    this.stock -= quantity;
    return this.stock;
  }

  /**
   * Checks if product is available for purchase
   * @param requestedQuantity - Desired quantity to purchase
   * @returns True if product is available
   */
  public isAvailable(requestedQuantity: number = 1): boolean {
    return this.isActive && this.stock >= requestedQuantity;
  }

  /**
   * Adds a new review to the product
   * @param review - Review data to add
   */
  public addReview(review: Omit<ProductReview, 'id' | 'createdAt'>): void {
    const newReview: ProductReview = {
      ...review,
      id: `review_${Date.now()}`,
      createdAt: new Date()
    };
    this.reviews.push(newReview);
  }

  /**
   * Calculates average rating from reviews
   * @returns Average rating or 0 if no reviews
   */
  public getAverageRating(): number {
    if (this.reviews.length === 0) return 0;
    const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    return Math.round((totalRating / this.reviews.length) * 10) / 10;
  }

  /**
   * Gets product summary for display
   * @returns Product summary object
   */
  public getSummary(): {
    id: string;
    name: string;
    price: number;
    category: string;
    rating: number;
    reviewCount: number;
    inStock: boolean;
  } {
    return {
      id: this.id,
      name: this.name,
      price: this.price,
      category: this.category.name,
      rating: this.getAverageRating(),
      reviewCount: this.reviews.length,
      inStock: this.stock > 0
    };
  }
}

/**
 * Creates a new product with validation
 * @param productData - Product creation data
 * @returns Promise resolving to new Product instance
 */
export async function createProduct(productData: {
  name: string;
  description: string;
  price: number;
  categoryId: string;
  initialStock?: number;
}): Promise<Product> {
  // Validate input data
  if (!productData.name.trim()) {
    throw new Error('Product name is required');
  }
  if (productData.price < 0) {
    throw new Error('Product price cannot be negative');
  }

  // In real implementation, would fetch category from database
  const category: ProductCategory = {
    id: productData.categoryId,
    name: 'Electronics',
    description: 'Electronic devices and accessories'
  };

  const id = `product_${Date.now()}`;
  
  return new Product(
    id,
    productData.name,
    productData.description,
    productData.price,
    category,
    productData.initialStock || 0
  );
}

/**
 * Product search and filtering utilities
 */
export const ProductUtils = {
  /**
   * Filters products by category
   * @param products - Array of products to filter
   * @param categoryId - Category ID to filter by
   * @returns Filtered products array
   */
  filterByCategory: (products: Product[], categoryId: string): Product[] => {
    return products.filter(product => product.category.id === categoryId);
  },

  /**
   * Sorts products by price
   * @param products - Array of products to sort
   * @param order - Sort order ('asc' or 'desc')
   * @returns Sorted products array
   */
  sortByPrice: (products: Product[], order: 'asc' | 'desc' = 'asc'): Product[] => {
    return [...products].sort((a, b) => {
      return order === 'asc' ? a.price - b.price : b.price - a.price;
    });
  },

  /**
   * Finds products within price range
   * @param products - Array of products to search
   * @param minPrice - Minimum price
   * @param maxPrice - Maximum price
   * @returns Products within price range
   */
  findByPriceRange: (products: Product[], minPrice: number, maxPrice: number): Product[] => {
    return products.filter(product => 
      product.price >= minPrice && product.price <= maxPrice
    );
  }
};