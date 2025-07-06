import { ParsedFile, ParsedClass, ParsedMethod } from '../types';
import {
  DiagramOptions,
  DiagramResult,
  ClassDiagramNode,
} from './diagram-types';

/**
 * Class diagram generator for M2JS
 * Converts ParsedFile data into Mermaid class diagrams
 */
export class ClassDiagramGenerator {
  /**
   * Generate class diagram from parsed file data
   */
  generateClassDiagram(
    parsedFile: ParsedFile,
    options: DiagramOptions
  ): DiagramResult {
    const sections: string[] = [];

    // Add title
    const title = options.title || `🏗️ Class Diagram - ${parsedFile.fileName}`;
    sections.push(`## ${title}`);

    // Add description
    if (options.description) {
      sections.push(`*${options.description}*`);
      sections.push('');
    }

    // Start Mermaid block
    sections.push('```mermaid');
    sections.push(this.generateMermaidConfig(options));
    sections.push('classDiagram');

    if (parsedFile.classes.length === 0) {
      sections.push('    note "No classes found in this file"');
    } else {
      // Generate class definitions
      const classNodes = this.convertToClassNodes(parsedFile.classes);
      sections.push(...this.generateClassDefinitions(classNodes));

      // Generate relationships (future enhancement)
      sections.push(...this.generateClassRelationships(classNodes));
    }

    sections.push('```');

    return {
      content: sections.join('\n'),
      metadata: {
        type: 'class',
        theme: options.theme,
        nodeCount: parsedFile.classes.length,
        edgeCount: 0, // Will be updated when relationships are implemented
        generatedAt: new Date(),
      },
    };
  }

  /**
   * Generate Mermaid configuration for class diagrams
   */
  private generateMermaidConfig(options: DiagramOptions): string {
    const config = {
      theme: options.theme,
      class: {
        htmlLabels: false,
      },
    };

    return `%%{init: ${JSON.stringify(config)}}%%`;
  }

  /**
   * Convert ParsedClass to ClassDiagramNode
   */
  private convertToClassNodes(classes: ParsedClass[]): ClassDiagramNode[] {
    return classes.map(cls => ({
      name: cls.name,
      methods: cls.methods
        .filter(method => !method.isPrivate) // Only public methods
        .map(method => ({
          name: method.name,
          visibility: '+', // Public by default
          params: this.formatParameters(method),
          returnType: method.returnType || 'void',
        })),
      properties: [], // Will be enhanced in future versions
    }));
  }

  /**
   * Format method parameters for display
   */
  private formatParameters(method: ParsedMethod): string {
    return method.params
      .map(param => {
        const optional = param.optional ? '?' : '';
        const type = param.type || 'any';
        return `${param.name}${optional}: ${type}`;
      })
      .join(', ');
  }

  /**
   * Generate class definitions in Mermaid syntax
   */
  private generateClassDefinitions(classNodes: ClassDiagramNode[]): string[] {
    const definitions: string[] = [];

    classNodes.forEach(classNode => {
      definitions.push(`  class ${classNode.name} {`);

      // Add properties (future enhancement)
      if (classNode.properties && classNode.properties.length > 0) {
        classNode.properties.forEach(prop => {
          definitions.push(`    ${prop.visibility}${prop.type} ${prop.name}`);
        });
      }

      // Add methods
      classNode.methods.forEach(method => {
        const methodSignature = `${method.visibility}${method.name}(${method.params}): ${method.returnType}`;
        definitions.push(`    ${methodSignature}`);
      });

      definitions.push('  }');
      definitions.push('');
    });

    return definitions;
  }

  /**
   * Generate class relationships (future enhancement)
   */
  private generateClassRelationships(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _classNodes: ClassDiagramNode[]
  ): string[] {
    const relationships: string[] = [];

    // Future enhancement: Analyze dependencies between classes
    // For now, return empty array
    // TODO: Implement inheritance, composition, aggregation detection

    return relationships;
  }

  /**
   * Generate class diagram for multiple files
   */
  generateMultiFileClassDiagram(
    parsedFiles: ParsedFile[],
    options: DiagramOptions
  ): DiagramResult {
    const sections: string[] = [];

    // Add title
    const title = options.title || '🏗️ Multi-File Class Diagram';
    sections.push(`## ${title}`);

    // Start Mermaid block
    sections.push('```mermaid');
    sections.push(this.generateMermaidConfig(options));
    sections.push('classDiagram');

    let totalClasses = 0;

    parsedFiles.forEach(parsedFile => {
      if (parsedFile.classes.length > 0) {
        const classNodes = this.convertToClassNodes(parsedFile.classes);
        sections.push(`  %% Classes from ${parsedFile.fileName}`);
        sections.push(...this.generateClassDefinitions(classNodes));
        totalClasses += parsedFile.classes.length;
      }
    });

    if (totalClasses === 0) {
      sections.push('    note "No classes found in the analyzed files"');
    }

    sections.push('```');

    return {
      content: sections.join('\n'),
      metadata: {
        type: 'class',
        theme: options.theme,
        nodeCount: totalClasses,
        edgeCount: 0,
        generatedAt: new Date(),
      },
    };
  }

  /**
   * Static method for easy usage
   */
  static generate(
    parsedFile: ParsedFile,
    options: Partial<DiagramOptions> = {}
  ): string {
    const generator = new ClassDiagramGenerator();
    const fullOptions: DiagramOptions = {
      type: 'class',
      theme: 'neutral',
      format: 'markdown',
      includeExternal: false,
      interactive: false,
      ...options,
    };

    return generator.generateClassDiagram(parsedFile, fullOptions).content;
  }
}
