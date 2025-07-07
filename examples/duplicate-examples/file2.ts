export function processProductData(product: any) {
  if (!product) {
    throw new Error('User is required');
  }
  
  if (!product.name) {
    throw new Error('Name is required');
  }
  
  if (!product.email) {
    throw new Error('Email is required');
  }
  
  if (!product.email.includes('@')) {
    throw new Error('Invalid email format');
  }
  
  const processedProduct = {
    id: Math.random().toString(36),
    name: product.name.trim().toLowerCase(),
    email: product.email.trim().toLowerCase(),
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  return processedProduct;
}

export function validateProductInput(input: any) {
  if (!input.username) {
    console.log('Validating username');
  }
  
  if (!input.password) {
    console.log('Validating password');
  }
  
  if (input.password.length < 8) {
    console.log('Password too short');
  }
  
  return true;
}