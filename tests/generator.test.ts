import { generateMarkdown, getOutputPath } from '../src/generator';
import { ParsedFile } from '../src/types';
import { promises as fs } from 'fs';
import path from 'path';

describe('Generator', () => {
  const mockParsedFile: ParsedFile = {
    fileName: 'test.ts',
    functions: [
      {
        name: 'calculateTotal',
        signature: 'export function calculateTotal(items: number[]): number',
        isDefault: false,
        params: [{ name: 'items', type: 'number[]', optional: false }],
        returnType: 'number'
      },
      {
        name: 'default',
        signature: 'export default function(email: string): boolean',
        isDefault: true,
        params: [{ name: 'email', type: 'string', optional: false }],
        returnType: 'boolean'
      }
    ]
  };

  it('should generate valid markdown structure', () => {
    const result = generateMarkdown(mockParsedFile);
    
    expect(result).toContain('# 📝 test.ts');
    expect(result).toContain('## 🔧 Functions');
    expect(result).toContain('### calculateTotal');
    expect(result).toContain('### default');
    expect(result).toContain('```typescript');
  });

  it('should handle empty function list', () => {
    const emptyFile: ParsedFile = {
      fileName: 'empty.ts',
      functions: []
    };

    const result = generateMarkdown(emptyFile);
    expect(result).toContain('# 📝 empty.ts');
    expect(result).toContain('No exported functions found.');
  });

  it('should escape markdown special characters', () => {
    const specialFile: ParsedFile = {
      fileName: 'special_*_file.ts',
      functions: [
        {
          name: 'special*function',
          signature: 'export function special*function(): void',
          isDefault: false,
          params: [],
        }
      ]
    };

    const result = generateMarkdown(specialFile);
    expect(result).toContain('# 📝 special\\_\\*\\_file.ts');
    expect(result).toContain('### special\\*function');
  });

  it('should match expected output format', async () => {
    const fixturesPath = path.join(__dirname, 'fixtures');
    const expectedContent = await fs.readFile(
      path.join(fixturesPath, 'expected', 'simple.md'),
      'utf-8'
    );

    const simpleParsedFile: ParsedFile = {
      fileName: 'simple.ts',
      functions: [
        {
          name: 'calculateTotal',
          signature: 'export function calculateTotal(items: number[]): number',
          isDefault: false,
          params: [{ name: 'items', type: 'number[]', optional: false }],
          returnType: 'number'
        },
        {
          name: 'formatCurrency',
          signature: 'export function formatCurrency(amount: number): string',
          isDefault: false,
          params: [{ name: 'amount', type: 'number', optional: false }],
          returnType: 'string'
        },
        {
          name: 'default',
          signature: 'export default function(email: string): boolean',
          isDefault: true,
          params: [{ name: 'email', type: 'string', optional: false }],
          returnType: 'boolean'
        }
      ]
    };

    const result = generateMarkdown(simpleParsedFile);
    expect(result.trim()).toBe(expectedContent.trim());
  });

  describe('getOutputPath', () => {
    it('should generate correct output path', () => {
      expect(getOutputPath('/path/to/file.ts')).toBe('/path/to/file.md');
      expect(getOutputPath('utils.ts')).toBe('utils.md');
    });

    it('should use custom output when provided', () => {
      expect(getOutputPath('/path/to/file.ts', 'custom.md')).toBe('custom.md');
    });

    it('should handle different extensions', () => {
      expect(getOutputPath('component.tsx')).toBe('component.md');
      expect(getOutputPath('script.js')).toBe('script.md');
      expect(getOutputPath('app.jsx')).toBe('app.md');
    });
  });
});