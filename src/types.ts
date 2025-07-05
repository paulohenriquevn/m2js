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
}

export interface ParseOptions {
  sourceType: 'module' | 'script';
  plugins: ('typescript' | 'jsx' | 'decorators-legacy' | 'classProperties')[];
}

export interface CliOptions {
  output?: string;
  noComments?: boolean;
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
  onFileProcessed?: (filePath: string, success: boolean, error?: string) => void;
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