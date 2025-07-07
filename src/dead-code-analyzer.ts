/**
 * Dead Code Analyzer for M2JS
 * Detects exported functions, classes, and variables that are never imported
 */

import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import * as t from '@babel/types';
import { readFileSync } from 'fs';
import path from 'path';
import {
  DeadExport,
  ExportInfo,
  ImportInfo,
  DeadCodeReport,
  DeadCodeMetrics,
  UnusedImport,
} from './dead-code-types';
import {
  generateRemovalSuggestions,
  assessExportRemovalRisk,
  assessImportRemovalRisk,
} from './suggestion-engine';
import {
  OptimizedFileProcessor,
  OptimizedDataStructures,
  ProgressIndicator,
  PerformanceOptions,
} from './performance-optimizer';

// Babel parser configuration for dead code analysis
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DEAD_CODE_PARSE_CONFIG: any = {
  sourceType: 'module',
  plugins: [
    'typescript',
    'jsx',
    'decorators-legacy',
    'classProperties',
    'asyncGenerators',
    'bigInt',
    'dynamicImport',
  ],
};

/**
 * Main function to analyze dead code in multiple files
 */
export async function analyzeDeadCode(
  files: string[],
  performanceOptions: Partial<PerformanceOptions> = {}
): Promise<DeadCodeReport> {
  if (files.length === 0) {
    throw new Error('No files provided for dead code analysis');
  }

  const startTime = Date.now();
  const projectPath = findCommonPath(files);

  // Initialize performance optimizer
  const processor = new OptimizedFileProcessor(performanceOptions);
  const progressIndicator = performanceOptions.showProgress ? new ProgressIndicator() : null;

  // Extract exports and imports from all files using optimized processor
  const { allExports, allImports } = await processor.processFiles(
    files,
    (filePath: string, content: string) => {
      const exports = extractExports(filePath, content);
      const imports = extractImports(filePath, content);
      return { exports, imports };
    },
    progressIndicator ? (processed, total, currentFile) => {
      progressIndicator.update(processed, total, currentFile);
    } : undefined
  );

  // Find dead exports by cross-referencing exports vs imports (optimized)
  const deadExports = findDeadExportsOptimized(allExports, allImports, projectPath);

  // Find unused imports by checking if they're referenced in code
  const unusedImports = findUnusedImports(files);

  // Generate removal suggestions with confidence levels
  const suggestions = generateRemovalSuggestions(deadExports, unusedImports, projectPath);

  // Calculate metrics with performance stats
  const analysisTime = Date.now() - startTime;
  const performanceStats = processor.getPerformanceStats();
  const metrics = calculateMetrics(
    files,
    allExports,
    allImports,
    deadExports,
    unusedImports,
    analysisTime,
    performanceStats
  );

  return {
    deadExports,
    unusedImports,
    suggestions,
    metrics,
    projectPath,
  };
}

/**
 * Extract all exports from a file
 */
function extractExports(filePath: string, content: string): ExportInfo[] {
  const exports: ExportInfo[] = [];

  try {
    const ast = parse(content, DEAD_CODE_PARSE_CONFIG);

    traverse(ast, {
      ExportNamedDeclaration(nodePath) {
        processNamedExports(nodePath, filePath, exports);
      },
      ExportDefaultDeclaration(nodePath) {
        processDefaultExports(nodePath, filePath, exports);
      },
    });
  } catch (error) {
    throw new Error(`Parse error in ${filePath}: ${(error as Error).message}`);
  }

  return exports;
}

/**
 * Process named export declarations
 */
