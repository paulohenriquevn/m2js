/**
 * Enhanced Generator for M2JS
 * Generates AI-optimized documentation with business context and insights
 */

/* eslint-disable @typescript-eslint/no-unused-vars */

import { ParsedFile, DependencyGraph, CliOptions } from './types';
import { generateMarkdown } from './generator';
import { analyzeBusinessContext } from './business-context-analyzer';
import { analyzeUsagePatterns } from './usage-pattern-analyzer';
import { analyzeArchitecture } from './architecture-analyzer';
import { analyzeSemanticRelationships } from './semantic-analyzer';
// import path from 'path'; // Currently unused

/**
 * Generates enhanced documentation with AI-friendly analysis
 */
export function generateEnhancedMarkdown(
  parsedFile: ParsedFile,
  allParsedFiles: ParsedFile[],
  dependencyGraph: DependencyGraph,
  options: CliOptions,
  projectPath: string
): string {
  const sections: string[] = [];

  // Generate base markdown
  const baseMarkdown = generateMarkdown(parsedFile, {
    includeComments: !options.noComments,
    businessContext: options.businessContext || options.aiEnhanced,
    usageExamples: options.usageExamples || options.aiEnhanced,
    architectureInsights: options.architectureInsights || options.aiEnhanced,
    semanticAnalysis: options.semanticAnalysis || options.aiEnhanced,
  });

  sections.push(baseMarkdown);

  // Add enhanced sections if requested
  if (options.businessContext || options.aiEnhanced) {
    const businessContext = analyzeBusinessContext(allParsedFiles, projectPath);
    sections.push(generateBusinessContextSection(businessContext));
  }

  if (options.usageExamples || options.aiEnhanced) {
    const usageAnalysis = analyzeUsagePatterns(allParsedFiles, projectPath);
    sections.push(generateUsageExamplesSection(usageAnalysis, parsedFile));
  }

  if (options.architectureInsights || options.aiEnhanced) {
    const architectureInsights = analyzeArchitecture(
      allParsedFiles,
      dependencyGraph
    );
    sections.push(
      generateArchitectureSection(architectureInsights, parsedFile)
    );
  }

  if (options.semanticAnalysis || options.aiEnhanced) {
    const semanticAnalysis = analyzeSemanticRelationships(
      allParsedFiles,
      dependencyGraph
    );
    sections.push(generateSemanticSection(semanticAnalysis, parsedFile));
  }

  return sections.filter(section => section.trim()).join('\n\n');
}

/**
 * Generates business context section
 */
function generateBusinessContextSection(context: unknown): string {
  const sections: string[] = [];

  sections.push('## 🎯 Business Context');
  sections.push(
    `**Domain**: ${context.domain} (${context.confidence}% confidence)`
  );

  if (context.description) {
    sections.push(`**Description**: ${context.description}`);
  }

  if (context.frameworks.length > 0) {
    sections.push(`**Tech Stack**: ${context.frameworks.join(', ')}`);
  }

  if (context.patterns.length > 0) {
    sections.push(`**Architecture**: ${context.patterns.join(', ')}`);
  }

  if (context.entities.length > 0) {
    sections.push('');
    sections.push('**Business Entities**:');
    context.entities.forEach((entity: string) => {
      sections.push(`- ${entity}`);
    });
  }

  if (context.businessRules.length > 0) {
    sections.push('');
    sections.push('**Business Rules**:');
    context.businessRules.forEach((rule: string) => {
      sections.push(`- ${rule}`);
    });
  }

  return sections.join('\n');
}

/**
 * Generates usage examples section
 */
function generateUsageExamplesSection(
  usage: any,
  parsedFile: ParsedFile
): string {
  const sections: string[] = [];

  // Filter examples relevant to this file
  const relevantExamples = usage.examples.filter(
    (example: unknown) =>
      parsedFile.functions.some(func => func.name === example.function) ||
      parsedFile.classes.some(cls =>
        cls.methods.some(method => example.function.includes(method.name))
      )
  );

  if (relevantExamples.length === 0) {
    return '';
  }

  sections.push('## 📖 Usage Examples');

  // Group by category
  const categories = [
    'creation',
    'validation',
    'transformation',
    'query',
    'business-logic',
  ];

  categories.forEach(category => {
    const categoryExamples = relevantExamples.filter(
      (ex: unknown) => ex.category === category
    );

    if (categoryExamples.length > 0) {
      sections.push(
        `### ${category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}`
      );

      categoryExamples.slice(0, 2).forEach((example: unknown) => {
        sections.push(`**${example.function}**`);
        sections.push('```typescript');
        sections.push(example.example);
        sections.push('```');
        sections.push(`*${example.description}*`);
        sections.push('');
      });
    }
  });

  // Add common patterns
  if (usage.patterns.length > 0) {
    sections.push('### Common Patterns');
    usage.patterns.slice(0, 3).forEach((pattern: unknown) => {
      sections.push(`**${pattern.pattern}**: ${pattern.description}`);
    });
  }

  return sections.join('\n');
}

