/**
 * Types for Graph-Deep Diff Analysis
 * Compare architectural states and detect problematic changes
 */

export interface GraphDiffOptions {
  /** Baseline for comparison (git ref, branch, commit, 'previous', etc.) */
  baseline: string;
  /** Current state to compare against baseline (default: working directory) */
  current?: string;
  /** Output format */
  format?: 'table' | 'json';
  /** Include detailed change analysis */
  includeDetails?: boolean;
  /** Include impact scoring */
  includeImpact?: boolean;
  /** Include suggestions for improvements */
  includeSuggestions?: boolean;
  /** Minimum severity to report */
  minSeverity?: 'low' | 'medium' | 'high' | 'critical';
}

export interface GraphDiffReport {
  /** Project path analyzed */
  projectPath: string;
  /** Comparison details */
  comparison: {
    baseline: string;
    current: string;
    timestamp: Date;
  };
  /** Analysis options used */
  options: GraphDiffOptions;
  /** Detected changes */
  changes: ArchitecturalChange[];
  /** Impact summary */
  impact: ImpactSummary;
  /** Recommendations */
  recommendations: Recommendation[];
  /** Baseline and current graph metrics */
  metrics: {
    baseline: GraphMetrics;
    current: GraphMetrics;
    diff: GraphMetricsDiff;
  };
}

export interface ArchitecturalChange {
  /** Unique identifier */
  id: string;
  /** Type of change detected */
  type: ChangeType;
  /** Severity level */
  severity: 'low' | 'medium' | 'high' | 'critical';
  /** Change category */
  category: ChangeCategory;
  /** Human-readable description */
  description: string;
  /** Technical details */
  details: ChangeDetails;
  /** Files/modules affected */
  affected: string[];
  /** Impact assessment */
  impact: ChangeImpact;
  /** When this change was introduced */
  introducedIn?: string;
}

export type ChangeType = 
  | 'dependency-added'
  | 'dependency-removed' 
  | 'circular-dependency-introduced'
  | 'circular-dependency-resolved'
  | 'coupling-increased'
  | 'coupling-decreased'
  | 'layer-violation-introduced'
  | 'layer-violation-resolved'
  | 'external-dependency-added'
  | 'external-dependency-removed'
  | 'module-fragmentation'
  | 'module-consolidation'
  | 'architecture-layer-added'
  | 'architecture-layer-removed'
  | 'hotspot-created'
  | 'hotspot-resolved';

export type ChangeCategory = 
  | 'dependencies'
  | 'architecture'
  | 'coupling'
  | 'complexity'
  | 'external'
  | 'performance'
  | 'maintainability';

export interface ChangeDetails {
  /** Before state */
  before?: any;
  /** After state */
  after?: any;
  /** Specific modules/files involved */
  modules: string[];
  /** Dependencies involved in the change */
  dependencies?: DependencyChange[];
  /** Metrics related to the change */
  metrics?: Record<string, number>;
}

export interface DependencyChange {
  /** Source module */
  from: string;
  /** Target module */
  to: string;
  /** Type of dependency change */
  changeType: 'added' | 'removed' | 'modified';
  /** Import details */
  importType: 'default' | 'named' | 'namespace' | 'side-effect';
  /** Import names */
  importNames?: string[];
}

export interface ChangeImpact {
  /** Risk level for this change */
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  /** Maintainability impact (-5 to +5) */
  maintainability: number;
  /** Performance impact (-5 to +5) */
  performance: number;
  /** Testability impact (-5 to +5) */
  testability: number;
  /** Overall impact score (-15 to +15) */
  overallScore: number;
  /** Reasoning for the impact assessment */
  reasoning: string;
  /** Affected areas */
  affectedAreas: string[];
}

