/**
 * M2JS Template Generator Engine
 * Generates LLM-friendly specification documents for code implementation
 */

/* eslint-disable max-lines */
/* eslint-disable max-lines-per-function */

import {
  ComponentSpec,
  TemplateOptions,
  ExportSpec,
  ImplementationGuide,
  BusinessLogicSpec,
} from './template-types';
import { domainTemplates, availableDomains } from './domain-templates';
// import path from 'path'; // Currently unused

/**
 * Main template generator class
 */
export class TemplateGenerator {
  /**
   * Generates a specification template for a component
   */
  generateTemplate(options: TemplateOptions): string {
    if (!availableDomains.includes(options.domain)) {
      throw new Error(
        `Domain '${options.domain}' not supported. Available domains: ${availableDomains.join(', ')}`
      );
    }

    const domainTemplate = domainTemplates[options.domain];
    const componentSpec = this.createComponentSpec(options, domainTemplate);

    return this.generateMarkdownTemplate(componentSpec, options);
  }

  /**
   * Lists available domains and their descriptions
   */
  listDomains(): string {
    const sections: string[] = [];

    sections.push('# 🎯 Available Domain Templates');
    sections.push('');
    sections.push(
      'Choose a domain template to guide your LLM-assisted development:'
    );
    sections.push('');

    Object.entries(domainTemplates).forEach(([key, template]) => {
      sections.push(`## ${key}`);
      sections.push(`**Domain**: ${template.domain}`);
      sections.push(`**Description**: ${template.description}`);
      sections.push('');
      sections.push('**Common Entities**:');
      template.commonEntities.forEach(entity => {
        sections.push(
          `- **${entity.name}** (${entity.type}): ${entity.description}`
        );
      });
      sections.push('');
      sections.push('**Common Workflows**:');
      template.commonWorkflows.forEach(workflow => {
        sections.push(`- **${workflow.name}**: ${workflow.description}`);
      });
      sections.push('');
      sections.push('---');
      sections.push('');
    });

    return sections.join('\n');
  }

  /**
   * Creates component specification based on options and domain template
   */
  private createComponentSpec(
    options: TemplateOptions,
    domainTemplate: any
  ): ComponentSpec {
    // Find matching entity in domain template
    const domainEntity = domainTemplate.commonEntities.find(
      (entity: unknown) =>
        entity.name.toLowerCase() === options.component.toLowerCase()
    );

    if (!domainEntity) {
      return this.createGenericComponentSpec(options, domainTemplate);
    }

    return this.createEntityBasedComponentSpec(
      options,
      domainTemplate,
      domainEntity
    );
  }

  /**
   * Creates generic component spec when no domain entity match
   */
  private createGenericComponentSpec(
    options: TemplateOptions,
    _domainTemplate: any
  ): ComponentSpec {
    const componentName = this.capitalizeFirst(options.component);

    return {
      type: this.inferComponentType(options.component),
      name: componentName,
      description: `${componentName} component for the business domain`,
      businessPurpose: `Handle ${options.component.toLowerCase()} operations within the system`,
      category: {
        layer: this.inferLayer(options.component),
        pattern: this.inferPattern(options.component) as any,
        domain: 'Business Domain',
      },
      dependencies: this.inferDependencies(options.component),
      exports: this.createGenericExports(componentName),
      implementation: this.createImplementationGuide(componentName),
    };
  }

  /**
   * Creates component spec based on domain entity
   */
  private createEntityBasedComponentSpec(
    _options: TemplateOptions,
    _domainTemplate: any,
    domainEntity: any
  ): ComponentSpec {
    return {
      type: 'class',
      name: domainEntity.name,
      description: domainEntity.description,
      businessPurpose: `Implements ${domainEntity.name} entity with business logic and state management`,
      category: {
        layer: 'business',
        pattern: domainEntity.type,
        domain: 'Business Domain',
      },
      dependencies: this.extractEntityDependencies(domainEntity),
      exports: this.createEntityExports(domainEntity),
      implementation: this.createEntityImplementationGuide(domainEntity),
    };
  }

