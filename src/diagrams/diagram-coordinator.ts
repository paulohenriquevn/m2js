import { ParsedFile, DependencyGraph } from '../types';
import { DiagramOptions, DiagramResult, DiagramType } from './diagram-types';
import { MermaidEnhancer } from './mermaid-enhancer';
import { ClassDiagramGenerator } from './class-diagram';

/**
 * Main coordinator for diagram generation
 * Routes requests to appropriate diagram generators
 */
export class DiagramCoordinator {
  private mermaidEnhancer: MermaidEnhancer;
  private classGenerator: ClassDiagramGenerator;

  constructor() {
    this.mermaidEnhancer = new MermaidEnhancer();
    this.classGenerator = new ClassDiagramGenerator();
  }

  /**
   * Generate diagram based on type and options
   */
  generateDiagram(
    data: {
      parsedFile?: ParsedFile;
      parsedFiles?: ParsedFile[];
      dependencyGraph?: DependencyGraph;
    },
    options: DiagramOptions
  ): DiagramResult {
    switch (options.type) {
      case 'dependency':
        return this.generateDependencyDiagram(data.dependencyGraph!, options);

      case 'class':
        return this.generateClassDiagram(data, options);

      case 'sequence':
        throw new Error('Sequence diagrams not yet implemented');

      case 'component':
        throw new Error('Component diagrams not yet implemented');

      default:
        throw new Error(`Unsupported diagram type: ${options.type}`);
    }
  }

  /**
   * Generate dependency diagram
   */
  private generateDependencyDiagram(
    graph: DependencyGraph,
    options: DiagramOptions
  ): DiagramResult {
    return this.mermaidEnhancer.generateEnhancedDependencyDiagram(
      graph,
      options
    );
  }

  /**
   * Generate class diagram
   */
  private generateClassDiagram(
    data: {
      parsedFile?: ParsedFile;
      parsedFiles?: ParsedFile[];
    },
    options: DiagramOptions
  ): DiagramResult {
    if (data.parsedFiles && data.parsedFiles.length > 1) {
      return this.classGenerator.generateMultiFileClassDiagram(
        data.parsedFiles,
        options
      );
    } else if (data.parsedFile) {
      return this.classGenerator.generateClassDiagram(data.parsedFile, options);
    } else {
      throw new Error('No parsed file data provided for class diagram');
    }
  }

  /**
   * Get supported diagram types
   */
  getSupportedTypes(): DiagramType[] {
    return ['dependency', 'class']; // Will expand as we implement more
  }

  /**
   * Validate diagram options
   */
  validateOptions(options: DiagramOptions): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!this.getSupportedTypes().includes(options.type)) {
      errors.push(`Unsupported diagram type: ${options.type}`);
    }

    if (!['neutral', 'dark', 'forest', 'base'].includes(options.theme)) {
      errors.push(`Unsupported theme: ${options.theme}`);
    }

    if (!['markdown', 'svg', 'png'].includes(options.format)) {
      errors.push(`Unsupported format: ${options.format}`);
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Generate multiple diagrams at once
   */
  generateMultipleDiagrams(
    data: {
      parsedFile?: ParsedFile;
      parsedFiles?: ParsedFile[];
      dependencyGraph?: DependencyGraph;
    },
    types: DiagramType[],
    baseOptions: Partial<DiagramOptions> = {}
  ): { [key in DiagramType]?: DiagramResult } {
    const results: { [key in DiagramType]?: DiagramResult } = {};

    types.forEach(type => {
      try {
        const options: DiagramOptions = {
          type,
          theme: 'neutral',
          format: 'markdown',
          includeExternal: false,
          interactive: false,
          ...baseOptions,
        };

        results[type] = this.generateDiagram(data, options);
      } catch (error) {
        console.warn(`Failed to generate ${type} diagram:`, error);
      }
    });

    return results;
  }

  /**
   * Static factory method
   */
  static create(): DiagramCoordinator {
    return new DiagramCoordinator();
  }
}

/**
 * Convenience function for quick diagram generation
 */
export function generateDiagram(
  type: DiagramType,
  data: {
    parsedFile?: ParsedFile;
    parsedFiles?: ParsedFile[];
    dependencyGraph?: DependencyGraph;
  },
  options: Partial<DiagramOptions> = {}
): string {
  const coordinator = DiagramCoordinator.create();
  const fullOptions: DiagramOptions = {
    type,
    theme: 'neutral',
    format: 'markdown',
    includeExternal: false,
    interactive: false,
    ...options,
  };

  return coordinator.generateDiagram(data, fullOptions).content;
}
