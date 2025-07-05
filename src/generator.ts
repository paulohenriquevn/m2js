import { ParsedFile, ParsedFunction, ParsedClass, ParsedMethod, GeneratorOptions } from './types';
import path from 'path';

const DEFAULT_OPTIONS: GeneratorOptions = {
  includeComments: false
};

export function generateMarkdown(
  parsedFile: ParsedFile, 
  _options: GeneratorOptions = DEFAULT_OPTIONS
): string {
  // Note: _options will be used in future stories for includeComments
  const fileName = path.basename(parsedFile.fileName);
  const sections: string[] = [];

  sections.push(generateHeader(fileName));
  
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

function generateHeader(fileName: string): string {
  return `# 📝 ${escapeMarkdown(fileName)}`;
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
  }
  
  sections.push('```typescript');
  sections.push(method.signature);
  sections.push('```');

  return sections.join('\n');
}

export function getOutputPath(inputPath: string, customOutput?: string): string {
  if (customOutput) {
    return customOutput;
  }
  
  const parsedPath = path.parse(inputPath);
  return path.join(parsedPath.dir, `${parsedPath.name}.md`);
}