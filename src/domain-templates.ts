/**
 * Pre-defined domain templates for common business domains
 * These serve as starting points for LLM-guided development
 */

import { DomainTemplate } from './template-types';

/* eslint-disable max-lines */

// === E-COMMERCE DOMAIN ===
export const ecommerceDomain: DomainTemplate = {
  domain: 'E-commerce Platform',
  description:
    'Online retail system with user management, product catalog, shopping cart, and order processing',

  commonEntities: [
    {
      name: 'User',
      type: 'aggregate',
      description:
        'Customer account with authentication and profile management',
      properties: [
        {
          name: 'id',
          type: 'string',
          required: true,
          description: 'Unique user identifier',
          businessMeaning: 'Primary key for customer tracking',
        },
        {
          name: 'email',
          type: 'string',
          required: true,
          description: 'User email address',
          validation: ['email format', 'unique constraint'],
          businessMeaning: 'Login credential and communication channel',
        },
        {
          name: 'firstName',
          type: 'string',
          required: true,
          description: 'Customer first name',
          businessMeaning: 'Personalization and shipping',
        },
        {
          name: 'lastName',
          type: 'string',
          required: true,
          description: 'Customer last name',
          businessMeaning: 'Personalization and shipping',
        },
        {
          name: 'address',
          type: 'Address',
          required: false,
          description: 'Default shipping address',
          businessMeaning: 'Order fulfillment',
        },
        {
          name: 'preferences',
          type: 'UserPreferences',
          required: false,
          description: 'User settings and preferences',
          businessMeaning: 'Personalized shopping experience',
        },
      ],
      behaviors: [
        'authenticate',
        'updateProfile',
        'changePassword',
        'manageAddresses',
      ],
      invariants: [
        'Email must be unique',
        'Password must meet security requirements',
        'Active users must have valid email',
      ],
    },
    {
      name: 'Product',
      type: 'entity',
      description: 'Catalog item with pricing, inventory, and metadata',
      properties: [
        {
          name: 'id',
          type: 'string',
          required: true,
          description: 'Product identifier',
          businessMeaning: 'Catalog reference',
        },
        {
          name: 'name',
          type: 'string',
          required: true,
          description: 'Product name',
          businessMeaning: 'Customer-facing title',
        },
        {
          name: 'description',
          type: 'string',
          required: true,
          description: 'Product description',
          businessMeaning: 'Marketing and SEO content',
        },
        {
          name: 'price',
          type: 'Money',
          required: true,
          description: 'Product price',
          businessMeaning: 'Revenue calculation',
        },
        {
          name: 'inventory',
          type: 'number',
          required: true,
          description: 'Available stock quantity',
          businessMeaning: 'Availability and fulfillment',
        },
        {
          name: 'category',
          type: 'string',
          required: true,
          description: 'Product category',
          businessMeaning: 'Navigation and filtering',
        },
      ],
      behaviors: ['updatePrice', 'adjustInventory', 'activate', 'deactivate'],
      invariants: [
        'Price must be positive',
        'Inventory cannot be negative',
        'Active products must have valid category',
      ],
    },
    {
      name: 'Order',
      type: 'aggregate',
      description:
        'Customer purchase transaction with items, payment, and fulfillment',
      properties: [
        {
          name: 'id',
          type: 'string',
          required: true,
          description: 'Order identifier',
          businessMeaning: 'Transaction tracking',
        },
        {
          name: 'userId',
          type: 'string',
          required: true,
          description: 'Customer reference',
          businessMeaning: 'Order ownership',
        },
        {
          name: 'items',
          type: 'OrderItem[]',
          required: true,
          description: 'Purchased products',
          businessMeaning: 'Order contents and pricing',
        },
        {
          name: 'status',
          type: 'OrderStatus',
          required: true,
          description: 'Order state',
          businessMeaning: 'Fulfillment tracking',
        },
        {
          name: 'total',
          type: 'Money',
          required: true,
          description: 'Order total amount',
          businessMeaning: 'Payment amount',
        },
        {
          name: 'shippingAddress',
          type: 'Address',
          required: true,
          description: 'Delivery address',
          businessMeaning: 'Order fulfillment',
        },
      ],
      behaviors: [
        'addItem',
        'removeItem',
        'calculateTotal',
        'processPayment',
        'ship',
        'cancel',
      ],
      invariants: [
        'Order must have at least one item',
        'Total must match sum of items',
        'Cannot modify shipped orders',
      ],
    },
  ],

  commonWorkflows: [
    {
      name: 'User Registration',
      description:
        'New customer account creation with validation and welcome flow',
      trigger: 'User submits registration form',
      steps: [
        {
          order: 1,
          action: 'Validate Registration Data',
          actor: 'System',
          input: 'Registration form data',
          output: 'Validation result',
          validation: ['Email format', 'Password strength', 'Required fields'],
          businessLogic: 'Check email uniqueness and password requirements',
        },
        {
          order: 2,
          action: 'Create User Account',
          actor: 'User Service',
          input: 'Valid registration data',
          output: 'New User entity',
          validation: ['Database constraints'],
          businessLogic: 'Hash password, generate user ID, set initial state',
        },
        {
          order: 3,
          action: 'Send Welcome Email',
          actor: 'Email Service',
          input: 'User account',
          output: 'Email sent confirmation',
          validation: ['Email service availability'],
          businessLogic: 'Personalized welcome message with account details',
        },
      ],
      outcomes: ['Successful registration', 'Validation error', 'System error'],
      businessRules: [
        'Email must be unique',
        'Password must meet security standards',
        'Welcome email required for new users',
      ],
    },
    {
      name: 'Order Processing',
      description: 'Complete order lifecycle from cart to fulfillment',
      trigger: 'Customer initiates checkout',
      steps: [
        {
          order: 1,
          action: 'Validate Cart Contents',
          actor: 'Order Service',
          input: 'Shopping cart',
          output: 'Cart validation result',
          validation: ['Product availability', 'Inventory levels', 'Pricing'],
          businessLogic:
            'Verify all items are available and prices are current',
        },
        {
          order: 2,
          action: 'Process Payment',
          actor: 'Payment Service',
          input: 'Order total and payment method',
          output: 'Payment confirmation',
          validation: ['Payment method validity', 'Sufficient funds'],
          businessLogic: 'Charge customer and handle payment failures',
        },
        {
          order: 3,
          action: 'Create Order',
          actor: 'Order Service',
          input: 'Validated cart and payment confirmation',
          output: 'New Order entity',
          validation: ['Order data integrity'],
          businessLogic:
            'Generate order ID, reserve inventory, set initial status',
        },
        {
          order: 4,
          action: 'Update Inventory',
          actor: 'Inventory Service',
          input: 'Order items',
          output: 'Inventory update confirmation',
          validation: ['Stock availability'],
          businessLogic: 'Reduce available inventory for ordered items',
        },
      ],
      outcomes: [
        'Order created successfully',
        'Payment failed',
        'Inventory insufficient',
        'System error',
      ],
      businessRules: [
        'Payment must be processed before order creation',
        'Inventory must be reserved upon order',
        'Failed orders do not affect inventory',
      ],
    },
  ],

  commonPatterns: [
    'Repository Pattern for data access',
    'Service Layer for business logic',
    'Domain Events for decoupling',
    'Value Objects for money and addresses',
    'State Machine for order status',
    'Command/Query Separation',
  ],

  architectureRecommendations: {
    pattern: 'Layered Architecture with Domain-Driven Design',
    layers: [
      {
        name: 'Presentation Layer',
        responsibility:
          'HTTP API endpoints, request/response handling, authentication',
        components: ['Controllers', 'DTOs', 'Validators', 'Middleware'],
        dependencies: ['Business Layer'],
        constraints: [
          'No direct database access',
          'Stateless operations',
          'Input validation required',
        ],
      },
      {
        name: 'Business Layer',
        responsibility: 'Domain logic, business rules, workflow orchestration',
        components: [
          'Services',
          'Domain Models',
          'Business Rules',
          'Workflows',
        ],
        dependencies: ['Data Layer'],
        constraints: [
          'Framework agnostic',
          'Rich domain models',
          'Explicit business rules',
        ],
      },
      {
        name: 'Data Layer',
        responsibility: 'Data persistence, external service integration',
        components: [
          'Repositories',
          'Data Models',
          'External APIs',
          'Database',
        ],
        dependencies: [],
        constraints: [
          'Implementation details hidden',
          'Transaction management',
          'Data consistency',
        ],
      },
    ],
    dataFlow: [
      {
        name: 'API Request Flow',
        description: 'Standard request processing pattern',
        steps: ['Controller → Validation → Service → Repository → Database'],
        components: ['Controllers', 'Services', 'Repositories'],
      },
      {
        name: 'Event-Driven Flow',
        description: 'Asynchronous business event handling',
        steps: ['Domain Event → Event Handler → Side Effects'],
        components: ['Domain Models', 'Event Handlers', 'External Services'],
      },
    ],
    errorStrategy: 'Exception-based with custom business exceptions',
    designPrinciples: [
      'Single Responsibility',
      'Dependency Inversion',
      'Domain-Driven Design',
      'CQRS for complex queries',
    ],
  },

  businessRules: [
    'Users must be authenticated for checkout',
    'Orders cannot be modified after payment',
    'Inventory must be available before order confirmation',
    'Price changes do not affect existing orders',
    'Customer data must be protected according to privacy laws',
    'Failed payments require explicit retry mechanism',
  ],
};

