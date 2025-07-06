/**
 * Usage Pattern Analyzer for M2JS
 * Extracts usage examples and patterns from code
 */

/* eslint-disable @typescript-eslint/no-unused-vars */

import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import * as t from '@babel/types';
import { readFileSync } from 'fs';
// import path from 'path'; // Currently unused
import { ParsedFile } from './types';

export interface UsageExample {
  function: string;
  example: string;
  description: string;
  errorHandling?: string;
  category: 'creation' | 'validation' | 'transformation' | 'query' | 'business-logic';
}

export interface UsagePattern {
  pattern: string;
  description: string;
  frequency: number;
  examples: string[];
}

export interface UsageAnalysis {
  examples: UsageExample[];
  patterns: UsagePattern[];
  errorHandling: string[];
  commonFlows: string[];
}

/**
 * Analyzes usage patterns from parsed files
 */
export function analyzeUsagePatterns(
  parsedFiles: ParsedFile[],
  projectPath: string
): UsageAnalysis {
  const examples: UsageExample[] = [];
  const patterns: UsagePattern[] = [];
  const errorHandling: string[] = [];
  const commonFlows: string[] = [];
  
  // Analyze each file for usage patterns
  parsedFiles.forEach(parsedFile => {
    try {
      const fileContent = readFileSync(parsedFile.filePath, 'utf8');
      const usage = extractUsageFromFile(fileContent, parsedFile);
      
      examples.push(...usage.examples);
      patterns.push(...usage.patterns);
      errorHandling.push(...usage.errorHandling);
      commonFlows.push(...usage.flows);
    } catch (error) {
      // Skip files that can't be read
    }
  });
  
  // Also look for test files
  const testExamples = extractFromTestFiles(projectPath, parsedFiles);
  examples.push(...testExamples);
  
  return {
    examples: deduplicateExamples(examples).slice(0, 10),
    patterns: consolidatePatterns(patterns).slice(0, 8),
    errorHandling: deduplicateStrings(errorHandling).slice(0, 5),
    commonFlows: deduplicateStrings(commonFlows).slice(0, 5)
  };
}

/**
 * Extracts usage patterns from a single file
 */
function extractUsageFromFile(
  content: string,
  parsedFile: ParsedFile
): {
  examples: UsageExample[];
  patterns: UsagePattern[];
  errorHandling: string[];
  flows: string[];
} {
  const examples: UsageExample[] = [];
  const patterns: UsagePattern[] = [];
  const errorHandling: string[] = [];
  const flows: string[] = [];
  
  try {
    const ast = parse(content, {
      sourceType: 'module',
      plugins: ['typescript', 'jsx', 'decorators-legacy']
    });
    
    traverse(ast, {
      // Extract function calls as usage examples
      CallExpression(nodePath) {
        const callee = nodePath.node.callee;
        
        if (t.isIdentifier(callee)) {
          const functionName = callee.name;
          
          // Check if this function is exported from our parsed files
          const isOurFunction = parsedFile.functions.some(f => f.name === functionName);
          
          if (isOurFunction) {
            const example = generateUsageExample(nodePath, functionName);
            if (example) {
              examples.push(example);
            }
          }
        }
        
        // Check for method calls on our classes
        if (t.isMemberExpression(callee) && t.isIdentifier(callee.property)) {
          const methodName = callee.property.name;
          const objectName = t.isIdentifier(callee.object) ? callee.object.name : '';
          
          const isOurMethod = parsedFile.classes.some(cls => 
            cls.methods.some(method => method.name === methodName)
          );
          
          if (isOurMethod) {
            const example = generateMethodUsageExample(nodePath, objectName, methodName);
            if (example) {
              examples.push(example);
            }
          }
        }
      },
      
      // Extract error handling patterns
      TryStatement(nodePath) {
        const errorPattern = extractErrorHandlingPattern(nodePath);
        if (errorPattern) {
          errorHandling.push(errorPattern);
        }
      },
      
      // Extract common patterns like validation flows
      IfStatement(nodePath) {
        const pattern = extractValidationPattern(nodePath);
        if (pattern) {
          patterns.push(pattern);
        }
      },
      
      // Extract workflow patterns from sequential function calls
      ExpressionStatement(nodePath) {
        const flow = extractWorkflowPattern(nodePath);
        if (flow) {
          flows.push(flow);
        }
      }
    });
  } catch (error) {
    // Skip files with parsing errors
  }
  
  return { examples, patterns, errorHandling, flows };
}

/**
 * Generates usage example from function call
 */
function generateUsageExample(
  nodePath: any,
  functionName: string
): UsageExample | null {
  try {
    const args = nodePath.node.arguments;
    const code = generateCodeFromNode(nodePath.node);
    
    if (!code || code.length > 200) return null;
    
    const category = categorizeFunction(functionName);
    const description = generateExampleDescription(functionName, args);
    
    return {
      function: functionName,
      example: code,
      description,
      category
    };
  } catch {
    return null;
  }
}

/**
 * Generates usage example from method call
 */
function generateMethodUsageExample(
  nodePath: any,
  objectName: string,
  methodName: string
): UsageExample | null {
  try {
    const code = generateCodeFromNode(nodePath.node);
    
    if (!code || code.length > 200) return null;
    
    const category = categorizeFunction(methodName);
    const description = `Call ${methodName}() on ${objectName} instance`;
    
    return {
      function: `${objectName}.${methodName}`,
      example: code,
      description,
      category
    };
  } catch {
    return null;
  }
}

