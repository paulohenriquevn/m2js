/**
 * E-commerce User Service Example
 * Perfect for testing M2JS Template Generation
 */

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

/**
 * User aggregate for e-commerce platform
 * Handles customer account management and authentication
 */
export class User {
  private _id: string;
  private _email: string;
  private _firstName: string;
  private _lastName: string;
  private _address?: Address;
  private _preferences: UserPreferences;
  private _isActive: boolean;

  constructor(data: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    address?: Address;
    preferences?: UserPreferences;
  }) {
    this._id = data.id;
    this._email = data.email;
    this._firstName = data.firstName;
    this._lastName = data.lastName;
    this._address = data.address;
    this._preferences = data.preferences || this.getDefaultPreferences();
    this._isActive = true;
  }

  /**
   * Update user profile information
   * Business rule: Only allow updates to mutable fields
   */
  updateProfile(updates: {
    firstName?: string;
    lastName?: string;
    address?: Address;
  }): void {
    if (!this._isActive) {
      throw new Error('Cannot update inactive user profile');
    }

    if (updates.firstName) this._firstName = updates.firstName;
    if (updates.lastName) this._lastName = updates.lastName;
    if (updates.address) this._address = updates.address;
  }

  /**
   * Validate user password
   * Security: Always use secure comparison
   */
  validatePassword(password: string): boolean {
    // In real implementation, use bcrypt
    return password.length >= 8;
  }

  /**
   * Get full name for display
   */
  getFullName(): string {
    return `${this._firstName} ${this._lastName}`;
  }

  /**
   * Update user preferences
   */
  updatePreferences(newPreferences: Partial<UserPreferences>): void {
    this._preferences = { ...this._preferences, ...newPreferences };
  }

  /**
   * Export user data without sensitive information
   */
  toJSON(): Omit<User, 'validatePassword'> {
    return {
      id: this._id,
      email: this._email,
      firstName: this._firstName,
      lastName: this._lastName,
      address: this._address,
      preferences: this._preferences,
      isActive: this._isActive
    } as any;
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
 * User service for e-commerce operations
 * Orchestrates user-related business workflows
 */
export class UserService {
  private users = new Map<string, User>();

  /**
   * Create new user with validation
   * Business rule: Email must be unique
   */
  async createUser(userData: {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    address?: Address;
  }): Promise<User> {
    // Validate email uniqueness
    if (this.findUserByEmail(userData.email)) {
      throw new Error('Email already exists');
    }

    // Validate password strength
    if (userData.password.length < 8) {
      throw new Error('Password must be at least 8 characters');
    }

    const user = new User({
      id: this.generateId(),
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      address: userData.address
    });

    this.users.set(user.id, user);
    return user;
  }

  /**
   * Find user by email
   */
  findUserByEmail(email: string): User | null {
    for (const user of this.users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return null;
  }

  /**
   * Get user by ID
   */
  getUserById(id: string): User | null {
    return this.users.get(id) || null;
  }

  /**
   * Process user login
   * Business workflow: Validate credentials and update last login
   */
  async login(email: string, password: string): Promise<{ user: User; token: string } | null> {
    const user = this.findUserByEmail(email);
    
    if (!user || !user.validatePassword(password)) {
      return null;
    }

    if (!user.isActive) {
      throw new Error('User account is inactive');
    }

    // Generate session token (simplified)
    const token = this.generateSessionToken(user.id);
    
    return { user, token };
  }

  private generateId(): string {
    return 'user_' + Math.random().toString(36).substring(2, 15);
  }

  private generateSessionToken(userId: string): string {
    return 'token_' + userId + '_' + Date.now();
  }
}