import { promises as fs } from 'fs';
import path from 'path';
import { processBatch } from '../src/batch-processor';

describe('Batch Processor', () => {
  const testDir = path.join(__dirname, 'batch-test-files');

  beforeAll(async () => {
    // Create test directory structure
    await fs.mkdir(testDir, { recursive: true });

    // Create valid test files
    await fs.writeFile(
      path.join(testDir, 'valid.ts'),
      `
/**
 * Valid TypeScript file for testing
 */
export function testFunction(param: string): string {
  return param.toUpperCase();
}

export class TestClass {
  method(): void {}
}
`
    );

    await fs.writeFile(
      path.join(testDir, 'another.js'),
      `
export function anotherFunction() {
  return 'hello';
}
`
    );

    // Create invalid file (malformed syntax)
    await fs.writeFile(
      path.join(testDir, 'invalid.ts'),
      `
export function broken( { // malformed syntax
  return 'broken';
}
`
    );
  });

  afterAll(async () => {
    // Clean up test files
    await fs.rm(testDir, { recursive: true, force: true });
  });

  describe('processBatch', () => {
    it('should process all valid files successfully', async () => {
      const progressCalls: Array<{
        current: number;
        total: number;
        fileName: string;
      }> = [];
      const processedCalls: Array<{
        filePath: string;
        success: boolean;
        error?: string;
      }> = [];

      const result = await processBatch({
        sourceDirectory: testDir,
        includeComments: true,
        onProgress: (current, total, fileName) => {
          progressCalls.push({ current, total, fileName });
        },
        onFileProcessed: (filePath, success, error) => {
          processedCalls.push({ filePath, success, error });
        },
      });

      // Check that all files were found
      expect(result.totalFiles).toBe(3); // valid.ts, another.js, invalid.ts

      // Check successful files
      expect(result.successCount).toBe(2); // valid.ts and another.js should succeed
      expect(result.failureCount).toBe(1); // invalid.ts should fail

      // Check progress callbacks were called
      expect(progressCalls).toHaveLength(3);
      expect(progressCalls[0]).toMatchObject({ current: 1, total: 3 });
      expect(progressCalls[1]).toMatchObject({ current: 2, total: 3 });
      expect(progressCalls[2]).toMatchObject({ current: 3, total: 3 });

      // Check file processed callbacks
      expect(processedCalls).toHaveLength(3);
      const successfulFiles = processedCalls.filter(call => call.success);
      const failedFiles = processedCalls.filter(call => !call.success);

      expect(successfulFiles).toHaveLength(2);
      expect(failedFiles).toHaveLength(1);
      expect(failedFiles[0].error).toContain('Parse error');
    });

    it('should create markdown files for successful processing', async () => {
      await processBatch({
        sourceDirectory: testDir,
        includeComments: true,
      });

      // Check that markdown files were created
      const validMdPath = path.join(testDir, 'valid.md');
      const anotherMdPath = path.join(testDir, 'another.md');
      const invalidMdPath = path.join(testDir, 'invalid.md');

      expect(
        await fs
          .access(validMdPath)
          .then(() => true)
          .catch(() => false)
      ).toBe(true);
      expect(
        await fs
          .access(anotherMdPath)
          .then(() => true)
          .catch(() => false)
      ).toBe(true);
      expect(
        await fs
          .access(invalidMdPath)
          .then(() => true)
          .catch(() => false)
      ).toBe(false);

      // Check content of generated markdown
      const validMdContent = await fs.readFile(validMdPath, 'utf-8');
      expect(validMdContent).toContain('# 📁');
      expect(validMdContent).toContain('## 📦 Exports');
      expect(validMdContent).toContain('testFunction');
      expect(validMdContent).toContain('TestClass');

      // Clean up generated files
      await fs.unlink(validMdPath);
      await fs.unlink(anotherMdPath);
    });

    it('should handle empty directory', async () => {
      const emptyDir = path.join(testDir, 'empty');
      await fs.mkdir(emptyDir, { recursive: true });

      await expect(
        processBatch({
          sourceDirectory: emptyDir,
          includeComments: true,
        })
      ).rejects.toThrow('No TypeScript/JavaScript files found');

      await fs.rmdir(emptyDir);
    });

    it('should handle non-existent directory', async () => {
      await expect(
        processBatch({
          sourceDirectory: '/non/existent/directory',
          includeComments: true,
        })
      ).rejects.toThrow('Directory scan failed');
    });

    it('should continue processing after individual file failures', async () => {
      const result = await processBatch({
        sourceDirectory: testDir,
        includeComments: true,
      });

      // Even with one failed file, should continue and process others
      expect(result.totalFiles).toBe(3);
      expect(result.successCount).toBe(2);
      expect(result.failureCount).toBe(1);

      // Check that successful files have output paths
      const successfulFiles = result.processedFiles.filter(f => f.success);
      expect(successfulFiles).toHaveLength(2);
      successfulFiles.forEach(file => {
        expect(file.outputPath).toBeDefined();
        expect(file.outputPath).toMatch(/\.md$/);
      });

      // Check that failed file has error message
      const failedFiles = result.processedFiles.filter(f => !f.success);
      expect(failedFiles).toHaveLength(1);
      expect(failedFiles[0].error).toBeDefined();
    });
  });
});