// === BLOG/CMS DOMAIN ===
export const blogDomain: DomainTemplate = {
  domain: 'Blog/CMS Platform',
  description:
    'Content management system with authoring, publishing, and reader engagement',

  commonEntities: [
    {
      name: 'Author',
      type: 'entity',
      description: 'Content creator with publishing permissions',
      properties: [
        {
          name: 'id',
          type: 'string',
          required: true,
          description: 'Author identifier',
          businessMeaning: 'Content attribution',
        },
        {
          name: 'username',
          type: 'string',
          required: true,
          description: 'Public author name',
          businessMeaning: 'Byline and SEO',
        },
        {
          name: 'email',
          type: 'string',
          required: true,
          description: 'Contact email',
          businessMeaning: 'Communication and login',
        },
        {
          name: 'bio',
          type: 'string',
          required: false,
          description: 'Author biography',
          businessMeaning: 'Reader engagement',
        },
      ],
      behaviors: ['createPost', 'editPost', 'publishPost', 'updateProfile'],
      invariants: [
        'Username must be unique',
        'Active authors must have valid email',
      ],
    },
    {
      name: 'Post',
      type: 'aggregate',
      description:
        'Blog article with content, metadata, and engagement tracking',
      properties: [
        {
          name: 'id',
          type: 'string',
          required: true,
          description: 'Post identifier',
          businessMeaning: 'Content reference',
        },
        {
          name: 'title',
          type: 'string',
          required: true,
          description: 'Post title',
          businessMeaning: 'SEO and navigation',
        },
        {
          name: 'content',
          type: 'string',
          required: true,
          description: 'Post content (markdown)',
          businessMeaning: 'Main article content',
        },
        {
          name: 'authorId',
          type: 'string',
          required: true,
          description: 'Author reference',
          businessMeaning: 'Content attribution',
        },
        {
          name: 'status',
          type: 'PostStatus',
          required: true,
          description: 'Publication status',
          businessMeaning: 'Content visibility',
        },
        {
          name: 'tags',
          type: 'string[]',
          required: false,
          description: 'Content tags',
          businessMeaning: 'Categorization and discovery',
        },
      ],
      behaviors: ['edit', 'publish', 'unpublish', 'addTag', 'removeTag'],
      invariants: [
        'Published posts must have title and content',
        'Only authors can edit their posts',
      ],
    },
  ],

  commonWorkflows: [
    {
      name: 'Content Publishing',
      description: 'Author creates and publishes content',
      trigger: 'Author submits post for publication',
      steps: [
        {
          order: 1,
          action: 'Validate Content',
          actor: 'Content Service',
          input: 'Post draft',
          output: 'Validation result',
          validation: [
            'Required fields',
            'Content length',
            'Format validation',
          ],
          businessLogic: 'Ensure post meets publication standards',
        },
        {
          order: 2,
          action: 'Generate SEO Metadata',
          actor: 'SEO Service',
          input: 'Post content',
          output: 'SEO metadata',
          validation: ['Title length', 'Description length'],
          businessLogic: 'Auto-generate meta description and tags',
        },
        {
          order: 3,
          action: 'Publish Post',
          actor: 'Content Service',
          input: 'Validated post with metadata',
          output: 'Published post',
          validation: ['Author permissions'],
          businessLogic: 'Make content publicly available',
        },
      ],
      outcomes: [
        'Post published successfully',
        'Validation failed',
        'Permission denied',
      ],
      businessRules: [
        'Only authenticated authors can publish',
        'Posts must have title and content',
        'Published posts are immediately public',
      ],
    },
  ],

  commonPatterns: [
    'Repository Pattern for content storage',
    'Strategy Pattern for content rendering',
    'Observer Pattern for notifications',
    'Decorator Pattern for content processing',
  ],

  architectureRecommendations: {
    pattern: 'MVC with Service Layer',
    layers: [
      {
        name: 'Presentation Layer',
        responsibility: 'Web interface, API endpoints, user interaction',
        components: ['Controllers', 'Views', 'API Routes'],
        dependencies: ['Service Layer'],
        constraints: ['Stateless', 'User authentication required'],
      },
      {
        name: 'Service Layer',
        responsibility:
          'Business logic, content processing, workflow management',
        components: ['Content Service', 'Author Service', 'SEO Service'],
        dependencies: ['Data Layer'],
        constraints: ['Business rule enforcement', 'Transaction management'],
      },
      {
        name: 'Data Layer',
        responsibility: 'Content storage, search indexing, file management',
        components: ['Repositories', 'Search Index', 'File Storage'],
        dependencies: [],
        constraints: ['Data consistency', 'Full-text search capability'],
      },
    ],
    dataFlow: [
      {
        name: 'Content Creation Flow',
        description: 'Author creates and publishes content',
        steps: [
          'Author Input → Validation → Processing → Storage → Publication',
        ],
        components: ['Controllers', 'Content Service', 'Repository'],
      },
    ],
    errorStrategy: 'Graceful degradation with user-friendly messages',
    designPrinciples: [
      'Content-first design',
      'SEO optimization',
      'Performance-focused',
    ],
  },

  businessRules: [
    'Content must be reviewed before publication',
    'Authors can only edit their own content',
    'Published content has permanent URLs',
    'Content versioning for draft management',
  ],
};

