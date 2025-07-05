import { generateDependencyMarkdown } from '../src/generator';
import {
  DependencyGraph,
  DependencyRelationship,
  GraphMetrics,
} from '../src/types';

describe('Dependency Graph Generator', () => {
  const createMockGraph = (
    overrides: Partial<DependencyGraph> = {}
  ): DependencyGraph => {
    const defaultGraph: DependencyGraph = {
      projectPath: '/test/project',
      nodes: ['/test/project/src/a.ts', '/test/project/src/b.ts'],
      edges: [
        {
          from: '/test/project/src/a.ts',
          to: './b',
          type: 'import',
          importName: 'b',
          isExternal: false,
          importType: 'default',
        },
        {
          from: '/test/project/src/a.ts',
          to: 'lodash',
          type: 'import',
          importName: 'lodash',
          isExternal: true,
          importType: 'default',
        },
      ],
      metrics: {
        totalNodes: 2,
        totalEdges: 2,
        internalDependencies: 1,
        externalDependencies: 1,
        circularDependencies: [],
        mostConnectedModule: '/test/project/src/a.ts',
        averageDependencies: 1.0,
      },
    };

    return { ...defaultGraph, ...overrides };
  };

  describe('generateDependencyMarkdown', () => {
    it('should generate basic dependency markdown', () => {
      const graph = createMockGraph();
      const markdown = generateDependencyMarkdown(graph);

      expect(markdown).toContain('# 📊 Dependency Analysis');
      expect(markdown).toContain('## 🔗 Module Dependencies');
      expect(markdown).toContain('## 📈 Dependency Metrics');
      expect(markdown).toContain('## 🏗️ Architecture Layers');
    });

    it('should include project path in header', () => {
      const graph = createMockGraph({
        projectPath: '/home/user/my-project',
      });
      const markdown = generateDependencyMarkdown(graph);

      expect(markdown).toContain('# 📊 Dependency Analysis');
      expect(markdown).toContain('my-project');
    });

    it('should list internal dependencies correctly', () => {
      const graph = createMockGraph({
        edges: [
          {
            from: '/test/src/a.ts',
            to: './b',
            type: 'import',
            importName: 'b',
            isExternal: false,
            importType: 'default',
          },
          {
            from: '/test/src/a.ts',
            to: './c',
            type: 'import',
            importName: 'c',
            isExternal: false,
            importType: 'named',
          },
        ],
      });

      const markdown = generateDependencyMarkdown(graph);

      expect(markdown).toContain('### Internal Dependencies');
      expect(markdown).toContain('**a.ts** → `./b`, `./c`');
    });

    it('should list external dependencies correctly', () => {
      const graph = createMockGraph({
        edges: [
          {
            from: '/test/src/a.ts',
            to: 'react',
            type: 'import',
            importName: 'React',
            isExternal: true,
            importType: 'default',
          },
          {
            from: '/test/src/b.ts',
            to: 'react',
            type: 'import',
            importName: 'Component',
            isExternal: true,
            importType: 'named',
          },
          {
            from: '/test/src/a.ts',
            to: 'lodash',
            type: 'import',
            importName: 'lodash',
            isExternal: true,
            importType: 'default',
          },
        ],
      });

      const markdown = generateDependencyMarkdown(graph);

      expect(markdown).toContain('### External Dependencies');
      expect(markdown).toContain('**react** (used by: a.ts, b.ts)');
      expect(markdown).toContain('**lodash** (used by: a.ts)');
    });

    it('should display metrics correctly', () => {
      const graph = createMockGraph({
        metrics: {
          totalNodes: 5,
          totalEdges: 8,
          internalDependencies: 3,
          externalDependencies: 5,
          circularDependencies: [],
          mostConnectedModule: '/test/src/main.ts',
          averageDependencies: 1.6,
        },
      });

      const markdown = generateDependencyMarkdown(graph);

      expect(markdown).toContain('- **Total Modules**: 5');
      expect(markdown).toContain('- **Total Dependencies**: 8');
      expect(markdown).toContain('- **Internal Dependencies**: 3');
      expect(markdown).toContain('- **External Dependencies**: 5');
      expect(markdown).toContain('- **Average Dependencies per Module**: 1.6');
      expect(markdown).toContain('- **Most Connected Module**: main.ts');
      expect(markdown).toContain(
        '- **Circular Dependencies**: ❌ None detected'
      );
    });

    it('should show circular dependencies warning when present', () => {
      const graph = createMockGraph({
        metrics: {
          totalNodes: 3,
          totalEdges: 4,
          internalDependencies: 4,
          externalDependencies: 0,
          circularDependencies: [
            [
              '/test/src/a.ts',
              '/test/src/b.ts',
              '/test/src/c.ts',
              '/test/src/a.ts',
            ],
          ],
          averageDependencies: 1.3,
        },
      });

      const markdown = generateDependencyMarkdown(graph);

      expect(markdown).toContain('- **Circular Dependencies**: ⚠️ 1 detected');
      expect(markdown).toContain('## ⚠️ Circular Dependencies');
      expect(markdown).toContain('1. **a.ts → b.ts → c.ts → a.ts**');
      expect(markdown).toContain(
        '*Circular dependencies can lead to runtime errors*'
      );
    });

    it('should categorize files into architecture layers', () => {
      const graph = createMockGraph({
        nodes: [
          '/test/src/cli.ts',
          '/test/src/parser.ts',
          '/test/src/types.ts',
          '/test/src/utils.ts',
          '/test/src/test.spec.ts',
        ],
      });

      const markdown = generateDependencyMarkdown(graph);

      expect(markdown).toContain('## 🏗️ Architecture Layers');
      expect(markdown).toContain('### CLI Layer');
      expect(markdown).toContain(
        '**cli.ts** - Command-line interface and argument parsing'
      );
      expect(markdown).toContain('### Core Logic');
      expect(markdown).toContain(
        '**parser.ts** - Code parsing and AST analysis'
      );
      expect(markdown).toContain('### Types');
      expect(markdown).toContain('**types.ts** - TypeScript type definitions');
      expect(markdown).toContain('### Utilities');
      expect(markdown).toContain(
        '**utils.ts** - Utility functions and helpers'
      );
      expect(markdown).toContain('### Tests');
      expect(markdown).toContain(
        '**test.spec.ts** - Test cases and validation'
      );
    });

    it('should include Mermaid diagram when requested', () => {
      const graph = createMockGraph();
      const markdown = generateDependencyMarkdown(graph, {
        includeMermaid: true,
      });

      expect(markdown).toContain('## 🗺️ Visual Dependency Map');
      expect(markdown).toContain('```mermaid');
      expect(markdown).toContain('graph TD');
      expect(markdown).toContain('```');
    });

    it('should not include Mermaid diagram by default', () => {
      const graph = createMockGraph();
      const markdown = generateDependencyMarkdown(graph);

      expect(markdown).not.toContain('## 🗺️ Visual Dependency Map');
      expect(markdown).not.toContain('```mermaid');
    });

    it('should handle empty dependency graph', () => {
      const graph = createMockGraph({
        nodes: [],
        edges: [],
        metrics: {
          totalNodes: 0,
          totalEdges: 0,
          internalDependencies: 0,
          externalDependencies: 0,
          circularDependencies: [],
          averageDependencies: 0,
        },
      });

      const markdown = generateDependencyMarkdown(graph);

      expect(markdown).toContain('*No dependencies found*');
      expect(markdown).toContain('- **Total Modules**: 0');
      expect(markdown).toContain('- **Total Dependencies**: 0');
    });

    it('should handle graph with only external dependencies', () => {
      const graph = createMockGraph({
        edges: [
          {
            from: '/test/src/a.ts',
            to: 'react',
            type: 'import',
            importName: 'React',
            isExternal: true,
            importType: 'default',
          },
          {
            from: '/test/src/a.ts',
            to: 'lodash',
            type: 'import',
            importName: 'lodash',
            isExternal: true,
            importType: 'default',
          },
        ],
        metrics: {
          totalNodes: 1,
          totalEdges: 2,
          internalDependencies: 0,
          externalDependencies: 2,
          circularDependencies: [],
          averageDependencies: 2.0,
        },
      });

      const markdown = generateDependencyMarkdown(graph);

      expect(markdown).toContain('### External Dependencies');
      expect(markdown).toContain('**react** (used by: a.ts)');
      expect(markdown).toContain('**lodash** (used by: a.ts)');
      expect(markdown).not.toContain('### Internal Dependencies');
    });

    it('should handle graph with only internal dependencies', () => {
      const graph = createMockGraph({
        edges: [
          {
            from: '/test/src/a.ts',
            to: './b',
            type: 'import',
            importName: 'b',
            isExternal: false,
            importType: 'default',
          },
        ],
        metrics: {
          totalNodes: 2,
          totalEdges: 1,
          internalDependencies: 1,
          externalDependencies: 0,
          circularDependencies: [],
          averageDependencies: 0.5,
        },
      });

      const markdown = generateDependencyMarkdown(graph);

      expect(markdown).toContain('### Internal Dependencies');
      expect(markdown).toContain('**a.ts** → `./b`');
      expect(markdown).not.toContain('### External Dependencies');
    });
  });

  describe('Mermaid diagram generation', () => {
    it('should generate valid Mermaid syntax', () => {
      const graph = createMockGraph({
        nodes: ['/test/a.ts', '/test/b.ts'],
        edges: [
          {
            from: '/test/a.ts',
            to: './b',
            type: 'import',
            importName: 'b',
            isExternal: false,
            importType: 'default',
          },
        ],
      });

      const markdown = generateDependencyMarkdown(graph, {
        includeMermaid: true,
      });

      expect(markdown).toContain('```mermaid');
      expect(markdown).toContain('graph TD');
      expect(markdown).toContain('a0[a.ts]');
      expect(markdown).toContain('b1[b.ts]');
      expect(markdown).toContain('a0 --> b1');
      expect(markdown).toContain('```');
    });

    it('should only include internal dependencies in Mermaid diagram', () => {
      const graph = createMockGraph({
        nodes: ['/test/a.ts'],
        edges: [
          {
            from: '/test/a.ts',
            to: './b',
            type: 'import',
            importName: 'b',
            isExternal: false,
            importType: 'default',
          },
          {
            from: '/test/a.ts',
            to: 'react',
            type: 'import',
            importName: 'React',
            isExternal: true,
            importType: 'default',
          },
        ],
      });

      const markdown = generateDependencyMarkdown(graph, {
        includeMermaid: true,
      });

      // Should include internal dependency
      expect(markdown).toContain('a0 --> b1');
      // Should not include external dependency
      expect(markdown).not.toContain('react');
    });
  });
});
