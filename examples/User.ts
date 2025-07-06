/**
 * User Entity Implementation
 * Generated based on M2JS Template Specification
 * Domain: E-commerce Platform
 */

// Supporting types (normally in separate files)
export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface UserPreferences {
  newsletter: boolean;
  notifications: boolean;
  theme: 'light' | 'dark';
  language: string;
}

// Main interface as specified in template
export interface CreateUserData {
  id: string; // Unique user identifier
  email: string; // User email address
  firstName: string; // Customer first name
  lastName: string; // Customer last name
  address?: Address; // Default shipping address
  preferences?: UserPreferences; // User settings and preferences
}

// Custom business errors
export class BusinessRuleViolationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BusinessRuleViolationError';
  }
}

export class InvalidStateTransitionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidStateTransitionError';
  }
}

/**
 * User aggregate - Customer account with authentication and profile management
 * Implements business rules: Email uniqueness, password requirements, active user validation
 */
export class User {
  private _id: string;
  private _email: string;
  private _firstName: string;
  private _lastName: string;
  private _address?: Address;
  private _preferences?: UserPreferences;
  private _passwordHash: string;
  private _isActive: boolean;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(data: CreateUserData & { passwordHash: string }) {
    // Validate business rules during construction
    this.validateEmail(data.email);
    this.validateRequiredFields(data);
    
    this._id = data.id;
    this._email = data.email.toLowerCase().trim();
    this._firstName = data.firstName.trim();
    this._lastName = data.lastName.trim();
    this._address = data.address;
    this._preferences = data.preferences || this.getDefaultPreferences();
    this._passwordHash = data.passwordHash;
    this._isActive = true;
    this._createdAt = new Date();
    this._updatedAt = new Date();
  }

  // Public getters
  get id(): string { return this._id; }
  get email(): string { return this._email; }
  get firstName(): string { return this._firstName; }
  get lastName(): string { return this._lastName; }
  get address(): Address | undefined { return this._address; }
  get preferences(): UserPreferences | undefined { return this._preferences; }
  get isActive(): boolean { return this._isActive; }
  get createdAt(): Date { return this._createdAt; }
  get updatedAt(): Date { return this._updatedAt; }

  /**
   * Authenticate user with password
   * Business logic: Verify password against stored hash
   */
  async authenticate(password: string): Promise<boolean> {
    if (!this._isActive) {
      throw new InvalidStateTransitionError('Cannot authenticate inactive user');
    }
    
    // In real implementation, use bcrypt or similar
    // For demo purposes, simple comparison
    return this._passwordHash === this.hashPassword(password);
  }

  /**
   * Update user profile information
   * Business logic: Only allow updates to mutable fields, maintain data integrity
   */
  updateProfile(updates: Partial<Pick<User, 'firstName' | 'lastName' | 'address'>>): void {
    if (!this._isActive) {
      throw new InvalidStateTransitionError('Cannot update profile of inactive user');
    }

    if (updates.firstName !== undefined) {
      if (!updates.firstName.trim()) {
        throw new BusinessRuleViolationError('First name cannot be empty');
      }
      this._firstName = updates.firstName.trim();
    }

    if (updates.lastName !== undefined) {
      if (!updates.lastName.trim()) {
        throw new BusinessRuleViolationError('Last name cannot be empty');
      }
      this._lastName = updates.lastName.trim();
    }

    if (updates.address !== undefined) {
      this._address = updates.address;
    }

    this._updatedAt = new Date();
  }

  /**
   * Change user password
   * Business logic: Validate password strength, update hash
   */
  changePassword(currentPassword: string, newPassword: string): void {
    if (!this._isActive) {
      throw new InvalidStateTransitionError('Cannot change password of inactive user');
    }

    // Verify current password
    if (this._passwordHash !== this.hashPassword(currentPassword)) {
      throw new BusinessRuleViolationError('Current password is incorrect');
    }

    // Validate new password strength
    this.validatePasswordStrength(newPassword);
    
    this._passwordHash = this.hashPassword(newPassword);
    this._updatedAt = new Date();
  }

