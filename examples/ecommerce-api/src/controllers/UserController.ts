import { User, createUser, UserValidator } from '../models/User';
import { OrderService } from '../services/OrderService';
import { validateEmail, validatePassword, createValidator } from '../utils/validators';

/**
 * Controller for user management operations
 * Handles HTTP requests for user registration, authentication, and profile management
 */

export interface UserRegistrationRequest {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

export interface UserLoginRequest {
  email: string;
  password: string;
}

export interface UserProfileUpdateRequest {
  firstName?: string;
  lastName?: string;
  address?: {
    street: string;
    city: string;
    zipCode: string;
    country: string;
  };
}

/**
 * Main user controller class
 * Handles all user-related API endpoints
 */
export class UserController {
  private users: Map<string, User> = new Map();
  private orderService: OrderService;

  constructor(orderService: OrderService) {
    this.orderService = orderService;
  }

  /**
   * Registers a new user
   * @param request - User registration data
   * @returns Promise resolving to created user (without password)
   */
  public async registerUser(request: UserRegistrationRequest): Promise<Omit<User, 'passwordHash'>> {
    // Validate input
    const validationResult = this.validateRegistrationRequest(request);
    if (!validationResult.isValid) {
      throw new Error(`Validation failed: ${validationResult.errors.join(', ')}`);
    }

    // Check if user already exists
    const existingUser = Array.from(this.users.values())
      .find(user => user.email === request.email);
    
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Create new user
    const newUser = await createUser(request);
    this.users.set(newUser.id, newUser);

    // Return user without sensitive data
    return newUser.toJSON();
  }

  /**
   * Authenticates user login
   * @param request - Login credentials
   * @returns Promise resolving to authenticated user data
   */
  public async loginUser(request: UserLoginRequest): Promise<{
    user: Omit<User, 'passwordHash'>;
    token: string;
  }> {
    // Validate input
    if (!validateEmail(request.email)) {
      throw new Error('Invalid email format');
    }

    if (!request.password) {
      throw new Error('Password is required');
    }

    // Find user
    const user = Array.from(this.users.values())
      .find(u => u.email === request.email);

    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Validate password
    const isValidPassword = await user.validatePassword(request.password);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    // Generate token (in real implementation, use JWT)
    const token = `token_${user.id}_${Date.now()}`;

    return {
      user: user.toJSON(),
      token
    };
  }

  /**
   * Updates user profile
   * @param userId - ID of user to update
   * @param request - Profile update data
   * @returns Promise resolving to updated user
   */
  public async updateProfile(
    userId: string, 
    request: UserProfileUpdateRequest
  ): Promise<Omit<User, 'passwordHash'>> {
    const user = this.users.get(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Validate update request
    const validationResult = this.validateProfileUpdateRequest(request);
    if (!validationResult.isValid) {
      throw new Error(`Validation failed: ${validationResult.errors.join(', ')}`);
    }

    // Update user profile
    await user.updateProfile(request);

    return user.toJSON();
  }

  /**
   * Gets user profile by ID
   * @param userId - ID of user to retrieve
   * @returns Promise resolving to user profile
   */
  public async getUserProfile(userId: string): Promise<Omit<User, 'passwordHash'>> {
    const user = this.users.get(userId);
    if (!user) {
      throw new Error('User not found');
    }

    return user.toJSON();
  }

  /**
   * Gets user order history
   * @param userId - ID of user
   * @returns Promise resolving to user's order history
   */
  public async getUserOrders(userId: string): Promise<any[]> {
    const user = this.users.get(userId);
    if (!user) {
      throw new Error('User not found');
    }

    return await this.orderService.getUserOrders(userId);
  }

  /**
   * Updates user preferences
   * @param userId - ID of user
   * @param preferences - New preferences
   * @returns Promise resolving to updated user
   */
  public async updatePreferences(
    userId: string, 
    preferences: Partial<User['preferences']>
  ): Promise<Omit<User, 'passwordHash'>> {
    const user = this.users.get(userId);
    if (!user) {
      throw new Error('User not found');
    }

    user.updatePreferences(preferences);

    return user.toJSON();
  }

  /**
   * Deletes user account
   * @param userId - ID of user to delete
   * @returns Promise resolving to deletion confirmation
   */
  public async deleteUser(userId: string): Promise<{ success: boolean }> {
    const user = this.users.get(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // In real implementation, would also clean up related data
    this.users.delete(userId);

    return { success: true };
  }

  /**
   * Validates user registration request
   * @param request - Registration request to validate
   * @returns Validation result
   */
  private validateRegistrationRequest(request: UserRegistrationRequest): {
    isValid: boolean;
    errors: string[];
  } {
    const validator = createValidator();
    
    // Validate email
    validator.field('email').required(request.email).email(request.email);
    
    // Validate password
    const passwordResult = validatePassword(request.password);
    if (!passwordResult.isValid) {
      validator.field('password').required(request.password);
      if (!passwordResult.requirements.minLength) {
        validator.errors.push('Password must be at least 8 characters long');
      }
      if (!passwordResult.requirements.hasUpperCase) {
        validator.errors.push('Password must contain at least one uppercase letter');
      }
      if (!passwordResult.requirements.hasNumber) {
        validator.errors.push('Password must contain at least one number');
      }
    }
    
    // Validate names
    validator.field('firstName').required(request.firstName).minLength(request.firstName, 2);
    validator.field('lastName').required(request.lastName).minLength(request.lastName, 2);

    return validator.getResult();
  }

  /**
   * Validates profile update request
   * @param request - Profile update request to validate
   * @returns Validation result
   */
  private validateProfileUpdateRequest(request: UserProfileUpdateRequest): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (request.firstName && request.firstName.trim().length < 2) {
      errors.push('First name must be at least 2 characters');
    }

    if (request.lastName && request.lastName.trim().length < 2) {
      errors.push('Last name must be at least 2 characters');
    }

    if (request.address) {
      if (!request.address.street.trim()) {
        errors.push('Street address is required');
      }
      if (!request.address.city.trim()) {
        errors.push('City is required');
      }
      if (!request.address.zipCode.trim()) {
        errors.push('Zip code is required');
      }
      if (!request.address.country.trim()) {
        errors.push('Country is required');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

/**
 * Creates a new user controller instance
 * @param orderService - Order service dependency
 * @returns UserController instance
 */
export function createUserController(orderService: OrderService): UserController {
  return new UserController(orderService);
}