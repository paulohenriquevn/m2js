import { parseFile } from '../src/parser';
import { generateMarkdown } from '../src/generator';
import { promises as fs } from 'fs';
import path from 'path';

describe('Integration Tests', () => {
  const fixturesPath = path.join(__dirname, 'fixtures');

  it('should process real TypeScript file end-to-end', async () => {
    const inputFile = path.join(fixturesPath, 'simple.ts');
    const expectedFile = path.join(fixturesPath, 'expected', 'simple.md');

    const content = await fs.readFile(inputFile, 'utf-8');
    const parsedFile = parseFile(inputFile, content);
    const markdown = generateMarkdown(parsedFile);

    const expected = await fs.readFile(expectedFile, 'utf-8');
    expect(markdown.trim()).toBe(expected.trim());
  });

  it('should handle complex TypeScript features', async () => {
    const complexContent = `
export async function fetchData<T>(url: string): Promise<T> {
  return fetch(url).then(res => res.json());
}

export const arrowFunction = (x: number, y?: string): void => {};

export interface Config {
  apiKey: string;
}

class InternalClass {
  private method() {}
}

export class PublicClass {
  public method(): void {}
}
`;

    const parsedFile = parseFile('complex.ts', complexContent);
    const markdown = generateMarkdown(parsedFile);

    expect(parsedFile.functions).toHaveLength(2);
    expect(parsedFile.functions.map(f => f.name)).toEqual(['fetchData', 'arrowFunction']);
    
    expect(markdown).toContain('### fetchData');
    expect(markdown).toContain('### arrowFunction');
    expect(markdown).not.toContain('InternalClass');
  });

  it('should preserve type information accurately', async () => {
    const typedContent = `
export function process(
  items: string[],
  options: { strict: boolean }
): Promise<string[]> {
  return Promise.resolve([]);
}
`;

    const parsedFile = parseFile('typed.ts', typedContent);
    const func = parsedFile.functions[0];

    expect(func.params).toHaveLength(2);
    expect(func.params[0]).toEqual({ name: 'items', type: 'string[]', optional: false });
    expect(func.returnType).toBe('Promise');
  });

  it('should handle different export patterns', async () => {
    const exportContent = `
function helper() {}

export function namedExport() {}

export default function defaultExport() {}

export { helper as renamedHelper };

const arrow = () => {};
export { arrow };
`;

    const parsedFile = parseFile('exports.ts', exportContent);
    
    expect(parsedFile.functions).toHaveLength(2);
    expect(parsedFile.functions.some(f => f.name === 'namedExport')).toBe(true);
    expect(parsedFile.functions.some(f => f.isDefault)).toBe(true);
  });

  it('should produce deterministic output', async () => {
    const content = await fs.readFile(path.join(fixturesPath, 'simple.ts'), 'utf-8');
    
    const result1 = generateMarkdown(parseFile('test.ts', content));
    const result2 = generateMarkdown(parseFile('test.ts', content));
    
    expect(result1).toBe(result2);
  });
});