  /**
   * Generates the final markdown template
   */
  private generateMarkdownTemplate(
    spec: ComponentSpec,
    options: TemplateOptions
  ): string {
    const sections: string[] = [];

    // Header
    const fileName = `${spec.name}.ts`;
    const filePath =
      options.output || `./src/${this.inferDirectory(spec)}/${fileName}`;
    sections.push(`# 📁 ${filePath}`);
    sections.push('');
    sections.push('> **🤖 LLM IMPLEMENTATION GUIDE**');
    sections.push(
      '> This is a specification template for AI-guided development.'
    );
    sections.push(
      '> Follow the structure and business rules to implement the component.'
    );
    sections.push('');

    // Business Context
    if (options.businessContext !== false) {
      sections.push(this.generateBusinessContextSection(spec, options));
      sections.push('');
    }

    // Component Overview
    sections.push(this.generateComponentOverviewSection(spec));
    sections.push('');

    // Exports Section (Functions/Classes to implement)
    sections.push(this.generateExportsSection(spec));
    sections.push('');

    // Implementation Guide
    if (options.architectureGuide !== false) {
      sections.push(this.generateImplementationSection(spec));
      sections.push('');
    }

    // Usage Examples
    if (options.examples !== false) {
      sections.push(this.generateUsageExamplesSection(spec));
      sections.push('');
    }

    // Testing Guide
    if (options.testingGuide !== false) {
      sections.push(this.generateTestingSection(spec));
    }

    return sections.join('\n');
  }

  /**
   * Generates business context section
   */
  private generateBusinessContextSection(
    spec: ComponentSpec,
    _options: TemplateOptions
  ): string {
    const sections: string[] = [];

    sections.push('## 🎯 Business Context');
    sections.push(`**Domain**: ${spec.category.domain}`);
    sections.push(
      `**Component Type**: ${spec.type} (${spec.category.pattern})`
    );
    sections.push(`**Layer**: ${spec.category.layer}`);
    sections.push(`**Business Purpose**: ${spec.businessPurpose}`);

    if (spec.dependencies.length > 0) {
      sections.push('');
      sections.push('**Dependencies**:');
      spec.dependencies.forEach(dep => {
        sections.push(`- ${dep}`);
      });
    }

    return sections.join('\n');
  }

  /**
   * Generates component overview section
   */
  private generateComponentOverviewSection(spec: ComponentSpec): string {
    const sections: string[] = [];

    sections.push('## 📋 Component Overview');
    sections.push(`**Name**: ${spec.name}`);
    sections.push(`**Description**: ${spec.description}`);
    sections.push('');
    sections.push('### 📦 Exports to Implement');
    sections.push(
      `This component should export ${spec.exports.length} item(s):`
    );

    spec.exports.forEach(exp => {
      sections.push(`- **${exp.name}** (${exp.type}): ${exp.purpose}`);
    });

    return sections.join('\n');
  }

  /**
   * Generates exports section with detailed specifications
   */
  private generateExportsSection(spec: ComponentSpec): string {
    const sections: string[] = [];

    // Group exports by type
    const functions = spec.exports.filter(e => e.type === 'function');
    const classes = spec.exports.filter(e => e.type === 'class');
    const interfaces = spec.exports.filter(e => e.type === 'interface');

    if (functions.length > 0) {
      sections.push('## 🔧 Functions to Implement');
      sections.push('');
      functions.forEach(func => {
        sections.push(this.generateFunctionSpec(func));
        sections.push('');
      });
    }

    if (classes.length > 0) {
      sections.push('## 🏗️ Classes to Implement');
      sections.push('');
      classes.forEach(cls => {
        sections.push(this.generateClassSpec(cls));
        sections.push('');
      });
    }

    if (interfaces.length > 0) {
      sections.push('## 📋 Interfaces to Implement');
      sections.push('');
      interfaces.forEach(iface => {
        sections.push(this.generateInterfaceSpec(iface));
        sections.push('');
      });
    }

    return sections.join('\n');
  }

