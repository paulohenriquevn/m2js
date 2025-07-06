/**
 * User model for e-commerce application
 * Handles user data structure and validation
 */

export interface Address {
  street: string;
  city: string;
  zipCode: string;
  country: string;
}

export interface UserPreferences {
  newsletter: boolean;
  theme: 'light' | 'dark';
  language: string;
}

/**
 * Main User class representing a customer in the e-commerce system
 * Provides methods for user management and authentication
 */
export class User {
  public readonly id: string;
  public email: string;
  public firstName: string;
  public lastName: string;
  public address?: Address;
  public preferences: UserPreferences;
  private passwordHash: string;

  constructor(
    id: string,
    email: string,
    firstName: string,
    lastName: string,
    passwordHash: string
  ) {
    this.id = id;
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
    this.passwordHash = passwordHash;
    this.preferences = {
      newsletter: false,
      theme: 'light',
      language: 'en'
    };
  }

  /**
   * Updates user profile information
   * @param updates - Partial user data to update
   * @returns Promise resolving to updated user
   */
  public async updateProfile(updates: Partial<Pick<User, 'firstName' | 'lastName' | 'address'>>): Promise<User> {
    Object.assign(this, updates);
    // In real implementation, this would save to database
    return this;
  }

  /**
   * Validates user password against stored hash
   * @param password - Plain text password to validate
   * @returns Promise resolving to boolean indicating validity
   */
  public async validatePassword(password: string): Promise<boolean> {
    // In real implementation, this would use bcrypt or similar
    return password.length > 0;
  }

  /**
   * Gets user's full name
   * @returns Formatted full name string
   */
  public getFullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  /**
   * Updates user preferences
   * @param newPreferences - New preference settings
   */
  public updatePreferences(newPreferences: Partial<UserPreferences>): void {
    this.preferences = { ...this.preferences, ...newPreferences };
  }

  /**
   * Converts user to safe JSON representation (excluding sensitive data)
   * @returns Public user data object
   */
  public toJSON(): Omit<User, 'passwordHash'> {
    const { passwordHash, ...publicData } = this;
    return publicData;
  }
}

/**
 * Creates a new user instance with validation
 * @param userData - User creation data
 * @returns Promise resolving to new User instance
 */
export async function createUser(userData: {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}): Promise<User> {
  // Validate email format
  if (!userData.email.includes('@')) {
    throw new Error('Invalid email format');
  }

  // Generate ID and hash password
  const id = `user_${Date.now()}`;
  const passwordHash = `hashed_${userData.password}`;

  return new User(
    id,
    userData.email,
    userData.firstName,
    userData.lastName,
    passwordHash
  );
}

/**
 * User validation utilities
 */
export const UserValidator = {
  /**
   * Validates email format
   * @param email - Email string to validate
   * @returns True if valid email format
   */
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Validates password strength
   * @param password - Password to validate
   * @returns True if password meets requirements
   */
  isValidPassword: (password: string): boolean => {
    return password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password);
  }
};