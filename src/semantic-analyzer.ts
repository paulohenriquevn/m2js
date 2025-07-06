/**
 * Semantic Relationship Analyzer for M2JS
 * Analyzes business entities, relationships, and workflows
 */

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import { ParsedFile } from './types';
import { DependencyGraph } from './types';

export interface SemanticAnalysis {
  entities: BusinessEntity[];
  relationships: EntityRelationship[];
  workflows: BusinessWorkflow[];
  stateTransitions: StateTransition[];
  invariants: BusinessInvariant[];
}

export interface BusinessEntity {
  name: string;
  type: 'aggregate' | 'entity' | 'value-object' | 'service';
  properties: EntityProperty[];
  operations: EntityOperation[];
  description: string;
}

export interface EntityProperty {
  name: string;
  type: string;
  required: boolean;
  description?: string;
}

export interface EntityOperation {
  name: string;
  type: 'command' | 'query' | 'event';
  parameters: string[];
  returns: string;
  sideEffects: boolean;
}

export interface EntityRelationship {
  from: string;
  to: string;
  type:
    | 'has-one'
    | 'has-many'
    | 'belongs-to'
    | 'uses'
    | 'depends-on'
    | 'creates'
    | 'validates';
  cardinality: string;
  description: string;
}

export interface BusinessWorkflow {
  name: string;
  description: string;
  steps: WorkflowStep[];
  triggers: string[];
  outcomes: string[];
}

export interface WorkflowStep {
  order: number;
  action: string;
  actor: string;
  preconditions: string[];
  postconditions: string[];
}

export interface StateTransition {
  entity: string;
  states: string[];
  transitions: Transition[];
  invariants: string[];
}

export interface Transition {
  from: string;
  to: string;
  trigger: string;
  conditions: string[];
}

export interface BusinessInvariant {
  entity: string;
  rule: string;
  enforcement: string;
  violations: string[];
}

/**
 * Analyzes semantic relationships and business domain
 */
export function analyzeSemanticRelationships(
  parsedFiles: ParsedFile[],
  dependencyGraph: DependencyGraph
): SemanticAnalysis {
  const entities = extractBusinessEntities(parsedFiles);
  const relationships = extractEntityRelationships(
    parsedFiles,
    dependencyGraph,
    entities
  );
  const workflows = extractBusinessWorkflows(parsedFiles, entities);
  const stateTransitions = extractStateTransitions(parsedFiles, entities);
  const invariants = extractBusinessInvariants(parsedFiles, entities);

  return {
    entities,
    relationships,
    workflows,
    stateTransitions,
    invariants,
  };
}

/**
 * Extracts business entities from classes and their usage
 */
function extractBusinessEntities(parsedFiles: ParsedFile[]): BusinessEntity[] {
  const entities: BusinessEntity[] = [];

  parsedFiles.forEach(file => {
    file.classes.forEach(cls => {
      const entity = analyzeClassAsEntity(cls, file);
      if (entity) {
        entities.push(entity);
      }
    });
  });

  return entities;
}

/**
 * Analyzes a class to determine if it's a business entity
 */
function analyzeClassAsEntity(
  cls: any,
  file: ParsedFile
): BusinessEntity | null {
  // Skip utility classes and technical classes
  if (isUtilityClass(cls.name)) {
    return null;
  }

  const properties = extractEntityProperties(cls);
  const operations = extractEntityOperations(cls);
  const entityType = determineEntityType(cls, operations);

  return {
    name: cls.name,
    type: entityType,
    properties,
    operations,
    description: extractEntityDescription(cls, file),
  };
}

/**
 * Determines if a class is a utility class
 */
function isUtilityClass(className: string): boolean {
  const utilityPatterns = [
    'util',
    'helper',
    'validator',
    'formatter',
    'converter',
    'parser',
    'builder',
    'factory',
    'manager',
    'handler',
  ];

  const lowerName = className.toLowerCase();
  return utilityPatterns.some(pattern => lowerName.includes(pattern));
}

/**
 * Extracts entity properties from class methods
 */