  /**
   * Generates function specification
   */
  private generateFunctionSpec(func: ExportSpec): string {
    const sections: string[] = [];

    sections.push(`### ${func.name}`);
    sections.push(`**Purpose**: ${func.purpose}`);
    sections.push('');

    if (func.parameters && func.parameters.length > 0) {
      sections.push('**Parameters**:');
      func.parameters.forEach(param => {
        const required = param.required ? '' : '?';
        sections.push(
          `- **${param.name}${required}**: \`${param.type}\` - ${param.description}`
        );
        if (param.businessMeaning) {
          sections.push(`  - *Business meaning*: ${param.businessMeaning}`);
        }
        if (param.validation && param.validation.length > 0) {
          sections.push(`  - *Validation*: ${param.validation.join(', ')}`);
        }
      });
      sections.push('');
    }

    if (func.returnType) {
      sections.push(`**Returns**: \`${func.returnType}\``);
      sections.push('');
    }

    if (func.businessRules && func.businessRules.length > 0) {
      sections.push('**Business Rules**:');
      func.businessRules.forEach(rule => {
        sections.push(`- ${rule}`);
      });
      sections.push('');
    }

    sections.push('**Implementation Signature**:');
    sections.push('```typescript');
    sections.push(func.signature);
    sections.push('```');

    return sections.join('\n');
  }

  /**
   * Generates class specification
   */
  private generateClassSpec(cls: ExportSpec): string {
    const sections: string[] = [];

    sections.push(`### ${cls.name}`);
    sections.push(`**Purpose**: ${cls.purpose}`);
    sections.push('');

    if (cls.businessRules && cls.businessRules.length > 0) {
      sections.push('**Business Rules**:');
      cls.businessRules.forEach(rule => {
        sections.push(`- ${rule}`);
      });
      sections.push('');
    }

    sections.push('**Implementation Template**:');
    sections.push('```typescript');
    sections.push(cls.signature);
    sections.push('```');

    return sections.join('\n');
  }

  /**
   * Generates interface specification
   */
  private generateInterfaceSpec(iface: ExportSpec): string {
    const sections: string[] = [];

    sections.push(`### ${iface.name}`);
    sections.push(`**Purpose**: ${iface.purpose}`);
    sections.push('');

    sections.push('**Interface Definition**:');
    sections.push('```typescript');
    sections.push(iface.signature);
    sections.push('```');

    return sections.join('\n');
  }

  /**
   * Generates implementation guide section
   */
  private generateImplementationSection(spec: ComponentSpec): string {
    const sections: string[] = [];

    sections.push('## 🔨 Implementation Guide');
    sections.push(`**Approach**: ${spec.implementation.approach}`);
    sections.push('');

    if (spec.implementation.keyConsiderations.length > 0) {
      sections.push('**Key Considerations**:');
      spec.implementation.keyConsiderations.forEach(consideration => {
        sections.push(`- ${consideration}`);
      });
      sections.push('');
    }

    if (spec.implementation.businessLogic.length > 0) {
      sections.push('**Business Logic Implementation**:');
      spec.implementation.businessLogic.forEach((logic, index) => {
        sections.push(`${index + 1}. **${logic.rule}**`);
        sections.push(`   - Implementation: ${logic.implementation}`);
        sections.push(`   - Validation: ${logic.validation}`);
        if (logic.edge_cases.length > 0) {
          sections.push(`   - Edge cases: ${logic.edge_cases.join(', ')}`);
        }
      });
      sections.push('');
    }

    sections.push('**Error Handling**:');
    sections.push(`- Strategy: ${spec.implementation.errorHandling.strategy}`);
    if (spec.implementation.errorHandling.errorTypes.length > 0) {
      sections.push(
        `- Error types: ${spec.implementation.errorHandling.errorTypes.join(', ')}`
      );
    }

    return sections.join('\n');
  }

  /**
   * Generates usage examples section
   */
  private generateUsageExamplesSection(spec: ComponentSpec): string {
    const sections: string[] = [];

    sections.push('## 📖 Usage Examples');
    sections.push('');
    sections.push(
      '> **Note**: These are example usage patterns to guide implementation'
    );
    sections.push('');

    spec.exports.forEach(exp => {
      if (exp.examples && exp.examples.length > 0) {
        sections.push(`### ${exp.name} Usage`);
        exp.examples.forEach(example => {
          sections.push(`**${example.scenario}**:`);
          sections.push('```typescript');
          sections.push(example.code);
          sections.push('```');
          sections.push(`*${example.description}*`);
          sections.push(`*Expected: ${example.expectedBehavior}*`);
          sections.push('');
        });
      }
    });

    return sections.join('\n');
  }

