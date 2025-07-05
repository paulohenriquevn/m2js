import { parseFile } from '../src/parser';
import { promises as fs } from 'fs';
import path from 'path';

describe('Parser', () => {
  const fixturesPath = path.join(__dirname, 'fixtures');

  it('should extract exported functions only', async () => {
    const content = await fs.readFile(
      path.join(fixturesPath, 'simple.ts'),
      'utf-8'
    );
    const result = parseFile('simple.ts', content);

    expect(result.functions).toHaveLength(3);
    expect(result.functions.map(f => f.name)).toEqual([
      'calculateTotal',
      'formatCurrency',
      'default',
    ]);
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
    expect(() => parseFile('whitespace.ts', '   \n  \t  ')).toThrow(
      'File is empty'
    );
  });

  it('should extract function parameters correctly', async () => {
    const content = await fs.readFile(
      path.join(fixturesPath, 'simple.ts'),
      'utf-8'
    );
    const result = parseFile('simple.ts', content);

    const calculateTotal = result.functions.find(
      f => f.name === 'calculateTotal'
    );
    expect(calculateTotal?.params).toEqual([
      { name: 'items', type: 'number[]', optional: false },
    ]);

    const formatCurrency = result.functions.find(
      f => f.name === 'formatCurrency'
    );
    expect(formatCurrency?.returnType).toBe('string');
  });

  it('should handle default exports', async () => {
    const content = await fs.readFile(
      path.join(fixturesPath, 'simple.ts'),
      'utf-8'
    );
    const result = parseFile('simple.ts', content);

    const defaultFunc = result.functions.find(f => f.isDefault);
    expect(defaultFunc).toBeDefined();
    expect(defaultFunc?.name).toBe('default');
    expect(defaultFunc?.isDefault).toBe(true);
  });

  it('should generate correct function signatures', async () => {
    const content = await fs.readFile(
      path.join(fixturesPath, 'simple.ts'),
      'utf-8'
    );
    const result = parseFile('simple.ts', content);

    const calculateTotal = result.functions.find(
      f => f.name === 'calculateTotal'
    );
    expect(calculateTotal?.signature).toBe(
      'export function calculateTotal(items: number[]): number'
    );

    const defaultFunc = result.functions.find(f => f.isDefault);
    expect(defaultFunc?.signature).toBe(
      'export default function(email: string): boolean'
    );
  });

  it('should extract exported classes only', async () => {
    const content = await fs.readFile(
      path.join(fixturesPath, 'with-classes.ts'),
      'utf-8'
    );
    const result = parseFile('with-classes.ts', content);

    expect(result.classes).toHaveLength(2);
    expect(result.classes.map(c => c.name)).toEqual(['AuthService', 'default']);
  });

  it('should extract public methods only from classes', async () => {
    const content = await fs.readFile(
      path.join(fixturesPath, 'with-classes.ts'),
      'utf-8'
    );
    const result = parseFile('with-classes.ts', content);

    const authService = result.classes.find(c => c.name === 'AuthService');
    expect(authService?.methods).toHaveLength(3); // login, logout, validateToken

    const publicMethods = authService?.methods.filter(m => !m.isPrivate);
    expect(publicMethods).toHaveLength(2); // only login and logout
    expect(publicMethods?.map(m => m.name)).toEqual(['login', 'logout']);
  });

  it('should extract JSDoc comments for functions', async () => {
    const content = await fs.readFile(
      path.join(fixturesPath, 'with-classes.ts'),
      'utf-8'
    );
    const result = parseFile('with-classes.ts', content);

    const calculateTotal = result.functions.find(
      f => f.name === 'calculateTotal'
    );
    expect(calculateTotal?.jsDoc).toBeDefined();
    expect(calculateTotal?.jsDoc).toContain('Calculates the sum of an array');
  });

  it('should extract JSDoc comments for classes', async () => {
    const content = await fs.readFile(
      path.join(fixturesPath, 'with-classes.ts'),
      'utf-8'
    );
    const result = parseFile('with-classes.ts', content);

    const authService = result.classes.find(c => c.name === 'AuthService');
    expect(authService?.jsDoc).toBeDefined();
    expect(authService?.jsDoc).toContain(
      'Service for handling user authentication'
    );
  });

  it('should parse method signatures correctly', async () => {
    const content = await fs.readFile(
      path.join(fixturesPath, 'with-classes.ts'),
      'utf-8'
    );
    const result = parseFile('with-classes.ts', content);

    const authService = result.classes.find(c => c.name === 'AuthService');
    const loginMethod = authService?.methods.find(m => m.name === 'login');

    expect(loginMethod?.signature).toBe(
      'login(email: string, password: string): Promise'
    );
    expect(loginMethod?.params).toHaveLength(2);
    expect(loginMethod?.returnType).toBe('Promise');
  });
});
