/**
 * Suggestion Engine Tests
 * Comprehensive tests for safe removal suggestions with confidence levels
 */

import path from 'path';
import {
  generateRemovalSuggestions,
  assessExportRemovalRisk,
  assessImportRemovalRisk,
} from '../src/suggestion-engine';
import { DeadExport, UnusedImport } from '../src/dead-code-types';

describe('Suggestion Engine', () => {
  const testProjectPath = '/test/project';

  describe('Export Risk Assessment', () => {
    it('should assign high confidence to simple internal exports', () => {
      const deadExport: DeadExport = {
        file: '/test/project/src/utils/helper.ts',
        name: 'internalHelper',
        type: 'function',
        line: 10,
        reason: 'Never imported',
        confidence: 'medium', // Will be updated
        riskFactors: [], // Will be updated
      };

      const result = assessExportRemovalRisk(deadExport, testProjectPath);

      expect(result.confidence).toBe('high');
      expect(result.riskFactors).toHaveLength(0);
    });

    it('should assign medium confidence to exports with some risk factors', () => {
      const deadExport: DeadExport = {
        file: '/test/project/src/index.ts',
        name: 'createApi',
        type: 'function',
        line: 5,
        reason: 'Never imported',
        confidence: 'medium',
        riskFactors: [],
      };

      const result = assessExportRemovalRisk(deadExport, testProjectPath);

      expect(result.confidence).toBe('medium');
      expect(result.riskFactors.length).toBeGreaterThan(0);
      expect(result.riskFactors).toContain('Appears to be public API - may have external consumers');
      expect(result.riskFactors).toContain('Export name suggests it may be used by external packages');
    });

    it('should assign low confidence to high-risk exports', () => {
      const deadExport: DeadExport = {
        file: '/test/project/api/config.ts',  // Changed to api directory for public API detection
        name: 'default',
        type: 'interface',
        line: 1,
        reason: 'Never imported',
        confidence: 'medium',
        riskFactors: [],
      };

      const result = assessExportRemovalRisk(deadExport, testProjectPath);

      expect(result.confidence).toBe('low');
      expect(result.riskFactors.length).toBeGreaterThan(2);
      expect(result.riskFactors).toContain('Appears to be public API - may have external consumers');
      expect(result.riskFactors).toContain('Type definition - may be used in type annotations');
      expect(result.riskFactors).toContain('Default export - may be imported with different names');
      expect(result.riskFactors).toContain('Configuration file - may be loaded dynamically');
    });

    it('should detect test file exports correctly', () => {
      const deadExport: DeadExport = {
        file: '/test/project/src/utils.test.ts',
        name: 'testHelper',
        type: 'function',
        line: 15,
        reason: 'Never imported',
        confidence: 'medium',
        riskFactors: [],
      };

      const result = assessExportRemovalRisk(deadExport, testProjectPath);

      expect(result.riskFactors).toContain('Located in test file - may be used by test framework');
    });

    it('should detect public API patterns in lib directory', () => {
      const deadExport: DeadExport = {
        file: '/test/project/lib/public.ts',
        name: 'publicFunction',
        type: 'function',
        line: 8,
        reason: 'Never imported',
        confidence: 'medium',
        riskFactors: [],
      };

      const result = assessExportRemovalRisk(deadExport, testProjectPath);

      expect(result.riskFactors).toContain('Appears to be public API - may have external consumers');
    });
  });

  describe('Import Risk Assessment', () => {
    it('should assign high confidence to unused external imports', () => {
      const unusedImport: UnusedImport = {
        file: '/test/project/src/component.ts',
        name: 'lodash',
        from: 'lodash',
        line: 2,
        type: 'default',
        reason: 'Imported but never used',
        confidence: 'medium',
        riskFactors: [],
      };

      const result = assessImportRemovalRisk(unusedImport);

      expect(result.confidence).toBe('high');
      expect(result.riskFactors).toHaveLength(0);
    });

    it('should assign medium confidence to potentially risky imports', () => {
      const unusedImport: UnusedImport = {
        file: '/test/project/src/component.tsx',
        name: 'React',
        from: 'react',
        line: 1,
        type: 'default',
        reason: 'Imported but never used',
        confidence: 'medium',
        riskFactors: [],
      };

      const result = assessImportRemovalRisk(unusedImport);

      expect(result.confidence).toBe('medium');
      expect(result.riskFactors).toContain('Framework import - may be used implicitly');
    });

    it('should detect side-effect imports', () => {
      const unusedImport: UnusedImport = {
        file: '/test/project/src/index.ts',
        name: 'core-js',
        from: 'core-js/stable',
        line: 1,
        type: 'namespace',
        reason: 'Imported but never used',
        confidence: 'medium',
        riskFactors: [],
      };

      const result = assessImportRemovalRisk(unusedImport);

      // Both side-effect and polyfill patterns should match core-js/stable
      expect(result.riskFactors).toContain('May be imported for side effects');
      expect(result.riskFactors).toContain('Appears to be polyfill or setup import');
    });

    it('should detect type-only imports', () => {
      const unusedImport: UnusedImport = {
        file: '/test/project/src/types.ts',
        name: 'UserInterface',
        from: './user-types',
        line: 3,
        type: 'named',
        reason: 'Imported but never used',
        confidence: 'medium',
        riskFactors: [],
      };

      const result = assessImportRemovalRisk(unusedImport);

      expect(result.riskFactors).toContain('May be used in type annotations only');
    });

    it('should assign low confidence to multiple risk factors', () => {
      const unusedImport: UnusedImport = {
        file: '/test/project/src/setup.ts',
        name: 'polyfillType',
        from: 'core-js/polyfill',
        line: 1,
        type: 'named',
        reason: 'Imported but never used',
        confidence: 'medium',
        riskFactors: [],
      };

      const result = assessImportRemovalRisk(unusedImport);

      expect(result.confidence).toBe('low');
      expect(result.riskFactors.length).toBeGreaterThan(1);
    });
  });

  describe('Removal Suggestions Generation', () => {
    it('should generate prioritized suggestions', () => {
      const deadExports: DeadExport[] = [
        {
          file: '/test/project/src/utils.ts',
          name: 'simpleHelper',
          type: 'function',
          line: 10,
          reason: 'Never imported',
          confidence: 'high',
          riskFactors: [],
        },
        {
          file: '/test/project/src/index.ts',
          name: 'createApi',
          type: 'function',
          line: 5,
          reason: 'Never imported',
          confidence: 'medium',
          riskFactors: ['Appears to be public API - may have external consumers'],
        },
        {
          file: '/test/project/src/config.ts',
          name: 'default',
          type: 'interface',
          line: 1,
          reason: 'Never imported',
          confidence: 'low',
          riskFactors: [
            'Type definition - may be used in type annotations',
            'Default export - may be imported with different names',
            'Configuration file - may be loaded dynamically',
          ],
        },
      ];

      const unusedImports: UnusedImport[] = [
        {
          file: '/test/project/src/component.ts',
          name: 'unused',
          from: 'external-lib',
          line: 3,
          type: 'named',
          reason: 'Imported but never used',
          confidence: 'high',
          riskFactors: [],
        },
      ];

      const suggestions = generateRemovalSuggestions(
        deadExports,
        unusedImports,
        testProjectPath
      );

      // Should have 4 suggestions total
      expect(suggestions).toHaveLength(4);

      // High priority/safe suggestions should come first
      expect(suggestions[0].priority).toBe('high');
      expect(suggestions[0].safety).toBe('safe');
      expect(suggestions[0].command).toBeDefined();

      // Medium confidence should have review-needed safety
      const mediumSuggestion = suggestions.find(s => s.file.includes('index.ts'));
      expect(mediumSuggestion?.safety).toBe('review-needed');
      expect(mediumSuggestion?.warnings).toBeDefined();
      expect(mediumSuggestion?.warnings?.length).toBeGreaterThan(0);

      // Low confidence should be risky
      const lowSuggestion = suggestions.find(s => s.file.includes('config.ts'));
      expect(lowSuggestion?.safety).toBe('risky');
    });

    it('should generate correct suggestion types', () => {
      const deadExports: DeadExport[] = [
        {
          file: '/test/project/src/utils.ts',
          name: 'helper',
          type: 'function',
          line: 10,
          reason: 'Never imported',
          confidence: 'high',
          riskFactors: [],
        },
      ];

      const unusedImports: UnusedImport[] = [
        {
          file: '/test/project/src/component.ts',
          name: 'unused',
          from: 'lib',
          line: 3,
          type: 'named',
          reason: 'Imported but never used',
          confidence: 'high',
          riskFactors: [],
        },
      ];

      const suggestions = generateRemovalSuggestions(
        deadExports,
        unusedImports,
        testProjectPath
      );

      expect(suggestions).toHaveLength(2);

      const exportSuggestion = suggestions.find(s => s.type === 'remove-export');
      expect(exportSuggestion).toBeDefined();
      expect(exportSuggestion?.action).toContain('Remove function: helper');

      const importSuggestion = suggestions.find(s => s.type === 'remove-import');
      expect(importSuggestion).toBeDefined();
      expect(importSuggestion?.action).toContain('Remove unused import: unused');
    });

    it('should handle empty inputs gracefully', () => {
      const suggestions = generateRemovalSuggestions([], [], testProjectPath);

      expect(suggestions).toHaveLength(0);
    });

    it('should generate unique IDs for suggestions', () => {
      const deadExports: DeadExport[] = [
        {
          file: '/test/project/src/utils.ts',
          name: 'helper1',
          type: 'function',
          line: 10,
          reason: 'Never imported',
          confidence: 'high',
          riskFactors: [],
        },
        {
          file: '/test/project/src/utils.ts',
          name: 'helper2',
          type: 'function',
          line: 15,
          reason: 'Never imported',
          confidence: 'high',
          riskFactors: [],
        },
      ];

      const unusedImports: UnusedImport[] = [
        {
          file: '/test/project/src/component.ts',
          name: 'unused1',
          from: 'lib',
          line: 3,
          type: 'named',
          reason: 'Imported but never used',
          confidence: 'high',
          riskFactors: [],
        },
      ];

      const suggestions = generateRemovalSuggestions(
        deadExports,
        unusedImports,
        testProjectPath
      );

      const ids = suggestions.map(s => s.id);
      const uniqueIds = new Set(ids);

      expect(uniqueIds.size).toBe(ids.length);
      expect(ids).toContain('export-0');
      expect(ids).toContain('export-1');
      expect(ids).toContain('import-2');
    });

    it('should provide relative file paths', () => {
      const deadExports: DeadExport[] = [
        {
          file: '/test/project/src/deep/nested/utils.ts',
          name: 'helper',
          type: 'function',
          line: 10,
          reason: 'Never imported',
          confidence: 'high',
          riskFactors: [],
        },
      ];

      const suggestions = generateRemovalSuggestions(deadExports, [], testProjectPath);

      expect(suggestions[0].file).toBe('src/deep/nested/utils.ts');
      expect(suggestions[0].file).not.toContain('/test/project');
    });

    it('should estimate impact correctly for different types', () => {
      const deadExports: DeadExport[] = [
        {
          file: '/test/project/src/utils.ts',
          name: 'simpleVar',
          type: 'variable',
          line: 10,
          reason: 'Never imported',
          confidence: 'high',
          riskFactors: [],
        },
        {
          file: '/test/project/src/utils.ts',
          name: 'BigClass',
          type: 'class',
          line: 15,
          reason: 'Never imported',
          confidence: 'high',
          riskFactors: [],
        },
      ];

      const suggestions = generateRemovalSuggestions(deadExports, [], testProjectPath);

      const variableSuggestion = suggestions.find(s => s.action.includes('variable'));
      const classSuggestion = suggestions.find(s => s.action.includes('class'));

      expect(variableSuggestion?.impact).toContain('(~1 lines)');
      expect(classSuggestion?.impact).toContain('(~20 lines)');
    });
  });

  describe('Integration with Confidence Assessment', () => {
    it('should correctly map confidence to priority and safety', () => {
      const highConfidenceExport: DeadExport = {
        file: '/test/project/src/utils.ts',
        name: 'helper',
        type: 'function',
        line: 10,
        reason: 'Never imported',
        confidence: 'high',
        riskFactors: [],
      };

      const mediumConfidenceExport: DeadExport = {
        file: '/test/project/src/api.ts',
        name: 'createApi',
        type: 'function',
        line: 5,
        reason: 'Never imported',
        confidence: 'medium',
        riskFactors: ['Appears to be public API'],
      };

      const lowConfidenceExport: DeadExport = {
        file: '/test/project/src/config.ts',
        name: 'Config',
        type: 'interface',
        line: 1,
        reason: 'Never imported',
        confidence: 'low',
        riskFactors: ['Multiple risk factors'],
      };

      const suggestions = generateRemovalSuggestions(
        [highConfidenceExport, mediumConfidenceExport, lowConfidenceExport],
        [],
        testProjectPath
      );

      // High confidence should be high priority and safe
      const highSuggestion = suggestions.find(s => s.action.includes('helper'));
      expect(highSuggestion?.priority).toBe('high');
      expect(highSuggestion?.safety).toBe('safe');
      expect(highSuggestion?.command).toBeDefined();

      // Medium confidence with risks should be review-needed
      const mediumSuggestion = suggestions.find(s => s.action.includes('createApi'));
      expect(mediumSuggestion?.priority).toBe('medium');
      expect(mediumSuggestion?.safety).toBe('review-needed');
      expect(mediumSuggestion?.warnings).toBeDefined();

      // Low confidence should be risky
      const lowSuggestion = suggestions.find(s => s.action.includes('Config'));
      expect(lowSuggestion?.priority).toBe('low');
      expect(lowSuggestion?.safety).toBe('risky');
      expect(lowSuggestion?.command).toBeUndefined();
    });
  });
});