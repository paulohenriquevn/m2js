/**
 * Payment service for processing e-commerce transactions
 * Handles payment processing, validation, and refunds
 */

export interface PaymentMethod {
  type: 'credit_card' | 'paypal' | 'bank_transfer';
  token: string;
}

export interface PaymentRequest {
  amount: number;
  orderId: string;
  paymentMethod: PaymentMethod;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  errorMessage?: string;
}

/**
 * Main payment service class
 * Integrates with external payment providers
 */
export class PaymentService {
  private readonly apiKey: string;
  private readonly environment: 'sandbox' | 'production';

  constructor(apiKey: string, environment: 'sandbox' | 'production' = 'sandbox') {
    this.apiKey = apiKey;
    this.environment = environment;
  }

  /**
   * Processes a payment request
   * @param request - Payment request details
   * @returns Promise resolving to payment result
   */
  public async processPayment(request: PaymentRequest): Promise<PaymentResult> {
    // Validate payment request
    const validationResult = this.validatePaymentRequest(request);
    if (!validationResult.isValid) {
      return {
        success: false,
        errorMessage: validationResult.error
      };
    }

    try {
      // Simulate payment processing
      const result = await this.executePayment(request);
      return result;
    } catch (error) {
      return {
        success: false,
        errorMessage: error instanceof Error ? error.message : 'Payment processing failed'
      };
    }
  }

  /**
   * Validates payment request data
   * @param request - Payment request to validate
   * @returns Validation result
   */
  private validatePaymentRequest(request: PaymentRequest): {
    isValid: boolean;
    error?: string;
  } {
    if (request.amount <= 0) {
      return { isValid: false, error: 'Amount must be positive' };
    }

    if (!request.orderId || request.orderId.trim().length === 0) {
      return { isValid: false, error: 'Order ID is required' };
    }

    if (!request.paymentMethod.token || request.paymentMethod.token.trim().length === 0) {
      return { isValid: false, error: 'Payment method token is required' };
    }

    return { isValid: true };
  }

  /**
   * Executes the actual payment processing
   * @param request - Payment request
   * @returns Promise resolving to payment result
   */
  private async executePayment(request: PaymentRequest): Promise<PaymentResult> {
    // Simulate different payment methods
    switch (request.paymentMethod.type) {
      case 'credit_card':
        return this.processCreditCardPayment(request);
      case 'paypal':
        return this.processPayPalPayment(request);
      case 'bank_transfer':
        return this.processBankTransferPayment(request);
      default:
        throw new Error('Unsupported payment method');
    }
  }

  /**
   * Processes credit card payment
   * @param request - Payment request
   * @returns Promise resolving to payment result
   */
  private async processCreditCardPayment(request: PaymentRequest): Promise<PaymentResult> {
    // Simulate credit card processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simulate random success/failure for demonstration
    const success = Math.random() > 0.1; // 90% success rate

    if (success) {
      return {
        success: true,
        transactionId: `cc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };
    } else {
      return {
        success: false,
        errorMessage: 'Credit card declined'
      };
    }
  }

  /**
   * Processes PayPal payment
   * @param request - Payment request
   * @returns Promise resolving to payment result
   */
  private async processPayPalPayment(request: PaymentRequest): Promise<PaymentResult> {
    // Simulate PayPal processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    return {
      success: true,
      transactionId: `pp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
  }

  /**
   * Processes bank transfer payment
   * @param request - Payment request
   * @returns Promise resolving to payment result
   */
  private async processBankTransferPayment(request: PaymentRequest): Promise<PaymentResult> {
    // Bank transfers typically take longer to process
    await new Promise(resolve => setTimeout(resolve, 2000));

    return {
      success: true,
      transactionId: `bt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
  }

  /**
   * Processes a refund for a previous payment
   * @param transactionId - Original transaction ID
   * @param amount - Refund amount
   * @returns Promise resolving to refund result
   */
  public async processRefund(transactionId: string, amount: number): Promise<PaymentResult> {
    if (amount <= 0) {
      return {
        success: false,
        errorMessage: 'Refund amount must be positive'
      };
    }

    // Simulate refund processing
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      success: true,
      transactionId: `refund_${transactionId}_${Date.now()}`
    };
  }

  /**
   * Gets payment status for a transaction
   * @param transactionId - Transaction ID to check
   * @returns Promise resolving to payment status
   */
  public async getPaymentStatus(transactionId: string): Promise<{
    status: 'pending' | 'completed' | 'failed' | 'refunded';
    amount?: number;
    createdAt?: Date;
  }> {
    // Simulate status check
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
      status: 'completed',
      amount: 99.99,
      createdAt: new Date()
    };
  }
}

/**
 * Creates a new payment service instance
 * @param apiKey - API key for payment provider
 * @param environment - Environment (sandbox or production)
 * @returns PaymentService instance
 */
export function createPaymentService(
  apiKey: string, 
  environment: 'sandbox' | 'production' = 'sandbox'
): PaymentService {
  return new PaymentService(apiKey, environment);
}

/**
 * Payment utility functions
 */
export const PaymentUtils = {
  /**
   * Formats amount for display
   * @param amount - Amount in cents
   * @returns Formatted currency string
   */
  formatCurrency: (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount / 100);
  },

  /**
   * Validates credit card number format
   * @param cardNumber - Credit card number
   * @returns True if format is valid
   */
  isValidCardNumber: (cardNumber: string): boolean => {
    const cleaned = cardNumber.replace(/\s+/g, '');
    return /^\d{13,19}$/.test(cleaned);
  },

  /**
   * Masks credit card number for display
   * @param cardNumber - Credit card number
   * @returns Masked card number
   */
  maskCardNumber: (cardNumber: string): string => {
    const cleaned = cardNumber.replace(/\s+/g, '');
    if (cleaned.length < 4) return cleaned;
    
    const lastFour = cleaned.slice(-4);
    const masked = '*'.repeat(cleaned.length - 4);
    return `${masked}${lastFour}`;
  }
};