export interface ImpactSummary {
  /** Total number of changes */
  totalChanges: number;
  /** Changes by severity */
  bySeverity: Record<string, number>;
  /** Changes by category */
  byCategory: Record<string, number>;
  /** Overall architectural health change */
  healthChange: {
    before: number; // 0-100 score
    after: number;  // 0-100 score
    delta: number;  // difference
  };
  /** Key metrics changes */
  keyMetrics: {
    circularDependencies: { before: number; after: number; delta: number };
    averageCoupling: { before: number; after: number; delta: number };
    externalDependencies: { before: number; after: number; delta: number };
    moduleCount: { before: number; after: number; delta: number };
  };
}

export interface Recommendation {
  /** Unique identifier */
  id: string;
  /** Priority level */
  priority: 'low' | 'medium' | 'high' | 'critical';
  /** Recommendation type */
  type: 'fix-issue' | 'improve-architecture' | 'refactor' | 'monitor';
  /** Title of recommendation */
  title: string;
  /** Detailed description */
  description: string;
  /** Action items */
  actions: string[];
  /** Changes this addresses */
  addresses: string[];
  /** Estimated effort */
  effort: 'low' | 'medium' | 'high';
  /** Expected impact of following this recommendation */
  expectedImpact: string;
}

export interface GraphMetrics {
  /** Total number of nodes (files) */
  totalNodes: number;
  /** Total edges (dependencies) */
  totalEdges: number;
  /** Internal dependencies */
  internalDependencies: number;
  /** External dependencies */
  externalDependencies: number;
  /** Circular dependencies arrays */
  circularDependencies: string[][];
  /** Average dependencies per module */
  averageDependencies: number;
  /** Most connected module */
  mostConnectedModule?: string;
  /** Module hotspots (high coupling) - derived property */
  hotspots?: string[];
  /** Architecture layers detected - derived property */
  layers?: string[];
  /** Cross-layer violations - derived property */
  layerViolations?: number;
  
  // Computed properties for graph diff analysis
  /** Average coupling (for backwards compatibility) */
  averageCoupling?: number;
  /** Total modules (alias for totalNodes) */
  totalModules?: number;
  /** Total dependencies (alias for totalEdges) */
  totalDependencies?: number;
}

export interface GraphMetricsDiff {
  /** Change in total modules */
  totalModules: number;
  /** Change in total dependencies */
  totalDependencies: number;
  /** Change in internal dependencies */
  internalDependencies: number;
  /** Change in external dependencies */
  externalDependencies: number;
  /** Change in circular dependencies */
  circularDependencies: number;
  /** Change in average coupling */
  averageCoupling: number;
  /** New hotspots created */
  newHotspots: string[];
  /** Hotspots resolved */
  resolvedHotspots: string[];
  /** New layers added */
  newLayers: string[];
  /** Layers removed */
  removedLayers: string[];
  /** Change in layer violations */
  layerViolations: number;
}

export interface GitComparisonOptions {
  /** Repository path */
  repoPath: string;
  /** Baseline reference (commit, branch, tag) */
  baselineRef: string;
  /** Current reference (default: working directory) */
  currentRef?: string;
  /** File patterns to include */
  includePatterns?: string[];
  /** File patterns to exclude */
  excludePatterns?: string[];
}

export interface GitFileChange {
  /** File path */
  path: string;
  /** Change type */
  changeType: 'added' | 'modified' | 'deleted' | 'renamed';
  /** Old path (for renames) */
  oldPath?: string;
  /** Lines added */
  linesAdded: number;
  /** Lines deleted */
  linesDeleted: number;
}

export interface GraphSnapshot {
  /** Timestamp when snapshot was taken */
  timestamp: Date;
  /** Git reference */
  gitRef: string;
  /** Dependency graph */
  dependencyGraph: DependencyGraph;
  /** Calculated metrics */
  metrics: GraphMetrics;
  /** Files included in analysis */
  files: string[];
}

// Re-export from existing types
export interface DependencyGraph {
  projectPath: string;
  nodes: string[];
  edges: DependencyRelationship[];
  metrics: GraphMetrics;
}

export interface DependencyRelationship {
  from: string;
  to: string;
  type: 'import' | 'export' | 'type';
  importName?: string;
  isExternal: boolean;
  importType: 'default' | 'named' | 'namespace' | 'side-effect';
}