  /**
   * Generates testing section
   */
  private generateTestingSection(spec: ComponentSpec): string {
    const sections: string[] = [];

    sections.push('## 🧪 Testing Guide');
    sections.push(
      `**Testing Approach**: ${spec.implementation.testing.approach}`
    );
    sections.push('');

    if (spec.implementation.testing.scenarios.length > 0) {
      sections.push('**Test Scenarios**:');
      spec.implementation.testing.scenarios.forEach(scenario => {
        sections.push(`- **${scenario.name}**: ${scenario.description}`);
        sections.push(`  - Input: \`${scenario.input}\``);
        sections.push(`  - Expected: \`${scenario.expectedOutput}\``);
        sections.push(`  - Validation: ${scenario.businessValidation}`);
      });
      sections.push('');
    }

    sections.push(
      `**Mocking Strategy**: ${spec.implementation.testing.mockingStrategy}`
    );

    return sections.join('\n');
  }

  // Utility methods for type inference and component creation

  private capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  private inferComponentType(component: string): ComponentSpec['type'] {
    const name = component.toLowerCase();
    if (name.includes('service')) return 'service';
    if (name.includes('controller')) return 'controller';
    if (name.includes('model') || name.includes('entity')) return 'class';
    if (name.endsWith('s') && !name.includes('service')) return 'class'; // Plural suggests entity
    return 'class';
  }

  private inferLayer(
    component: string
  ): 'presentation' | 'business' | 'data' | 'utility' {
    const name = component.toLowerCase();
    if (name.includes('controller') || name.includes('route'))
      return 'presentation';
    if (name.includes('service') || name.includes('manager')) return 'business';
    if (name.includes('repository') || name.includes('model')) return 'data';
    if (name.includes('util') || name.includes('helper')) return 'utility';
    return 'business';
  }

  private inferPattern(component: string): string {
    const name = component.toLowerCase();
    if (name.includes('service')) return 'service';
    if (name.includes('controller')) return 'controller';
    if (name.includes('repository')) return 'repository';
    return 'entity';
  }

  private inferDirectory(spec: ComponentSpec): string {
    switch (spec.category.layer) {
      case 'presentation':
        return 'controllers';
      case 'business':
        return spec.type === 'service' ? 'services' : 'models';
      case 'data':
        return 'repositories';
      case 'utility':
        return 'utils';
      default:
        return 'lib';
    }
  }

  private inferDependencies(component: string): string[] {
    const dependencies: string[] = [];
    const name = component.toLowerCase();

    if (name.includes('service')) {
      dependencies.push('Repository interface', 'Domain entities');
    }
    if (name.includes('controller')) {
      dependencies.push('Service layer', 'DTOs', 'Validation middleware');
    }
    if (name.includes('model') || name.includes('entity')) {
      dependencies.push('Value objects', 'Business rules');
    }

    return dependencies;
  }

  private extractEntityDependencies(entity: unknown): string[] {
    const dependencies: string[] = [];

    // Add dependencies based on entity properties
    entity.properties.forEach((prop: unknown) => {
      if (
        prop.type !== 'string' &&
        prop.type !== 'number' &&
        prop.type !== 'boolean' &&
        prop.type !== 'Date'
      ) {
        dependencies.push(prop.type);
      }
    });

    return Array.from(new Set(dependencies));
  }

  private createGenericExports(componentName: string): ExportSpec[] {
    const exports: ExportSpec[] = [];

    if (componentName.toLowerCase().includes('service')) {
      exports.push({
        type: 'class',
        name: componentName,
        signature: `export class ${componentName} {\n  // Implementation here\n}`,
        purpose: `Main ${componentName.toLowerCase()} implementation with business logic`,
        businessRules: [
          `${componentName} must handle business operations`,
          'Error handling required for all operations',
        ],
      });
    } else {
      exports.push({
        type: 'class',
        name: componentName,
        signature: `export class ${componentName} {\n  // Properties and methods here\n}`,
        purpose: `${componentName} entity with data and behavior`,
        businessRules: [
          `${componentName} must maintain data integrity`,
          'Business invariants must be enforced',
        ],
      });

      exports.push({
        type: 'function',
        name: `create${componentName}`,
        signature: `export function create${componentName}(data: Create${componentName}Data): ${componentName}`,
        purpose: `Factory function to create new ${componentName} instances`,
        parameters: [
          {
            name: 'data',
            type: `Create${componentName}Data`,
            required: true,
            description: `Data needed to create a new ${componentName}`,
            businessMeaning:
              'Input validation and business rule enforcement point',
          },
        ],
        returnType: componentName,
        businessRules: [
          `Input data must be validated`,
          `Business rules must be enforced during creation`,
        ],
        examples: [
          {
            scenario: `Create new ${componentName}`,
            code: `const new${componentName} = create${componentName}({\n  // required data here\n});`,
            description: `Creates a new ${componentName} instance with validation`,
            expectedBehavior: `Returns valid ${componentName} instance or throws validation error`,
          },
        ],
      });
    }

    return exports;
  }

