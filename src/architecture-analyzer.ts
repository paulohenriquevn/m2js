/**
 * Architecture Insights Analyzer for M2JS
 * Analyzes architectural patterns, decisions, and code organization
 */

/* eslint-disable @typescript-eslint/no-unused-vars */

import { ParsedFile } from './types';
import { DependencyGraph } from './types';

export interface ArchitectureInsights {
  layerArchitecture: LayerAnalysis;
  dataFlow: DataFlowPattern[];
  errorStrategy: ErrorHandlingStrategy;
  securityPatterns: SecurityPattern[];
  testingStrategy: TestingStrategy;
  performancePatterns: PerformancePattern[];
  designPrinciples: DesignPrinciple[];
}

export interface LayerAnalysis {
  pattern: string;
  layers: ArchitectureLayer[];
  rationale: string;
}

export interface ArchitectureLayer {
  name: string;
  responsibility: string;
  files: string[];
  dependencies: string[];
}

export interface DataFlowPattern {
  name: string;
  steps: string[];
  description: string;
  files: string[];
}

export interface ErrorHandlingStrategy {
  strategy: string;
  patterns: string[];
  customErrors: string[];
  examples: string[];
}

export interface SecurityPattern {
  pattern: string;
  description: string;
  implementation: string;
}

export interface TestingStrategy {
  approach: string;
  frameworks: string[];
  patterns: string[];
  coverage: string;
}

export interface PerformancePattern {
  pattern: string;
  description: string;
  evidence: string[];
}

export interface DesignPrinciple {
  principle: string;
  evidence: string[];
  violations: string[];
}

/**
 * Analyzes architectural patterns from parsed files and dependencies
 */
export function analyzeArchitecture(
  parsedFiles: ParsedFile[],
  dependencyGraph: DependencyGraph
): ArchitectureInsights {
  return {
    layerArchitecture: analyzeLayerArchitecture(parsedFiles, dependencyGraph),
    dataFlow: analyzeDataFlowPatterns(parsedFiles, dependencyGraph),
    errorStrategy: analyzeErrorHandling(parsedFiles),
    securityPatterns: analyzeSecurityPatterns(parsedFiles),
    testingStrategy: analyzeTestingStrategy(parsedFiles),
    performancePatterns: analyzePerformancePatterns(parsedFiles),
    designPrinciples: analyzeDesignPrinciples(parsedFiles, dependencyGraph),
  };
}

/**
 * Analyzes layer architecture patterns
 */
function analyzeLayerArchitecture(
  parsedFiles: ParsedFile[],
  dependencyGraph: DependencyGraph
): LayerAnalysis {
  const layers: ArchitectureLayer[] = [];

  // Categorize files into architectural layers
  const controllerFiles = parsedFiles.filter(
    f =>
      f.fileName.toLowerCase().includes('controller') ||
      f.fileName.toLowerCase().includes('route') ||
      f.fileName.toLowerCase().includes('endpoint')
  );

  const serviceFiles = parsedFiles.filter(
    f =>
      f.fileName.toLowerCase().includes('service') ||
      f.fileName.toLowerCase().includes('business') ||
      f.fileName.toLowerCase().includes('logic')
  );

  const modelFiles = parsedFiles.filter(
    f =>
      f.fileName.toLowerCase().includes('model') ||
      f.fileName.toLowerCase().includes('entity') ||
      f.fileName.toLowerCase().includes('schema')
  );

  const utilFiles = parsedFiles.filter(
    f =>
      f.fileName.toLowerCase().includes('util') ||
      f.fileName.toLowerCase().includes('helper') ||
      f.fileName.toLowerCase().includes('validator')
  );

  // Build layer structure
  if (controllerFiles.length > 0) {
    layers.push({
      name: 'Presentation Layer',
      responsibility:
        'HTTP request handling, input validation, response formatting',
      files: controllerFiles.map(f => f.fileName),
      dependencies: getLayerDependencies(controllerFiles, dependencyGraph),
    });
  }

  if (serviceFiles.length > 0) {
    layers.push({
      name: 'Business Logic Layer',
      responsibility: 'Core business rules, workflows, and domain operations',
      files: serviceFiles.map(f => f.fileName),
      dependencies: getLayerDependencies(serviceFiles, dependencyGraph),
    });
  }

  if (modelFiles.length > 0) {
    layers.push({
      name: 'Data Layer',
      responsibility: 'Data structures, entities, and persistence logic',
      files: modelFiles.map(f => f.fileName),
      dependencies: getLayerDependencies(modelFiles, dependencyGraph),
    });
  }

  if (utilFiles.length > 0) {
    layers.push({
      name: 'Utility Layer',
      responsibility:
        'Cross-cutting concerns, helpers, and shared functionality',
      files: utilFiles.map(f => f.fileName),
      dependencies: getLayerDependencies(utilFiles, dependencyGraph),
    });
  }

  // Determine architecture pattern
  let pattern = 'Custom Architecture';
  let rationale =
    'Architecture pattern determined by file organization and dependencies';

  if (
    controllerFiles.length > 0 &&
    serviceFiles.length > 0 &&
    modelFiles.length > 0
  ) {
    pattern = 'Layered Architecture (MVC-style)';
    rationale =
      'Clear separation between presentation, business logic, and data layers';
  } else if (serviceFiles.length > 0 && modelFiles.length > 0) {
    pattern = 'Service-Oriented Architecture';
    rationale = 'Business logic encapsulated in services with domain models';
  } else if (utilFiles.length > parsedFiles.length * 0.5) {
    pattern = 'Utility-First Architecture';
    rationale =
      'Functional approach with emphasis on reusable utility functions';
  }

  return { pattern, layers, rationale };
}

