/**
 * Authentication and user management utilities
 */

/**
 * Validates an email address format
 * @param email The email address to validate
 * @returns True if email is valid, false otherwise
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Service class for handling user authentication and session management
 */
export class AuthService {
  private apiKey: string;
  private baseUrl: string;

  /**
   * Creates a new AuthService instance
   * @param apiKey API key for authentication
   * @param baseUrl Base URL for the authentication service
   */
  constructor(apiKey: string, baseUrl: string) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  /**
   * Authenticates a user with email and password
   * @param email User's email address
   * @param password User's password
   * @returns Promise resolving to authentication token
   */
  async login(email: string, password: string): Promise<AuthToken> {
    if (!this.validateCredentials(email, password)) {
      throw new Error('Invalid credentials');
    }

    const response = await fetch(`${this.baseUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    return response.json();
  }

  /**
   * Refreshes an authentication token
   * @param refreshToken The refresh token
   * @returns Promise with new token pair
   */
  async refreshToken(refreshToken: string): Promise<AuthToken> {
    const response = await fetch(`${this.baseUrl}/auth/refresh`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${refreshToken}` }
    });

    return response.json();
  }

  /**
   * Logs out the current user and invalidates tokens
   * @param token The authentication token to invalidate
   */
  async logout(token: string): Promise<void> {
    await fetch(`${this.baseUrl}/auth/logout`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
  }

  /**
   * Private method to validate user credentials
   * This method should not appear in the documentation
   */
  private validateCredentials(email: string, password: string): boolean {
    return email.length > 0 && password.length >= 8;
  }

  /**
   * Private method to handle API errors
   */
  private handleApiError(error: any): never {
    throw new Error(`API Error: ${error.message}`);
  }
}

/**
 * User management service for handling user profiles
 */
export class UserService {
  /**
   * Retrieves user profile information
   * @param userId The user's unique identifier
   * @returns Promise with user profile data
   */
  async getProfile(userId: string): Promise<UserProfile> {
    // Implementation here
    return {} as UserProfile;
  }

  /**
   * Updates user profile information
   * @param userId The user's unique identifier
   * @param profile Updated profile data
   * @returns Promise with updated profile
   */
  async updateProfile(userId: string, profile: Partial<UserProfile>): Promise<UserProfile> {
    // Implementation here
    return {} as UserProfile;
  }

  private internalMethod(): void {
    // This should not appear in docs
  }
}

// Type definitions
interface AuthToken {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

// Private utility function - should not be extracted
function privateHelper(data: string): string {
  return data.toLowerCase();
}