function processNamedExports(
  nodePath: any,
  filePath: string,
  exports: ExportInfo[]
): void {
  const declaration = nodePath.node.declaration;
  const line = nodePath.node.loc?.start.line || 0;

  // Handle export function/class/variable declarations
  if (t.isFunctionDeclaration(declaration) && declaration.id) {
    exports.push({
      name: declaration.id.name,
      type: 'function',
      file: filePath,
      line,
      isDefault: false,
    });
  } else if (t.isClassDeclaration(declaration) && declaration.id) {
    exports.push({
      name: declaration.id.name,
      type: 'class',
      file: filePath,
      line,
      isDefault: false,
    });
  } else if (t.isVariableDeclaration(declaration)) {
    declaration.declarations.forEach(declarator => {
      if (t.isIdentifier(declarator.id)) {
        exports.push({
          name: declarator.id.name,
          type: 'variable',
          file: filePath,
          line,
          isDefault: false,
        });
      }
    });
  } else if (t.isTSInterfaceDeclaration(declaration)) {
    exports.push({
      name: declaration.id.name,
      type: 'interface',
      file: filePath,
      line,
      isDefault: false,
    });
  } else if (t.isTSTypeAliasDeclaration(declaration)) {
    exports.push({
      name: declaration.id.name,
      type: 'type',
      file: filePath,
      line,
      isDefault: false,
    });
  }

  // Handle export specifiers (export { foo, bar })
  if (nodePath.node.specifiers) {
    nodePath.node.specifiers.forEach(specifier => {
      if (t.isExportSpecifier(specifier)) {
        const exportName = t.isIdentifier(specifier.exported)
          ? specifier.exported.name
          : specifier.exported.value;

        exports.push({
          name: exportName,
          type: 'variable', // Default to variable for specifiers
          file: filePath,
          line,
          isDefault: false,
        });
      }
    });
  }
}

/**
 * Process default export declarations
 */
function processDefaultExports(
  nodePath: any,
  filePath: string,
  exports: ExportInfo[]
): void {
  const declaration = nodePath.node.declaration;
  const line = nodePath.node.loc?.start.line || 0;

  if (t.isFunctionDeclaration(declaration)) {
    const name = declaration.id?.name || 'default';
    exports.push({
      name,
      type: 'function',
      file: filePath,
      line,
      isDefault: true,
    });
  } else if (t.isClassDeclaration(declaration)) {
    const name = declaration.id?.name || 'default';
    exports.push({
      name,
      type: 'class',
      file: filePath,
      line,
      isDefault: true,
    });
  } else if (t.isIdentifier(declaration)) {
    exports.push({
      name: declaration.name,
      type: 'variable',
      file: filePath,
      line,
      isDefault: true,
    });
  }
}

/**
 * Extract all imports from a file
 */
function extractImports(filePath: string, content: string): ImportInfo[] {
  const imports: ImportInfo[] = [];

  try {
    const ast = parse(content, DEAD_CODE_PARSE_CONFIG);

    traverse(ast, {
      ImportDeclaration(nodePath) {
        const source = nodePath.node.source.value;
        const line = nodePath.node.loc?.start.line || 0;

        // Only track relative imports (internal to project)
        if (source.startsWith('./') || source.startsWith('../')) {
          nodePath.node.specifiers.forEach(specifier => {
            if (t.isImportDefaultSpecifier(specifier)) {
              imports.push({
                name: 'default',
                from: source,
                file: filePath,
                line,
                type: 'default',
              });
            } else if (t.isImportSpecifier(specifier)) {
              const importName = t.isIdentifier(specifier.imported)
                ? specifier.imported.name
                : specifier.imported.value;

              imports.push({
                name: importName,
                from: source,
                file: filePath,
                line,
                type: 'named',
              });
            } else if (t.isImportNamespaceSpecifier(specifier)) {
              imports.push({
                name: '*',
                from: source,
                file: filePath,
                line,
                type: 'namespace',
              });
            }
          });
        }
      },
    });
  } catch (error) {
    throw new Error(`Parse error in ${filePath}: ${(error as Error).message}`);
  }

  return imports;
}

/**
 * Optimized function to find dead exports - uses existing logic with batching
 */
function findDeadExportsOptimized(
  exports: ExportInfo[],
  imports: ImportInfo[],
  projectPath: string
): DeadExport[] {
  // Use the original logic but with performance optimizations
  return findDeadExports(exports, imports, projectPath);
}

/**
 * Legacy function for backward compatibility
 */