  private createEntityExports(entity: unknown): ExportSpec[] {
    const exports: ExportSpec[] = [];

    // Main entity class
    const classSignature = this.generateEntityClassSignature(entity);
    exports.push({
      type: 'class',
      name: entity.name,
      signature: classSignature,
      purpose: entity.description,
      businessRules: entity.invariants || [],
    });

    // Factory function
    exports.push({
      type: 'function',
      name: `create${entity.name}`,
      signature: `export function create${entity.name}(data: Create${entity.name}Data): Promise<${entity.name}>`,
      purpose: `Creates new ${entity.name} with validation and business rules`,
      parameters: [
        {
          name: 'data',
          type: `Create${entity.name}Data`,
          required: true,
          description: `Data required to create ${entity.name}`,
          businessMeaning:
            'Enforces business rules and validation during creation',
          validation: [
            'Required field validation',
            'Business rule validation',
            'Data format validation',
          ],
        },
      ],
      returnType: `Promise<${entity.name}>`,
      businessRules: entity.invariants || [],
      examples: [
        {
          scenario: `Create new ${entity.name}`,
          code: `const ${entity.name.toLowerCase()} = await create${entity.name}({\n  ${this.generateExampleData(entity)}\n});`,
          description: `Creates a new ${entity.name} with proper validation`,
          expectedBehavior: `Returns valid ${entity.name} instance or throws business rule violation`,
        },
      ],
    });

    // Interface for creation data
    exports.push({
      type: 'interface',
      name: `Create${entity.name}Data`,
      signature: this.generateCreateDataInterface(entity),
      purpose: `Type definition for ${entity.name} creation data`,
    });

    return exports;
  }

  private generateEntityClassSignature(entity: unknown): string {
    const sections: string[] = [];

    sections.push(`export class ${entity.name} {`);

    // Constructor
    sections.push('  constructor(data: EntityData) {');
    sections.push('    // Initialize properties and validate business rules');
    sections.push('  }');
    sections.push('');

    // Methods based on behaviors
    if (entity.behaviors && entity.behaviors.length > 0) {
      entity.behaviors.forEach((behavior: string) => {
        const methodName = behavior;
        const returnType = this.inferMethodReturnType(behavior);
        const params = this.inferMethodParameters(behavior, entity);

        sections.push(`  ${methodName}(${params}): ${returnType} {`);
        sections.push('    // Implement business logic');
        sections.push('  }');
        sections.push('');
      });
    }

    sections.push('}');

    return sections.join('\n');
  }

  private generateCreateDataInterface(entity: unknown): string {
    const sections: string[] = [];

    sections.push(`export interface Create${entity.name}Data {`);

    entity.properties.forEach((prop: unknown) => {
      const optional = prop.required ? '' : '?';
      sections.push(
        `  ${prop.name}${optional}: ${prop.type}; // ${prop.description}`
      );
    });

    sections.push('}');

    return sections.join('\n');
  }

  private generateExampleData(entity: unknown): string {
    return entity.properties
      .filter((prop: unknown) => prop.required)
      .map(
        (prop: unknown) =>
          `  ${prop.name}: ${this.generateExampleValue(prop.type)}`
      )
      .join(',\n');
  }

  private generateExampleValue(type: string): string {
    switch (type.toLowerCase()) {
      case 'string':
        return '"example"';
      case 'number':
        return '123';
      case 'boolean':
        return 'true';
      case 'date':
        return 'new Date()';
      default:
        return `{} // ${type} instance`;
    }
  }

  private inferMethodReturnType(behavior: string): string {
    if (behavior.includes('validate') || behavior.includes('check'))
      return 'boolean';
    if (behavior.includes('get') || behavior.includes('find'))
      return 'string | null';
    if (behavior.includes('update') || behavior.includes('change'))
      return 'void';
    return 'void';
  }

