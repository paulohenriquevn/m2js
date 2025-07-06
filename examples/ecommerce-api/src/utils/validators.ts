/**
 * Validation utilities for e-commerce application
 * Provides common validation functions for user input
 */

/**
 * Validates email address format
 * @param email - Email address to validate
 * @returns True if email format is valid
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Validates password strength
 * @param password - Password to validate
 * @returns Object with validation result and requirements
 */
export function validatePassword(password: string): {
  isValid: boolean;
  requirements: {
    minLength: boolean;
    hasUpperCase: boolean;
    hasLowerCase: boolean;
    hasNumber: boolean;
    hasSpecialChar: boolean;
  };
} {
  const requirements = {
    minLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };

  const isValid = Object.values(requirements).every(req => req);

  return { isValid, requirements };
}

/**
 * Validates phone number format
 * @param phone - Phone number to validate
 * @returns True if phone format is valid
 */
export function validatePhone(phone: string): boolean {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone.trim());
}

/**
 * Validates postal/zip code format
 * @param zipCode - Zip code to validate
 * @param country - Country code (optional)
 * @returns True if zip code format is valid
 */
export function validateZipCode(zipCode: string, country?: string): boolean {
  const cleaned = zipCode.trim();
  
  switch (country?.toUpperCase()) {
    case 'US':
      return /^\d{5}(-\d{4})?$/.test(cleaned);
    case 'CA':
      return /^[A-Z]\d[A-Z] ?\d[A-Z]\d$/.test(cleaned);
    case 'UK':
      return /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/.test(cleaned);
    default:
      return cleaned.length >= 3 && cleaned.length <= 10;
  }
}

/**
 * Validates credit card number using Luhn algorithm
 * @param cardNumber - Credit card number to validate
 * @returns True if card number is valid
 */
export function validateCreditCard(cardNumber: string): boolean {
  const cleaned = cardNumber.replace(/\s+/g, '');
  
  // Check if it's all digits and has valid length
  if (!/^\d{13,19}$/.test(cleaned)) {
    return false;
  }

  // Luhn algorithm
  let sum = 0;
  let alternate = false;
  
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned.charAt(i));
    
    if (alternate) {
      digit *= 2;
      if (digit > 9) {
        digit = (digit % 10) + 1;
      }
    }
    
    sum += digit;
    alternate = !alternate;
  }
  
  return sum % 10 === 0;
}

/**
 * Validates URL format
 * @param url - URL to validate
 * @returns True if URL format is valid
 */
export function validateURL(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validates that a string is not empty or whitespace
 * @param value - String to validate
 * @param minLength - Minimum length requirement
 * @returns True if string is valid
 */
export function validateRequired(value: string, minLength: number = 1): boolean {
  return value.trim().length >= minLength;
}

/**
 * Validates numeric value within range
 * @param value - Number to validate
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns True if number is within range
 */
export function validateRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

/**
 * Validates array has minimum number of items
 * @param array - Array to validate
 * @param minItems - Minimum number of items required
 * @returns True if array has enough items
 */
export function validateArrayLength<T>(array: T[], minItems: number = 1): boolean {
  return Array.isArray(array) && array.length >= minItems;
}

/**
 * Comprehensive validation result interface
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  field?: string;
}

/**
 * Validation utility class for complex validation scenarios
 */
export class Validator {
  private errors: string[] = [];
  private fieldName: string = '';

  /**
   * Sets the current field name for error reporting
   * @param fieldName - Name of the field being validated
   * @returns Validator instance for chaining
   */
  public field(fieldName: string): Validator {
    this.fieldName = fieldName;
    return this;
  }

  /**
   * Validates that a value is required
   * @param value - Value to validate
   * @param message - Custom error message
   * @returns Validator instance for chaining
   */
  public required(value: any, message?: string): Validator {
    if (value === null || value === undefined || value === '') {
      this.errors.push(message || `${this.fieldName} is required`);
    }
    return this;
  }

  /**
   * Validates email format
   * @param email - Email to validate
   * @param message - Custom error message
   * @returns Validator instance for chaining
   */
  public email(email: string, message?: string): Validator {
    if (!validateEmail(email)) {
      this.errors.push(message || `${this.fieldName} must be a valid email`);
    }
    return this;
  }

  /**
   * Validates minimum length
   * @param value - String to validate
   * @param minLength - Minimum length
   * @param message - Custom error message
   * @returns Validator instance for chaining
   */
  public minLength(value: string, minLength: number, message?: string): Validator {
    if (value.length < minLength) {
      this.errors.push(message || `${this.fieldName} must be at least ${minLength} characters`);
    }
    return this;
  }

  /**
   * Gets validation result
   * @returns ValidationResult object
   */
  public getResult(): ValidationResult {
    const result = {
      isValid: this.errors.length === 0,
      errors: [...this.errors],
      field: this.fieldName
    };
    
    // Reset for next validation
    this.errors = [];
    this.fieldName = '';
    
    return result;
  }
}

/**
 * Creates a new validator instance
 * @returns New Validator instance
 */
export function createValidator(): Validator {
  return new Validator();
}