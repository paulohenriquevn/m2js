# AI Analyzers Reference

Deep dive into M2JS's AI-enhanced analysis capabilities.

::: warning Current Status
AI analyzer features are temporarily disabled in v1.0.1 while being rebuilt with better TypeScript support. This documentation describes the intended functionality for v2.0.

Core features (code extraction, dependency analysis) remain fully operational.
:::

## Overview

M2JS AI analyzers extract business context and architectural insights from your code, making it more valuable for AI assistants and human developers.

## Available Analyzers

### 1. Business Context Analyzer

**Purpose**: Identifies business domain patterns and terminology

```bash
# Enable business context analysis
m2js src/UserService.ts --business-context
```

**Extracts**:
- Domain identification (e-commerce, finance, healthcare, etc.)
- Business entity recognition
- Workflow pattern detection
- Rule and constraint identification

**Example Output**:
```markdown
## Business Context
**Domain**: E-commerce (95% confidence)
**Framework**: Node.js + Express + TypeScript
**Patterns**: Service Layer, Repository Pattern, Event Sourcing
**Business Rules**:
- Orders require payment validation
- Inventory must be checked before fulfillment
- User authentication required for all operations
```

### 2. Usage Pattern Analyzer

**Purpose**: Extracts common usage patterns and examples

```bash
# Enable usage pattern analysis
m2js src/PaymentService.ts --usage-examples
```

**Extracts**:
- Function call patterns
- Error handling approaches
- Common parameter combinations
- Integration workflows

**Example Output**:
```markdown
## Usage Patterns

### Common Workflows
1. **Payment Processing**: validate → charge → confirm → notify
2. **Error Handling**: try-catch with specific business exceptions
3. **Async Patterns**: Promise-based with proper error propagation

### Example Usage
```typescript
// Typical payment flow
const result = await paymentService.processPayment({
amount: 99.99,
currency: 'USD',
paymentMethod: 'credit_card',
customer: { id: 'user123' }
});
```

### 3. Architecture Analyzer

**Purpose**: Analyzes architectural patterns and design decisions

```bash
# Enable architecture analysis
m2js src/ --architecture-insights
```

**Extracts**:
- Layer architecture detection
- Design pattern identification
- Dependency flow analysis
- SOLID principle compliance

**Example Output**:
```markdown
## Architecture Insights

### Layer Architecture
- **Presentation**: Controllers and API endpoints
- **Business**: Services and domain logic
- **Data**: Repositories and database access
- **Utilities**: Helper functions and cross-cutting concerns

### Design Patterns
- **Repository Pattern**: Data access abstraction
- **Service Layer**: Business logic organization
- **Dependency Injection**: Loose coupling implementation

### Architecture Violations
Direct database access in controller (UserController.ts:45)
Business logic in data layer (UserRepository.ts:123)
```

### 4. Semantic Relationship Analyzer

**Purpose**: Maps business entities and their relationships

```bash
# Enable semantic analysis
m2js src/ --semantic-analysis
```

**Extracts**:
- Entity relationship mapping
- Business process flows
- State transition analysis
- Domain model validation

**Example Output**:
```markdown
## Entity Relationships

### Business Entities
- **User** (Aggregate Root)
- Properties: id, email, profile, preferences
- Operations: register, authenticate, updateProfile
- States: inactive → active → suspended → deleted

- **Order** (Entity)
- Belongs to: User (1:N)
- Contains: OrderItems (1:N)
- States: draft → confirmed → shipped → delivered

### Business Workflows
1. **User Registration**
- Trigger: Registration form submission
- Steps: validate → create → verify email → activate
- Outcomes: Active user account or validation errors

2. **Order Processing**
- Trigger: Checkout button click
- Steps: validate cart → process payment → create order → send confirmation
- Outcomes: Confirmed order or payment failure
```

## Analyzer Configuration

### Enable Individual Analyzers

```bash
# Single analyzer
m2js src/file.ts --business-context
m2js src/file.ts --usage-examples 
m2js src/file.ts --architecture-insights
m2js src/file.ts --semantic-analysis

# Multiple analyzers
m2js src/file.ts --business-context --usage-examples

# All analyzers
m2js src/file.ts --ai-enhanced
```

### Analyzer Options

```bash
# Future configuration options (v2.0)
m2js src/ --ai-enhanced --confidence-threshold 0.8
m2js src/ --business-context --domain healthcare
m2js src/ --architecture-insights --pattern-detection strict
```

## Output Integration

### Enhanced Markdown Structure

When AI analyzers are enabled, M2JS generates enriched documentation:

```markdown
# UserService.ts

