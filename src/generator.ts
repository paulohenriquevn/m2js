/* eslint-disable max-lines */
/* eslint-disable max-lines-per-function */

import {
  ParsedFile,
  ParsedFunction,
  ParsedClass,
  ParsedMethod,
  Parameter,
  GeneratorOptions,
  DependencyGraph,
  DependencyRelationship,
  GraphOptions,
} from './types';
import path from 'path';

const DEFAULT_OPTIONS: GeneratorOptions = {
  includeComments: false,
};

export function generateMarkdown(
  parsedFile: ParsedFile,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _options: GeneratorOptions = DEFAULT_OPTIONS
): string {
  // Note: _options parameter reserved for future includeComments feature
  const sections: string[] = [];

  sections.push(generateEnhancedHeader(parsedFile));
  sections.push(generateExportsSection(parsedFile));

  if (parsedFile.functions.length > 0) {
    sections.push(generateFunctionsSection(parsedFile.functions));
  }

  if (parsedFile.classes.length > 0) {
    sections.push(generateClassesSection(parsedFile.classes));
  }

  if (parsedFile.functions.length === 0 && parsedFile.classes.length === 0) {
    sections.push('No exported functions or classes found.');
  }

  return sections.join('\n\n');
}

function generateEnhancedHeader(parsedFile: ParsedFile): string {
  // Try to show relative path from current working directory, fallback to absolute
  const cwd = process.cwd();
  let displayPath = parsedFile.filePath;

  if (parsedFile.filePath.startsWith(cwd)) {
    displayPath = path.relative(cwd, parsedFile.filePath);
    // Add ./ prefix for relative paths to be clear
    if (!displayPath.startsWith('.')) {
      displayPath = `./${displayPath}`;
    }
  }

  return `# 📁 ${escapeMarkdown(displayPath)}`;
}

function generateExportsSection(parsedFile: ParsedFile): string {
  const { exportMetadata } = parsedFile;
  const sections: string[] = ['## 📦 Exports'];

  // Add export counts
  if (exportMetadata.totalFunctions > 0) {
    const plural = exportMetadata.totalFunctions === 1 ? '' : 's';
    sections.push(
      `- **Functions**: ${exportMetadata.totalFunctions} exported function${plural}`
    );
  }

  if (exportMetadata.totalClasses > 0) {
    const plural = exportMetadata.totalClasses === 1 ? '' : 'es';
    sections.push(
      `- **Classes**: ${exportMetadata.totalClasses} exported class${plural}`
    );
  }

  // Add default export information
  if (exportMetadata.hasDefaultExport) {
    const exportType = exportMetadata.defaultExportType;
    const exportName = exportMetadata.defaultExportName;
    sections.push(`- **Default Export**: ${exportName} ${exportType}`);
  }

  // If no exports found
  if (
    exportMetadata.totalFunctions === 0 &&
    exportMetadata.totalClasses === 0
  ) {
    sections.push('- No exported functions or classes found');
  }

  return sections.join('\n');
}

function generateFunctionsSection(functions: ParsedFunction[]): string {
  const sections: string[] = ['## 🔧 Functions'];

  // Use compact format for utility files with many simple functions
  if (shouldUseCompactFormat(functions)) {
    sections.push(generateCompactFunctionsTable(functions));
  } else {
    functions.forEach(func => {
      sections.push(generateFunctionMarkdown(func));
    });
  }

  return sections.join('\n\n');
}

/**
 * Determines if we should use compact format for functions
 * Criteria: 5+ functions where most are simple utilities
 */
function shouldUseCompactFormat(functions: ParsedFunction[]): boolean {
  if (functions.length < 5) return false;
  
  // Check if most functions are simple (few params, simple types)
  const simpleFunctions = functions.filter(func => {
    const hasSimpleParams = func.params.length <= 3;
    const hasSimpleReturn = func.returnType && ['boolean', 'string', 'number', 'void'].includes(func.returnType);
    const hasShortJSDoc = !func.jsDoc || func.jsDoc.length < 200;
    
    return hasSimpleParams && hasSimpleReturn && hasShortJSDoc;
  });
  
  // Use compact format if 70%+ of functions are simple
  return simpleFunctions.length / functions.length >= 0.7;
}

/**
 * Generates a compact table format for utility functions
 */
