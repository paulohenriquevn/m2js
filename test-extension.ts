/**
 * Test file for M2JS VS Code Extension
 * This file contains various TypeScript patterns to test the extension
 */

export interface User {
  id: number;
  email: string;
  name: string;
  isActive: boolean;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}

/**
 * Service for managing user operations
 * Handles CRUD operations for users
 */
export class UserService {
  private users: User[] = [];

  /**
   * Create a new user
   * @param userData - User data to create
   * @returns Promise resolving to created user
   */
  async createUser(userData: Omit<User, 'id'>): Promise<User> {
    const user: User = {
      id: Date.now(),
      ...userData
    };
    
    this.users.push(user);
    return user;
  }

  /**
   * Find user by email address
   * @param email - User email to search for
   * @returns Promise resolving to user or null
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.users.find(user => user.email === email) || null;
  }

  /**
   * Update user information
   * @param id - User ID to update
   * @param updates - Partial user data to update
   * @returns Promise resolving to updated user
   */
  async updateUser(id: number, updates: Partial<User>): Promise<User | null> {
    const userIndex = this.users.findIndex(user => user.id === id);
    
    if (userIndex === -1) {
      return null;
    }
    
    this.users[userIndex] = { ...this.users[userIndex], ...updates };
    return this.users[userIndex];
  }

  /**
   * Delete user by ID
   * @param id - User ID to delete
   * @returns Promise resolving to success status
   */
  async deleteUser(id: number): Promise<boolean> {
    const userIndex = this.users.findIndex(user => user.id === id);
    
    if (userIndex === -1) {
      return false;
    }
    
    this.users.splice(userIndex, 1);
    return true;
  }

  /**
   * Get all active users
   * @returns Promise resolving to array of active users
   */
  async getActiveUsers(): Promise<User[]> {
    return this.users.filter(user => user.isActive);
  }
}

/**
 * E-commerce shopping cart functionality
 */
export class ShoppingCart {
  private items: Array<{ product: Product; quantity: number }> = [];

  /**
   * Add product to cart
   * @param product - Product to add
   * @param quantity - Quantity to add
   */
  addItem(product: Product, quantity: number = 1): void {
    const existingItem = this.items.find(item => item.product.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.items.push({ product, quantity });
    }
  }

  /**
   * Calculate total cart value
   * @returns Total price of all items in cart
   */
  calculateTotal(): number {
    return this.items.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  }

  /**
   * Get cart contents
   * @returns Array of cart items
   */
  getItems(): Array<{ product: Product; quantity: number }> {
    return [...this.items];
  }

  /**
   * Clear all items from cart
   */
  clear(): void {
    this.items = [];
  }
}

/**
 * Utility functions for validation
 */
export const ValidationUtils = {
  /**
   * Validate email format
   * @param email - Email to validate
   * @returns True if email is valid
   */
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Validate price is positive
   * @param price - Price to validate
   * @returns True if price is valid
   */
  isValidPrice(price: number): boolean {
    return price > 0 && isFinite(price);
  },

  /**
   * Sanitize user input
   * @param input - Input string to sanitize
   * @returns Sanitized string
   */
  sanitizeInput(input: string): string {
    return input.trim().replace(/[<>]/g, '');
  }
};