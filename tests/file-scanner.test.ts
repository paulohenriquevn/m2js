import { promises as fs } from 'fs';
import path from 'path';
import { scanDirectory, isDirectory, isFile } from '../src/file-scanner';

describe('File Scanner', () => {
  const testDir = path.join(__dirname, 'test-files');
  
  beforeAll(async () => {
    // Create test directory structure
    await fs.mkdir(testDir, { recursive: true });
    await fs.mkdir(path.join(testDir, 'subdir'), { recursive: true });
    
    // Create test files
    await fs.writeFile(path.join(testDir, 'test.ts'), 'export const test = 1;');
    await fs.writeFile(path.join(testDir, 'test.js'), 'export const test = 1;');
    await fs.writeFile(path.join(testDir, 'test.tsx'), 'export const Test = () => <div/>;');
    await fs.writeFile(path.join(testDir, 'test.jsx'), 'export const Test = () => <div/>;');
    await fs.writeFile(path.join(testDir, 'test.txt'), 'not a js/ts file');
    await fs.writeFile(path.join(testDir, 'subdir', 'nested.ts'), 'export const nested = 1;');
  });
  
  afterAll(async () => {
    // Clean up test files
    await fs.rm(testDir, { recursive: true, force: true });
  });

  describe('scanDirectory', () => {
    it('should find all TypeScript and JavaScript files', async () => {
      const result = await scanDirectory(testDir);
      
      expect(result.errors).toHaveLength(0);
      expect(result.totalFound).toBe(5); // 4 files + 1 nested
      expect(result.files).toEqual(
        expect.arrayContaining([
          expect.stringContaining('test.ts'),
          expect.stringContaining('test.js'),
          expect.stringContaining('test.tsx'),
          expect.stringContaining('test.jsx'),
          expect.stringContaining('nested.ts')
        ])
      );
    });

    it('should not include non-TypeScript/JavaScript files', async () => {
      const result = await scanDirectory(testDir);
      
      const textFile = result.files.find(f => f.endsWith('.txt'));
      expect(textFile).toBeUndefined();
    });

    it('should scan subdirectories recursively', async () => {
      const result = await scanDirectory(testDir);
      
      const nestedFile = result.files.find(f => f.includes('nested.ts'));
      expect(nestedFile).toBeDefined();
      expect(nestedFile).toContain(path.join('subdir', 'nested.ts'));
    });

    it('should handle non-existent directory', async () => {
      const result = await scanDirectory('/non/existent/path');
      
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toContain('Cannot access directory');
      expect(result.totalFound).toBe(0);
    });

    it('should handle file path instead of directory', async () => {
      const filePath = path.join(testDir, 'test.ts');
      const result = await scanDirectory(filePath);
      
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toContain('Path is not a directory');
    });
  });

  describe('isDirectory', () => {
    it('should return true for existing directory', async () => {
      const result = await isDirectory(testDir);
      expect(result).toBe(true);
    });

    it('should return false for file', async () => {
      const filePath = path.join(testDir, 'test.ts');
      const result = await isDirectory(filePath);
      expect(result).toBe(false);
    });

    it('should return false for non-existent path', async () => {
      const result = await isDirectory('/non/existent/path');
      expect(result).toBe(false);
    });
  });

  describe('isFile', () => {
    it('should return true for existing file', async () => {
      const filePath = path.join(testDir, 'test.ts');
      const result = await isFile(filePath);
      expect(result).toBe(true);
    });

    it('should return false for directory', async () => {
      const result = await isFile(testDir);
      expect(result).toBe(false);
    });

    it('should return false for non-existent path', async () => {
      const result = await isFile('/non/existent/file.ts');
      expect(result).toBe(false);
    });
  });
});