/**
 * Categorizes function based on name patterns
 */
function categorizeFunction(name: string): UsageExample['category'] {
  const lowerName = name.toLowerCase();
  
  if (lowerName.includes('create') || lowerName.includes('new') || lowerName.includes('build')) {
    return 'creation';
  }
  if (lowerName.includes('validate') || lowerName.includes('check') || lowerName.includes('verify')) {
    return 'validation';
  }
  if (lowerName.includes('transform') || lowerName.includes('convert') || lowerName.includes('format')) {
    return 'transformation';
  }
  if (lowerName.includes('get') || lowerName.includes('find') || lowerName.includes('search') || lowerName.includes('query')) {
    return 'query';
  }
  
  return 'business-logic';
}

/**
 * Generates description for usage example
 */
function generateExampleDescription(functionName: string, args: any[]): string {
  const argCount = args.length;
  const action = functionName.replace(/([A-Z])/g, ' $1').toLowerCase().trim();
  
  if (argCount === 0) {
    return `Call ${action} with no parameters`;
  } else if (argCount === 1) {
    return `Call ${action} with single parameter`;
  } else {
    return `Call ${action} with ${argCount} parameters`;
  }
}

/**
 * Extracts error handling patterns
 */
function extractErrorHandlingPattern(nodePath: any): string | null {
  try {
    const tryBlock = nodePath.node.block;
    const catchClause = nodePath.node.handler;
    
    if (!catchClause) return null;
    
    const pattern = `try { /* ${getBlockDescription(tryBlock)} */ } catch (${catchClause.param?.name || 'error'}) { /* ${getBlockDescription(catchClause.body)} */ }`;
    
    return pattern.length < 150 ? pattern : null;
  } catch {
    return null;
  }
}

/**
 * Extracts validation patterns from if statements
 */
function extractValidationPattern(nodePath: any): UsagePattern | null {
  try {
    const test = nodePath.node.test;
    
    if (t.isCallExpression(test) && t.isIdentifier(test.callee)) {
      const functionName = test.callee.name;
      
      if (functionName.includes('validate') || functionName.includes('check')) {
        return {
          pattern: 'Validation Guard',
          description: `Check ${functionName}() before proceeding`,
          frequency: 1,
          examples: [generateCodeFromNode(nodePath.node)]
        };
      }
    }
    
    return null;
  } catch {
    return null;
  }
}

/**
 * Extracts workflow patterns
 */
function extractWorkflowPattern(nodePath: any): string | null {
  try {
    const expression = nodePath.node.expression;
    
    if (t.isAwaitExpression(expression) && t.isCallExpression(expression.argument)) {
      const call = expression.argument;
      if (t.isIdentifier(call.callee)) {
        return `await ${call.callee.name}()`;
      }
    }
    
    return null;
  } catch {
    return null;
  }
}

/**
 * Gets description of a code block
 */
function getBlockDescription(block: any): string {
  if (!block || !block.body) return 'code block';
  
  const statementCount = block.body.length;
  if (statementCount === 0) return 'empty block';
  if (statementCount === 1) return 'single statement';
  return `${statementCount} statements`;
}

/**
 * Generates code string from AST node (simplified)
 */
function generateCodeFromNode(node: any): string {
  try {
    // This is a simplified code generation
    // In a real implementation, you'd use babel-generator
    if (t.isCallExpression(node)) {
      const callee = t.isIdentifier(node.callee) ? node.callee.name : 'function';
      const argCount = node.arguments.length;
      
      if (argCount === 0) {
        return `${callee}()`;
      } else if (argCount === 1) {
        return `${callee}(param)`;
      } else {
        return `${callee}(${Array(argCount).fill('param').join(', ')})`;
      }
    }
    
    return 'code_example';
  } catch {
    return 'code_example';
  }
}

/**
 * Extracts examples from test files
 */
function extractFromTestFiles(_projectPath: string, _parsedFiles: ParsedFile[]): UsageExample[] {
  const examples: UsageExample[] = [];
  
  // Look for common test file patterns
  // const testPatterns = [
  //   '**/*.test.ts',
  //   '**/*.test.js',
  //   '**/*.spec.ts',
  //   '**/*.spec.js',
  //   '**/tests/**/*.ts',
  //   '**/tests/**/*.js'
  // ];
  
  // This is a simplified implementation
  // In practice, you'd use a proper glob library to find test files
  
  return examples;
}

/**
 * Removes duplicate examples
 */
function deduplicateExamples(examples: UsageExample[]): UsageExample[] {
  const seen = new Set<string>();
  return examples.filter(example => {
    const key = `${example.function}-${example.example}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * Consolidates similar patterns
 */
function consolidatePatterns(patterns: UsagePattern[]): UsagePattern[] {
  const patternMap = new Map<string, UsagePattern>();
  
  patterns.forEach(pattern => {
    const existing = patternMap.get(pattern.pattern);
    if (existing) {
      existing.frequency += pattern.frequency;
      existing.examples.push(...pattern.examples);
    } else {
      patternMap.set(pattern.pattern, { ...pattern });
    }
  });
  
  return Array.from(patternMap.values())
    .sort((a, b) => b.frequency - a.frequency);
}

/**
 * Removes duplicate strings
 */
function deduplicateStrings(strings: string[]): string[] {
  return Array.from(new Set(strings));
}