/**
 * Generates architecture insights section
 */
function generateArchitectureSection(
  insights: any,
  parsedFile: ParsedFile
): string {
  const sections: string[] = [];

  sections.push('## 🏗️ Architecture Insights');

  // Layer information
  if (insights.layerArchitecture) {
    sections.push(`**Pattern**: ${insights.layerArchitecture.pattern}`);
    sections.push(`**Rationale**: ${insights.layerArchitecture.rationale}`);

    // Find which layer this file belongs to
    const currentLayer = insights.layerArchitecture.layers.find(
      (layer: any) => layer.files.includes(parsedFile.fileName)
    );

    if (currentLayer) {
      sections.push('');
      sections.push(`**This File's Role**: ${currentLayer.name}`);
      sections.push(`**Responsibility**: ${currentLayer.responsibility}`);
    }
  }

  // Data flow patterns
  if (insights.dataFlow.length > 0) {
    sections.push('');
    sections.push('**Data Flow Patterns**:');
    insights.dataFlow.slice(0, 2).forEach((flow: unknown) => {
      sections.push(`- **${flow.name}**: ${flow.description}`);
    });
  }

  // Error handling strategy
  if (insights.errorStrategy) {
    sections.push('');
    sections.push(`**Error Handling**: ${insights.errorStrategy.strategy}`);
    if (insights.errorStrategy.patterns.length > 0) {
      sections.push(
        `**Patterns**: ${insights.errorStrategy.patterns.join(', ')}`
      );
    }
  }

  return sections.join('\n');
}

/**
 * Generates semantic analysis section
 */
function generateSemanticSection(
  semantic: any,
  parsedFile: ParsedFile
): string {
  const sections: string[] = [];

  // Find entities in this file
  const fileEntities = semantic.entities.filter((entity: unknown) =>
    parsedFile.classes.some(cls => cls.name === entity.name)
  );

  if (fileEntities.length === 0) {
    return '';
  }

  sections.push('## 🔗 Domain Analysis');

  fileEntities.forEach((entity: unknown) => {
    sections.push(`### ${entity.name} Entity`);
    sections.push(`**Type**: ${entity.type}`);
    sections.push(`**Description**: ${entity.description}`);

    // Relationships
    const entityRelationships = semantic.relationships.filter(
      (rel: unknown) => rel.from === entity.name || rel.to === entity.name
    );

    if (entityRelationships.length > 0) {
      sections.push('');
      sections.push('**Relationships**:');
      entityRelationships.forEach((rel: unknown) => {
        sections.push(
          `- ${rel.from} ${rel.type} ${rel.to} (${rel.cardinality})`
        );
      });
    }

    // State transitions
    const stateTransition = semantic.stateTransitions.find(
      (st: unknown) => st.entity === entity.name
    );

    if (stateTransition) {
      sections.push('');
      sections.push(`**States**: ${stateTransition.states.join(' → ')}`);
    }

    // Business rules
    const entityInvariants = semantic.invariants.filter(
      (inv: unknown) => inv.entity === entity.name
    );

    if (entityInvariants.length > 0) {
      sections.push('');
      sections.push('**Business Rules**:');
      entityInvariants.forEach((inv: unknown) => {
        sections.push(`- ${inv.rule}`);
      });
    }
  });

  // Workflows involving this file
  const relevantWorkflows = semantic.workflows.filter((workflow: unknown) =>
    workflow.name.includes(parsedFile.fileName.replace('.ts', ''))
  );

  if (relevantWorkflows.length > 0) {
    sections.push('');
    sections.push('**Business Workflows**:');
    relevantWorkflows.slice(0, 2).forEach((workflow: unknown) => {
      sections.push(`- **${workflow.name}**: ${workflow.description}`);
    });
  }

  return sections.join('\n');
}

/**
 * Generates enhanced dependency analysis with all insights
 */
