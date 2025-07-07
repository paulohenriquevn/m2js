export interface ParsedFunction {
  name: string;
  signature: string;
  isDefault: boolean;
  params: Parameter[];
  returnType?: string;
  jsDoc?: string;
}

export interface Parameter {
  name: string;
  type?: string;
  optional: boolean;
}

export interface ParsedMethod {
  name: string;
  signature: string;
  params: Parameter[];
  returnType?: string;
  isPrivate: boolean;
  jsDoc?: string;
}

export interface ParsedClass {
  name: string;
  methods: ParsedMethod[];
  jsDoc?: string;
}

export interface ExportMetadata {
  totalFunctions: number;
  totalClasses: number;
  hasDefaultExport: boolean;
  defaultExportType?: 'function' | 'class';
  defaultExportName?: string;
}

export interface ParsedFile {
  fileName: string;
  filePath: string;
  functions: ParsedFunction[];
  classes: ParsedClass[];
  exportMetadata: ExportMetadata;
}

export interface GeneratorOptions {
  includeComments?: boolean;
  outputPath?: string;
  businessContext?: boolean;
  usageExamples?: boolean;
  architectureInsights?: boolean;
  semanticAnalysis?: boolean;
}

export interface ParseOptions {
  sourceType: 'module' | 'script';
  plugins: ('typescript' | 'jsx' | 'decorators-legacy' | 'classProperties')[];
}

export interface CliOptions {
  output?: string;
  noComments?: boolean;
  graph?: boolean;
  mermaid?: boolean;
  usageExamples?: boolean;
  businessContext?: boolean;
  architectureInsights?: boolean;
  semanticAnalysis?: boolean;
  aiEnhanced?: boolean;
  detectUnused?: boolean;
  format?: 'table' | 'json';
  initConfig?: boolean;
  helpDeadCode?: boolean;
}

export interface ScanResult {
  files: string[];
  totalFound: number;
  errors: string[];
}

export interface BatchOptions {
  sourceDirectory: string;
  includeComments?: boolean;
  onProgress?: (current: number, total: number, fileName: string) => void;
  onFileProcessed?: (
    filePath: string,
    success: boolean,
    error?: string
  ) => void;
}

export interface BatchResult {
  totalFiles: number;
  successCount: number;
  failureCount: number;
  processedFiles: Array<{
    filePath: string;
    success: boolean;
    outputPath?: string;
    error?: string;
  }>;
}

// === DEPENDENCY GRAPH TYPES ===

export interface DependencyRelationship {
  from: string; // Source file path
  to: string; // Target file/module path
  type: 'import' | 'export' | 'type';
  importName?: string; // Specific import name
  isExternal: boolean; // NPM package vs local file
  importType: 'default' | 'named' | 'namespace' | 'side-effect';
}

export interface GraphMetrics {
  totalNodes: number;
  totalEdges: number;
  internalDependencies: number;
  externalDependencies: number;
  circularDependencies: string[][];
  mostConnectedModule?: string;
  averageDependencies: number;
}

export interface DependencyGraph {
  projectPath: string;
  nodes: string[]; // All file paths
  edges: DependencyRelationship[]; // All dependencies
  metrics: GraphMetrics;
}

export interface GraphOptions {
  includeMermaid?: boolean;
  includeExternalDeps?: boolean;
  detectCircular?: boolean;
}

// Template generation options
export interface TemplateOptions {
  domain: string;
  component: string;
  output?: string;
  interactive?: boolean;
  examples?: boolean;
  businessContext?: boolean;
  architectureGuide?: boolean;
  testingGuide?: boolean;
}