  private inferMethodParameters(behavior: string, entity: unknown): string {
    if (behavior.includes('update') || behavior.includes('change')) {
      return `updates: Partial<${entity.name}>`;
    }
    if (behavior.includes('validate') || behavior.includes('check')) {
      return 'value: string';
    }
    return '';
  }

  private createImplementationGuide(
    componentName: string
  ): ImplementationGuide {
    return {
      approach: 'Domain-driven design with layered architecture',
      keyConsiderations: [
        'Follow business rules strictly',
        'Implement proper error handling',
        'Ensure data validation at boundaries',
        'Maintain separation of concerns',
      ],
      businessLogic: [
        {
          rule: `${componentName} must validate all inputs`,
          implementation:
            'Use validation decorators or explicit validation methods',
          validation:
            'Check required fields, data types, and business constraints',
          edge_cases: [
            'null/undefined inputs',
            'invalid data formats',
            'business rule violations',
          ],
        },
      ],
      errorHandling: {
        strategy: 'throw',
        errorTypes: ['ValidationError', 'BusinessRuleError', 'NotFoundError'],
        examples: [
          'throw new ValidationError("Invalid input")',
          'throw new BusinessRuleError("Business rule violated")',
        ],
      },
      testing: {
        approach: 'Unit testing with business scenario coverage',
        scenarios: [
          {
            name: 'Valid input test',
            description: 'Test with valid business data',
            input: 'valid business data',
            expectedOutput: 'successful operation',
            businessValidation: 'All business rules satisfied',
          },
          {
            name: 'Invalid input test',
            description: 'Test with invalid data',
            input: 'invalid data',
            expectedOutput: 'validation error',
            businessValidation: 'Proper error handling and messages',
          },
        ],
        mockingStrategy:
          'Mock external dependencies, test business logic in isolation',
      },
      performance: {
        considerations: [
          'Minimize database queries',
          'Cache frequently accessed data',
          'Validate early to fail fast',
        ],
        optimizations: [
          'Use efficient data structures',
          'Implement pagination for large datasets',
        ],
        constraints: [
          'Response time < 200ms for CRUD operations',
          'Memory usage < 100MB per request',
        ],
      },
    };
  }

  private createEntityImplementationGuide(
    entity: unknown
  ): ImplementationGuide {
    const businessLogic: BusinessLogicSpec[] = entity.invariants.map(
      (invariant: string) => ({
        rule: invariant,
        implementation: 'Validate in constructor and setter methods',
        validation: 'Throw error if invariant is violated',
        edge_cases: [
          'Concurrent modifications',
          'Partial updates',
          'State transitions',
        ],
      })
    );

    return {
      approach: `Rich domain model with encapsulated business logic`,
      keyConsiderations: [
        'Encapsulate business rules within the entity',
        'Maintain data consistency through invariants',
        'Use value objects for complex data types',
        'Implement proper state transitions',
      ],
      businessLogic,
      errorHandling: {
        strategy: 'throw',
        errorTypes: [
          'BusinessRuleViolationError',
          'InvalidStateTransitionError',
        ],
        examples: [
          `throw new BusinessRuleViolationError("${entity.invariants[0]}")`,
        ],
      },
      testing: {
        approach: 'State-based testing with business scenario validation',
        scenarios: [
          {
            name: `Create valid ${entity.name}`,
            description: `Test ${entity.name} creation with valid data`,
            input: 'valid entity data',
            expectedOutput: `${entity.name} instance`,
            businessValidation: 'All invariants satisfied',
          },
          {
            name: `Test ${entity.name} business rules`,
            description: `Verify business rule enforcement`,
            input: 'data violating business rules',
            expectedOutput: 'business rule error',
            businessValidation: 'Proper error with business context',
          },
        ],
        mockingStrategy:
          'Mock repositories and external services, test domain logic directly',
      },
      performance: {
        considerations: [
          'Lazy loading for complex relationships',
          'Efficient validation algorithms',
        ],
        optimizations: [
          'Cache computed properties',
          'Batch validation operations',
        ],
        constraints: ['Entity creation < 50ms', 'Validation < 10ms'],
      },
    };
  }
}

/**
 * Convenience function to generate template
 */
export function generateTemplate(options: TemplateOptions): string {
  const generator = new TemplateGenerator();
  return generator.generateTemplate(options);
}

/**
 * Convenience function to list domains
 */
export function listAvailableDomains(): string {
  const generator = new TemplateGenerator();
  return generator.listDomains();
}