function extractEntityProperties(cls: unknown): EntityProperty[] {
  const properties: EntityProperty[] = [];

  // Look for getter/setter patterns to infer properties
  const getters = cls.methods.filter(
    (m: unknown) => m.name.startsWith('get') && m.params.length === 0
  );
  const setters = cls.methods.filter(
    (m: unknown) => m.name.startsWith('set') && m.params.length === 1
  );

  getters.forEach((getter: unknown) => {
    const propName = getter.name.substring(3).toLowerCase();
    const setter = setters.find(
      (s: unknown) => s.name.toLowerCase() === `set${propName}`
    );

    properties.push({
      name: propName,
      type: getter.returnType || 'unknown',
      required: !setter, // If no setter, might be required/readonly
      description: getter.jsDoc ? extractFirstLine(getter.jsDoc) : undefined,
    });
  });

  // If no clear getter/setter pattern, infer from constructor or common patterns
  if (properties.length === 0) {
    properties.push(...inferPropertiesFromContext(cls));
  }

  return properties;
}

/**
 * Infers properties from class context
 */
function inferPropertiesFromContext(cls: unknown): EntityProperty[] {
  const properties: EntityProperty[] = [];

  // Common business entity properties
  const commonProps = [
    'id',
    'name',
    'email',
    'status',
    'createdAt',
    'updatedAt',
  ];

  commonProps.forEach(prop => {
    const hasRelatedMethod = cls.methods.some((m: unknown) =>
      m.name.toLowerCase().includes(prop.toLowerCase())
    );

    if (hasRelatedMethod) {
      properties.push({
        name: prop,
        type:
          prop === 'id' ? 'string' : prop.includes('At') ? 'Date' : 'string',
        required: prop === 'id' || prop === 'name',
      });
    }
  });

  return properties;
}

/**
 * Extracts entity operations from class methods
 */
function extractEntityOperations(cls: unknown): EntityOperation[] {
  const operations: EntityOperation[] = [];

  cls.methods.forEach((method: unknown) => {
    const operation = classifyOperation(method);
    if (operation) {
      operations.push(operation);
    }
  });

  return operations;
}

/**
 * Classifies a method as a type of operation
 */
function classifyOperation(method: unknown): EntityOperation | null {
  const name = method.name.toLowerCase();
  // const hasReturnValue = method.returnType && method.returnType !== 'void';
  const hasSideEffects =
    name.includes('create') ||
    name.includes('update') ||
    name.includes('delete') ||
    name.includes('save');

  let type: EntityOperation['type'] = 'query';

  if (hasSideEffects) {
    type = 'command';
  } else if (
    name.includes('notify') ||
    name.includes('emit') ||
    name.includes('publish')
  ) {
    type = 'event';
  }

  return {
    name: method.name,
    type,
    parameters: method.params.map(
      (p: unknown) => `${p.name}: ${p.type || 'unknown'}`
    ),
    returns: method.returnType || 'void',
    sideEffects: hasSideEffects,
  };
}

/**
 * Determines the type of entity based on patterns
 */
function determineEntityType(
  cls: any,
  operations: EntityOperation[]
): BusinessEntity['type'] {
  const className = cls.name.toLowerCase();
  const hasCommands = operations.some(op => op.type === 'command');
  const hasQueries = operations.some(op => op.type === 'query');

  if (className.includes('service') || className.includes('manager')) {
    return 'service';
  }

  if (hasCommands && hasQueries) {
    return 'aggregate'; // Rich domain object
  }

  if (hasQueries && !hasCommands) {
    return 'value-object'; // Immutable object
  }

  return 'entity'; // Basic entity
}

/**
 * Extracts entity description from JSDoc or class name
 */
function extractEntityDescription(cls: any, file: ParsedFile): string {
  if (cls.jsDoc) {
    const firstLine = extractFirstLine(cls.jsDoc);
    if (firstLine && firstLine.length > 10) {
      return firstLine;
    }
  }

  // Generate description from class name and file context
  const className = cls.name.replace(/([A-Z])/g, ' $1').trim();
  const fileName = file.fileName.replace(/([A-Z])/g, ' $1').trim();

  return `${className} entity from ${fileName} module`;
}

/**
 * Extracts entity relationships from dependencies and usage patterns
 */
function extractEntityRelationships(
  parsedFiles: ParsedFile[],
  dependencyGraph: DependencyGraph,
  entities: BusinessEntity[]
): EntityRelationship[] {
  const relationships: EntityRelationship[] = [];

  // Analyze dependencies between entity files
  entities.forEach(entity => {
    const entityFile = findEntityFile(entity, parsedFiles);
    if (!entityFile) return;

    const dependencies = dependencyGraph.edges.filter(
      edge => edge.from === entityFile.filePath && !edge.isExternal
    );

    dependencies.forEach(dep => {
      const targetEntity = findEntityByFile(dep.to, entities, parsedFiles);
      if (targetEntity && targetEntity !== entity) {
        const relationship = inferRelationshipType(
          entity,
          targetEntity,
          entityFile
        );
        if (relationship) {
          relationships.push(relationship);
        }
      }
    });
  });

  return relationships;
}

