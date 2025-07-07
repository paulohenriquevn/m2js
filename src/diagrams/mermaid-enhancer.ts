/* eslint-disable max-lines-per-function */

import path from 'path';
import { DependencyGraph } from '../types';
import { DiagramOptions, DiagramResult, MermaidConfig } from './diagram-types';
import {
  NEUTRAL_THEME,
  NEUTRAL_NODE_TYPES,
  generateNeutralCSS,
} from './themes/neutral';

/**
 * Enhanced Mermaid diagram generator with styling and themes
 */
export class MermaidEnhancer {
  private config: MermaidConfig;

  constructor(theme: DiagramOptions['theme'] = 'neutral') {
    this.config = this.getThemeConfig(theme);
  }

  /**
   * Generate enhanced dependency graph with styling
   */
  generateEnhancedDependencyDiagram(
    graph: DependencyGraph,
    options: DiagramOptions
  ): DiagramResult {
    const sections: string[] = [];

    // Add title if provided
    if (options.title) {
      sections.push(`## ${options.title}`);
    } else {
      sections.push('## Enhanced Dependency Map');
    }

    // Add description
    if (options.description) {
      sections.push(`*${options.description}*`);
      sections.push('');
    }

    // Start Mermaid block with configuration
    sections.push('```mermaid');
    sections.push(this.generateMermaidConfig());
    sections.push('graph TD');

    // Generate styled nodes
    const { nodeMap, nodeDefinitions } = this.generateStyledNodes(graph);
    sections.push(...nodeDefinitions);

    // Generate edges
    const edges = this.generateStyledEdges(
      graph,
      nodeMap,
      options.includeExternal
    );
    sections.push(...edges);

    // Add CSS classes
    sections.push('');
    sections.push(this.generateCSSClasses());

    sections.push('```');

    return {
      content: sections.join('\n'),
      metadata: {
        type: 'dependency',
        theme: options.theme,
        nodeCount: graph.nodes.length,
        edgeCount: graph.edges.length,
        generatedAt: new Date(),
      },
    };
  }

  /**
   * Generate Mermaid configuration header
   */
  private generateMermaidConfig(): string {
    return `%%{init: ${JSON.stringify({
      theme: this.config.theme,
      flowchart: this.config.flowchart,
      themeVariables: this.config.themeVariables,
    })}}%%`;
  }

  /**
   * Generate styled nodes with classification
   */
  private generateStyledNodes(graph: DependencyGraph): {
    nodeMap: Map<string, string>;
    nodeDefinitions: string[];
  } {
    const nodeMap = new Map<string, string>();
    const nodeDefinitions: string[] = [];

    graph.nodes.forEach((file, index) => {
      const cleanName = path
        .basename(file, path.extname(file))
        .replace(/[^a-zA-Z0-9]/g, '')
        .substring(0, 10);
      const nodeId = `${cleanName}${index}`;
      nodeMap.set(file, nodeId);

      const fileName = path.basename(file);
      const classification = this.classifyFile(fileName);
      const icon = NEUTRAL_NODE_TYPES[classification]?.icon || 'FILE';

      // Create styled node definition
      nodeDefinitions.push(
        `    ${nodeId}["${icon} ${fileName}"]:::${classification}`
      );
    });

    return { nodeMap, nodeDefinitions };
  }

  /**
   * Generate styled edges
   */
  private generateStyledEdges(
    graph: DependencyGraph,
    nodeMap: Map<string, string>,
    includeExternal: boolean
  ): string[] {
    const edges: string[] = [];

    // Filter edges based on includeExternal option
    const filteredEdges = graph.edges.filter(
      edge => includeExternal || !edge.isExternal
    );

    filteredEdges.forEach(edge => {
      const fromNode = nodeMap.get(edge.from);
      const toNode = nodeMap.get(edge.to);

      if (fromNode && toNode) {
        // Different arrow styles for different import types
        const arrowStyle = this.getArrowStyle(edge.importType);
        edges.push(`    ${fromNode} ${arrowStyle} ${toNode}`);
      }
    });

    return edges;
  }

  /**
   * Classify file type based on name patterns
   */
  private classifyFile(fileName: string): string {
    const name = fileName.toLowerCase();

    if (name.includes('cli')) return 'cli';
    if (name.includes('parser')) return 'parser';
    if (name.includes('generator')) return 'generator';
    if (name.includes('analyzer')) return 'analyzer';
    if (name.includes('types')) return 'types';
    if (name.includes('util') || name.includes('helper')) return 'utils';
    if (name.includes('test') || name.includes('spec')) return 'test';

    return 'core';
  }

  /**
   * Get arrow style based on import type
   */
  private getArrowStyle(importType: string): string {
    switch (importType) {
      case 'default':
        return '==>';
      case 'named':
        return '-->';
      case 'namespace':
        return '-.->';
      case 'side-effect':
        return '-.->';
      default:
        return '-->';
    }
  }

  /**
   * Generate CSS classes for styling
   */
  private generateCSSClasses(): string {
    return generateNeutralCSS();
  }

  /**
   * Get theme configuration
   */
  private getThemeConfig(theme: DiagramOptions['theme']): MermaidConfig {
    switch (theme) {
      case 'neutral':
      default:
        return NEUTRAL_THEME;
      // Add other themes later
    }
  }

  /**
   * Static method for backward compatibility
   */
  static generateEnhanced(
    graph: DependencyGraph,
    options: Partial<DiagramOptions> = {}
  ): string {
    const enhancer = new MermaidEnhancer(options.theme || 'neutral');
    const fullOptions: DiagramOptions = {
      type: 'dependency',
      theme: 'neutral',
      format: 'markdown',
      includeExternal: false,
      interactive: false,
      ...options,
    };

    return enhancer.generateEnhancedDependencyDiagram(graph, fullOptions)
      .content;
  }
}