  /**
   * Update user preferences
   * Business logic: Allow preference customization while maintaining defaults
   */
  updatePreferences(newPreferences: Partial<UserPreferences>): void {
    if (!this._isActive) {
      throw new InvalidStateTransitionError('Cannot update preferences of inactive user');
    }

    this._preferences = {
      ...this._preferences,
      ...newPreferences
    };
    this._updatedAt = new Date();
  }

  /**
   * Get full name for display
   * Business logic: Consistent name formatting
   */
  getFullName(): string {
    return `${this._firstName} ${this._lastName}`;
  }

  /**
   * Deactivate user account
   * Business logic: State transition from active to inactive
   */
  deactivate(): void {
    if (!this._isActive) {
      throw new InvalidStateTransitionError('User is already inactive');
    }
    
    this._isActive = false;
    this._updatedAt = new Date();
  }

  /**
   * Reactivate user account
   * Business logic: State transition from inactive to active, validate email still valid
   */
  reactivate(): void {
    if (this._isActive) {
      throw new InvalidStateTransitionError('User is already active');
    }
    
    // Re-validate business rules before reactivation
    this.validateEmail(this._email);
    
    this._isActive = true;
    this._updatedAt = new Date();
  }

  /**
   * Export safe user data (without sensitive information)
   * Business logic: Never expose password hash or sensitive data
   */
  toJSON(): Omit<User, 'passwordHash'> {
    return {
      id: this._id,
      email: this._email,
      firstName: this._firstName,
      lastName: this._lastName,
      address: this._address,
      preferences: this._preferences,
      isActive: this._isActive,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt
    } as any;
  }

  // Private helper methods
  private validateEmail(email: string): void {
    if (!email || !email.trim()) {
      throw new BusinessRuleViolationError('Email is required');
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      throw new BusinessRuleViolationError('Email must be valid format');
    }
    
    // Note: Email uniqueness would be validated at the repository/service layer
    // since it requires database access
  }

  private validateRequiredFields(data: CreateUserData): void {
    if (!data.firstName?.trim()) {
      throw new BusinessRuleViolationError('First name is required');
    }
    
    if (!data.lastName?.trim()) {
      throw new BusinessRuleViolationError('Last name is required');
    }
    
    if (!data.id?.trim()) {
      throw new BusinessRuleViolationError('User ID is required');
    }
  }

  private validatePasswordStrength(password: string): void {
    if (!password || password.length < 8) {
      throw new BusinessRuleViolationError('Password must be at least 8 characters long');
    }
    
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      throw new BusinessRuleViolationError('Password must contain at least one uppercase letter, one lowercase letter, and one number');
    }
  }

  private hashPassword(password: string): string {
    // In real implementation, use bcrypt with salt
    // For demo purposes, simple hash simulation
    return `hashed_${password}_${this._id}`;
  }

  private getDefaultPreferences(): UserPreferences {
    return {
      newsletter: false,
      notifications: true,
      theme: 'light',
      language: 'en'
    };
  }
}

/**
 * Factory function to create new User with validation and business rules
 * Implements all business rules: email validation, password requirements
 */
export async function createUser(data: CreateUserData & { password: string }): Promise<User> {
  // Validate input data
  if (!data.password) {
    throw new BusinessRuleViolationError('Password is required for user creation');
  }

  // Create password hash
  const passwordHash = hashPasswordForCreation(data.password);
  
  // Validate password strength before user creation
  validatePasswordForCreation(data.password);
  
  // Create and return user instance
  return new User({
    ...data,
    passwordHash
  });
}

// Helper functions for user creation
function hashPasswordForCreation(password: string): string {
  // In real implementation, use bcrypt with salt
  return `hashed_${password}_${Date.now()}`;
}

function validatePasswordForCreation(password: string): void {
  if (!password || password.length < 8) {
    throw new BusinessRuleViolationError('Password must be at least 8 characters long');
  }
  
  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
    throw new BusinessRuleViolationError('Password must contain at least one uppercase letter, one lowercase letter, and one number');
  }
}