/**
 * Diagram system types for M2JS
 * Extends existing types for diagram generation
 */

export type DiagramType = 'dependency' | 'class' | 'sequence' | 'component';
export type DiagramTheme = 'neutral' | 'dark' | 'forest' | 'base';
export type DiagramFormat = 'markdown' | 'svg' | 'png';

export interface DiagramOptions {
  type: DiagramType;
  theme: DiagramTheme;
  format: DiagramFormat;
  includeExternal: boolean;
  interactive: boolean;
  title?: string;
  description?: string;
}

export interface NodeClassification {
  type:
    | 'cli'
    | 'parser'
    | 'generator'
    | 'analyzer'
    | 'types'
    | 'utils'
    | 'test'
    | 'core';
  icon: string;
  color: string;
  description: string;
}

export interface MermaidConfig {
  theme: DiagramTheme;
  flowchart?: {
    curve: 'basis' | 'linear' | 'step';
    padding: number;
    useMaxWidth: boolean;
  };
  themeVariables?: {
    primaryColor: string;
    primaryTextColor: string;
    primaryBorderColor: string;
    lineColor: string;
  };
}

export interface ClassDiagramNode {
  name: string;
  methods: {
    name: string;
    visibility: '+' | '-' | '#';
    params: string;
    returnType: string;
  }[];
  properties?: {
    name: string;
    type: string;
    visibility: '+' | '-' | '#';
  }[];
}

export interface SequenceDiagramStep {
  from: string;
  to: string;
  message: string;
  type: '->' | '->>' | '-x' | '-->';
  note?: string;
}

export interface DiagramResult {
  content: string;
  metadata: {
    type: DiagramType;
    theme: DiagramTheme;
    nodeCount: number;
    edgeCount: number;
    generatedAt: Date;
  };
}

export interface DiagramGenerator {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  generate(data: any, options: DiagramOptions): DiagramResult;
  supports(type: DiagramType): boolean;
}