/**
 * Gets dependencies for a layer of files
 */
function getLayerDependencies(
  layerFiles: ParsedFile[],
  dependencyGraph: DependencyGraph
): string[] {
  const dependencies = new Set<string>();

  layerFiles.forEach(file => {
    const edges = dependencyGraph.edges.filter(
      edge => edge.from === file.filePath && !edge.isExternal
    );

    edges.forEach(edge => {
      dependencies.add(edge.to);
    });
  });

  return Array.from(dependencies);
}

/**
 * Analyzes data flow patterns
 */
function analyzeDataFlowPatterns(
  parsedFiles: ParsedFile[],
  _dependencyGraph: DependencyGraph
): DataFlowPattern[] {
  const patterns: DataFlowPattern[] = [];

  // Analyze common data flow patterns
  const hasControllers = parsedFiles.some(f =>
    f.fileName.includes('controller')
  );
  const hasServices = parsedFiles.some(f => f.fileName.includes('service'));
  const hasModels = parsedFiles.some(f => f.fileName.includes('model'));
  const hasValidators = parsedFiles.some(f => f.fileName.includes('validator'));

  if (hasControllers && hasServices && hasModels) {
    patterns.push({
      name: 'Request-Response Flow',
      steps: [
        'HTTP Request → Controller',
        'Controller → Input Validation',
        'Controller → Service Layer',
        'Service → Business Logic',
        'Service → Data Layer',
        'Response ← Controller',
      ],
      description: 'Standard web application request processing flow',
      files: ['Controllers', 'Services', 'Models'],
    });
  }

  if (hasValidators) {
    patterns.push({
      name: 'Validation Pipeline',
      steps: [
        'Input Data → Validation Functions',
        'Validation → Error Collection',
        'Valid Data → Business Logic',
        'Invalid Data → Error Response',
      ],
      description: 'Input validation and error handling workflow',
      files: ['Validators', 'Controllers'],
    });
  }

  // Analyze async patterns
  const hasAsyncFunctions = parsedFiles.some(file =>
    file.functions.some(
      func =>
        func.signature.includes('async') || func.returnType?.includes('Promise')
    )
  );

  if (hasAsyncFunctions) {
    patterns.push({
      name: 'Async Operation Flow',
      steps: [
        'Async Function Call',
        'Promise Creation',
        'Await Resolution',
        'Error Handling (try/catch)',
        'Result Processing',
      ],
      description: 'Asynchronous operation handling pattern',
      files: ['Services', 'Controllers'],
    });
  }

  return patterns;
}

/**
 * Analyzes error handling strategies
 */
function analyzeErrorHandling(
  parsedFiles: ParsedFile[]
): ErrorHandlingStrategy {
  const patterns: string[] = [];
  const customErrors: string[] = [];
  const examples: string[] = [];

  // Look for error-related patterns in function names and JSDoc
  parsedFiles.forEach(file => {
    file.functions.forEach(func => {
      if (func.name.includes('validate') || func.name.includes('check')) {
        patterns.push('Input Validation');
        examples.push(`${func.name}() validates input and throws on failure`);
      }

      if (func.jsDoc?.includes('throw') || func.jsDoc?.includes('error')) {
        patterns.push('Explicit Error Throwing');
      }

      if (func.returnType?.includes('boolean')) {
        patterns.push('Boolean Return Pattern');
        examples.push(`${func.name}() returns boolean for success/failure`);
      }
    });

    // Look for custom error classes
    file.classes.forEach(cls => {
      if (cls.name.includes('Error') || cls.name.includes('Exception')) {
        customErrors.push(cls.name);
      }
    });
  });

  // Determine overall strategy
  let strategy = 'Mixed Error Handling';
  if (
    patterns.includes('Boolean Return Pattern') &&
    !patterns.includes('Explicit Error Throwing')
  ) {
    strategy = 'Return Value Error Handling';
  } else if (patterns.includes('Explicit Error Throwing')) {
    strategy = 'Exception-Based Error Handling';
  }

  return {
    strategy,
    patterns: Array.from(new Set(patterns)),
    customErrors,
    examples: examples.slice(0, 3),
  };
}