function generateCompactFunctionsTable(functions: ParsedFunction[]): string {
  const sections: string[] = [];
  
  sections.push('| Function | Parameters | Returns | Description |');
  sections.push('|----------|------------|---------|-------------|');
  
  functions.forEach(func => {
    const name = func.isDefault ? 'default' : func.name;
    const params = func.params.map(p => `${p.name}${p.optional ? '?' : ''}: ${p.type || 'any'}`).join(', ');
    const returnType = func.returnType || 'unknown';
    
    // Extract first line of JSDoc as description
    let description = 'Utility function';
    if (func.jsDoc) {
      // Try multiple patterns to extract description
      const patterns = [
        /\/\*\*\s*\n?\s*\*\s*(.+?)(?:\n|\*\/)/,  // Standard JSDoc
        /\/\*\*\s*(.+?)(?:\n|\*\/)/,              // Inline JSDoc
        /\*\s*(.+?)(?:\n|\*\/|@)/                 // Any comment line before @
      ];
      
      for (const pattern of patterns) {
        const match = func.jsDoc.match(pattern);
        if (match && match[1] && match[1].trim()) {
          description = match[1].trim();
          break;
        }
      }
      
      // Clean up common prefixes and shorten
      description = description.replace(/^(Validates?|Checks?|Returns?|Gets?|Creates?)\s+/i, '');
      if (description.length > 45) {
        description = description.substring(0, 42) + '...';
      }
    }
    
    sections.push(`| \`${name}\` | \`${params}\` | \`${returnType}\` | ${description} |`);
  });
  
  // Add a note about compact format
  sections.push('');
  sections.push('*Compact format used for utility functions - see source for implementation details*');
  
  return sections.join('\n');
}

function generateFunctionMarkdown(func: ParsedFunction): string {
  const sections: string[] = [];

  const displayName = func.isDefault ? 'default' : func.name;
  sections.push(`### ${escapeMarkdown(displayName)}`);

  if (func.jsDoc) {
    sections.push(func.jsDoc);
    sections.push('');
  }

  // Add hierarchical parameters section
  const paramsList = generateParametersList(func.params);
  const returnType = generateReturnType(func.returnType);

  // Add empty line after function name if we have params or return type
  if (paramsList || returnType) {
    sections.push('');
  }

  if (paramsList) {
    sections.push(paramsList);
    sections.push('');
  }

  if (returnType) {
    sections.push(returnType);
    sections.push('');
  }

  sections.push('```typescript');
  sections.push(func.signature);
  sections.push('```');

  return sections.join('\n');
}

