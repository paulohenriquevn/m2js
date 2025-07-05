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

export interface ParsedFile {
  fileName: string;
  functions: ParsedFunction[];
  classes: ParsedClass[];
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