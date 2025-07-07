/**
 * User Service with intentional duplicate code for testing
 */

export class UserService {
  async validateUser(user: any): Promise<boolean> {
    // Validation logic - duplicated in multiple places
    if (!user) {
      throw new Error('User is required');
    }
    if (!user.email) {
      throw new Error('Email is required');
    }
    if (!user.email.includes('@')) {
      throw new Error('Invalid email format');
    }
    if (!user.name) {
      throw new Error('Name is required');
    }
    if (user.name.length < 2) {
      throw new Error('Name must be at least 2 characters');
    }
    
    return true;
  }

  async createUser(userData: any): Promise<void> {
    // Same validation logic duplicated here
    if (!userData) {
      throw new Error('User is required');
    }
    if (!userData.email) {
      throw new Error('Email is required');
    }
    if (!userData.email.includes('@')) {
      throw new Error('Invalid email format');
    }
    if (!userData.name) {
      throw new Error('Name is required');
    }
    if (userData.name.length < 2) {
      throw new Error('Name must be at least 2 characters');
    }

    // Create user logic
    console.log('Creating user:', userData);
  }

  async updateUser(id: string, userData: any): Promise<void> {
    // Different duplicate - formatting logic
    const formattedUser = {
      id: id,
      name: userData.name?.trim().toLowerCase(),
      email: userData.email?.trim().toLowerCase(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    console.log('Updating user:', formattedUser);
  }
}