/**
 * Analyzes security patterns
 */
function analyzeSecurityPatterns(parsedFiles: ParsedFile[]): SecurityPattern[] {
  const patterns: SecurityPattern[] = [];

  // Look for security-related functions
  const securityFunctions = parsedFiles.flatMap(file =>
    file.functions.filter(
      func =>
        func.name.includes('validate') ||
        func.name.includes('auth') ||
        func.name.includes('encrypt') ||
        func.name.includes('hash') ||
        func.name.includes('token') ||
        func.name.includes('permission')
    )
  );

  if (securityFunctions.length > 0) {
    patterns.push({
      pattern: 'Input Validation',
      description: 'Systematic input validation to prevent injection attacks',
      implementation: `${securityFunctions.length} validation functions found`,
    });
  }

  // Look for authentication patterns
  const authFunctions = securityFunctions.filter(
    func =>
      func.name.includes('auth') ||
      func.name.includes('login') ||
      func.name.includes('token')
  );

  if (authFunctions.length > 0) {
    patterns.push({
      pattern: 'Authentication Layer',
      description: 'User authentication and authorization mechanisms',
      implementation: 'Token-based or session-based authentication',
    });
  }

  return patterns;
}

/**
 * Analyzes testing strategy
 */
function analyzeTestingStrategy(parsedFiles: ParsedFile[]): TestingStrategy {
  // This is a simplified analysis
  // In practice, you'd analyze test files separately

  const hasComplexLogic = parsedFiles.some(
    file =>
      file.functions.length > 5 ||
      file.classes.some(cls => cls.methods.length > 5)
  );

  return {
    approach: hasComplexLogic
      ? 'Unit Testing Recommended'
      : 'Integration Testing Focus',
    frameworks: ['Jest', 'Mocha', 'Vitest'], // Common frameworks
    patterns: ['Arrange-Act-Assert', 'Given-When-Then'],
    coverage: 'Target 80%+ for business logic',
  };
}

/**
 * Analyzes performance patterns
 */
function analyzePerformancePatterns(
  parsedFiles: ParsedFile[]
): PerformancePattern[] {
  const patterns: PerformancePattern[] = [];

  // Look for async patterns
  const asyncFunctions = parsedFiles.flatMap(file =>
    file.functions.filter(func => func.returnType?.includes('Promise'))
  );

  if (asyncFunctions.length > 0) {
    patterns.push({
      pattern: 'Asynchronous Processing',
      description: 'Non-blocking operations for better performance',
      evidence: [`${asyncFunctions.length} async functions`],
    });
  }

  // Look for caching patterns
  const cachingFunctions = parsedFiles.flatMap(file =>
    file.functions.filter(
      func => func.name.includes('cache') || func.name.includes('memo')
    )
  );

  if (cachingFunctions.length > 0) {
    patterns.push({
      pattern: 'Caching Strategy',
      description: 'Data caching for improved response times',
      evidence: [`${cachingFunctions.length} caching functions`],
    });
  }

  return patterns;
}

/**
 * Analyzes adherence to design principles
 */
function analyzeDesignPrinciples(
  parsedFiles: ParsedFile[],
  dependencyGraph: DependencyGraph
): DesignPrinciple[] {
  const principles: DesignPrinciple[] = [];

  // Single Responsibility Principle
  const violations: string[] = [];
  const evidence: string[] = [];

  parsedFiles.forEach(file => {
    if (file.functions.length > 10) {
      violations.push(
        `${file.fileName} has ${file.functions.length} functions`
      );
    } else {
      evidence.push(`${file.fileName} has focused responsibility`);
    }
  });

  principles.push({
    principle: 'Single Responsibility Principle',
    evidence: evidence.slice(0, 3),
    violations: violations.slice(0, 3),
  });

  // Dependency Inversion (check for dependency directions)
  const hasProperLayering = dependencyGraph.edges.every(edge => {
    const fromIsController = edge.from.includes('controller');
    const toIsModel = edge.to.includes('model');

    // Controllers should not directly depend on models (should go through services)
    return !(fromIsController && toIsModel);
  });

  if (hasProperLayering) {
    principles.push({
      principle: 'Dependency Inversion Principle',
      evidence: ['Proper dependency flow through layers'],
      violations: [],
    });
  }

  return principles;
}
