export function processUserData(user: any) {
  if (!user) {
    throw new Error('User is required');
  }
  
  if (!user.name) {
    throw new Error('Name is required');
  }
  
  if (!user.email) {
    throw new Error('Email is required');
  }
  
  if (!user.email.includes('@')) {
    throw new Error('Invalid email format');
  }
  
  const processedUser = {
    id: Math.random().toString(36),
    name: user.name.trim().toLowerCase(),
    email: user.email.trim().toLowerCase(),
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  return processedUser;
}

export function validateUserInput(input: any) {
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