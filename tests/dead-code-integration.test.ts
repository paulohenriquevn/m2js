/**
 * Dead Code Integration Tests
 * End-to-end testing of CLI integration for dead code analysis
 */

import { execSync } from 'child_process';
import path from 'path';
import { executeDeadCodeAnalysis } from '../src/dead-code-cli';

describe('Dead Code CLI Integration', () => {
  const fixturesPath = path.join(__dirname, 'fixtures', 'dead-exports');

  describe('CLI Function Integration', () => {
    // Mock console methods for testing
    let consoleSpy: jest.SpyInstance;
    let processExitSpy: jest.SpyInstance;

    beforeEach(() => {
      consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      processExitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {
        throw new Error('process.exit called');
      });
    });

    afterEach(() => {
      consoleSpy.mockRestore();
      processExitSpy.mockRestore();
    });

    it('should execute dead code analysis and display results', () => {
      const files = [
        path.join(fixturesPath, 'with-dead-function.ts'),
        path.join(fixturesPath, 'consumer.ts'),
      ];

      expect(() => {
        executeDeadCodeAnalysis(files, {
          format: 'table',
          includeMetrics: true,
        });
      }).toThrow('process.exit called');

      // Check that console.log was called with expected content
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Dead Code Analysis Report')
      );
      expect(processExitSpy).toHaveBeenCalledWith(0); // Should exit with success code
    });

    it('should handle success case with no dead exports', () => {
      const files = [path.join(fixturesPath, 'no-exports.ts')];

      expect(() => {
        executeDeadCodeAnalysis(files, {
          format: 'table',
          includeMetrics: true,
        });
      }).toThrow('process.exit called');

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('No dead exports found')
      );
      expect(processExitSpy).toHaveBeenCalledWith(0);
    });

    it('should handle JSON format output', () => {
      const files = [path.join(fixturesPath, 'with-dead-function.ts')];

      expect(() => {
        executeDeadCodeAnalysis(files, {
          format: 'json',
          includeMetrics: true,
        });
      }).toThrow('process.exit called');

      // Should output JSON format
      const jsonOutput = consoleSpy.mock.calls.find(
        call =>
          call[0] && typeof call[0] === 'string' && call[0].startsWith('{')
      );
      expect(jsonOutput).toBeDefined();
      expect(processExitSpy).toHaveBeenCalledWith(0);
    });

    it('should handle analysis errors gracefully', () => {
      const files = ['non-existent-file.ts'];

      expect(() => {
        executeDeadCodeAnalysis(files, {
          format: 'table',
          includeMetrics: true,
        });
      }).toThrow('process.exit called');

      expect(processExitSpy).toHaveBeenCalledWith(1); // Should exit with error code
    });
  });

  describe('Output Format Validation', () => {
    let consoleSpy: jest.SpyInstance;
    let processExitSpy: jest.SpyInstance;

    beforeEach(() => {
      consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      processExitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {
        throw new Error('process.exit called');
      });
    });

    afterEach(() => {
      consoleSpy.mockRestore();
      processExitSpy.mockRestore();
    });

    it('should display proper table format with colors', () => {
      const files = [path.join(fixturesPath, 'with-dead-function.ts')];

      expect(() => {
        executeDeadCodeAnalysis(files, {
          format: 'table',
          includeMetrics: true,
        });
      }).toThrow('process.exit called');

      // Check for expected table elements
      const allCalls = consoleSpy.mock.calls.map(call => call[0]).join('\n');
      expect(allCalls).toContain('Dead Code Analysis Report');
      expect(allCalls).toContain('Dead Exports');
      expect(allCalls).toContain('Impact Summary');
      expect(allCalls).toContain('Next Steps');
    });

    it('should include metrics when requested', () => {
      const files = [path.join(fixturesPath, 'mixed-usage.ts')];

      expect(() => {
        executeDeadCodeAnalysis(files, {
          format: 'table',
          includeMetrics: true,
        });
      }).toThrow('process.exit called');

      const allCalls = consoleSpy.mock.calls.map(call => call[0]).join('\n');
      expect(allCalls).toContain('Files analyzed:');
      expect(allCalls).toContain('Analysis time:');
    });

    it('should show file locations correctly', () => {
      const files = [path.join(fixturesPath, 'with-dead-function.ts')];

      expect(() => {
        executeDeadCodeAnalysis(files, {
          format: 'table',
          includeMetrics: true,
        });
      }).toThrow('process.exit called');

      const allCalls = consoleSpy.mock.calls.map(call => call[0]).join('\n');
      expect(allCalls).toContain('with-dead-function.ts');
      expect(allCalls).toMatch(/:\d+/); // Should contain line numbers
    });
  });

  describe('Performance Validation', () => {
    let consoleSpy: jest.SpyInstance;
    let processExitSpy: jest.SpyInstance;

    beforeEach(() => {
      consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      processExitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {
        throw new Error('process.exit called');
      });
    });

    afterEach(() => {
      consoleSpy.mockRestore();
      processExitSpy.mockRestore();
    });

    it('should complete analysis within performance requirements', () => {
      const files = [
        path.join(fixturesPath, 'with-dead-function.ts'),
        path.join(fixturesPath, 'with-dead-class.ts'),
        path.join(fixturesPath, 'with-dead-variable.ts'),
        path.join(fixturesPath, 'consumer.ts'),
        path.join(fixturesPath, 'mixed-usage.ts'),
        path.join(fixturesPath, 'mixed-consumer.ts'),
      ];

      const startTime = Date.now();

      expect(() => {
        executeDeadCodeAnalysis(files, {
          format: 'table',
          includeMetrics: true,
        });
      }).toThrow('process.exit called');

      const endTime = Date.now();
      const executionTime = endTime - startTime;

      // Should complete within 3 seconds for this number of files
      expect(executionTime).toBeLessThan(3000);
    });
  });

  describe('Error Handling', () => {
    it('should handle empty file list gracefully', () => {
      let consoleSpy: jest.SpyInstance;
      let processExitSpy: jest.SpyInstance;

      consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      processExitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {
        throw new Error('process.exit called');
      });

      expect(() => {
        executeDeadCodeAnalysis([], { format: 'table', includeMetrics: true });
      }).toThrow('process.exit called');

      expect(processExitSpy).toHaveBeenCalledWith(1);
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Error:')
      );

      consoleSpy.mockRestore();
      processExitSpy.mockRestore();
    });
  });
});