export function generateEnhancedDependencyAnalysis(
  allParsedFiles: ParsedFile[],
  dependencyGraph: DependencyGraph,
  options: CliOptions,
  projectPath: string
): string {
  const sections: string[] = [];

  // Start with base dependency analysis
  const baseDependencyMarkdown = generateDependencyMarkdown(dependencyGraph, {
    includeMermaid: options.mermaid,
  });

  sections.push(baseDependencyMarkdown);

  // Add enhanced sections
  if (options.businessContext || options.aiEnhanced) {
    const businessContext = analyzeBusinessContext(allParsedFiles, projectPath);
    sections.push(generateBusinessContextSection(businessContext));
  }

  if (options.architectureInsights || options.aiEnhanced) {
    const architectureInsights = analyzeArchitecture(
      allParsedFiles,
      dependencyGraph
    );
    sections.push(generateFullArchitectureSection(architectureInsights));
  }

  if (options.semanticAnalysis || options.aiEnhanced) {
    const semanticAnalysis = analyzeSemanticRelationships(
      allParsedFiles,
      dependencyGraph
    );
    sections.push(generateFullSemanticSection(semanticAnalysis));
  }

  return sections.filter(section => section.trim()).join('\n\n');
}

/**
 * Generates full architecture section for dependency analysis
 */
function generateFullArchitectureSection(insights: unknown): string {
  const sections: string[] = [];

  sections.push('## 🏗️ Complete Architecture Analysis');

  // Layer architecture
  sections.push(`### ${insights.layerArchitecture.pattern}`);
  sections.push(insights.layerArchitecture.rationale);
  sections.push('');

  insights.layerArchitecture.layers.forEach((layer: unknown) => {
    sections.push(`**${layer.name}**`);
    sections.push(`- Responsibility: ${layer.responsibility}`);
    sections.push(`- Files: ${layer.files.join(', ')}`);
    sections.push('');
  });

  // Design principles analysis
  if (insights.designPrinciples.length > 0) {
    sections.push('### Design Principles Analysis');
    insights.designPrinciples.forEach((principle: unknown) => {
      sections.push(`**${principle.principle}**`);
      if (principle.evidence.length > 0) {
        sections.push('✅ Evidence:');
        principle.evidence.forEach((evidence: string) => {
          sections.push(`- ${evidence}`);
        });
      }
      if (principle.violations.length > 0) {
        sections.push('⚠️ Potential Issues:');
        principle.violations.forEach((violation: string) => {
          sections.push(`- ${violation}`);
        });
      }
      sections.push('');
    });
  }

  return sections.join('\n');
}

/**
 * Generates full semantic analysis section
 */
function generateFullSemanticSection(semantic: unknown): string {
  const sections: string[] = [];

  sections.push('## 🔗 Complete Domain Model');

  // Entity relationship diagram
  if (semantic.entities.length > 0 && semantic.relationships.length > 0) {
    sections.push('### Entity Relationships');
    sections.push('```mermaid');
    sections.push('erDiagram');

    semantic.relationships.forEach((rel: unknown) => {
      const mermaidRel = convertToMermaidRelationship(rel.type);
      sections.push(
        `    ${rel.from} ${mermaidRel} ${rel.to} : "${rel.description}"`
      );
    });

    sections.push('```');
    sections.push('');
  }

  // Business workflows
  if (semantic.workflows.length > 0) {
    sections.push('### Business Workflows');
    semantic.workflows.forEach((workflow: unknown) => {
      sections.push(`**${workflow.name}**`);
      sections.push(workflow.description);
      sections.push('');
      sections.push('Steps:');
      workflow.steps.forEach((step: unknown) => {
        sections.push(`${step.order}. ${step.action} (${step.actor})`);
      });
      sections.push('');
    });
  }

  return sections.join('\n');
}

/**
 * Converts relationship type to Mermaid syntax
 */
function convertToMermaidRelationship(type: string): string {
  switch (type) {
    case 'has-one':
      return '||--||';
    case 'has-many':
      return '||--o{';
    case 'belongs-to':
      return '}o--||';
    case 'uses':
      return '..>';
    default:
      return '--';
  }
}

// Import the base function (this would need to be implemented)
function generateDependencyMarkdown(
  _graph: DependencyGraph,
  _options: Record<string, unknown>
): string {
  // This would call the existing generateDependencyMarkdown function
  // For now, return a placeholder
  return '# Dependency Analysis\n\n(Base dependency analysis would go here)';
}