function escapeMarkdown(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/\*/g, '\\*')
    .replace(/_/g, '\\_')
    .replace(/`/g, '\\`')
    .replace(/#/g, '\\#')
    .replace(/\[/g, '\\[')
    .replace(/\]/g, '\\]')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');
}

function generateClassesSection(classes: ParsedClass[]): string {
  const sections: string[] = ['## 🏗️ Classes'];

  classes.forEach(cls => {
    sections.push(generateClassMarkdown(cls));
  });

  return sections.join('\n\n');
}

function generateClassMarkdown(cls: ParsedClass): string {
  const sections: string[] = [];

  sections.push(`### ${escapeMarkdown(cls.name)}`);

  if (cls.jsDoc) {
    sections.push(cls.jsDoc);
    sections.push('');
  }

  // Add hierarchical methods overview
  const methodsList = generateMethodsList(cls.methods);
  if (methodsList) {
    sections.push(methodsList);
    sections.push('');
  }

  // Generate class signature with public methods only
  const publicMethods = cls.methods.filter(method => !method.isPrivate);

  sections.push('```typescript');
  if (publicMethods.length > 0) {
    sections.push(`export class ${cls.name} {`);
    publicMethods.forEach(method => {
      sections.push(`  ${method.signature}`);
    });
    sections.push('}');
  } else {
    sections.push(`export class ${cls.name} {}`);
  }
  sections.push('```');

  // Only generate individual method docs for classes with few methods
  // For utility classes, the class signature is sufficient
  if (publicMethods.length <= 4) {
    publicMethods.forEach(method => {
      sections.push('');
      sections.push(generateMethodMarkdown(method));
    });
  } else {
    sections.push('');
    sections.push('*Method details available in source code*');
  }

  return sections.join('\n');
}

function generateMethodMarkdown(method: ParsedMethod): string {
  const sections: string[] = [];

  sections.push(`#### ${escapeMarkdown(method.name)}`);

  if (method.jsDoc) {
    sections.push(method.jsDoc);
    sections.push('');
  }

  // Add hierarchical parameters section
  const paramsList = generateParametersList(method.params);
  const returnType = generateReturnType(method.returnType);

  // Add empty line after method name if we have params or return type
  if (paramsList || returnType) {
    sections.push('');
  }

  if (paramsList) {
    sections.push(paramsList);
    sections.push('');
  }

  if (returnType) {
    sections.push(returnType);
    sections.push('');
  }

  sections.push('```typescript');
  sections.push(method.signature);
  sections.push('```');

  return sections.join('\n');
}

function generateParametersList(params: Parameter[]): string {
  if (params.length === 0) {
    return '';
  }

  const sections: string[] = ['**Parameters:**'];
  params.forEach(param => {
    const optional = param.optional ? '?' : '';
    const type = param.type || 'unknown';
    sections.push(`- ${param.name}${optional}: ${type}`);
  });

  return sections.join('\n');
}

function generateReturnType(returnType?: string): string {
  if (!returnType) {
    return '';
  }

  return `**Returns:** ${returnType}`;
}

function generateMethodsList(methods: ParsedMethod[]): string {
  const publicMethods = methods.filter(method => !method.isPrivate);

  if (publicMethods.length === 0) {
    return '';
  }

  const sections: string[] = ['**Methods:**'];
  publicMethods.forEach(method => {
    sections.push(`- ${method.name}`);
  });

  return sections.join('\n');
}

export function getOutputPath(
  inputPath: string,
  customOutput?: string
): string {
  if (customOutput) {
    return customOutput;
  }

  const parsedPath = path.parse(inputPath);
  return path.join(parsedPath.dir, `${parsedPath.name}.md`);
}

// === DEPENDENCY GRAPH MARKDOWN GENERATION ===

/**
 * Generate comprehensive dependency graph markdown
 */
export function generateDependencyMarkdown(
  graph: DependencyGraph,
  options: GraphOptions = {}
): string {
  const sections: string[] = [];

  // Header with project info
  sections.push(generateGraphHeader(graph));

  // Module dependencies
  sections.push(generateModuleDependencies(graph));

  // Metrics section
  sections.push(generateGraphMetrics(graph));

  // Circular dependencies warning
  if (graph.metrics.circularDependencies.length > 0) {
    sections.push(
      generateCircularDependencies(graph.metrics.circularDependencies)
    );
  }

  // Architecture layers
  sections.push(generateArchitectureLayers(graph));

  // Mermaid diagram if requested
  if (options.includeMermaid) {
    sections.push(generateMermaidDiagram(graph));
  }

  return sections.join('\n\n');
}

/**
 * Generate graph header
 */
function generateGraphHeader(graph: DependencyGraph): string {
  const cwd = process.cwd();
  let displayPath = graph.projectPath;

  if (graph.projectPath.startsWith(cwd)) {
    displayPath = path.relative(cwd, graph.projectPath);
    if (!displayPath.startsWith('.')) {
      displayPath = `./${displayPath}`;
    }
  }

  return `# 📊 Dependency Analysis - ${escapeMarkdown(displayPath)}`;
}

/**
 * Generate module dependencies section
 */
function generateModuleDependencies(graph: DependencyGraph): string {
  const sections: string[] = ['## 🔗 Module Dependencies'];

  // Group dependencies by source file
  const dependencyMap = new Map<string, DependencyRelationship[]>();

  graph.edges.forEach(edge => {
    if (!dependencyMap.has(edge.from)) {
      dependencyMap.set(edge.from, []);
    }
    dependencyMap.get(edge.from)!.push(edge);
  });

  // Sort files and generate dependency lists
  const sortedFiles = Array.from(dependencyMap.keys()).sort();

  if (sortedFiles.length === 0) {
    sections.push('*No dependencies found*');
    return sections.join('\n');
  }

  // Group by internal vs external
  const internalFiles = sortedFiles.filter(file =>
    dependencyMap.get(file)!.some(dep => !dep.isExternal)
  );

  // Internal dependencies
  if (internalFiles.length > 0) {
    sections.push('### Internal Dependencies');
    internalFiles.forEach(file => {
      const deps = dependencyMap.get(file)!.filter(dep => !dep.isExternal);
      if (deps.length > 0) {
        const fileName = path.basename(file);
        
        // Group dependencies by target file and count occurrences
        const depCounts = new Map<string, number>();
        deps.forEach(dep => {
          const count = depCounts.get(dep.to) || 0;
          depCounts.set(dep.to, count + 1);
        });
        
        // Format with counts for duplicates
        const depList = Array.from(depCounts.entries())
          .map(([depPath, count]) => {
            return count > 1 ? `\`${depPath}\` (${count}x)` : `\`${depPath}\``;
          })
          .join(', ');
        
        sections.push(`- **${fileName}** → ${depList}`);
      }
    });
    sections.push('');
  }

  // External dependencies
  const allExternalDeps = new Set<string>();
  graph.edges
    .filter(edge => edge.isExternal)
    .forEach(edge => {
      allExternalDeps.add(edge.to);
    });

  if (allExternalDeps.size > 0) {
    sections.push('### External Dependencies');
    const sortedExternal = Array.from(allExternalDeps).sort();
    sortedExternal.forEach(dep => {
      const usedBy = graph.edges
        .filter(edge => edge.to === dep && edge.isExternal)
        .map(edge => path.basename(edge.from));
      const uniqueUsers = Array.from(new Set(usedBy)).sort();
      sections.push(`- **${dep}** (used by: ${uniqueUsers.join(', ')})`);
    });
  }

  return sections.join('\n');
}

/**
 * Generate metrics section
 */
function generateGraphMetrics(graph: DependencyGraph): string {
  const { metrics } = graph;
  const sections: string[] = ['## 📈 Dependency Metrics'];

  sections.push(`- **Total Modules**: ${metrics.totalNodes}`);
  sections.push(`- **Total Dependencies**: ${metrics.totalEdges}`);
  sections.push(`- **Internal Dependencies**: ${metrics.internalDependencies}`);
  sections.push(`- **External Dependencies**: ${metrics.externalDependencies}`);
  sections.push(
    `- **Average Dependencies per Module**: ${metrics.averageDependencies}`
  );

  if (metrics.mostConnectedModule) {
    const moduleName = path.basename(metrics.mostConnectedModule);
    sections.push(`- **Most Connected Module**: ${moduleName}`);
  }

  // Circular dependencies status
  if (metrics.circularDependencies.length === 0) {
    sections.push('- **Circular Dependencies**: ❌ None detected');
  } else {
    sections.push(
      `- **Circular Dependencies**: ⚠️ ${metrics.circularDependencies.length} detected`
    );
  }

  return sections.join('\n');
}

/**
 * Generate circular dependencies warning
 */
function generateCircularDependencies(cycles: string[][]): string {
  const sections: string[] = ['## ⚠️ Circular Dependencies'];

  cycles.forEach((cycle, index) => {
    const cycleDisplay = cycle.map(file => path.basename(file)).join(' → ');
    sections.push(`${index + 1}. **${cycleDisplay}**`);
  });

  sections.push('');
  sections.push(
    '*Circular dependencies can lead to runtime errors and should be resolved.*'
  );

  return sections.join('\n');
}

/**
 * Generate architecture layers
 */
function generateArchitectureLayers(graph: DependencyGraph): string {
  const sections: string[] = ['## 🏗️ Architecture Layers'];

  // Simple layer detection based on common patterns
  const layers = detectArchitectureLayers(graph);

  Object.entries(layers).forEach(([layerName, files]) => {
    if (files.length > 0) {
      sections.push(`### ${layerName}`);
      files.forEach(file => {
        const baseName = path.basename(file);
        const description = getFileDescription(baseName);
        sections.push(`- **${baseName}** - ${description}`);
      });
      sections.push('');
    }
  });

  return sections.join('\n');
}

/**
 * Detect architecture layers based on file patterns
 */
function detectArchitectureLayers(
  graph: DependencyGraph
): Record<string, string[]> {
  const layers: Record<string, string[]> = {
    'CLI Layer': [],
    'Core Logic': [],
    Utilities: [],
    Types: [],
    Tests: [],
  };

  graph.nodes.forEach(file => {
    const baseName = path.basename(file).toLowerCase();

    if (baseName.includes('cli') || baseName.includes('command')) {
      layers['CLI Layer'].push(file);
    } else if (baseName.includes('test') || baseName.includes('spec')) {
      layers['Tests'].push(file);
    } else if (baseName.includes('type') || baseName.includes('interface')) {
      layers['Types'].push(file);
    } else if (baseName.includes('util') || baseName.includes('helper')) {
      layers['Utilities'].push(file);
    } else {
      layers['Core Logic'].push(file);
    }
  });

  // Remove empty layers
  Object.keys(layers).forEach(key => {
    if (layers[key].length === 0) {
      delete layers[key];
    }
  });

  return layers;
}

/**
 * Get file description based on name patterns
 */
function getFileDescription(fileName: string): string {
  const name = fileName.toLowerCase();

  if (name.includes('cli'))
    return 'Command-line interface and argument parsing';
  if (name.includes('parser')) return 'Code parsing and AST analysis';
  if (name.includes('generator')) return 'Markdown generation and formatting';
  if (name.includes('analyzer'))
    return 'Dependency analysis and graph building';
  if (name.includes('scanner')) return 'File system scanning and discovery';
  if (name.includes('batch')) return 'Batch processing coordination';
  if (name.includes('types')) return 'TypeScript type definitions';
  if (name.includes('util')) return 'Utility functions and helpers';
  if (name.includes('test')) return 'Test cases and validation';

  return 'Core functionality';
}

/**
 * Generate Mermaid diagram
 */
function generateMermaidDiagram(graph: DependencyGraph): string {
  const sections: string[] = ['## 🗺️ Visual Dependency Map'];

  sections.push('```mermaid');
  sections.push('graph TD');

  // Create node definitions with clean names
  const nodeMap = new Map<string, string>();
  graph.nodes.forEach((file, index) => {
    const cleanName = path
      .basename(file, path.extname(file))
      .replace(/[^a-zA-Z0-9]/g, '')
      .substring(0, 10);
    const nodeId = `${cleanName}${index}`;
    nodeMap.set(file, nodeId);

    const displayName = path.basename(file);
    sections.push(`    ${nodeId}[${displayName}]`);
  });

  // Add edges (only internal dependencies for clarity)
  const internalEdges = graph.edges.filter(edge => !edge.isExternal);
  
  // Deduplicate edges by grouping from -> to relationships
  const edgeMap = new Map<string, Set<string>>();
  
  internalEdges.forEach(edge => {
    const fromNode = nodeMap.get(edge.from);
    
    // Resolve relative paths to absolute paths for mapping
    let resolvedToPath = edge.to;
    if (edge.to.startsWith('./') || edge.to.startsWith('../')) {
      try {
        resolvedToPath = path.resolve(path.dirname(edge.from), edge.to);
        // Add common file extensions if missing
        if (!path.extname(resolvedToPath)) {
          const extensions = ['.ts', '.tsx', '.js', '.jsx'];
          for (const ext of extensions) {
            const withExt = resolvedToPath + ext;
            if (nodeMap.has(withExt)) {
              resolvedToPath = withExt;
              break;
            }
          }
        }
      } catch (e) {
        // If resolution fails, try to find by basename
        const basename = path.basename(edge.to);
        for (const [nodePath] of nodeMap.entries()) {
          if (path.basename(nodePath, path.extname(nodePath)) === basename.replace(/\.(ts|tsx|js|jsx)$/, '')) {
            resolvedToPath = nodePath;
            break;
          }
        }
      }
    }
    
    const toNode = nodeMap.get(resolvedToPath);
    
    if (fromNode && toNode && fromNode !== toNode) {
      if (!edgeMap.has(fromNode)) {
        edgeMap.set(fromNode, new Set());
      }
      edgeMap.get(fromNode)!.add(toNode);
    }
  });
  
  // Generate unique edges
  for (const [fromNode, toNodes] of edgeMap.entries()) {
    for (const toNode of toNodes) {
      sections.push(`    ${fromNode} --> ${toNode}`);
    }
  }

  sections.push('```');

  return sections.join('\n');
}
