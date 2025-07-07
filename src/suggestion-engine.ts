/**
 * Safe Removal Suggestions Engine for M2JS
 * Generates intelligent removal suggestions with confidence levels
 */

import path from 'path';
import { DeadExport, UnusedImport, RemovalSuggestion } from './dead-code-types';

/**
 * Generate safe removal suggestions for dead code
 */
export function generateRemovalSuggestions(
  deadExports: DeadExport[],
  unusedImports: UnusedImport[],
  projectPath: string
): RemovalSuggestion[] {
  const suggestions: RemovalSuggestion[] = [];

  // Generate suggestions for dead exports
  deadExports.forEach((deadExport, index) => {
    const suggestion = createExportRemovalSuggestion(
      deadExport,
      index,
      projectPath
    );
    suggestions.push(suggestion);
  });

  // Generate suggestions for unused imports
  unusedImports.forEach((unusedImport, index) => {
    const suggestion = createImportRemovalSuggestion(
      unusedImport,
      index + deadExports.length,
      projectPath
    );
    suggestions.push(suggestion);
  });

  // Sort suggestions by priority and safety
  return suggestions.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    const safetyOrder = { safe: 3, 'review-needed': 2, risky: 1 };

    if (a.priority !== b.priority) {
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }

    return safetyOrder[b.safety] - safetyOrder[a.safety];
  });
}

/**
 * Create removal suggestion for a dead export
 */
function createExportRemovalSuggestion(
  deadExport: DeadExport,
  index: number,
  projectPath: string
): RemovalSuggestion {
  const relativePath = path.relative(projectPath, deadExport.file);
  const isHighConfidence = deadExport.confidence === 'high';
  const hasRisks = deadExport.riskFactors.length > 0;

  const suggestion: RemovalSuggestion = {
    id: `export-${index}`,
    priority: mapConfidenceToPriority(deadExport.confidence),
    safety: mapConfidenceToSafety(deadExport.confidence, hasRisks),
    action: `Remove ${deadExport.type}: ${deadExport.name}`,
    file: relativePath,
    line: deadExport.line,
    impact: generateExportImpact(deadExport),
    type: 'remove-export',
  };

  // Add command for high confidence removals
  if (isHighConfidence && !hasRisks) {
    suggestion.command = generateRemovalCommand(deadExport);
  }

  // Add warnings for risky removals
  if (hasRisks) {
    suggestion.warnings = deadExport.riskFactors;
  }

  return suggestion;
}

/**
 * Create removal suggestion for an unused import
 */
function createImportRemovalSuggestion(
  unusedImport: UnusedImport,
  index: number,
  projectPath: string
): RemovalSuggestion {
  const relativePath = path.relative(projectPath, unusedImport.file);
  const isHighConfidence = unusedImport.confidence === 'high';
  const hasRisks = unusedImport.riskFactors.length > 0;

  const suggestion: RemovalSuggestion = {
    id: `import-${index}`,
    priority: mapConfidenceToPriority(unusedImport.confidence),
    safety: mapConfidenceToSafety(unusedImport.confidence, hasRisks),
    action: `Remove unused import: ${unusedImport.name}`,
    file: relativePath,
    line: unusedImport.line,
    impact: generateImportImpact(unusedImport),
    type: 'remove-import',
  };

  // Add command for high confidence removals
  if (isHighConfidence && !hasRisks) {
    suggestion.command = generateImportRemovalCommand(unusedImport);
  }

  // Add warnings for risky removals
  if (hasRisks) {
    suggestion.warnings = unusedImport.riskFactors;
  }

  return suggestion;
}

/**
 * Generate confidence levels and risk assessment for dead exports
 */
export function assessExportRemovalRisk(
  deadExport: DeadExport,
  projectPath: string
): { confidence: 'high' | 'medium' | 'low'; riskFactors: string[] } {
  const riskFactors: string[] = [];
  const fileName = path.basename(deadExport.file);
  const exportName = deadExport.name;

  // Check for public API patterns
  if (isPublicAPI(deadExport, projectPath)) {
    riskFactors.push('Appears to be public API - may have external consumers');
  }

  // Check for common naming patterns that suggest external usage
  if (isLikelyExternalAPI(exportName)) {
    riskFactors.push(
      'Export name suggests it may be used by external packages'
    );
  }

  // Check for test files
  if (isTestFile(fileName)) {
    riskFactors.push('Located in test file - may be used by test framework');
  }

  // Check for type definitions
  if (deadExport.type === 'interface' || deadExport.type === 'type') {
    riskFactors.push('Type definition - may be used in type annotations');
  }

  // Check for default exports
  if (exportName === 'default') {
    riskFactors.push('Default export - may be imported with different names');
  }

  // Check for configuration/setup files
  if (isConfigFile(fileName)) {
    riskFactors.push('Configuration file - may be loaded dynamically');
  }

  // Determine confidence based on risk factors
  let confidence: 'high' | 'medium' | 'low';
  if (riskFactors.length === 0) {
    confidence = 'high';
  } else if (riskFactors.length <= 2) {
    confidence = 'medium';
  } else {
    confidence = 'low';
  }

  return { confidence, riskFactors };
}

/**
 * Generate confidence levels and risk assessment for unused imports
 */