// === REST API DOMAIN ===
export const apiDomain: DomainTemplate = {
  domain: 'REST API Service',
  description:
    'HTTP API service with authentication, data processing, and external integrations',

  commonEntities: [
    {
      name: 'ApiKey',
      type: 'value-object',
      description: 'API authentication credential',
      properties: [
        {
          name: 'key',
          type: 'string',
          required: true,
          description: 'API key value',
          businessMeaning: 'Authentication token',
        },
        {
          name: 'permissions',
          type: 'string[]',
          required: true,
          description: 'Allowed operations',
          businessMeaning: 'Access control',
        },
        {
          name: 'expiresAt',
          type: 'Date',
          required: false,
          description: 'Expiration date',
          businessMeaning: 'Security lifecycle',
        },
      ],
      behaviors: ['validate', 'hasPermission', 'isExpired'],
      invariants: ['API key must be unique', 'Permissions must be valid'],
    },
  ],

  commonWorkflows: [
    {
      name: 'API Request Processing',
      description: 'Standard API request lifecycle',
      trigger: 'HTTP request received',
      steps: [
        {
          order: 1,
          action: 'Authenticate Request',
          actor: 'Auth Middleware',
          input: 'HTTP request with credentials',
          output: 'Authentication result',
          validation: ['API key format', 'Key validity', 'Rate limits'],
          businessLogic: 'Verify API key and check permissions',
        },
        {
          order: 2,
          action: 'Validate Input',
          actor: 'Validation Middleware',
          input: 'Request body and parameters',
          output: 'Validated data',
          validation: ['Schema validation', 'Required fields', 'Data types'],
          businessLogic: 'Ensure request meets API contract',
        },
        {
          order: 3,
          action: 'Process Business Logic',
          actor: 'Service Layer',
          input: 'Validated request data',
          output: 'Business result',
          validation: ['Business rules', 'Data constraints'],
          businessLogic: 'Execute core functionality',
        },
        {
          order: 4,
          action: 'Format Response',
          actor: 'Response Formatter',
          input: 'Business result',
          output: 'HTTP response',
          validation: ['Response schema'],
          businessLogic: 'Convert to API response format',
        },
      ],
      outcomes: [
        'Success response',
        'Validation error',
        'Authentication error',
        'Business logic error',
        'System error',
      ],
      businessRules: [
        'All requests must be authenticated',
        'Responses must follow API specification',
        'Errors must include helpful messages',
      ],
    },
  ],

  commonPatterns: [
    'Middleware Pipeline for request processing',
    'Repository Pattern for data access',
    'Factory Pattern for response creation',
    'Chain of Responsibility for validation',
  ],

  architectureRecommendations: {
    pattern: 'Hexagonal Architecture',
    layers: [
      {
        name: 'API Layer',
        responsibility:
          'HTTP handling, routing, middleware, response formatting',
        components: ['Controllers', 'Middleware', 'Routes', 'Validators'],
        dependencies: ['Application Layer'],
        constraints: [
          'Stateless',
          'RESTful conventions',
          'Proper HTTP status codes',
        ],
      },
      {
        name: 'Application Layer',
        responsibility: 'Use cases, business workflows, service orchestration',
        components: ['Services', 'Use Cases', 'DTOs'],
        dependencies: ['Domain Layer'],
        constraints: ['Framework independent', 'Transaction boundaries'],
      },
      {
        name: 'Domain Layer',
        responsibility: 'Business entities, domain logic, business rules',
        components: ['Entities', 'Value Objects', 'Domain Services'],
        dependencies: [],
        constraints: ['Pure business logic', 'No external dependencies'],
      },
      {
        name: 'Infrastructure Layer',
        responsibility: 'Database, external APIs, file system, messaging',
        components: ['Repositories', 'External Services', 'Database'],
        dependencies: ['Domain Layer'],
        constraints: ['Implementation details hidden', 'Dependency injection'],
      },
    ],
    dataFlow: [
      {
        name: 'Request Processing Pipeline',
        description: 'HTTP request to response flow',
        steps: ['Middleware → Controller → Service → Repository → Database'],
        components: ['Middleware', 'Controllers', 'Services', 'Repositories'],
      },
    ],
    errorStrategy: 'Structured error responses with proper HTTP status codes',
    designPrinciples: [
      'API-first design',
      'Idempotency',
      'Versioning strategy',
      'Rate limiting',
    ],
  },

  businessRules: [
    'API versioning for backward compatibility',
    'Rate limiting per API key',
    'Consistent error response format',
    'Request/response logging for debugging',
    'Graceful handling of external service failures',
  ],
};

// Export all domain templates
export const domainTemplates: Record<string, DomainTemplate> = {
  ecommerce: ecommerceDomain,
  blog: blogDomain,
  api: apiDomain,
};

// Available domain list for CLI
export const availableDomains = Object.keys(domainTemplates);