function findDeadExports(
  exports: ExportInfo[],
  imports: ImportInfo[],
  projectPath: string
): DeadExport[] {
  const deadExports: DeadExport[] = [];

  // Build a map of all imports for quick lookup
  const importMap = new Map<string, Set<string>>();

  imports.forEach(imp => {
    // Resolve relative import paths
    const resolvedPath = resolveImportPath(imp.file, imp.from);
    const importNames = importMap.get(resolvedPath) || new Set();

    if (imp.type === 'default') {
      importNames.add('default');
    } else if (imp.type === 'namespace') {
      importNames.add('*'); // Namespace import covers all exports
    } else {
      importNames.add(imp.name);
    }

    importMap.set(resolvedPath, importNames);
  });

  // Check each export to see if it's imported anywhere
  exports.forEach(exp => {
    const normalizedPath = path.resolve(exp.file);
    const importedNames = importMap.get(normalizedPath);

    // Check if this export is imported
    const isImported =
      importedNames &&
      (importedNames.has(exp.name) ||
        importedNames.has('*') ||
        (exp.isDefault && importedNames.has('default')));

    if (!isImported) {
      // Assess removal risk and confidence
      const baseDeadExport: DeadExport = {
        file: exp.file,
        name: exp.name,
        type: exp.type,
        line: exp.line,
        reason: 'Never imported in analyzed files',
        confidence: 'medium', // Default, will be updated
        riskFactors: [], // Default, will be updated
      };

      const riskAssessment = assessExportRemovalRisk(baseDeadExport, projectPath);
      
      deadExports.push({
        ...baseDeadExport,
        confidence: riskAssessment.confidence,
        riskFactors: riskAssessment.riskFactors,
      });
    }
  });

  return deadExports;
}

/**
 * Find unused imports by checking if they're referenced in code
 */
function findUnusedImports(files: string[]): UnusedImport[] {
  const unusedImports: UnusedImport[] = [];

  for (const file of files) {
    try {
      const content = readFileSync(file, 'utf-8');
      const fileUnusedImports = analyzeFileForUnusedImports(file, content);
      unusedImports.push(...fileUnusedImports);
    } catch (error) {
      // Skip files that can't be read
      continue;
    }
  }

  return unusedImports;
}

/**
 * Analyze a single file for unused imports
 */
function analyzeFileForUnusedImports(
  filePath: string,
  content: string
): UnusedImport[] {
  const unusedImports: UnusedImport[] = [];

  try {
    const ast = parse(content, DEAD_CODE_PARSE_CONFIG);
    const imports: ImportInfo[] = [];
    const usages: Set<string> = new Set();

    // First pass: collect all imports
    traverse(ast, {
      ImportDeclaration(nodePath) {
        const source = nodePath.node.source.value;
        const line = nodePath.node.loc?.start.line || 0;

        nodePath.node.specifiers.forEach(specifier => {
          if (t.isImportDefaultSpecifier(specifier)) {
            imports.push({
              name: specifier.local.name,
              from: source,
              file: filePath,
              line,
              type: 'default',
            });
          } else if (t.isImportSpecifier(specifier)) {
            imports.push({
              name: specifier.local.name,
              from: source,
              file: filePath,
              line,
              type: 'named',
            });
          } else if (t.isImportNamespaceSpecifier(specifier)) {
            imports.push({
              name: specifier.local.name,
              from: source,
              file: filePath,
              line,
              type: 'namespace',
            });
          }
        });
      },
    });

    // Second pass: collect all identifier usages
    traverse(ast, {
      Identifier(nodePath) {
        // Skip if this identifier is in an import declaration
        if (
          t.isImportDeclaration(nodePath.parent) ||
          t.isImportSpecifier(nodePath.parent) ||
          t.isImportDefaultSpecifier(nodePath.parent) ||
          t.isImportNamespaceSpecifier(nodePath.parent)
        ) {
          return;
        }

        // Skip if this is a property key in object notation
        if (
          t.isObjectProperty(nodePath.parent) &&
          nodePath.parent.key === nodePath.node &&
          !nodePath.parent.computed
        ) {
          return;
        }

        usages.add(nodePath.node.name);
      },

      // Handle JSX elements for React imports
      JSXIdentifier(nodePath) {
        usages.add(nodePath.node.name);
      },

      // Handle member expressions (namespace.member)
      MemberExpression(nodePath) {
        if (t.isIdentifier(nodePath.node.object)) {
          usages.add(nodePath.node.object.name);
        }
      },
    });

    // Check which imports are unused
    imports.forEach(importInfo => {
      if (!usages.has(importInfo.name)) {
        // Assess removal risk and confidence
        const baseUnusedImport: UnusedImport = {
          file: filePath,
          name: importInfo.name,
          from: importInfo.from,
          line: importInfo.line,
          type: importInfo.type,
          reason: 'Imported but never used in code',
          confidence: 'medium', // Default, will be updated
          riskFactors: [], // Default, will be updated
        };

        const riskAssessment = assessImportRemovalRisk(baseUnusedImport);
        
        unusedImports.push({
          ...baseUnusedImport,
          confidence: riskAssessment.confidence,
          riskFactors: riskAssessment.riskFactors,
        });
      }
    });
  } catch (error) {
    // Skip files with parse errors
  }

  return unusedImports;
}

