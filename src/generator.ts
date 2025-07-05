import { ParsedFile, ParsedFunction, GeneratorOptions } from './types';
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
  } else {
    sections.push('No exported functions found.');
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

export function getOutputPath(inputPath: string, customOutput?: string): string {
  if (customOutput) {
    return customOutput;
  }
  
  const parsedPath = path.parse(inputPath);
  return path.join(parsedPath.dir, `${parsedPath.name}.md`);
}