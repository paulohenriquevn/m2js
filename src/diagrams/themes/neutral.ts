import { MermaidConfig, NodeClassification } from '../diagram-types';

export const NEUTRAL_THEME: MermaidConfig = {
  theme: 'neutral',
  flowchart: {
    curve: 'basis',
    padding: 10,
    useMaxWidth: true,
  },
  themeVariables: {
    primaryColor: '#3498db',
    primaryTextColor: '#2c3e50',
    primaryBorderColor: '#2980b9',
    lineColor: '#7f8c8d',
  },
};

export const NEUTRAL_NODE_TYPES: Record<string, NodeClassification> = {
  cli: {
    type: 'cli',
    icon: '🖥️',
    color: '#e74c3c',
    description: 'Command-line interface',
  },
  parser: {
    type: 'parser',
    icon: '🔍',
    color: '#9b59b6',
    description: 'Code parsing and AST analysis',
  },
  generator: {
    type: 'generator',
    icon: '📝',
    color: '#27ae60',
    description: 'Markdown generation',
  },
  analyzer: {
    type: 'analyzer',
    icon: '🔬',
    color: '#f39c12',
    description: 'Dependency analysis',
  },
  types: {
    type: 'types',
    icon: '📋',
    color: '#34495e',
    description: 'Type definitions',
  },
  utils: {
    type: 'utils',
    icon: '🛠️',
    color: '#7f8c8d',
    description: 'Utility functions',
  },
  test: {
    type: 'test',
    icon: '🧪',
    color: '#16a085',
    description: 'Test files',
  },
  core: {
    type: 'core',
    icon: '⚙️',
    color: '#2c3e50',
    description: 'Core functionality',
  },
};

export function generateNeutralCSS(): string {
  return `
    classDef cli fill:${NEUTRAL_NODE_TYPES.cli.color},stroke:#fff,stroke-width:2px,color:#fff;
    classDef parser fill:${NEUTRAL_NODE_TYPES.parser.color},stroke:#fff,stroke-width:2px,color:#fff;
    classDef generator fill:${NEUTRAL_NODE_TYPES.generator.color},stroke:#fff,stroke-width:2px,color:#fff;
    classDef analyzer fill:${NEUTRAL_NODE_TYPES.analyzer.color},stroke:#fff,stroke-width:2px,color:#fff;
    classDef types fill:${NEUTRAL_NODE_TYPES.types.color},stroke:#fff,stroke-width:2px,color:#fff;
    classDef utils fill:${NEUTRAL_NODE_TYPES.utils.color},stroke:#fff,stroke-width:2px,color:#fff;
    classDef test fill:${NEUTRAL_NODE_TYPES.test.color},stroke:#fff,stroke-width:2px,color:#fff;
    classDef core fill:${NEUTRAL_NODE_TYPES.core.color},stroke:#fff,stroke-width:2px,color:#fff;
  `.trim();
}
