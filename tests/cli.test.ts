import { exec } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import { promisify } from 'util';

const execAsync = promisify(exec);

describe('CLI', () => {
  const fixturesPath = path.join(__dirname, 'fixtures');
  const testOutputPath = path.join(__dirname, 'test-output.md');

  beforeEach(async () => {
    try {
      await fs.unlink(testOutputPath);
    } catch {
      // File doesn't exist, that's okay
    }
  });

  afterEach(async () => {
    try {
      await fs.unlink(testOutputPath);
    } catch {
      // File doesn't exist, that's okay
    }
  });

  it('should show help when --help is used', async () => {
    const { stdout } = await execAsync(
      'npm run build && node dist/cli.js --help'
    );
    expect(stdout).toContain('Usage:');
    expect(stdout).toContain('Transform TypeScript/JavaScript');
  });

  it('should show version when --version is used', async () => {
    const { stdout } = await execAsync(
      'npm run build && node dist/cli.js --version'
    );
    const lines = stdout.trim().split('\n');
    expect(lines[lines.length - 1]).toBe('1.0.0');
  });

  it('should exit with code 1 on file not found', async () => {
    try {
      await execAsync('npm run build && node dist/cli.js non-existent.ts');
      fail('Should have thrown an error');
    } catch (error: any) {
      expect(error.code).toBe(1);
      expect(error.stderr).toContain('Path not found');
    }
  });

  it('should exit with code 1 on unsupported file type', async () => {
    const txtFile = path.join(__dirname, 'test.txt');
    await fs.writeFile(txtFile, 'hello world');

    try {
      await execAsync(`npm run build && node dist/cli.js ${txtFile}`);
      fail('Should have thrown an error');
    } catch (error: any) {
      expect(error.code).toBe(1);
      expect(error.stderr).toContain('Unsupported file type');
    } finally {
      await fs.unlink(txtFile);
    }
  });

  it('should process a valid TypeScript file', async () => {
    const inputFile = path.join(fixturesPath, 'simple.ts');
    const outputFile = path.join(fixturesPath, 'simple.md');

    try {
      const { stdout } = await execAsync(
        `npm run build && node dist/cli.js ${inputFile}`
      );

      expect(stdout).toContain('📁 Reading simple.ts');
      expect(stdout).toContain('✅ Created simple.md with enhanced context');
      expect(stdout).toContain('📦 Exports: 3 functions');

      const outputExists = await fs
        .access(outputFile)
        .then(() => true)
        .catch(() => false);
      expect(outputExists).toBe(true);

      const content = await fs.readFile(outputFile, 'utf-8');
      expect(content).toContain('# 📁 ./tests/fixtures/simple.ts');
      expect(content).toContain('## 📦 Exports');
      expect(content).toContain('## 🔧 Functions');
    } finally {
      try {
        await fs.unlink(outputFile);
      } catch {
        // File might not exist
      }
    }
  });

  it('should use custom output file when -o option is provided', async () => {
    const inputFile = path.join(fixturesPath, 'simple.ts');
    const customOutput = testOutputPath;

    const { stdout } = await execAsync(
      `npm run build && node dist/cli.js ${inputFile} -o ${customOutput}`
    );

    expect(stdout).toContain(`✅ Created ${path.basename(customOutput)}`);

    const outputExists = await fs
      .access(customOutput)
      .then(() => true)
      .catch(() => false);
    expect(outputExists).toBe(true);
  });

  it('should process files with classes and show enhanced statistics', async () => {
    const inputFile = path.join(fixturesPath, 'with-classes.ts');
    const outputFile = path.join(fixturesPath, 'with-classes.md');

    try {
      const { stdout } = await execAsync(
        `npm run build && node dist/cli.js ${inputFile}`
      );

      expect(stdout).toContain('🏗️  Extracting exported classes');
      expect(stdout).toContain('📝 Extracting JSDoc comments');
      expect(stdout).toContain(
        '✅ Created with-classes.md with enhanced context'
      );
      expect(stdout).toContain('📦 Exports:');
      expect(stdout).toContain('function');
      expect(stdout).toContain('class');
      expect(stdout).toContain('📋 Generated enhanced structure');

      const outputExists = await fs
        .access(outputFile)
        .then(() => true)
        .catch(() => false);
      expect(outputExists).toBe(true);

      const content = await fs.readFile(outputFile, 'utf-8');
      expect(content).toContain('## 🏗️ Classes');
      expect(content).toContain('### AuthService');
      expect(content).toContain('#### login');
      expect(content).not.toContain('validateToken'); // private method
    } finally {
      try {
        await fs.unlink(outputFile);
      } catch {
        // File might not exist
      }
    }
  });

  it('should handle files with no exported functions', async () => {
    const emptyFile = path.join(__dirname, 'empty.ts');
    await fs.writeFile(
      emptyFile,
      'const internal = 42;\nfunction privateFunc() {}'
    );

    try {
      const { stdout } = await execAsync(
        `npm run build && node dist/cli.js ${emptyFile}`
      );
      expect(stdout).toContain('⚠️  No exported functions or classes found');
    } finally {
      await fs.unlink(emptyFile);
    }
  });

  describe('Directory Processing', () => {
    const testBatchDir = path.join(__dirname, 'batch-test');

    beforeAll(async () => {
      // Create test directory with multiple files
      await fs.mkdir(testBatchDir, { recursive: true });
      await fs.mkdir(path.join(testBatchDir, 'subdir'), { recursive: true });

      // Create test files
      await fs.writeFile(
        path.join(testBatchDir, 'file1.ts'),
        'export function func1(): string { return "test"; }'
      );

      await fs.writeFile(
        path.join(testBatchDir, 'file2.js'),
        'export const func2 = () => "test";'
      );

      await fs.writeFile(
        path.join(testBatchDir, 'subdir', 'nested.tsx'),
        'export const Component = () => <div>test</div>;'
      );
    });

    afterAll(async () => {
      // Clean up test directory
      await fs.rm(testBatchDir, { recursive: true, force: true });
    });

    it('should process all files in a directory', async () => {
      try {
        const { stdout } = await execAsync(
          `npm run build && node dist/cli.js ${testBatchDir}`
        );

        expect(stdout).toContain('📁 Scanning directory');
        expect(stdout).toContain('📊 Processing files (1/3):');
        expect(stdout).toContain('📊 Processing files (2/3):');
        expect(stdout).toContain('📊 Processing files (3/3):');
        expect(stdout).toContain('✅ Generated file1.md');
        expect(stdout).toContain('✅ Generated file2.md');
        expect(stdout).toContain('✅ Generated nested.md');
        expect(stdout).toContain('📋 Batch processing complete');
        expect(stdout).toContain('✅ Successful: 3');

        // Check that markdown files were created
        const file1Md = path.join(testBatchDir, 'file1.md');
        const file2Md = path.join(testBatchDir, 'file2.md');
        const nestedMd = path.join(testBatchDir, 'subdir', 'nested.md');

        expect(
          await fs
            .access(file1Md)
            .then(() => true)
            .catch(() => false)
        ).toBe(true);
        expect(
          await fs
            .access(file2Md)
            .then(() => true)
            .catch(() => false)
        ).toBe(true);
        expect(
          await fs
            .access(nestedMd)
            .then(() => true)
            .catch(() => false)
        ).toBe(true);

        // Clean up generated files
        await fs.unlink(file1Md);
        await fs.unlink(file2Md);
        await fs.unlink(nestedMd);
      } catch (error) {
        console.error('Directory processing test failed:', error);
        throw error;
      }
    });

    it('should handle empty directory', async () => {
      const emptyDir = path.join(testBatchDir, 'empty');
      await fs.mkdir(emptyDir, { recursive: true });

      try {
        await execAsync(`npm run build && node dist/cli.js ${emptyDir}`);
      } catch (error: any) {
        expect(error.stderr).toContain(
          'No TypeScript/JavaScript files found in directory'
        );
      } finally {
        await fs.rmdir(emptyDir);
      }
    });

    it('should handle non-existent directory', async () => {
      try {
        await execAsync(
          `npm run build && node dist/cli.js /non/existent/directory`
        );
      } catch (error: any) {
        expect(error.stderr).toContain('Path not found');
      }
    });

    it('should warn about --output option for directories', async () => {
      try {
        const { stdout } = await execAsync(
          `npm run build && node dist/cli.js ${testBatchDir} --output test.md`
        );
        expect(stdout).toContain(
          '⚠️  Note: --output option is ignored for directory processing'
        );
      } catch (error: any) {
        // Process should succeed, just show warning
        expect(error.stdout).toContain(
          '⚠️  Note: --output option is ignored for directory processing'
        );
      }
    });
  });
});
