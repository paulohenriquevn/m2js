/* eslint-disable max-lines */
/* eslint-disable max-lines-per-function */

import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import * as t from '@babel/types';
import { readFileSync } from 'fs';
import path from 'path';
import {
  DependencyRelationship,
  DependencyGraph,
  GraphMetrics,
  GraphOptions,
} from './types';

// Babel parser configuration for dependency analysis
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DEPENDENCY_PARSE_CONFIG: any = {
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
 * Extract dependencies from a single file's AST
 */
export function extractFileDependencies(
  filePath: string,
  content: string
): DependencyRelationship[] {
  const dependencies: DependencyRelationship[] = [];

  try {
    const ast = parse(content, DEPENDENCY_PARSE_CONFIG);

    traverse(ast, {
      ImportDeclaration(nodePath) {
        const source = nodePath.node.source.value;
        const isExternal =
          !source.startsWith('./') &&
          !source.startsWith('../') &&
          !source.startsWith('/');

        // Handle different import types
        nodePath.node.specifiers.forEach(spec => {
          if (t.isImportDefaultSpecifier(spec)) {
            dependencies.push({
              from: filePath,
              to: source,
              type: 'import',
              importName: spec.local.name,
              isExternal,
              importType: 'default',
            });
          } else if (t.isImportSpecifier(spec)) {
            const importName = t.isIdentifier(spec.imported)
              ? spec.imported.name
              : spec.imported.value;

            dependencies.push({
              from: filePath,
              to: source,
              type: 'import',
              importName,
              isExternal,
              importType: 'named',
            });
          } else if (t.isImportNamespaceSpecifier(spec)) {
            dependencies.push({
              from: filePath,
              to: source,
              type: 'import',
              importName: spec.local.name,
              isExternal,
              importType: 'namespace',
            });
          }
        });

        // Handle side-effect imports (no specifiers)
        if (nodePath.node.specifiers.length === 0) {
          dependencies.push({
            from: filePath,
            to: source,
            type: 'import',
            isExternal,
            importType: 'side-effect',
          });
        }
      },

      ExportNamedDeclaration(nodePath) {
        if (nodePath.node.source) {
          const source = nodePath.node.source.value;
          const isExternal =
            !source.startsWith('./') &&
            !source.startsWith('../') &&
            !source.startsWith('/');

          nodePath.node.specifiers?.forEach(spec => {
            if (t.isExportSpecifier(spec)) {
              const exportName = t.isIdentifier(spec.exported)
                ? spec.exported.name
                : spec.exported.value;

              dependencies.push({
                from: filePath,
                to: source,
                type: 'export',
                importName: exportName,
                isExternal,
                importType: 'named',
              });
            }
          });
        }
      },

      ExportAllDeclaration(nodePath) {
        if (nodePath.node.source) {
          const source = nodePath.node.source.value;
          const isExternal =
            !source.startsWith('./') &&
            !source.startsWith('../') &&
            !source.startsWith('/');

          dependencies.push({
            from: filePath,
            to: source,
            type: 'export',
            isExternal,
            importType: 'namespace',
          });
        }
      },

      // Handle type-only imports
      TSImportType(nodePath) {
        if (t.isStringLiteral(nodePath.node.argument)) {
          const source = nodePath.node.argument.value;
          const isExternal =
            !source.startsWith('./') &&
            !source.startsWith('../') &&
            !source.startsWith('/');

          dependencies.push({
            from: filePath,
            to: source,
            type: 'type',
            isExternal,
            importType: 'named',
          });
        }
      },
    });
  } catch (error) {
    // Fail-fast: throw parse errors immediately
    throw new Error(
      `Failed to parse dependencies in ${filePath}: ${(error as Error).message}`
    );
  }

  return dependencies;
}

/**
 * Analyze dependencies for an array of files
 */
export function analyzeDependencies(
  files: string[],
  options: GraphOptions = {}
): DependencyGraph {
  if (files.length === 0) {
    throw new Error('No files provided for dependency analysis');
  }

  const allDependencies: DependencyRelationship[] = [];
  const projectPath = findCommonPath(files);

  // Extract dependencies from each file
  for (const file of files) {
    try {
      const content = readFileSync(file, 'utf-8');
      const fileDeps = extractFileDependencies(file, content);
      allDependencies.push(...fileDeps);
    } catch (error) {
      throw new Error(
        `Failed to analyze file ${file}: ${(error as Error).message}`
      );
    }
  }

  // Build unique node list
  const nodeSet = new Set<string>();
  files.forEach(file => nodeSet.add(file));

  // Add external dependencies to nodes if requested
  if (options.includeExternalDeps) {
    allDependencies
      .filter(dep => dep.isExternal)
      .forEach(dep => nodeSet.add(dep.to));
  }

  // Generate metrics
  const metrics = calculateGraphMetrics(
    Array.from(nodeSet),
    allDependencies,
    options
  );

  return {
    projectPath,
    nodes: Array.from(nodeSet).sort(),
    edges: allDependencies,
    metrics,
  };
}

/**
 * Calculate graph metrics
 */
function calculateGraphMetrics(
  nodes: string[],
  edges: DependencyRelationship[],
  options: GraphOptions
): GraphMetrics {
  const internalEdges = edges.filter(edge => !edge.isExternal);
  const externalEdges = edges.filter(edge => edge.isExternal);

  // Find most connected module
  const connectionCounts = new Map<string, number>();
  internalEdges.forEach(edge => {
    connectionCounts.set(edge.from, (connectionCounts.get(edge.from) || 0) + 1);
  });

  const mostConnectedModule = Array.from(connectionCounts.entries()).sort(
    ([, a], [, b]) => b - a
  )[0]?.[0];

  // Calculate average dependencies per module
  const averageDependencies =
    nodes.length > 0
      ? Math.round((internalEdges.length / nodes.length) * 10) / 10
      : 0;

  // Detect circular dependencies if requested
  const circularDependencies = options.detectCircular
    ? detectCircularDependencies(nodes, internalEdges)
    : [];

  return {
    totalNodes: nodes.length,
    totalEdges: edges.length,
    internalDependencies: internalEdges.length,
    externalDependencies: externalEdges.length,
    circularDependencies,
    mostConnectedModule,
    averageDependencies,
  };
}

/**
 * Detect circular dependencies using DFS
 */
function detectCircularDependencies(
  nodes: string[],
  edges: DependencyRelationship[]
): string[][] {
  const adjList = new Map<string, string[]>();
  const cycles: string[][] = [];

  // Build adjacency list
  nodes.forEach(node => adjList.set(node, []));
  edges.forEach(edge => {
    if (!edge.isExternal) {
      const targets = adjList.get(edge.from) || [];
      targets.push(edge.to);
      adjList.set(edge.from, targets);
    }
  });

  // DFS to detect cycles
  const visited = new Set<string>();
  const recursionStack = new Set<string>();
  const path: string[] = [];

  function dfs(node: string): boolean {
    if (recursionStack.has(node)) {
      // Found cycle - extract it from path
      const cycleStart = path.indexOf(node);
      if (cycleStart >= 0) {
        cycles.push([...path.slice(cycleStart), node]);
      }
      return true;
    }

    if (visited.has(node)) {
      return false;
    }

    visited.add(node);
    recursionStack.add(node);
    path.push(node);

    const neighbors = adjList.get(node) || [];
    for (const neighbor of neighbors) {
      if (dfs(neighbor)) {
        // Continue to find all cycles
      }
    }

    recursionStack.delete(node);
    path.pop();
    return false;
  }

  // Check each node
  nodes.forEach(node => {
    if (!visited.has(node)) {
      dfs(node);
    }
  });

  return cycles;
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

/**
 * Resolve relative paths to absolute paths within project
 */
export function resolveModulePath(fromFile: string, toModule: string): string {
  // Handle relative imports
  if (toModule.startsWith('./') || toModule.startsWith('../')) {
    const fromDir = path.dirname(fromFile);
    const resolved = path.resolve(fromDir, toModule);

    // Try common TypeScript/JavaScript extensions
    const extensions = ['.ts', '.tsx', '.js', '.jsx', '.d.ts'];

    for (const ext of extensions) {
      const withExt = resolved + ext;
      try {
        readFileSync(withExt);
        return withExt;
      } catch {
        // Continue trying other extensions
      }
    }

    // Try index files
    for (const ext of extensions) {
      const indexFile = path.join(resolved, `index${ext}`);
      try {
        readFileSync(indexFile);
        return indexFile;
      } catch {
        // Continue trying other index files
      }
    }

    return resolved; // Return as-is if file not found
  }

  // Return external modules as-is
  return toModule;
}
