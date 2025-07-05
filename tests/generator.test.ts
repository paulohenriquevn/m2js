import { generateMarkdown, getOutputPath } from '../src/generator';
import { ParsedFile } from '../src/types';
import { promises as fs } from 'fs';
import path from 'path';

describe('Generator', () => {
  const mockParsedFile: ParsedFile = {
    fileName: 'test.ts',
    filePath: '/path/to/test.ts',
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
    ],
    classes: [],
    exportMetadata: {
      totalFunctions: 2,
      totalClasses: 0,
      hasDefaultExport: true,
      defaultExportType: 'function',
      defaultExportName: 'function'
    }
  };

const mockParsedFileWithClasses: ParsedFile = {
  fileName: 'service.ts',
  filePath: '/path/to/service.ts',
  functions: [],
  classes: [
    {
      name: 'AuthService',
      jsDoc: '/**\n * Service for authentication\n */',
      methods: [
        {
          name: 'login',
          signature: 'login(email: string): Promise<string>',
          params: [{ name: 'email', type: 'string', optional: false }],
          returnType: 'Promise<string>',
          isPrivate: false,
          jsDoc: '/**\n * Logs in user\n */'
        },
        {
          name: 'validateToken',
          signature: 'validateToken(token: string): boolean',
          params: [{ name: 'token', type: 'string', optional: false }],
          returnType: 'boolean',
          isPrivate: true
        }
      ]
    }
  ],
  exportMetadata: {
    totalFunctions: 0,
    totalClasses: 1,
    hasDefaultExport: false,
    defaultExportType: undefined,
    defaultExportName: undefined
  }
};

  it('should generate valid markdown structure', () => {
    const result = generateMarkdown(mockParsedFile);
    
    expect(result).toContain('# 📁 /path/to/test.ts');
    expect(result).toContain('## 📦 Exports');
    expect(result).toContain('- **Functions**: 2 exported functions');
    expect(result).toContain('- **Default Export**: function function');
    expect(result).toContain('## 🔧 Functions');
    expect(result).toContain('### calculateTotal');
    expect(result).toContain('### default');
    expect(result).toContain('```typescript');
  });

  it('should handle empty function and class lists', () => {
    const emptyFile: ParsedFile = {
      fileName: 'empty.ts',
      filePath: '/path/to/empty.ts',
      functions: [],
      classes: [],
      exportMetadata: {
        totalFunctions: 0,
        totalClasses: 0,
        hasDefaultExport: false,
        defaultExportType: undefined,
        defaultExportName: undefined
      }
    };

    const result = generateMarkdown(emptyFile);
    expect(result).toContain('# 📁 /path/to/empty.ts');
    expect(result).toContain('## 📦 Exports');
    expect(result).toContain('- No exported functions or classes found');
    expect(result).toContain('No exported functions or classes found.');
  });

  it('should generate classes section', () => {
    const result = generateMarkdown(mockParsedFileWithClasses);
    
    expect(result).toContain('# 📁 /path/to/service.ts');
    expect(result).toContain('## 📦 Exports');
    expect(result).toContain('- **Classes**: 1 exported class');
    expect(result).toContain('## 🏗️ Classes');
    expect(result).toContain('### AuthService');
    expect(result).toContain('#### login');
    expect(result).not.toContain('#### validateToken'); // private method
  });

  it('should include JSDoc comments in output', () => {
    const result = generateMarkdown(mockParsedFileWithClasses);
    
    expect(result).toContain('Service for authentication');
    expect(result).toContain('Logs in user');
  });

  it('should filter out private methods from class signatures', () => {
    const result = generateMarkdown(mockParsedFileWithClasses);
    
    expect(result).toContain('login(email: string): Promise<string>');
    expect(result).not.toContain('validateToken'); // private method should not appear
  });

  it('should escape markdown special characters', () => {
    const specialFile: ParsedFile = {
      fileName: 'special_*_file.ts',
      filePath: '/path/to/special_*_file.ts',
      exportMetadata: {
        totalFunctions: 1,
        totalClasses: 0,
        hasDefaultExport: false,
        defaultExportType: undefined,
        defaultExportName: undefined
      },
      functions: [
        {
          name: 'special*function',
          signature: 'export function special*function(): void',
          isDefault: false,
          params: [],
        }
      ],
      classes: []
    };

    const result = generateMarkdown(specialFile);
    expect(result).toContain('# 📁 /path/to/special\\_\\*\\_file.ts');
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
      filePath: path.join(process.cwd(), 'tests/fixtures/simple.ts'),
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
      ],
      classes: [],
      exportMetadata: {
        totalFunctions: 3,
        totalClasses: 0,
        hasDefaultExport: true,
        defaultExportType: 'function',
        defaultExportName: 'function'
      }
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