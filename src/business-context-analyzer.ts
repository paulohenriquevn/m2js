/**
 * Business Context Analyzer for M2JS
 * Extracts business domain and architectural patterns from code
 */

import path from 'path';
import { readFileSync } from 'fs';
import { ParsedFile } from './types';

/* eslint-disable max-lines */
/* eslint-disable max-lines-per-function */

export interface BusinessContext {
  domain: string;
  confidence: number;
  frameworks: string[];
  patterns: string[];
  entities: string[];
  businessRules: string[];
  description?: string;
}

export interface DomainIndicator {
  keywords: string[];
  domain: string;
  weight: number;
}

/**
 * Domain patterns for business context detection
 */
const DOMAIN_PATTERNS: DomainIndicator[] = [
  {
    keywords: [
      'user',
      'product',
      'order',
      'payment',
      'cart',
      'checkout',
      'shipping',
    ],
    domain: 'E-commerce Platform',
    weight: 3,
  },
  {
    keywords: [
      'account',
      'transaction',
      'balance',
      'transfer',
      'payment',
      'invoice',
    ],
    domain: 'Financial Services',
    weight: 3,
  },
  {
    keywords: [
      'patient',
      'doctor',
      'appointment',
      'medical',
      'treatment',
      'diagnosis',
    ],
    domain: 'Healthcare Management',
    weight: 3,
  },
  {
    keywords: [
      'student',
      'course',
      'grade',
      'assignment',
      'enrollment',
      'curriculum',
    ],
    domain: 'Education Management',
    weight: 3,
  },
  {
    keywords: [
      'task',
      'project',
      'team',
      'collaboration',
      'workflow',
      'kanban',
    ],
    domain: 'Project Management',
    weight: 2,
  },
  {
    keywords: ['inventory', 'supplier', 'warehouse', 'stock', 'procurement'],
    domain: 'Supply Chain Management',
    weight: 2,
  },
  {
    keywords: [
      'validate',
      'auth',
      'security',
      'encrypt',
      'token',
      'permission',
    ],
    domain: 'Security & Authentication',
    weight: 2,
  },
  {
    keywords: ['analytics', 'metrics', 'dashboard', 'report', 'chart', 'data'],
    domain: 'Analytics & Reporting',
    weight: 2,
  },
];

/**
 * Framework detection patterns
 */
const FRAMEWORK_PATTERNS = [
  { pattern: /express|fastify|koa/i, name: 'Express.js/Node.js API' },
  { pattern: /react|jsx|component/i, name: 'React Frontend' },
  { pattern: /vue|nuxt/i, name: 'Vue.js Frontend' },
  { pattern: /angular|ng/i, name: 'Angular Frontend' },
  { pattern: /graphql|apollo/i, name: 'GraphQL API' },
  { pattern: /mongoose|sequelize|prisma|typeorm/i, name: 'Database ORM' },
  { pattern: /jest|mocha|chai|vitest/i, name: 'Testing Framework' },
  { pattern: /winston|logger|log/i, name: 'Logging System' },
  { pattern: /redis|cache/i, name: 'Caching Layer' },
  { pattern: /aws|azure|gcp|cloud/i, name: 'Cloud Services' },
];

/**
 * Architectural pattern detection
 */
const ARCHITECTURE_PATTERNS = [
  { pattern: /controller|route|endpoint/i, name: 'MVC/Controller Pattern' },
  { pattern: /service|business.*logic/i, name: 'Service Layer Pattern' },
  { pattern: /repository|dao|data.*access/i, name: 'Repository Pattern' },
  { pattern: /factory|builder|singleton/i, name: 'Design Patterns' },
  { pattern: /middleware|interceptor/i, name: 'Middleware Pattern' },
  {
    pattern: /event|emit|listen|subscriber/i,
    name: 'Event-Driven Architecture',
  },
  { pattern: /queue|job|worker|async/i, name: 'Async Processing' },
  { pattern: /dto|serializer|transformer/i, name: 'Data Transfer Objects' },
];

/**
 * Extracts business context from parsed files
 */
export function analyzeBusinessContext(
  parsedFiles: ParsedFile[],
  projectPath: string
): BusinessContext {
  const allText = extractAllText(parsedFiles, projectPath);

  return {
    domain: detectDomain(allText),
    confidence: calculateConfidence(allText),
    frameworks: detectFrameworks(allText),
    patterns: detectArchitecturalPatterns(allText),
    entities: extractBusinessEntities(parsedFiles),
    businessRules: extractBusinessRules(allText),
    description: generateDescription(allText, parsedFiles),
  };
}

/**
 * Extracts all relevant text from files and README
 */
function extractAllText(
  parsedFiles: ParsedFile[],
  projectPath: string
): string {
  let allText = '';

  // Extract from parsed files
  parsedFiles.forEach(file => {
    // File names and paths
    allText += ` ${file.fileName} ${file.filePath} `;

    // Function and class names
    file.functions.forEach(func => {
      allText += ` ${func.name} `;
      if (func.jsDoc) allText += ` ${func.jsDoc} `;
    });

    file.classes.forEach(cls => {
      allText += ` ${cls.name} `;
      if (cls.jsDoc) allText += ` ${cls.jsDoc} `;
      cls.methods.forEach(method => {
        allText += ` ${method.name} `;
        if (method.jsDoc) allText += ` ${method.jsDoc} `;
      });
    });
  });

  // Try to read README for additional context
  try {
    const readmePath = path.join(projectPath, 'README.md');
    const readmeContent = readFileSync(readmePath, 'utf8');
    allText += ` ${readmeContent} `;
  } catch {
    // README not found, continue without it
  }

  // Try to read package.json for dependencies
  try {
    const packagePath = path.join(projectPath, 'package.json');
    const packageContent = readFileSync(packagePath, 'utf8');
    const packageJson = JSON.parse(packageContent);

    // Add dependency names and description
    if (packageJson.description) {
      allText += ` ${packageJson.description} `;
    }

    const dependencies = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    };

    Object.keys(dependencies).forEach(dep => {
      allText += ` ${dep} `;
    });
  } catch {
    // package.json not found, continue without it
  }

  return allText.toLowerCase();
}