export function assessImportRemovalRisk(unusedImport: UnusedImport): {
  confidence: 'high' | 'medium' | 'low';
  riskFactors: string[];
} {
  const riskFactors: string[] = [];
  const importName = unusedImport.name;
  const fromPath = unusedImport.from;

  // Check for side-effect imports
  if (isSideEffectImport(fromPath)) {
    riskFactors.push('May be imported for side effects');
  }

  // Check for polyfills or setup imports
  if (isPolyfillImport(fromPath, importName)) {
    riskFactors.push('Appears to be polyfill or setup import');
  }

  // Check for type-only usage (TypeScript)
  if (isTypeImport(importName)) {
    riskFactors.push('May be used in type annotations only');
  }

  // Check for common framework patterns
  if (isFrameworkImport(fromPath, importName)) {
    riskFactors.push('Framework import - may be used implicitly');
  }

  // External packages are generally safe to remove if unused
  const isExternal = !fromPath.startsWith('./') && !fromPath.startsWith('../');

  // Determine confidence
  let confidence: 'high' | 'medium' | 'low';
  if (riskFactors.length === 0 && isExternal) {
    confidence = 'high';
  } else if (riskFactors.length <= 1) {
    confidence = 'medium';
  } else {
    confidence = 'low';
  }

  return { confidence, riskFactors };
}

/**
 * Helper functions for risk assessment
 */
function isPublicAPI(deadExport: DeadExport, projectPath: string): boolean {
  const relativePath = path.relative(projectPath, deadExport.file);

  // Check if it's in an index file (common pattern for public APIs)
  if (path.basename(deadExport.file).startsWith('index.')) {
    return true;
  }

  // Check if it's in a 'lib', 'public', or 'api' directory at root level
  // Note: 'src' is too broad - most internal code is in src
  const segments = relativePath.split(path.sep);
  if (segments.length > 0 && ['lib', 'public', 'api'].includes(segments[0])) {
    return true;
  }

  // Check if it's in top-level src/index.ts or similar public entry points
  if (
    segments.length === 2 &&
    segments[0] === 'src' &&
    path.basename(deadExport.file).startsWith('index.')
  ) {
    return true;
  }

  return false;
}

function isLikelyExternalAPI(exportName: string): boolean {
  // Common patterns for external APIs
  const apiPatterns = [
    /^create[A-Z]/, // createComponent, createStore
    /^use[A-Z]/, // useHook, useEffect (React)
    /^get[A-Z]/, // getConfig, getData
    /^set[A-Z]/, // setConfig, setData
    /^init[A-Z]/, // initializeApp, initConfig (not just "init")
    /[A-Z]Config$/, // AppConfig, UserConfig (not internal configs)
    /[A-Z]Utils$/, // StringUtils, DateUtils (not internal utils)
    /[A-Z]Helper$/, // ApiHelper, DataHelper (not internal helpers)
  ];

  return apiPatterns.some(pattern => pattern.test(exportName));
}

function isTestFile(fileName: string): boolean {
  return /\.(test|spec)\.(ts|tsx|js|jsx)$/.test(fileName);
}

function isConfigFile(fileName: string): boolean {
  const configPatterns = [
    /^config\./,
    /\.config\./,
    /^setup\./,
    /^bootstrap\./,
    /^polyfill\./,
  ];

  return configPatterns.some(pattern => pattern.test(fileName));
}

function isSideEffectImport(fromPath: string): boolean {
  const sideEffectPatterns = [
    /polyfill/,
    /setup/,
    /bootstrap/,
    /core-js/, // Add core-js as a side-effect import
    /\.css$/,
    /\.scss$/,
    /\.less$/,
  ];

  return sideEffectPatterns.some(pattern => pattern.test(fromPath));
}

function isPolyfillImport(fromPath: string, importName: string): boolean {
  return (
    /polyfill|core-js|regenerator/.test(fromPath) ||
    /polyfill|regenerator/.test(importName)
  );
}

function isTypeImport(importName: string): boolean {
  // Common type naming patterns
  return /^[A-Z].*Type$|^[A-Z].*Interface$|^I[A-Z]/.test(importName);
}

function isFrameworkImport(fromPath: string, importName: string): boolean {
  // React patterns
  if (
    fromPath === 'react' &&
    ['React', 'Component', 'PureComponent'].includes(importName)
  ) {
    return true;
  }

  // Vue patterns
  if (fromPath === 'vue' && ['Vue', 'createApp'].includes(importName)) {
    return true;
  }

  return false;
}

/**
 * Utility functions for mapping confidence to priority/safety
 */
function mapConfidenceToPriority(
  confidence: 'high' | 'medium' | 'low'
): 'high' | 'medium' | 'low' {
  return confidence; // Direct mapping for now
}

function mapConfidenceToSafety(
  confidence: 'high' | 'medium' | 'low',
  hasRisks: boolean
): 'safe' | 'review-needed' | 'risky' {
  if (confidence === 'low') {
    return 'risky';
  }

  if (hasRisks) {
    return 'review-needed'; // Both high and medium confidence with risks need review
  }

  return confidence === 'high' ? 'safe' : 'review-needed';
}

function generateExportImpact(deadExport: DeadExport): string {
  const typeDescriptions = {
    function: 'function',
    class: 'class definition',
    variable: 'variable/constant',
    interface: 'type interface',
    type: 'type alias',
  };

  return `Remove unused ${typeDescriptions[deadExport.type]} (~${estimateLines(deadExport.type)} lines)`;
}

function generateImportImpact(unusedImport: UnusedImport): string {
  return `Remove unused ${unusedImport.type} import (~1 line)`;
}

function estimateLines(type: string): number {
  const estimates = {
    function: 10,
    class: 20,
    variable: 1,
    interface: 5,
    type: 2,
  };

  return estimates[type] || 5;
}

function generateRemovalCommand(deadExport: DeadExport): string {
  return `# Remove lines around ${deadExport.line} in ${path.basename(deadExport.file)}`;
}

function generateImportRemovalCommand(unusedImport: UnusedImport): string {
  return `# Remove import on line ${unusedImport.line} in ${path.basename(unusedImport.file)}`;
}
