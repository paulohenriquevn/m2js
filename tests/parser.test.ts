import { parseFile } from '../src/parser';
import { promises as fs } from 'fs';
import path from 'path';

describe('Parser', () => {
  const fixturesPath = path.join(__dirname, 'fixtures');

  it('should extract exported functions only', async () => {
    const content = await fs.readFile(path.join(fixturesPath, 'simple.ts'), 'utf-8');
    const result = parseFile('simple.ts', content);

    expect(result.functions).toHaveLength(3);
    expect(result.functions.map(f => f.name)).toEqual(['calculateTotal', 'formatCurrency', 'default']);
  });

  it('should handle TypeScript syntax correctly', () => {
    const input = `export function typed(x: number): string { return ''; }`;
    expect(() => parseFile('test.ts', input)).not.toThrow();
  });

  it('should fail fast on invalid syntax', () => {
    const input = `export function broken( { // malformed`;
    expect(() => parseFile('test.ts', input)).toThrow('Parse error');
  });

  it('should handle empty files', () => {
    expect(() => parseFile('empty.ts', '')).toThrow('File is empty');
    expect(() => parseFile('whitespace.ts', '   \n  \t  ')).toThrow('File is empty');
  });

  it('should extract function parameters correctly', async () => {
    const content = await fs.readFile(path.join(fixturesPath, 'simple.ts'), 'utf-8');
    const result = parseFile('simple.ts', content);

    const calculateTotal = result.functions.find(f => f.name === 'calculateTotal');
    expect(calculateTotal?.params).toEqual([
      { name: 'items', type: 'number[]', optional: false }
    ]);

    const formatCurrency = result.functions.find(f => f.name === 'formatCurrency');
    expect(formatCurrency?.returnType).toBe('string');
  });

  it('should handle default exports', async () => {
    const content = await fs.readFile(path.join(fixturesPath, 'simple.ts'), 'utf-8');
    const result = parseFile('simple.ts', content);

    const defaultFunc = result.functions.find(f => f.isDefault);
    expect(defaultFunc).toBeDefined();
    expect(defaultFunc?.name).toBe('default');
    expect(defaultFunc?.isDefault).toBe(true);
  });

  it('should generate correct function signatures', async () => {
    const content = await fs.readFile(path.join(fixturesPath, 'simple.ts'), 'utf-8');
    const result = parseFile('simple.ts', content);

    const calculateTotal = result.functions.find(f => f.name === 'calculateTotal');
    expect(calculateTotal?.signature).toBe('export function calculateTotal(items: number[]): number');

    const defaultFunc = result.functions.find(f => f.isDefault);
    expect(defaultFunc?.signature).toBe('export default function(email: string): boolean');
  });
});