/**
 * Detects the most likely business domain
 */
function detectDomain(text: string): string {
  const scores = new Map<string, number>();

  DOMAIN_PATTERNS.forEach(pattern => {
    let score = 0;
    pattern.keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      const matches = text.match(regex);
      if (matches) {
        score += matches.length * pattern.weight;
      }
    });

    if (score > 0) {
      scores.set(pattern.domain, score);
    }
  });

  if (scores.size === 0) {
    return 'General Purpose Application';
  }

  // Return domain with highest score
  const sortedDomains = Array.from(scores.entries()).sort(
    (a, b) => b[1] - a[1]
  );

  return sortedDomains[0][0];
}

/**
 * Calculates confidence in domain detection
 */
function calculateConfidence(text: string): number {
  let totalMatches = 0;
  let weightedMatches = 0;

  DOMAIN_PATTERNS.forEach(pattern => {
    pattern.keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      const matches = text.match(regex);
      if (matches) {
        totalMatches += matches.length;
        weightedMatches += matches.length * pattern.weight;
      }
    });
  });

  if (totalMatches === 0) return 30; // Low confidence for generic code

  // Confidence based on number and weight of matches
  const confidence = Math.min(95, 50 + weightedMatches * 2);
  return Math.round(confidence);
}

/**
 * Detects frameworks and technologies used
 */
function detectFrameworks(text: string): string[] {
  const frameworks: string[] = [];

  FRAMEWORK_PATTERNS.forEach(framework => {
    if (framework.pattern.test(text)) {
      frameworks.push(framework.name);
    }
  });

  return frameworks;
}

/**
 * Detects architectural patterns
 */
function detectArchitecturalPatterns(text: string): string[] {
  const patterns: string[] = [];

  ARCHITECTURE_PATTERNS.forEach(pattern => {
    if (pattern.pattern.test(text)) {
      patterns.push(pattern.name);
    }
  });

  return patterns;
}

/**
 * Extracts business entities from class and function names
 */
function extractBusinessEntities(parsedFiles: ParsedFile[]): string[] {
  const entities = new Set<string>();

  parsedFiles.forEach(file => {
    // Extract from class names
    file.classes.forEach(cls => {
      // Convert PascalCase to readable entities
      const entityName = cls.name
        .replace(/([A-Z])/g, ' $1')
        .trim()
        .replace(/\s+/g, ' ');

      entities.add(entityName);
    });

    // Extract from function names that look like entities
    file.functions.forEach(func => {
      const name = func.name;
      if (
        name.startsWith('create') ||
        name.startsWith('get') ||
        name.startsWith('update') ||
        name.startsWith('delete')
      ) {
        const entityName = name
          .replace(/^(create|get|update|delete|find|search)/, '')
          .replace(/([A-Z])/g, ' $1')
          .trim();

        if (entityName && entityName.length > 1) {
          entities.add(entityName);
        }
      }
    });
  });

  return Array.from(entities).slice(0, 10); // Limit to most relevant
}

/**
 * Extracts business rules from JSDoc comments
 */
function extractBusinessRules(text: string): string[] {
  const rules: string[] = [];

  // Look for constraint-related keywords in comments
  const constraintPatterns = [
    /must\s+(?:be|have|contain|include|start|end|match)[^.]*\./gi,
    /cannot\s+(?:be|have|contain|include|start|end|exceed)[^.]*\./gi,
    /should\s+(?:be|have|contain|include|start|end|validate)[^.]*\./gi,
    /required\s+(?:for|to|when|if)[^.]*\./gi,
    /(?:minimum|maximum|max|min)\s+[^.]*\./gi,
  ];

  constraintPatterns.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) {
      matches.forEach(match => {
        const rule = match
          .trim()
          .replace(
            /^\w+/,
            word => word.charAt(0).toUpperCase() + word.slice(1)
          );

        if (rule.length > 10 && rule.length < 100) {
          rules.push(rule);
        }
      });
    }
  });

  return rules.slice(0, 5); // Limit to most relevant rules
}

/**
 * Generates a description of the system
 */
function generateDescription(text: string, parsedFiles: ParsedFile[]): string {
  const domain = detectDomain(text);
  const classCount = parsedFiles.reduce(
    (sum, file) => sum + file.classes.length,
    0
  );
  const functionCount = parsedFiles.reduce(
    (sum, file) => sum + file.functions.length,
    0
  );

  let description = `${domain} system`;

  if (classCount > 5) {
    description += ' with object-oriented architecture';
  } else if (functionCount > 10) {
    description += ' with functional programming approach';
  }

  // Add specific domain insights
  if (domain.includes('E-commerce')) {
    description +=
      ' handling user management, product catalog, and order processing';
  } else if (domain.includes('Financial')) {
    description += ' managing accounts, transactions, and financial operations';
  } else if (domain.includes('Healthcare')) {
    description += ' supporting patient care and medical record management';
  }

  return description;
}