/**
 * Finds the file containing an entity
 */
function findEntityFile(
  entity: BusinessEntity,
  parsedFiles: ParsedFile[]
): ParsedFile | null {
  return (
    parsedFiles.find(file =>
      file.classes.some(cls => cls.name === entity.name)
    ) || null
  );
}

/**
 * Finds entity by file path
 */
function findEntityByFile(
  filePath: string,
  entities: BusinessEntity[],
  parsedFiles: ParsedFile[]
): BusinessEntity | null {
  const file = parsedFiles.find(f => f.filePath === filePath);
  if (!file) return null;

  for (const cls of file.classes) {
    const entity = entities.find(e => e.name === cls.name);
    if (entity) return entity;
  }

  return null;
}

/**
 * Infers relationship type between entities
 */
function inferRelationshipType(
  from: BusinessEntity,
  to: BusinessEntity,
  _fromFile: ParsedFile
): EntityRelationship | null {
  const fromName = from.name.toLowerCase();
  const toName = to.name.toLowerCase();

  // Common relationship patterns
  if (fromName.includes('user') && toName.includes('order')) {
    return {
      from: from.name,
      to: to.name,
      type: 'has-many',
      cardinality: '1:N',
      description: `${from.name} can have multiple ${to.name}s`,
    };
  }

  if (fromName.includes('order') && toName.includes('payment')) {
    return {
      from: from.name,
      to: to.name,
      type: 'has-one',
      cardinality: '1:1',
      description: `${from.name} has one ${to.name}`,
    };
  }

  // Service relationships
  if (from.type === 'service' && to.type !== 'service') {
    return {
      from: from.name,
      to: to.name,
      type: 'uses',
      cardinality: '1:N',
      description: `${from.name} service operates on ${to.name} entities`,
    };
  }

  // Default dependency relationship
  return {
    from: from.name,
    to: to.name,
    type: 'depends-on',
    cardinality: '1:1',
    description: `${from.name} depends on ${to.name}`,
  };
}

/**
 * Extracts business workflows from function sequences
 */
function extractBusinessWorkflows(
  parsedFiles: ParsedFile[],
  entities: BusinessEntity[]
): BusinessWorkflow[] {
  const workflows: BusinessWorkflow[] = [];

  // Look for service classes that orchestrate workflows
  const serviceFiles = parsedFiles.filter(
    file =>
      file.fileName.toLowerCase().includes('service') ||
      file.classes.some(cls => cls.name.toLowerCase().includes('service'))
  );

  serviceFiles.forEach(file => {
    file.functions.forEach(func => {
      const workflow = analyzeWorkflowFunction(func, entities);
      if (workflow) {
        workflows.push(workflow);
      }
    });

    file.classes.forEach(cls => {
      cls.methods.forEach(method => {
        const workflow = analyzeWorkflowMethod(method, cls.name, entities);
        if (workflow) {
          workflows.push(workflow);
        }
      });
    });
  });

  return workflows.slice(0, 5); // Limit to most relevant workflows
}

/**
 * Analyzes a function as a potential workflow
 */
function analyzeWorkflowFunction(
  func: any,
  entities: BusinessEntity[]
): BusinessWorkflow | null {
  const name = func.name.toLowerCase();

  // Look for workflow indicators
  if (
    !name.includes('process') &&
    !name.includes('create') &&
    !name.includes('handle') &&
    !name.includes('execute')
  ) {
    return null;
  }

  const workflowName = func.name.replace(/([A-Z])/g, ' $1').trim();
  const description = func.jsDoc
    ? extractFirstLine(func.jsDoc)
    : `${workflowName} workflow`;

  const steps = inferWorkflowSteps(func, entities);

  return {
    name: workflowName,
    description,
    steps,
    triggers: [`${func.name}() function call`],
    outcomes: [func.returnType || 'completion'],
  };
}

/**
 * Analyzes a method as a potential workflow
 */
function analyzeWorkflowMethod(
  method: any,
  className: string,
  entities: BusinessEntity[]
): BusinessWorkflow | null {
  const name = method.name.toLowerCase();

  if (
    !name.includes('process') &&
    !name.includes('create') &&
    !name.includes('handle') &&
    !name.includes('execute')
  ) {
    return null;
  }

  const workflowName = `${className}.${method.name}`;
  const description = method.jsDoc
    ? extractFirstLine(method.jsDoc)
    : `${workflowName} workflow`;

  const steps = inferWorkflowSteps(method, entities);

  return {
    name: workflowName,
    description,
    steps,
    triggers: [`${method.name}() method call`],
    outcomes: [method.returnType || 'completion'],
  };
}