## Business Context
[Business domain analysis]

## Architecture Insights 
[Architectural pattern analysis]

## Semantic Relationships
[Entity and workflow mapping]

## Usage Examples
[Common usage patterns]

## Functions
[Standard function documentation]

## Classes
[Standard class documentation]
```

### AI Assistant Integration

The enhanced output is optimized for AI assistants:

```markdown
> **For AI Assistants**: This service handles user authentication in an e-commerce context. 
> Key business rules: rate limiting (5 attempts/hour), password complexity requirements, 
> session management with JWT tokens. Architecture follows clean architecture with 
> dependency injection.
```

## Analysis Algorithms

### Business Domain Detection

```typescript
// Domain classification approach
interface DomainPattern {
domain: string;
keywords: string[];
patterns: string[];
confidence: number;
}

const domains: DomainPattern[] = [
{
domain: 'E-commerce',
keywords: ['cart', 'order', 'payment', 'product', 'customer'],
patterns: ['checkout workflow', 'inventory management'],
confidence: 0.95
},
{
domain: 'Healthcare',
keywords: ['patient', 'diagnosis', 'treatment', 'medical'],
patterns: ['patient records', 'appointment scheduling'],
confidence: 0.90
}
];
```

### Pattern Recognition

```typescript
// Architecture pattern detection
interface ArchitecturePattern {
name: string;
indicators: string[];
violations: string[];
benefits: string[];
}

const patterns = {
'Repository Pattern': {
indicators: ['Repository interface', 'Data access abstraction'],
violations: ['Direct SQL in business logic'],
benefits: ['Testability', 'Data source independence']
}
};
```

### Entity Extraction

```typescript
// Business entity identification
interface BusinessEntity {
name: string;
type: 'aggregate' | 'entity' | 'value-object';
properties: EntityProperty[];
operations: EntityOperation[];
relationships: EntityRelationship[];
}
```

## Performance Considerations

### Analysis Overhead

| Analyzer | Overhead | File Size Impact |
|----------|----------|------------------|
| Business Context | +20% | Small projects: +0.5s |
| Usage Examples | +30% | Medium projects: +1-2s |
| Architecture | +40% | Large projects: +3-5s |
| Semantic Analysis | +50% | Very large: +5-10s |
| All Combined | +100% | 2x processing time |

### Optimization Strategies

```bash
# Selective analysis for performance
m2js src/core/ --business-context # Only core business logic
m2js src/api/ --architecture-insights # Only API layer

# Batch optimization
m2js src/ --ai-enhanced --batch-size 10 # Process in smaller chunks
```

## Accuracy and Confidence

### Confidence Scoring

AI analyzers provide confidence scores for their findings:

```markdown
## Business Context
**Domain**: E-commerce (92% confidence)
**Framework**: Node.js + Express (87% confidence)
**Patterns**: Repository Pattern (95% confidence)
```

### Human Validation

```markdown
> **Review Recommended**: Low confidence detection (< 80%)
> Manual review suggested for business rule identification.
```

## Future Enhancements (v2.0)

### Planned Features

1. **Custom Domain Training**
```bash
m2js --train-domain healthcare ./training-data/
m2js src/ --domain healthcare # Use trained model
```

2. **Pattern Libraries**
```bash
m2js --add-pattern ./custom-patterns.json
m2js src/ --patterns enterprise # Use pattern library
```

3. **Interactive Mode**
```bash
m2js src/ --interactive # Step-by-step analysis with user input
```

4. **Integration APIs**
```typescript
// Programmatic access
import { analyzeBusinessContext } from '@paulohenriquevn/m2js/analyzers';

const result = await analyzeBusinessContext(sourceCode, options);
```

## Troubleshooting

### Common Issues

**Low confidence scores:**
- Increase codebase size for better pattern detection
- Add more descriptive JSDoc comments
- Use consistent naming conventions

**Incorrect domain detection:**
- Use explicit domain hints in comments
- Ensure business logic is clearly separated
- Add domain-specific terminology

**Performance issues:**
- Use selective analysis on specific directories
- Process in smaller batches
- Skip analysis for utility/test files

### Debug Mode

```bash
# Enable analyzer debugging (future feature)
M2JS_ANALYZER_DEBUG=true m2js src/ --ai-enhanced
```

This AI analyzer system transforms raw code into rich, contextual documentation that's invaluable for both human developers and AI assistants.