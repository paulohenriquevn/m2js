export interface ParsedFunction {
  name: string;
  signature: string;
  isDefault: boolean;
  params: Parameter[];
  returnType?: string;
}

export interface Parameter {
  name: string;
  type?: string;
  optional: boolean;
}

export interface ParsedFile {
  fileName: string;
  functions: ParsedFunction[];
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