/**
 * Utility functions for mathematical operations
 */

/**
 * Calculates the sum of an array of numbers
 * @param items Array of numbers to sum
 * @returns The total sum
 */
export function calculateTotal(items: number[]): number {
  return items.reduce((sum, item) => sum + item, 0);
}

/**
 * Service for handling user authentication and authorization
 */
export class AuthService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Authenticates a user with email and password
   * @param email User's email address
   * @param password User's password
   * @returns Promise resolving to authentication token
   */
  async login(email: string, password: string): Promise<string> {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${this.apiKey}` },
      body: JSON.stringify({ email, password })
    });
    return response.json();
  }

  /**
   * Logs out the current user
   */
  logout(): void {
    // Clear session
  }

  /**
   * Internal method for token validation
   * This should not appear in the output (private)
   */
  private validateToken(token: string): boolean {
    return token.length > 0;
  }
}

/**
 * Default export class for data processing
 */
export default class DataProcessor {
  /**
   * Processes raw data into formatted output
   * @param data Raw input data
   * @returns Processed data object
   */
  process(data: any[]): ProcessedData {
    return { items: data, count: data.length };
  }

  private internal(): void {
    // Private method - should not appear
  }
}

interface ProcessedData {
  items: any[];
  count: number;
}

// Private function - should not be extracted
function privateHelper(): void {
  console.log('This is private');
}