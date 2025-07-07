/**
 * Dead Code Analyzer Tests
 * Comprehensive unit tests for dead export detection
 */

import path from 'path';
import { analyzeDeadCode } from '../src/dead-code-analyzer';
import { DeadCodeReport } from '../src/dead-code-types';

describe('Dead Code Analyzer', () => {
  const fixturesPath = path.join(__dirname, 'fixtures', 'dead-exports');

  describe('Basic Dead Export Detection', () => {
    it('should detect exported function never imported', async () => {
      const files = [path.join(fixturesPath, 'with-dead-function.ts')];
      const report = await analyzeDeadCode(files);

      expect(report.deadExports).toHaveLength(2); // unusedFunction + usedFunction (no consumer)

      const deadFunction = report.deadExports.find(
        exp => exp.name === 'unusedFunction'
      );
      expect(deadFunction).toBeDefined();
      expect(deadFunction?.type).toBe('function');
      expect(deadFunction?.file).toContain('with-dead-function.ts');
      expect(deadFunction?.line).toBeGreaterThan(0);
      expect(deadFunction?.reason).toBe('Never imported in analyzed files');
    });

    it('should detect exported class never imported', async () => {
      const files = [path.join(fixturesPath, 'with-dead-class.ts')];
      const report = await analyzeDeadCode(files);

      expect(report.deadExports).toHaveLength(2); // Both classes are dead without consumer

      const deadClass = report.deadExports.find(
        exp => exp.name === 'UnusedClass'
      );
      expect(deadClass).toBeDefined();
      expect(deadClass?.type).toBe('class');
    });

    it('should detect exported variable never imported', async () => {
      const files = [path.join(fixturesPath, 'with-dead-variable.ts')];
      const report = await analyzeDeadCode(files);

      expect(report.deadExports.length).toBeGreaterThan(0);

      const deadVariable = report.deadExports.find(
        exp => exp.name === 'UNUSED_CONSTANT'
      );
      expect(deadVariable).toBeDefined();
      expect(deadVariable?.type).toBe('variable');
    });

    it('should detect default export never imported', async () => {
      const files = [path.join(fixturesPath, 'with-dead-variable.ts')];
      const report = await analyzeDeadCode(files);

      const deadDefault = report.deadExports.find(
        exp => exp.name === 'unusedDefaultFunction'
      );
      expect(deadDefault).toBeDefined();
      expect(deadDefault?.type).toBe('function');
    });
  });

  describe('Cross-Reference Analysis', () => {
    it('should correctly identify used vs unused exports', async () => {
      const files = [
        path.join(fixturesPath, 'with-dead-function.ts'),
        path.join(fixturesPath, 'consumer.ts'),
      ];
      const report = await analyzeDeadCode(files);

      // usedFunction should NOT be in dead exports (it's imported by consumer)
      const usedFunction = report.deadExports.find(
        exp => exp.name === 'usedFunction'
      );
      expect(usedFunction).toBeUndefined();

      // unusedFunction should be in dead exports
      const unusedFunction = report.deadExports.find(
        exp => exp.name === 'unusedFunction'
      );
      expect(unusedFunction).toBeDefined();
    });

    it('should handle mixed usage correctly', async () => {
      const files = [
        path.join(fixturesPath, 'mixed-usage.ts'),
        path.join(fixturesPath, 'mixed-consumer.ts'),
      ];
      const report = await analyzeDeadCode(files);

      // importantFunction should NOT be dead (imported by mixed-consumer)
      const importantFunction = report.deadExports.find(
        exp => exp.name === 'importantFunction'
      );
      expect(importantFunction).toBeUndefined();

      // Dead functions should be detected
      const deadFunction1 = report.deadExports.find(
        exp => exp.name === 'deadFunction1'
      );
      expect(deadFunction1).toBeDefined();

      const deadFunction2 = report.deadExports.find(
        exp => exp.name === 'deadFunction2'
      );
      expect(deadFunction2).toBeDefined();

      const deadClass = report.deadExports.find(
        exp => exp.name === 'DeadClass'
      );
      expect(deadClass).toBeDefined();

      const deadConstant = report.deadExports.find(
        exp => exp.name === 'DEAD_CONSTANT'
      );
      expect(deadConstant).toBeDefined();
    });

    it('should return empty report when no exports exist', async () => {
      const files = [path.join(fixturesPath, 'no-exports.ts')];
      const report = await analyzeDeadCode(files);

      expect(report.deadExports).toHaveLength(0);
    });

    it('should handle files where some exports are used', async () => {
      const files = [
        path.join(fixturesPath, 'clean-file.ts'),
        path.join(fixturesPath, 'clean-consumer.ts'),
      ];
      const report = await analyzeDeadCode(files);

      // clean-consumer exports useEverything but nobody imports it
      // So we expect 1 dead export (useEverything from clean-consumer)
      // The exports from clean-file are imported by clean-consumer, so they're not dead
      expect(report.deadExports).toHaveLength(1);
      expect(report.deadExports[0].name).toBe('useEverything');
      expect(report.deadExports[0].file).toContain('clean-consumer.ts');
    });
  });

  describe('Unused Import Detection', () => {
    it('should detect unused imports in a file', async () => {
      const files = [path.join(fixturesPath, 'with-unused-imports.ts')];
      const report = await analyzeDeadCode(files);

      expect(report.unusedImports.length).toBeGreaterThan(0);
      
      // Should detect UnusedClass import
      const unusedClass = report.unusedImports.find(
        imp => imp.name === 'UnusedClass'
      );
      expect(unusedClass).toBeDefined();
      expect(unusedClass?.type).toBe('named');
      expect(unusedClass?.reason).toBe('Imported but never used in code');

      // Should detect React default import
      const unusedReact = report.unusedImports.find(
        imp => imp.name === 'React'
      );
      expect(unusedReact).toBeDefined();
      expect(unusedReact?.type).toBe('default');

      // Should detect fs namespace import
      const unusedFs = report.unusedImports.find(
        imp => imp.name === 'fs'
      );
      expect(unusedFs).toBeDefined();
      expect(unusedFs?.type).toBe('namespace');
    });

    it('should not detect used imports as unused', async () => {
      const files = [path.join(fixturesPath, 'all-imports-used.ts')];
      const report = await analyzeDeadCode(files);

      // usedFunction should not be in unused imports
      const usedFunctionImport = report.unusedImports.find(
        imp => imp.name === 'usedFunction'
      );
      expect(usedFunctionImport).toBeUndefined();

      // UsedClass should not be in unused imports
      const usedClassImport = report.unusedImports.find(
        imp => imp.name === 'UsedClass'
      );
      expect(usedClassImport).toBeUndefined();

      // USED_CONSTANT should not be in unused imports
      const usedConstantImport = report.unusedImports.find(
        imp => imp.name === 'USED_CONSTANT'
      );
      expect(usedConstantImport).toBeUndefined();
    });

    it('should handle mixed imports correctly', async () => {
      const files = [path.join(fixturesPath, 'mixed-imports.ts')];
      const report = await analyzeDeadCode(files);

      // Should detect unused imports
      const unusedClass = report.unusedImports.find(
        imp => imp.name === 'UnusedClass'
      );
      expect(unusedClass).toBeDefined();

      const unusedConstant = report.unusedImports.find(
        imp => imp.name === 'UNUSED_CONSTANT'
      );
      expect(unusedConstant).toBeDefined();

      // Should NOT detect used imports
      const usedFunction = report.unusedImports.find(
        imp => imp.name === 'usedFunction'
      );
      expect(usedFunction).toBeUndefined();

      const usedClass = report.unusedImports.find(
        imp => imp.name === 'UsedClass'
      );
      expect(usedClass).toBeUndefined();
    });

    it('should return empty unused imports for file with no imports', async () => {
      const files = [path.join(fixturesPath, 'no-exports.ts')];
      const report = await analyzeDeadCode(files);

      expect(report.unusedImports).toHaveLength(0);
    });
  });

  describe('Metrics and Reporting', () => {
    it('should generate correct metrics', async () => {
      const files = [
        path.join(fixturesPath, 'mixed-usage.ts'),
        path.join(fixturesPath, 'mixed-consumer.ts'),
      ];
      const report = await analyzeDeadCode(files);

      expect(report.metrics.totalFiles).toBe(2);
      expect(report.metrics.totalExports).toBeGreaterThan(0);
      expect(report.metrics.totalImports).toBeGreaterThanOrEqual(0);
      expect(report.metrics.deadExports).toBeGreaterThan(0);
      expect(report.metrics.unusedImports).toBeGreaterThanOrEqual(0);
      expect(report.metrics.analysisTimeMs).toBeGreaterThan(0);
      expect(report.metrics.estimatedSavingsKB).toBeGreaterThanOrEqual(0);
    });

    it('should include project path in report', async () => {
      const files = [path.join(fixturesPath, 'with-dead-function.ts')];
      const report = await analyzeDeadCode(files);

      expect(report.projectPath).toBeDefined();
      expect(report.projectPath).toContain('dead-exports');
    });
  });

  describe('Error Handling', () => {
    it('should throw error when no files provided', async () => {
      await expect(analyzeDeadCode([])).rejects.toThrow(
        'No files provided for dead code analysis'
      );
    });

    it('should throw error for non-existent file', async () => {
      const files = [path.join(fixturesPath, 'non-existent.ts')];
      await expect(analyzeDeadCode(files)).rejects.toThrow('Failed to process file');
    });

    it('should handle parse errors gracefully', async () => {
      // Create a temporary malformed file for testing
      const malformedFile = path.join(fixturesPath, '..', 'malformed-temp.ts');
      require('fs').writeFileSync(
        malformedFile,
        'export function broken( { // malformed syntax'
      );

      const files = [malformedFile];
      await expect(analyzeDeadCode(files)).rejects.toThrow('Parse error');

      // Clean up
      require('fs').unlinkSync(malformedFile);
    });
  });

  describe('TypeScript and JavaScript Support', () => {
    it('should handle TypeScript syntax correctly', async () => {
      const files = [path.join(fixturesPath, 'with-dead-class.ts')];

      await expect(analyzeDeadCode(files)).resolves.not.toThrow();

      const report = await analyzeDeadCode(files);
      expect(report.deadExports.length).toBeGreaterThan(0);
    });

    it('should extract line numbers correctly', async () => {
      const files = [path.join(fixturesPath, 'with-dead-function.ts')];
      const report = await analyzeDeadCode(files);

      report.deadExports.forEach(deadExport => {
        expect(deadExport.line).toBeGreaterThan(0);
        expect(typeof deadExport.line).toBe('number');
      });
    });
  });

  describe('Performance Requirements', () => {
    it('should analyze files quickly', async () => {
      const files = [
        path.join(fixturesPath, 'with-dead-function.ts'),
        path.join(fixturesPath, 'with-dead-class.ts'),
        path.join(fixturesPath, 'with-dead-variable.ts'),
        path.join(fixturesPath, 'consumer.ts'),
        path.join(fixturesPath, 'mixed-usage.ts'),
      ];

      const startTime = Date.now();
      const report = await analyzeDeadCode(files);
      const endTime = Date.now();

      expect(endTime - startTime).toBeLessThan(2000); // Increased for async overhead
      expect(report.metrics.analysisTimeMs).toBeLessThan(2000);
    });
  });

  describe('Integration Scenarios', () => {
    it('should handle complex project structure', async () => {
      const files = [
        path.join(fixturesPath, 'with-dead-function.ts'),
        path.join(fixturesPath, 'with-dead-class.ts'),
        path.join(fixturesPath, 'with-dead-variable.ts'),
        path.join(fixturesPath, 'consumer.ts'),
        path.join(fixturesPath, 'mixed-usage.ts'),
        path.join(fixturesPath, 'mixed-consumer.ts'),
        path.join(fixturesPath, 'clean-file.ts'),
        path.join(fixturesPath, 'clean-consumer.ts'),
      ];

      const report = await analyzeDeadCode(files);

      expect(report.deadExports.length).toBeGreaterThan(0);
      expect(report.metrics.totalFiles).toBe(files.length);
      expect(report.metrics.totalExports).toBeGreaterThan(
        report.metrics.deadExports
      );
    });
  });
});
