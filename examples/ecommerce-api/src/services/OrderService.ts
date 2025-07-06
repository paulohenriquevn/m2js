import { User } from '../models/User';
import { Product } from '../models/Product';
import { PaymentService } from './PaymentService';
import { validateEmail } from '../utils/validators';

/**
 * Order service for e-commerce application
 * Handles order creation, processing, and management
 */

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
  shippingAddress: {
    street: string;
    city: string;
    zipCode: string;
    country: string;
  };
}

/**
 * Service class for managing e-commerce orders
 * Integrates with payment and inventory systems
 */
export class OrderService {
  private paymentService: PaymentService;
  private orders: Map<string, Order> = new Map();

  constructor(paymentService: PaymentService) {
    this.paymentService = paymentService;
  }

  /**
   * Creates a new order from cart items
   * @param userId - ID of the user placing the order
   * @param items - Array of order items
   * @param shippingAddress - Delivery address
   * @returns Promise resolving to created order
   */
  public async createOrder(
    userId: string,
    items: OrderItem[],
    shippingAddress: Order['shippingAddress']
  ): Promise<Order> {
    // Validate input
    if (!userId || items.length === 0) {
      throw new Error('Invalid order data');
    }

    // Calculate total
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Create order
    const order: Order = {
      id: `order_${Date.now()}`,
      userId,
      items,
      total,
      status: 'pending',
      createdAt: new Date(),
      shippingAddress
    };

    // Store order
    this.orders.set(order.id, order);

    return order;
  }

  /**
   * Processes payment for an order
   * @param orderId - ID of the order to process
   * @param paymentMethod - Payment method details
   * @returns Promise resolving to payment result
   */
  public async processPayment(
    orderId: string,
    paymentMethod: { type: 'credit_card' | 'paypal'; token: string }
  ): Promise<{ success: boolean; transactionId?: string }> {
    const order = this.orders.get(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    if (order.status !== 'pending') {
      throw new Error('Order cannot be processed');
    }

    try {
      // Process payment through payment service
      const paymentResult = await this.paymentService.processPayment({
        amount: order.total,
        orderId: order.id,
        paymentMethod
      });

      if (paymentResult.success) {
        order.status = 'processing';
        this.orders.set(orderId, order);
      }

      return paymentResult;
    } catch (error) {
      order.status = 'cancelled';
      this.orders.set(orderId, order);
      throw error;
    }
  }

  /**
   * Updates order status
   * @param orderId - ID of the order to update
   * @param newStatus - New order status
   * @returns Promise resolving to updated order
   */
  public async updateOrderStatus(
    orderId: string, 
    newStatus: Order['status']
  ): Promise<Order> {
    const order = this.orders.get(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    order.status = newStatus;
    this.orders.set(orderId, order);

    return order;
  }

  /**
   * Gets orders for a specific user
   * @param userId - ID of the user
   * @returns Promise resolving to user's orders
   */
  public async getUserOrders(userId: string): Promise<Order[]> {
    const userOrders = Array.from(this.orders.values())
      .filter(order => order.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return userOrders;
  }

  /**
   * Gets order by ID
   * @param orderId - ID of the order
   * @returns Promise resolving to order or null
   */
  public async getOrderById(orderId: string): Promise<Order | null> {
    return this.orders.get(orderId) || null;
  }

  /**
   * Cancels an order if possible
   * @param orderId - ID of the order to cancel
   * @returns Promise resolving to cancelled order
   */
  public async cancelOrder(orderId: string): Promise<Order> {
    const order = this.orders.get(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    if (order.status === 'shipped' || order.status === 'delivered') {
      throw new Error('Cannot cancel shipped or delivered orders');
    }

    order.status = 'cancelled';
    this.orders.set(orderId, order);

    return order;
  }

  /**
   * Calculates order statistics for a user
   * @param userId - ID of the user
   * @returns Promise resolving to order statistics
   */
  public async getOrderStats(userId: string): Promise<{
    totalOrders: number;
    totalSpent: number;
    averageOrderValue: number;
    ordersByStatus: Record<Order['status'], number>;
  }> {
    const userOrders = await this.getUserOrders(userId);
    
    const stats = {
      totalOrders: userOrders.length,
      totalSpent: userOrders.reduce((sum, order) => sum + order.total, 0),
      averageOrderValue: 0,
      ordersByStatus: {
        pending: 0,
        processing: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0
      } as Record<Order['status'], number>
    };

    // Calculate average order value
    stats.averageOrderValue = stats.totalOrders > 0 
      ? stats.totalSpent / stats.totalOrders 
      : 0;

    // Count orders by status
    userOrders.forEach(order => {
      stats.ordersByStatus[order.status]++;
    });

    return stats;
  }
}

/**
 * Creates a new order service instance
 * @param paymentService - Payment service dependency
 * @returns OrderService instance
 */
export function createOrderService(paymentService: PaymentService): OrderService {
  return new OrderService(paymentService);
}

/**
 * Order validation utilities
 */
export const OrderValidator = {
  /**
   * Validates order items
   * @param items - Order items to validate
   * @returns True if items are valid
   */
  validateItems: (items: OrderItem[]): boolean => {
    return items.every(item => 
      item.quantity > 0 && 
      item.price > 0 && 
      item.productId.trim().length > 0
    );
  },

  /**
   * Validates shipping address
   * @param address - Shipping address to validate
   * @returns True if address is valid
   */
  validateShippingAddress: (address: Order['shippingAddress']): boolean => {
    return Boolean(
      address.street.trim() &&
      address.city.trim() &&
      address.zipCode.trim() &&
      address.country.trim()
    );
  }
};