/**
 * Infers workflow steps from function/method analysis
 */
function inferWorkflowSteps(
  func: any,
  _entities: BusinessEntity[]
): WorkflowStep[] {
  const steps: WorkflowStep[] = [];

  // This is a simplified inference
  // In practice, you'd analyze the function body AST

  if (func.params.length > 0) {
    steps.push({
      order: 1,
      action: 'Validate Input',
      actor: 'System',
      preconditions: ['Input parameters provided'],
      postconditions: ['Input validated'],
    });
  }

  if (func.name.includes('create')) {
    steps.push({
      order: 2,
      action: 'Create Entity',
      actor: 'Business Logic',
      preconditions: ['Valid input'],
      postconditions: ['Entity created'],
    });
  }

  if (func.returnType?.includes('Promise') || func.name.includes('save')) {
    steps.push({
      order: steps.length + 1,
      action: 'Persist Changes',
      actor: 'Data Layer',
      preconditions: ['Entity ready'],
      postconditions: ['Changes persisted'],
    });
  }

  return steps;
}

/**
 * Extracts state transitions from entity analysis
 */
function extractStateTransitions(
  _parsedFiles: ParsedFile[],
  entities: BusinessEntity[]
): StateTransition[] {
  const transitions: StateTransition[] = [];

  entities.forEach(entity => {
    const stateTransition = analyzeEntityStates(entity);
    if (stateTransition && stateTransition.states.length > 1) {
      transitions.push(stateTransition);
    }
  });

  return transitions;
}

/**
 * Analyzes an entity for state patterns
 */
function analyzeEntityStates(entity: BusinessEntity): StateTransition | null {
  const entityName = entity.name.toLowerCase();

  // Common state patterns
  const statePatterns: Record<string, string[]> = {
    order: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    user: ['inactive', 'active', 'suspended', 'deleted'],
    payment: ['pending', 'processing', 'completed', 'failed', 'refunded'],
    product: ['draft', 'active', 'inactive', 'discontinued'],
  };

  let states: string[] = [];

  // Find matching pattern
  for (const [pattern, patternStates] of Object.entries(statePatterns)) {
    if (entityName.includes(pattern)) {
      states = patternStates;
      break;
    }
  }

  if (states.length === 0) {
    return null;
  }

  // Generate basic transitions (sequential)
  const transitions: Transition[] = [];
  for (let i = 0; i < states.length - 1; i++) {
    transitions.push({
      from: states[i],
      to: states[i + 1],
      trigger: `update${entity.name}Status`,
      conditions: [`Valid transition from ${states[i]}`],
    });
  }

  return {
    entity: entity.name,
    states,
    transitions,
    invariants: [`${entity.name} can only transition to valid next states`],
  };
}

/**
 * Extracts business invariants from entity operations
 */
function extractBusinessInvariants(
  _parsedFiles: ParsedFile[],
  entities: BusinessEntity[]
): BusinessInvariant[] {
  const invariants: BusinessInvariant[] = [];

  entities.forEach(entity => {
    const entityInvariants = analyzeEntityInvariants(entity);
    invariants.push(...entityInvariants);
  });

  return invariants;
}

/**
 * Analyzes an entity for business invariants
 */
function analyzeEntityInvariants(entity: BusinessEntity): BusinessInvariant[] {
  const invariants: BusinessInvariant[] = [];

  // Common invariants based on entity type and operations
  const validationOps = entity.operations.filter(op =>
    op.name.toLowerCase().includes('validate')
  );

  if (validationOps.length > 0) {
    invariants.push({
      entity: entity.name,
      rule: `${entity.name} must pass validation before persistence`,
      enforcement: 'Validation methods called before state changes',
      violations: ['Attempting to save invalid entity'],
    });
  }

  const requiredProps = entity.properties.filter(prop => prop.required);
  if (requiredProps.length > 0) {
    invariants.push({
      entity: entity.name,
      rule: `Required properties must be set: ${requiredProps.map(p => p.name).join(', ')}`,
      enforcement: 'Constructor validation and setter guards',
      violations: ['Missing required properties'],
    });
  }

  return invariants;
}

/**
 * Extracts first line from JSDoc or comment
 */
function extractFirstLine(jsDoc: string): string {
  const match = jsDoc.match(/\*\s*(.+?)(?:\n|\*\/)/);
  return match && match[1] ? match[1].trim() : '';
}
