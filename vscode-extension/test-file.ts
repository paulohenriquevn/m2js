/**
 * Test TypeScript file for M2JS VS Code Extension
 */

export interface UserData {
  id: string;
  email: string;
  name: string;
}

/**
 * Simple user class for testing M2JS extension
 */
export class TestUser {
  constructor(private data: UserData) {}

  /**
   * Get user email
   */
  getEmail(): string {
    return this.data.email;
  }

  /**
   * Validate user data
   */
  isValid(): boolean {
    return this.data.email.includes('@') && this.data.name.length > 0;
  }

  /**
   * Update user name
   */
  updateName(newName: string): void {
    this.data.name = newName;
  }
}

/**
 * Factory function to create users
 */
export function createUser(userData: UserData): TestUser {
  if (!userData.email || !userData.name) {
    throw new Error('Email and name are required');
  }
  
  return new TestUser(userData);
}