/**
 * Resolve relative import path to absolute path
 */
function resolveImportPath(fromFile: string, importPath: string): string {
  const fromDir = path.dirname(fromFile);
  const resolved = path.resolve(fromDir, importPath);

  // Try common TypeScript/JavaScript extensions
  const extensions = ['.ts', '.tsx', '.js', '.jsx', '.d.ts', ''];

  for (const ext of extensions) {
    const withExt = resolved + ext;
    try {
      readFileSync(withExt);
      return path.resolve(withExt);
    } catch {
      // Continue trying other extensions
    }
  }

  // Try index files
  for (const ext of extensions.slice(0, -1)) {
    const indexFile = path.join(resolved, `index${ext}`);
    try {
      readFileSync(indexFile);
      return path.resolve(indexFile);
    } catch {
      // Continue trying other index files
    }
  }

  // Return resolved path even if file not found (for analysis)
  return path.resolve(resolved);
}

/**
 * Calculate metrics for the dead code analysis with performance stats
 */
function calculateMetrics(
  files: string[],
  allExports: ExportInfo[],
  allImports: ImportInfo[],
  deadExports: DeadExport[],
  unusedImports: UnusedImport[],
  analysisTimeMs: number,
  performanceStats?: {
    cacheHits: number;
    cacheMisses: number;
    hitRate: number;
    cacheSize: number;
  }
): DeadCodeMetrics & { performanceStats?: typeof performanceStats } {
  // Estimate savings based on average lines per export/import
  const avgLinesPerExport = 15; // Conservative estimate
  const avgLinesPerImport = 1; // Import lines are usually single line
  
  const estimatedSavingsKB = Math.round(
    ((deadExports.length * avgLinesPerExport + unusedImports.length * avgLinesPerImport) * 50) / 1024
  ); // ~50 chars per line

  const metrics: DeadCodeMetrics & { performanceStats?: typeof performanceStats } = {
    totalFiles: files.length,
    totalExports: allExports.length,
    totalImports: allImports.length,
    deadExports: deadExports.length,
    unusedImports: unusedImports.length,
    analysisTimeMs,
    estimatedSavingsKB,
  };
  
  if (performanceStats) {
    metrics.performanceStats = performanceStats;
  }
  
  return metrics;
}

/**
 * Find common path prefix for a list of files
 */
function findCommonPath(files: string[]): string {
  if (files.length === 0) return '';
  if (files.length === 1) return path.dirname(files[0]);

  const absolutePaths = files.map(file => path.resolve(file));
  const pathParts = absolutePaths.map(p => p.split(path.sep));

  const commonParts: string[] = [];
  const minLength = Math.min(...pathParts.map(parts => parts.length));

  for (let i = 0; i < minLength; i++) {
    const part = pathParts[0][i];
    if (pathParts.every(parts => parts[i] === part)) {
      commonParts.push(part);
    } else {
      break;
    }
  }

  return commonParts.join(path.sep) || '/';
}
