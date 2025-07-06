import {
  extractFileDependencies,
  analyzeDependencies,
} from '../src/dependency-analyzer';
import { DependencyRelationship, DependencyGraph } from '../src/types';
import path from 'path';

describe('Dependency Analyzer', () => {
  describe('extractFileDependencies', () => {
    it('should extract named imports correctly', () => {
      const code = `
        import { foo, bar } from './module';
        import { Component } from 'react';
      `;
      const filePath = '/test/file.ts';

      const dependencies = extractFileDependencies(filePath, code);

      expect(dependencies).toHaveLength(3);

      // Named imports from local module
      expect(dependencies[0]).toEqual({
        from: filePath,
        to: './module',
        type: 'import',
        importName: 'foo',
        isExternal: false,
        importType: 'named',
      });

      expect(dependencies[1]).toEqual({
        from: filePath,
        to: './module',
        type: 'import',
        importName: 'bar',
        isExternal: false,
        importType: 'named',
      });

      // Named import from external module
      expect(dependencies[2]).toEqual({
        from: filePath,
        to: 'react',
        type: 'import',
        importName: 'Component',
        isExternal: true,
        importType: 'named',
      });
    });

    it('should extract default imports correctly', () => {
      const code = `
        import React from 'react';
        import utils from './utils';
      `;
      const filePath = '/test/file.ts';

      const dependencies = extractFileDependencies(filePath, code);

      expect(dependencies).toHaveLength(2);

      expect(dependencies[0]).toEqual({
        from: filePath,
        to: 'react',
        type: 'import',
        importName: 'React',
        isExternal: true,
        importType: 'default',
      });

      expect(dependencies[1]).toEqual({
        from: filePath,
        to: './utils',
        type: 'import',
        importName: 'utils',
        isExternal: false,
        importType: 'default',
      });
    });

    it('should extract namespace imports correctly', () => {
      const code = `
        import * as React from 'react';
        import * as utils from './utils';
      `;
      const filePath = '/test/file.ts';

      const dependencies = extractFileDependencies(filePath, code);

      expect(dependencies).toHaveLength(2);

      expect(dependencies[0]).toEqual({
        from: filePath,
        to: 'react',
        type: 'import',
        importName: 'React',
        isExternal: true,
        importType: 'namespace',
      });

      expect(dependencies[1]).toEqual({
        from: filePath,
        to: './utils',
        type: 'import',
        importName: 'utils',
        isExternal: false,
        importType: 'namespace',
      });
    });

    it('should extract side-effect imports correctly', () => {
      const code = `
        import './styles.css';
        import 'polyfill';
      `;
      const filePath = '/test/file.ts';

      const dependencies = extractFileDependencies(filePath, code);

      expect(dependencies).toHaveLength(2);

      expect(dependencies[0]).toEqual({
        from: filePath,
        to: './styles.css',
        type: 'import',
        isExternal: false,
        importType: 'side-effect',
      });

      expect(dependencies[1]).toEqual({
        from: filePath,
        to: 'polyfill',
        type: 'import',
        isExternal: true,
        importType: 'side-effect',
      });
    });

    it('should extract re-exports correctly', () => {
      const code = `
        export { foo, bar } from './module';
        export * from './utils';
      `;
      const filePath = '/test/file.ts';

      const dependencies = extractFileDependencies(filePath, code);

      expect(dependencies).toHaveLength(3);

      expect(dependencies[0]).toEqual({
        from: filePath,
        to: './module',
        type: 'export',
        importName: 'foo',
        isExternal: false,
        importType: 'named',
      });

      expect(dependencies[1]).toEqual({
        from: filePath,
        to: './module',
        type: 'export',
        importName: 'bar',
        isExternal: false,
        importType: 'named',
      });

      expect(dependencies[2]).toEqual({
        from: filePath,
        to: './utils',
        type: 'export',
        isExternal: false,
        importType: 'namespace',
      });
    });

    it('should handle TypeScript type imports', () => {
      const code = `
        import type { User } from './types';
        import { type Config } from './config';
      `;
      const filePath = '/test/file.ts';

      const dependencies = extractFileDependencies(filePath, code);

      expect(dependencies).toHaveLength(2);

      expect(dependencies[0]).toEqual({
        from: filePath,
        to: './types',
        type: 'import',
        importName: 'User',
        isExternal: false,
        importType: 'named',
      });

      expect(dependencies[1]).toEqual({
        from: filePath,
        to: './config',
        type: 'import',
        importName: 'Config',
        isExternal: false,
        importType: 'named',
      });
    });

    it('should handle complex import scenarios', () => {
      const code = `
        import React, { Component, useState } from 'react';
        import defaultUtil, { namedUtil } from './utils';
        import * as helpers from './helpers';
      `;
      const filePath = '/test/file.ts';

      const dependencies = extractFileDependencies(filePath, code);

      expect(dependencies).toHaveLength(5);

      // React default import
      expect(dependencies[0]).toEqual({
        from: filePath,
        to: 'react',
        type: 'import',
        importName: 'React',
        isExternal: true,
        importType: 'default',
      });

      // React named imports
      expect(dependencies[1].importName).toBe('Component');
      expect(dependencies[2].importName).toBe('useState');

      // Utils default and named
      expect(dependencies[3].importName).toBe('defaultUtil');
      expect(dependencies[4].importName).toBe('namedUtil');
    });

    it('should fail fast on invalid syntax', () => {
      const code = `
        import { broken syntax
      `;
      const filePath = '/test/file.ts';

      expect(() => {
        extractFileDependencies(filePath, code);
      }).toThrow('Failed to parse dependencies in /test/file.ts');
    });

    it('should handle empty file', () => {
      const code = '';
      const filePath = '/test/file.ts';

      const dependencies = extractFileDependencies(filePath, code);

      expect(dependencies).toHaveLength(0);
    });
  });

  describe('analyzeDependencies', () => {
    const createTestFile = (
      filePath: string,
      dependencies: string[]
    ): string => {
      const imports = dependencies
        .map(dep => `import something from '${dep}';`)
        .join('\n');
      return imports;
    };

    it('should analyze dependencies for multiple files', () => {
      // Mock file system - in real scenario we'd use actual files
      const files = ['/src/a.ts', '/src/b.ts'];

      // Mock extractFileDependencies to avoid file system
      const originalExtract =
        require('../src/dependency-analyzer').extractFileDependencies;
      const mockExtract = jest
        .fn()
        .mockReturnValueOnce([
          {
            from: '/src/a.ts',
            to: './b',
            type: 'import',
            importName: 'b',
            isExternal: false,
            importType: 'default',
          },
          {
            from: '/src/a.ts',
            to: 'lodash',
            type: 'import',
            importName: 'lodash',
            isExternal: true,
            importType: 'default',
          },
        ])
        .mockReturnValueOnce([
          {
            from: '/src/b.ts',
            to: 'react',
            type: 'import',
            importName: 'React',
            isExternal: true,
            importType: 'default',
          },
        ]);

      // Temporarily replace the function
      require('../src/dependency-analyzer').extractFileDependencies =
        mockExtract;

      // Mock fs.readFileSync
      const fs = require('fs');
      const originalReadFile = fs.readFileSync;
      fs.readFileSync = jest
        .fn()
        .mockReturnValueOnce(
          "import b from './b'; import lodash from 'lodash';"
        )
        .mockReturnValueOnce("import React from 'react';");

      try {
        const graph = analyzeDependencies(files, { detectCircular: true });

        expect(graph.nodes).toContain('/src/a.ts');
        expect(graph.nodes).toContain('/src/b.ts');
        expect(graph.edges).toHaveLength(3);

        expect(graph.metrics.totalNodes).toBe(2);
        expect(graph.metrics.totalEdges).toBe(3);
        expect(graph.metrics.internalDependencies).toBe(1);
        expect(graph.metrics.externalDependencies).toBe(2);
      } finally {
        // Restore original functions
        require('../src/dependency-analyzer').extractFileDependencies =
          originalExtract;
        fs.readFileSync = originalReadFile;
      }
    });

    it('should fail fast on empty file list', () => {
      expect(() => {
        analyzeDependencies([]);
      }).toThrow('No files provided for dependency analysis');
    });

    it('should calculate metrics correctly', () => {
      const files = ['/src/test.ts'];

      // Mock file system
      const fs = require('fs');
      const originalReadFile = fs.readFileSync;
      fs.readFileSync = jest.fn().mockReturnValue("import React from 'react';");

      const originalExtract =
        require('../src/dependency-analyzer').extractFileDependencies;
      const mockExtract = jest.fn().mockReturnValue([
        {
          from: '/src/test.ts',
          to: 'react',
          type: 'import',
          importName: 'React',
          isExternal: true,
          importType: 'default',
        },
      ]);

      require('../src/dependency-analyzer').extractFileDependencies =
        mockExtract;

      try {
        const graph = analyzeDependencies(files);

        expect(graph.metrics.averageDependencies).toBe(1.0);
        expect(graph.metrics.circularDependencies).toHaveLength(0);
      } finally {
        require('../src/dependency-analyzer').extractFileDependencies =
          originalExtract;
        fs.readFileSync = originalReadFile;
      }
    });
  });

  describe('Edge cases and error handling', () => {
    it('should handle files with no dependencies', () => {
      const code = `
        const x = 5;
        function hello() {
          console.log('Hello');
        }
      `;
      const filePath = '/test/file.ts';

      const dependencies = extractFileDependencies(filePath, code);

      expect(dependencies).toHaveLength(0);
    });

    it('should handle relative path variations', () => {
      const code = `
        import a from './module';
        import b from '../parent';
        import c from '/absolute';
      `;
      const filePath = '/test/file.ts';

      const dependencies = extractFileDependencies(filePath, code);

      expect(dependencies[0].isExternal).toBe(false); // ./module
      expect(dependencies[1].isExternal).toBe(false); // ../parent
      expect(dependencies[2].isExternal).toBe(false); // /absolute
    });

    it('should distinguish external vs internal modules correctly', () => {
      const code = `
        import react from 'react';
        import lodash from 'lodash';
        import myModule from './my-module';
        import parentModule from '../parent-module';
      `;
      const filePath = '/test/file.ts';

      const dependencies = extractFileDependencies(filePath, code);

      const external = dependencies.filter(d => d.isExternal);
      const internal = dependencies.filter(d => !d.isExternal);

      expect(external).toHaveLength(2); // react, lodash
      expect(internal).toHaveLength(2); // ./my-module, ../parent-module

      expect(external.map(d => d.to)).toEqual(['react', 'lodash']);
      expect(internal.map(d => d.to)).toEqual([
        './my-module',
        '../parent-module',
      ]);
    });
  });
});
