/**
 * M2JS Template Generator Types
 * Defines structure for specification-first development with LLMs
 */

export interface TemplateSpec {
  name: string;
  domain: string;
  description: string;
  confidence: number;
  version: string;
  components: ComponentSpec[];
  globalContext: GlobalContext;
}

export interface ComponentSpec {
  type: 'class' | 'function' | 'interface' | 'service' | 'controller' | 'model';
  name: string;
  description: string;
  businessPurpose: string;
  category: ComponentCategory;
  dependencies: string[];
  exports: ExportSpec[];
  implementation: ImplementationGuide;
}

export interface ComponentCategory {
  layer: 'presentation' | 'business' | 'data' | 'utility';
  pattern:
    | 'aggregate'
    | 'entity'
    | 'value-object'
    | 'service'
    | 'controller'
    | 'repository';
  domain: string;
}

export interface ExportSpec {
  type: 'function' | 'class' | 'interface' | 'type' | 'const';
  name: string;
  signature: string;
  purpose: string;
  parameters?: ParameterSpec[];
  returnType?: string;
  businessRules?: string[];
  examples?: UsageExample[];
}

export interface ParameterSpec {
  name: string;
  type: string;
  required: boolean;
  description: string;
  validation?: string[];
  businessMeaning?: string;
}

export interface UsageExample {
  scenario: string;
  code: string;
  description: string;
  expectedBehavior: string;
}

export interface ImplementationGuide {
  approach: string;
  keyConsiderations: string[];
  businessLogic: BusinessLogicSpec[];
  errorHandling: ErrorHandlingSpec;
  testing: TestingSpec;
  performance: PerformanceSpec;
}

export interface BusinessLogicSpec {
  rule: string;
  implementation: string;
  validation: string;
  edge_cases: string[];
}

export interface ErrorHandlingSpec {
  strategy: 'throw' | 'return-boolean' | 'result-pattern';
  errorTypes: string[];
  examples: string[];
}

export interface TestingSpec {
  approach: string;
  scenarios: TestScenario[];
  mockingStrategy: string;
}

export interface TestScenario {
  name: string;
  description: string;
  input: string;
  expectedOutput: string;
  businessValidation: string;
}

export interface PerformanceSpec {
  considerations: string[];
  optimizations: string[];
  constraints: string[];
}

export interface GlobalContext {
  domain: string;
  businessEntities: EntitySpec[];
  relationships: RelationshipSpec[];
  workflows: WorkflowSpec[];
  stateTransitions: StateTransitionSpec[];
  businessRules: string[];
  architecture: ArchitectureSpec;
}

export interface EntitySpec {
  name: string;
  type: 'aggregate' | 'entity' | 'value-object';
  description: string;
  properties: PropertySpec[];
  behaviors: string[];
  invariants: string[];
}

export interface PropertySpec {
  name: string;
  type: string;
  required: boolean;
  description: string;
  validation?: string[];
  businessMeaning?: string;
}

export interface RelationshipSpec {
  from: string;
  to: string;
  type: 'has-one' | 'has-many' | 'belongs-to' | 'uses' | 'depends-on';
  cardinality: string;
  description: string;
  businessRules?: string[];
}

export interface WorkflowSpec {
  name: string;
  description: string;
  trigger: string;
  steps: WorkflowStepSpec[];
  outcomes: string[];
  businessRules: string[];
}

export interface WorkflowStepSpec {
  order: number;
  action: string;
  actor: string;
  input: string;
  output: string;
  validation: string[];
  businessLogic: string;
}

export interface StateTransitionSpec {
  entity: string;
  states: string[];
  transitions: TransitionSpec[];
  invariants: string[];
}

export interface TransitionSpec {
  from: string;
  to: string;
  trigger: string;
  conditions: string[];
  businessRules: string[];
}

export interface ArchitectureSpec {
  pattern: string;
  layers: LayerSpec[];
  dataFlow: DataFlowSpec[];
  errorStrategy: string;
  designPrinciples: string[];
}

export interface LayerSpec {
  name: string;
  responsibility: string;
  components: string[];
  dependencies: string[];
  constraints: string[];
}

export interface DataFlowSpec {
  name: string;
  description: string;
  steps: string[];
  components: string[];
}

// Domain template definitions
export interface DomainTemplate {
  domain: string;
  description: string;
  commonEntities: EntitySpec[];
  commonWorkflows: WorkflowSpec[];
  commonPatterns: string[];
  architectureRecommendations: ArchitectureSpec;
  businessRules: string[];
}

// CLI options for template generation
export interface TemplateOptions {
  domain: string;
  component: string;
  output?: string;
  interactive?: boolean;
  examples?: boolean;
  businessContext?: boolean;
  architectureGuide?: boolean;
  testingGuide?: boolean;
}
