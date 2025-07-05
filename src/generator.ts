import { ParsedFile, ParsedFunction, ParsedClass, ParsedMethod, Parameter, GeneratorOptions } from './types';
import path from 'path';

const DEFAULT_OPTIONS: GeneratorOptions = {
  includeComments: false
};

export function generateMarkdown(
  parsedFile: ParsedFile, 
  _options: GeneratorOptions = DEFAULT_OPTIONS
): string {
  // Note: _options will be used in future stories for includeComments
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
    sections.push(`- **Functions**: ${exportMetadata.totalFunctions} exported function${plural}`);
  }
  
  if (exportMetadata.totalClasses > 0) {
    const plural = exportMetadata.totalClasses === 1 ? '' : 'es';
    sections.push(`- **Classes**: ${exportMetadata.totalClasses} exported class${plural}`);
  }
  
  // Add default export information
  if (exportMetadata.hasDefaultExport) {
    const exportType = exportMetadata.defaultExportType;
    const exportName = exportMetadata.defaultExportName;
    sections.push(`- **Default Export**: ${exportName} ${exportType}`);
  }
  
  // If no exports found
  if (exportMetadata.totalFunctions === 0 && exportMetadata.totalClasses === 0) {
    sections.push('- No exported functions or classes found');
  }
  
  return sections.join('\n');
}

function generateFunctionsSection(functions: ParsedFunction[]): string {
  const sections: string[] = ['## 🔧 Functions'];

  functions.forEach(func => {
    sections.push(generateFunctionMarkdown(func));
  });

  return sections.join('\n\n');
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
  
  // Generate individual method documentation for public methods
  publicMethods.forEach(method => {
    sections.push('');
    sections.push(generateMethodMarkdown(method));
  });

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

export function getOutputPath(inputPath: string, customOutput?: string): string {
  if (customOutput) {
    return customOutput;
  }
  
  const parsedPath = path.parse(inputPath);
  return path.join(parsedPath.dir, `${parsedPath.name}.md`);
}