/**
 * REST API Authentication Service
 * Perfect for testing API domain templates
 */

export interface ApiKey {
  key: string;
  permissions: string[];
  expiresAt?: Date;
  createdAt: Date;
  lastUsed?: Date;
}

export interface AuthRequest {
  apiKey: string;
  endpoint: string;
  method: string;
  timestamp: Date;
}

export interface AuthResult {
  success: boolean;
  permissions: string[];
  rateLimitRemaining: number;
  error?: string;
}

/**
 * API Authentication service
 * Handles API key validation and rate limiting
 */
export class ApiAuthService {
  private apiKeys = new Map<string, ApiKey>();
  private rateLimits = new Map<string, { count: number; resetTime: Date }>();

  /**
   * Create new API key with permissions
   * Business rule: API keys must have at least one permission
   */
  createApiKey(permissions: string[], expiresInDays?: number): ApiKey {
    if (permissions.length === 0) {
      throw new Error('API key must have at least one permission');
    }

    const key = this.generateApiKey();
    const apiKey: ApiKey = {
      key,
      permissions: [...permissions],
      expiresAt: expiresInDays ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000) : undefined,
      createdAt: new Date()
    };

    this.apiKeys.set(key, apiKey);
    return apiKey;
  }

  /**
   * Authenticate API request
   * Business workflow: Validate key, check permissions, apply rate limiting
   */
  authenticate(request: AuthRequest): AuthResult {
    // Step 1: Validate API key exists
    const apiKey = this.apiKeys.get(request.apiKey);
    if (!apiKey) {
      return {
        success: false,
        permissions: [],
        rateLimitRemaining: 0,
        error: 'Invalid API key'
      };
    }

    // Step 2: Check expiration
    if (apiKey.expiresAt && apiKey.expiresAt < new Date()) {
      return {
        success: false,
        permissions: [],
        rateLimitRemaining: 0,
        error: 'API key expired'
      };
    }

    // Step 3: Check rate limits
    const rateLimitResult = this.checkRateLimit(request.apiKey);
    if (!rateLimitResult.allowed) {
      return {
        success: false,
        permissions: apiKey.permissions,
        rateLimitRemaining: 0,
        error: 'Rate limit exceeded'
      };
    }

    // Step 4: Check endpoint permissions
    const requiredPermission = this.getRequiredPermission(request.endpoint, request.method);
    if (requiredPermission && !apiKey.permissions.includes(requiredPermission)) {
      return {
        success: false,
        permissions: apiKey.permissions,
        rateLimitRemaining: rateLimitResult.remaining,
        error: 'Insufficient permissions'
      };
    }

    // Step 5: Update usage tracking
    apiKey.lastUsed = new Date();
    this.updateRateLimit(request.apiKey);

    return {
      success: true,
      permissions: apiKey.permissions,
      rateLimitRemaining: rateLimitResult.remaining - 1
    };
  }

  /**
   * Validate API key format
   * Security: Ensure key meets complexity requirements
   */
  validateApiKeyFormat(key: string): boolean {
    // API key format: 32 characters, alphanumeric
    return /^[a-zA-Z0-9]{32}$/.test(key);
  }

  /**
   * Revoke API key
   * Security: Immediate revocation for compromised keys
   */
  revokeApiKey(key: string): boolean {
    return this.apiKeys.delete(key);
  }

  /**
   * Get API key usage statistics
   */
  getApiKeyStats(key: string): {
    createdAt: Date;
    lastUsed?: Date;
    requestCount: number;
    permissions: string[];
  } | null {
    const apiKey = this.apiKeys.get(key);
    if (!apiKey) return null;

    return {
      createdAt: apiKey.createdAt,
      lastUsed: apiKey.lastUsed,
      requestCount: this.getRateLimit(key)?.count || 0,
      permissions: apiKey.permissions
    };
  }

  /**
   * Check rate limit for API key
   * Business rule: 1000 requests per hour per API key
   */
  private checkRateLimit(apiKey: string): { allowed: boolean; remaining: number } {
    const limit = this.rateLimits.get(apiKey);
    const maxRequests = 1000;
    const windowMinutes = 60;

    if (!limit) {
      return { allowed: true, remaining: maxRequests - 1 };
    }

    // Reset if window expired
    if (limit.resetTime < new Date()) {
      this.rateLimits.set(apiKey, {
        count: 0,
        resetTime: new Date(Date.now() + windowMinutes * 60 * 1000)
      });
      return { allowed: true, remaining: maxRequests - 1 };
    }

    const remaining = maxRequests - limit.count;
    return {
      allowed: remaining > 0,
      remaining: Math.max(0, remaining)
    };
  }

  private updateRateLimit(apiKey: string): void {
    const existing = this.rateLimits.get(apiKey);
    if (existing) {
      existing.count++;
    } else {
      this.rateLimits.set(apiKey, {
        count: 1,
        resetTime: new Date(Date.now() + 60 * 60 * 1000) // 1 hour
      });
    }
  }

  private getRateLimit(apiKey: string) {
    return this.rateLimits.get(apiKey);
  }

  private generateApiKey(): string {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  private getRequiredPermission(endpoint: string, method: string): string | null {
    // Simplified permission mapping
    if (endpoint.includes('/admin/')) return 'admin';
    if (method === 'POST' || method === 'PUT' || method === 'DELETE') return 'write';
    if (method === 'GET') return 'read';
    return null;
  }
}

/**
 * Middleware for Express.js API authentication
 */
export function createAuthMiddleware(authService: ApiAuthService) {
  return (req: any, res: any, next: any) => {
    const apiKey = req.headers['x-api-key'] || req.query.api_key;
    
    if (!apiKey) {
      return res.status(401).json({ error: 'API key required' });
    }

    const authResult = authService.authenticate({
      apiKey,
      endpoint: req.path,
      method: req.method,
      timestamp: new Date()
    });

    if (!authResult.success) {
      return res.status(401).json({ error: authResult.error });
    }

    // Add auth info to request
    req.auth = {
      permissions: authResult.permissions,
      rateLimitRemaining: authResult.rateLimitRemaining
    };

    // Add rate limit headers
    res.set({
      'X-RateLimit-Remaining': authResult.rateLimitRemaining.toString(),
      'X-RateLimit-Reset': new Date(Date.now() + 60 * 60 * 1000).toISOString()
    });

    next();
  };
}