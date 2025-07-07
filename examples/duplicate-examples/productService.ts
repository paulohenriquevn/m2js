/**
 * Product Service with duplicate validation logic
 */

export class ProductService {
  async validateProduct(product: any): Promise<boolean> {
    // Same validation pattern as UserService
    if (!product) {
      throw new Error('User is required');
    }
    if (!product.email) {
      throw new Error('Email is required');
    }
    if (!product.email.includes('@')) {
      throw new Error('Invalid email format');
    }
    if (!product.name) {
      throw new Error('Name is required');
    }
    if (product.name.length < 2) {
      throw new Error('Name must be at least 2 characters');
    }
    
    return true;
  }

  async saveProduct(productData: any): Promise<void> {
    // Different duplicate - same formatting pattern
    const formattedProduct = {
      id: Math.random().toString(),
      name: productData.name?.trim().toLowerCase(),
      email: productData.email?.trim().toLowerCase(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    console.log('Saving product:', formattedProduct);
  }

  async processProductBatch(products: any[]): Promise<void> {
    for (const product of products) {
      // Another duplicate formatting block
      const formattedItem = {
        id: Math.random().toString(),
        name: product.name?.trim().toLowerCase(),
        email: product.email?.trim().toLowerCase(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      console.log('Processing:', formattedItem);
    }
  }
}