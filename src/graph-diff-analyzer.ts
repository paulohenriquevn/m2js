/**
 * Graph-Deep Diff Analyzer
 * Compare architectural states and detect problematic changes
 */

import * as path from 'path';
import { GitIntegrator } from './git-integrator';
import { analyzeDependencies } from './dependency-analyzer';
import { scanDirectory } from './file-scanner';
import { GraphMetrics as ExistingGraphMetrics } from './types';
import {
  GraphDiffOptions,
  GraphDiffReport,
  ArchitecturalChange,
  ImpactSummary,
  Recommendation,
  GraphSnapshot,
  GraphMetrics,
  GraphMetricsDiff,
  ChangeType,
  ChangeCategory,
  ChangeImpact,
  DependencyChange,
  DependencyGraph,
} from './graph-diff-types';

/**
 * Analyze architectural differences between two states
 */
export async function analyzeGraphDiff(
  projectPath: string,
  options: GraphDiffOptions
): Promise<GraphDiffReport> {
  const startTime = Date.now();
  
  try {
    // Initialize git integrator
    const git = new GitIntegrator(projectPath);
    
    // Resolve references
    const baselineRef = git.resolveRef(options.baseline);
    const currentRef = options.current ? git.resolveRef(options.current) : 'working-directory';
    
    console.log(`Comparing ${options.baseline} → ${currentRef || 'current'}`);
    
    // Create snapshots for both states
    const baselineSnapshot = await createGraphSnapshot(projectPath, git, baselineRef);
    const currentSnapshot = await createCurrentSnapshot(projectPath, git, currentRef);
    
    // Analyze differences
    const changes = detectArchitecturalChanges(baselineSnapshot, currentSnapshot);
    
    // Calculate impact
    const impact = calculateImpactSummary(baselineSnapshot, currentSnapshot, changes);
    
    // Generate recommendations
    const recommendations = generateRecommendations(changes, impact);
    
    // Calculate metrics diff
    const metricsDiff = calculateMetricsDiff(baselineSnapshot.metrics, currentSnapshot.metrics);
    
    return {
      projectPath,
      comparison: {
        baseline: options.baseline,
        current: currentRef || 'working-directory',
        timestamp: new Date(),
      },
      options,
      changes,
      impact,
      recommendations,
      metrics: {
        baseline: baselineSnapshot.metrics,
        current: currentSnapshot.metrics,
        diff: metricsDiff,
      },
    };
  } catch (error) {
    throw new Error(`Graph diff analysis failed: ${(error as Error).message}`);
  }
}

/**
 * Create a graph snapshot for a specific git reference
 */
async function createGraphSnapshot(
  projectPath: string,
  git: GitIntegrator,
  ref: string
): Promise<GraphSnapshot> {
  let workspace: string | null = null;
  
  try {
    // Create temporary workspace with files from the reference
    workspace = await git.createTempWorkspace(ref);
    
    // Scan for TypeScript/JavaScript files
    const scanResult = await scanDirectory(workspace);
    
    if (scanResult.files.length === 0) {
      return {
        timestamp: new Date(),
        gitRef: ref,
        dependencyGraph: {
          projectPath: workspace,
          nodes: [],
          edges: [],
          metrics: createEmptyMetrics(),
        },
        metrics: createEmptyMetrics(),
        files: [],
      };
    }
    
    // Analyze dependencies
    const dependencyGraph = analyzeDependencies(scanResult.files, {
      includeExternalDeps: true,
      detectCircular: true,
    });
    
    return {
      timestamp: new Date(),
      gitRef: ref,
      dependencyGraph,
      metrics: adaptGraphMetrics(dependencyGraph.metrics),
      files: scanResult.files,
    };
  } finally {
    // Cleanup workspace
    if (workspace) {
      git.cleanupWorkspace(workspace);
    }
  }
}

/**
 * Create snapshot for current state (working directory)
 */
async function createCurrentSnapshot(
  projectPath: string,
  git: GitIntegrator,
  ref: string
): Promise<GraphSnapshot> {
  // If ref is working-directory, analyze current files
  if (ref === 'working-directory') {
    const scanResult = await scanDirectory(projectPath);
    
    if (scanResult.files.length === 0) {
      return {
        timestamp: new Date(),
        gitRef: 'working-directory',
        dependencyGraph: {
          projectPath,
          nodes: [],
          edges: [],
          metrics: createEmptyMetrics(),
        },
        metrics: createEmptyMetrics(),
        files: [],
      };
    }
    
    const dependencyGraph = analyzeDependencies(scanResult.files, {
      includeExternalDeps: true,
      detectCircular: true,
    });
    
    return {
      timestamp: new Date(),
      gitRef: 'working-directory',
      dependencyGraph,
      metrics: adaptGraphMetrics(dependencyGraph.metrics),
      files: scanResult.files,
    };
  } else {
    // Use git snapshot for specific ref
    return createGraphSnapshot(projectPath, git, ref);
  }
}

/**
 * Detect architectural changes between two snapshots
 */
function detectArchitecturalChanges(
  baseline: GraphSnapshot,
  current: GraphSnapshot
): ArchitecturalChange[] {
  const changes: ArchitecturalChange[] = [];
  let changeId = 1;
  
  // Detect circular dependency changes
  changes.push(...detectCircularDependencyChanges(baseline, current, changeId));
  changeId += changes.length;
  
  // Detect coupling changes
  changes.push(...detectCouplingChanges(baseline, current, changeId));
  changeId += changes.length;
  
  // Detect external dependency changes
  changes.push(...detectExternalDependencyChanges(baseline, current, changeId));
  changeId += changes.length;
  
  // Detect layer violation changes
  changes.push(...detectLayerViolationChanges(baseline, current, changeId));
  changeId += changes.length;
  
  // Detect hotspot changes
  changes.push(...detectHotspotChanges(baseline, current, changeId));
  changeId += changes.length;
  
  // Detect architecture layer changes
  changes.push(...detectArchitectureLayerChanges(baseline, current, changeId));
  
  return changes;
}

/**
 * Detect circular dependency changes
 */
function detectCircularDependencyChanges(
  baseline: GraphSnapshot,
  current: GraphSnapshot,
  startId: number
): ArchitecturalChange[] {
  const changes: ArchitecturalChange[] = [];
  const baseCircular = baseline.metrics.circularDependencies.length;
  const currentCircular = current.metrics.circularDependencies.length;
  
  if (currentCircular > baseCircular) {
    const increase = currentCircular - baseCircular;
    changes.push({
      id: `change-${startId}`,
      type: 'circular-dependency-introduced',
      severity: increase > 2 ? 'critical' : increase > 1 ? 'high' : 'medium',
      category: 'dependencies',
      description: `${increase} new circular ${increase === 1 ? 'dependency' : 'dependencies'} introduced`,
      details: {
        before: baseCircular,
        after: currentCircular,
        modules: [], // TODO: Extract specific modules
        metrics: { increase },
      },
      affected: [], // TODO: Extract affected modules
      impact: {
        riskLevel: increase > 2 ? 'critical' : 'high',
        maintainability: -3 * increase,
        performance: -1 * increase,
        testability: -2 * increase,
        overallScore: -6 * increase,
        reasoning: 'Circular dependencies make code harder to understand, test, and maintain',
        affectedAreas: ['maintainability', 'testability', 'code organization'],
      },
    });
  } else if (currentCircular < baseCircular) {
    const decrease = baseCircular - currentCircular;
    changes.push({
      id: `change-${startId}`,
      type: 'circular-dependency-resolved',
      severity: 'low',
      category: 'dependencies',
      description: `${decrease} circular ${decrease === 1 ? 'dependency' : 'dependencies'} resolved`,
      details: {
        before: baseCircular,
        after: currentCircular,
        modules: [],
        metrics: { decrease },
      },
      affected: [],
      impact: {
        riskLevel: 'low',
        maintainability: 3 * decrease,
        performance: 1 * decrease,
        testability: 2 * decrease,
        overallScore: 6 * decrease,
        reasoning: 'Resolving circular dependencies improves code organization and testability',
        affectedAreas: ['maintainability', 'testability', 'code organization'],
      },
    });
  }
  
  return changes;
}

/**
 * Detect coupling changes
 */
function detectCouplingChanges(
  baseline: GraphSnapshot,
  current: GraphSnapshot,
  startId: number
): ArchitecturalChange[] {
  const changes: ArchitecturalChange[] = [];
  const baseCoupling = baseline.metrics.averageCoupling || baseline.metrics.averageDependencies;
  const currentCoupling = current.metrics.averageCoupling || current.metrics.averageDependencies;
  const threshold = 0.5; // Significant change threshold
  
  const couplingDiff = currentCoupling - baseCoupling;
  
  if (Math.abs(couplingDiff) > threshold) {
    if (couplingDiff > 0) {
      changes.push({
        id: `change-${startId}`,
        type: 'coupling-increased',
        severity: couplingDiff > 2 ? 'high' : couplingDiff > 1 ? 'medium' : 'low',
        category: 'coupling',
        description: `Average coupling increased by ${couplingDiff.toFixed(1)} dependencies per module`,
        details: {
          before: baseCoupling,
          after: currentCoupling,
          modules: [],
          metrics: { increase: couplingDiff },
        },
        affected: [],
        impact: {
          riskLevel: couplingDiff > 2 ? 'high' : 'medium',
          maintainability: -2 * Math.round(couplingDiff),
          performance: -1 * Math.round(couplingDiff),
          testability: -2 * Math.round(couplingDiff),
          overallScore: -5 * Math.round(couplingDiff),
          reasoning: 'Increased coupling makes modules more interdependent and harder to change',
          affectedAreas: ['maintainability', 'testability', 'modularity'],
        },
      });
    } else {
      changes.push({
        id: `change-${startId}`,
        type: 'coupling-decreased',
        severity: 'low',
        category: 'coupling',
        description: `Average coupling decreased by ${Math.abs(couplingDiff).toFixed(1)} dependencies per module`,
        details: {
          before: baseCoupling,
          after: currentCoupling,
          modules: [],
          metrics: { decrease: Math.abs(couplingDiff) },
        },
        affected: [],
        impact: {
          riskLevel: 'low',
          maintainability: 2 * Math.round(Math.abs(couplingDiff)),
          performance: 1 * Math.round(Math.abs(couplingDiff)),
          testability: 2 * Math.round(Math.abs(couplingDiff)),
          overallScore: 5 * Math.round(Math.abs(couplingDiff)),
          reasoning: 'Decreased coupling improves modularity and makes code easier to maintain',
          affectedAreas: ['maintainability', 'testability', 'modularity'],
        },
      });
    }
  }
  
  return changes;
}

/**
 * Detect external dependency changes
 */
function detectExternalDependencyChanges(
  baseline: GraphSnapshot,
  current: GraphSnapshot,
  startId: number
): ArchitecturalChange[] {
  const changes: ArchitecturalChange[] = [];
  const baseExternal = baseline.metrics.externalDependencies;
  const currentExternal = current.metrics.externalDependencies;
  
  if (currentExternal > baseExternal) {
    const increase = currentExternal - baseExternal;
    changes.push({
      id: `change-${startId}`,
      type: 'external-dependency-added',
      severity: increase > 5 ? 'medium' : 'low',
      category: 'external',
      description: `${increase} new external ${increase === 1 ? 'dependency' : 'dependencies'} added`,
      details: {
        before: baseExternal,
        after: currentExternal,
        modules: [],
        metrics: { increase },
      },
      affected: [],
      impact: {
        riskLevel: increase > 5 ? 'medium' : 'low',
        maintainability: -1 * increase,
        performance: 0,
        testability: -1 * increase,
        overallScore: -2 * increase,
        reasoning: 'New external dependencies increase maintenance burden and potential security risks',
        affectedAreas: ['maintainability', 'security', 'bundle size'],
      },
    });
  } else if (currentExternal < baseExternal) {
    const decrease = baseExternal - currentExternal;
    changes.push({
      id: `change-${startId}`,
      type: 'external-dependency-removed',
      severity: 'low',
      category: 'external',
      description: `${decrease} external ${decrease === 1 ? 'dependency' : 'dependencies'} removed`,
      details: {
        before: baseExternal,
        after: currentExternal,
        modules: [],
        metrics: { decrease },
      },
      affected: [],
      impact: {
        riskLevel: 'low',
        maintainability: 1 * decrease,
        performance: 1 * decrease,
        testability: 0,
        overallScore: 2 * decrease,
        reasoning: 'Removing external dependencies reduces maintenance burden and improves performance',
        affectedAreas: ['maintainability', 'performance', 'bundle size'],
      },
    });
  }
  
  return changes;
}

/**
 * Detect layer violation changes (simplified heuristic)
 */
function detectLayerViolationChanges(
  baseline: GraphSnapshot,
  current: GraphSnapshot,
  startId: number
): ArchitecturalChange[] {
  const changes: ArchitecturalChange[] = [];
  
  // Simple heuristic: detect UI → DB direct connections (bypassing service layer)
  const baseViolations = detectLayerViolations(baseline.dependencyGraph);
  const currentViolations = detectLayerViolations(current.dependencyGraph);
  
  if (currentViolations > baseViolations) {
    const increase = currentViolations - baseViolations;
    changes.push({
      id: `change-${startId}`,
      type: 'layer-violation-introduced',
      severity: increase > 2 ? 'high' : 'medium',
      category: 'architecture',
      description: `${increase} new layer ${increase === 1 ? 'violation' : 'violations'} introduced`,
      details: {
        before: baseViolations,
        after: currentViolations,
        modules: [],
        metrics: { increase },
      },
      affected: [],
      impact: {
        riskLevel: 'high',
        maintainability: -3 * increase,
        performance: 0,
        testability: -2 * increase,
        overallScore: -5 * increase,
        reasoning: 'Layer violations break architectural boundaries and make code harder to maintain',
        affectedAreas: ['architecture', 'maintainability', 'separation of concerns'],
      },
    });
  }
  
  return changes;
}

/**
 * Detect hotspot changes (modules with high coupling)
 */
function detectHotspotChanges(
  baseline: GraphSnapshot,
  current: GraphSnapshot,
  startId: number
): ArchitecturalChange[] {
  const changes: ArchitecturalChange[] = [];
  
  const baseHotspots = baseline.metrics.hotspots?.length || 0;
  const currentHotspots = current.metrics.hotspots?.length || 0;
  
  if (currentHotspots > baseHotspots) {
    const increase = currentHotspots - baseHotspots;
    changes.push({
      id: `change-${startId}`,
      type: 'hotspot-created',
      severity: increase > 2 ? 'high' : 'medium',
      category: 'complexity',
      description: `${increase} new complexity ${increase === 1 ? 'hotspot' : 'hotspots'} created`,
      details: {
        before: baseHotspots,
        after: currentHotspots,
        modules: current.metrics.hotspots || [],
        metrics: { increase },
      },
      affected: current.metrics.hotspots || [],
      impact: {
        riskLevel: 'medium',
        maintainability: -2 * increase,
        performance: -1 * increase,
        testability: -3 * increase,
        overallScore: -6 * increase,
        reasoning: 'Complexity hotspots are harder to understand, test, and maintain',
        affectedAreas: ['maintainability', 'testability', 'code complexity'],
      },
    });
  }
  
  return changes;
}

/**
 * Detect architecture layer changes
 */
function detectArchitectureLayerChanges(
  baseline: GraphSnapshot,
  current: GraphSnapshot,
  startId: number
): ArchitecturalChange[] {
  const changes: ArchitecturalChange[] = [];
  
  const baseLayers = new Set(baseline.metrics.layers || []);
  const currentLayers = new Set(current.metrics.layers || []);
  
  // New layers
  const newLayers = [...currentLayers].filter(layer => !baseLayers.has(layer));
  if (newLayers.length > 0) {
    changes.push({
      id: `change-${startId}`,
      type: 'architecture-layer-added',
      severity: 'low',
      category: 'architecture',
      description: `${newLayers.length} new architecture ${newLayers.length === 1 ? 'layer' : 'layers'} introduced: ${newLayers.join(', ')}`,
      details: {
        before: baseline.metrics.layers || [],
        after: current.metrics.layers || [],
        modules: newLayers,
      },
      affected: [],
      impact: {
        riskLevel: 'low',
        maintainability: 1 * newLayers.length,
        performance: 0,
        testability: 1 * newLayers.length,
        overallScore: 2 * newLayers.length,
        reasoning: 'New layers can improve separation of concerns when used properly',
        affectedAreas: ['architecture', 'separation of concerns'],
      },
    });
  }
  
  return changes;
}

/**
 * Simple heuristic to detect layer violations
 */
function detectLayerViolations(graph: DependencyGraph): number {
  let violations = 0;
  
  for (const edge of graph.edges) {
    const fromPath = edge.from;
    const toPath = edge.to;
    
    // Detect UI → DB violations (bypassing service layer)
    if (
      (fromPath.includes('/components/') || fromPath.includes('/ui/')) &&
      (toPath.includes('/database/') || toPath.includes('/db/') || toPath.includes('/models/'))
    ) {
      violations++;
    }
  }
  
  return violations;
}

/**
 * Calculate impact summary
 */
function calculateImpactSummary(
  baseline: GraphSnapshot,
  current: GraphSnapshot,
  changes: ArchitecturalChange[]
): ImpactSummary {
  const bySeverity = changes.reduce((acc, change) => {
    acc[change.severity] = (acc[change.severity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const byCategory = changes.reduce((acc, change) => {
    acc[change.category] = (acc[change.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Calculate health scores (0-100)
  const baselineHealth = calculateHealthScore(baseline.metrics);
  const currentHealth = calculateHealthScore(current.metrics);
  
  return {
    totalChanges: changes.length,
    bySeverity,
    byCategory,
    healthChange: {
      before: baselineHealth,
      after: currentHealth,
      delta: currentHealth - baselineHealth,
    },
    keyMetrics: {
      circularDependencies: {
        before: baseline.metrics.circularDependencies.length,
        after: current.metrics.circularDependencies.length,
        delta: current.metrics.circularDependencies.length - baseline.metrics.circularDependencies.length,
      },
      averageCoupling: {
        before: baseline.metrics.averageCoupling || baseline.metrics.averageDependencies,
        after: current.metrics.averageCoupling || current.metrics.averageDependencies,
        delta: (current.metrics.averageCoupling || current.metrics.averageDependencies) - 
               (baseline.metrics.averageCoupling || baseline.metrics.averageDependencies),
      },
      externalDependencies: {
        before: baseline.metrics.externalDependencies,
        after: current.metrics.externalDependencies,
        delta: current.metrics.externalDependencies - baseline.metrics.externalDependencies,
      },
      moduleCount: {
        before: baseline.metrics.totalModules || baseline.metrics.totalNodes,
        after: current.metrics.totalModules || current.metrics.totalNodes,
        delta: (current.metrics.totalModules || current.metrics.totalNodes) - 
               (baseline.metrics.totalModules || baseline.metrics.totalNodes),
      },
    },
  };
}

/**
 * Calculate health score (0-100) based on metrics
 */
function calculateHealthScore(metrics: GraphMetrics): number {
  let score = 100;
  
  // Penalize circular dependencies
  score -= metrics.circularDependencies.length * 10;
  
  // Penalize high coupling
  const avgCoupling = metrics.averageCoupling || metrics.averageDependencies;
  if (avgCoupling > 5) {
    score -= (avgCoupling - 5) * 5;
  }
  
  // Penalize too many external dependencies relative to modules
  const totalModules = metrics.totalModules || metrics.totalNodes;
  const externalRatio = totalModules > 0 ? metrics.externalDependencies / totalModules : 0;
  if (externalRatio > 2) {
    score -= (externalRatio - 2) * 10;
  }
  
  // Penalize hotspots
  score -= (metrics.hotspots?.length || 0) * 3;
  
  return Math.max(0, Math.min(100, score));
}

/**
 * Generate recommendations based on changes
 */
function generateRecommendations(
  changes: ArchitecturalChange[],
  impact: ImpactSummary
): Recommendation[] {
  const recommendations: Recommendation[] = [];
  let recId = 1;
  
  // Critical issues first
  const criticalChanges = changes.filter(c => c.severity === 'critical');
  if (criticalChanges.length > 0) {
    recommendations.push({
      id: `rec-${recId++}`,
      priority: 'critical',
      type: 'fix-issue',
      title: 'Address Critical Architectural Issues',
      description: 'Critical architectural problems detected that require immediate attention.',
      actions: criticalChanges.map(c => `Fix: ${c.description}`),
      addresses: criticalChanges.map(c => c.id),
      effort: 'high',
      expectedImpact: 'Prevent significant technical debt and maintainability issues',
    });
  }
  
  // Circular dependencies
  const circularChanges = changes.filter(c => c.type === 'circular-dependency-introduced');
  if (circularChanges.length > 0) {
    recommendations.push({
      id: `rec-${recId++}`,
      priority: 'high',
      type: 'refactor',
      title: 'Resolve Circular Dependencies',
      description: 'New circular dependencies were introduced that should be resolved.',
      actions: [
        'Identify the circular dependency chain',
        'Extract common functionality to a shared module',
        'Use dependency injection or event-driven patterns',
        'Consider architectural refactoring'
      ],
      addresses: circularChanges.map(c => c.id),
      effort: 'medium',
      expectedImpact: 'Improve code organization and testability',
    });
  }
  
  // Coupling increases
  const couplingChanges = changes.filter(c => c.type === 'coupling-increased');
  if (couplingChanges.length > 0) {
    recommendations.push({
      id: `rec-${recId++}`,
      priority: 'medium',
      type: 'improve-architecture',
      title: 'Reduce Module Coupling',
      description: 'Average coupling has increased, which may impact maintainability.',
      actions: [
        'Review new dependencies and remove unnecessary ones',
        'Use interfaces to decouple implementations',
        'Consider using dependency injection',
        'Extract common functionality to utilities'
      ],
      addresses: couplingChanges.map(c => c.id),
      effort: 'medium',
      expectedImpact: 'Improve modularity and make code easier to test',
    });
  }
  
  // Layer violations
  const layerChanges = changes.filter(c => c.type === 'layer-violation-introduced');
  if (layerChanges.length > 0) {
    recommendations.push({
      id: `rec-${recId++}`,
      priority: 'high',
      type: 'fix-issue',
      title: 'Fix Layer Violations',
      description: 'New architectural layer violations detected.',
      actions: [
        'Review direct connections between UI and database layers',
        'Ensure all data access goes through service layer',
        'Implement proper abstractions and interfaces',
        'Set up architectural linting rules'
      ],
      addresses: layerChanges.map(c => c.id),
      effort: 'medium',
      expectedImpact: 'Maintain proper separation of concerns',
    });
  }
  
  // Positive changes
  const positiveChanges = changes.filter(c => 
    c.type === 'circular-dependency-resolved' || 
    c.type === 'coupling-decreased'
  );
  if (positiveChanges.length > 0) {
    recommendations.push({
      id: `rec-${recId++}`,
      priority: 'low',
      type: 'monitor',
      title: 'Continue Good Practices',
      description: 'Positive architectural changes detected. Keep up the good work!',
      actions: [
        'Document the refactoring patterns used',
        'Share knowledge with the team',
        'Consider applying similar patterns elsewhere'
      ],
      addresses: positiveChanges.map(c => c.id),
      effort: 'low',
      expectedImpact: 'Maintain and spread good architectural practices',
    });
  }
  
  return recommendations;
}

/**
 * Calculate metrics diff
 */
function calculateMetricsDiff(baseline: GraphMetrics, current: GraphMetrics): GraphMetricsDiff {
  const baseModules = baseline.totalModules || baseline.totalNodes;
  const currentModules = current.totalModules || current.totalNodes;
  const baseDeps = baseline.totalDependencies || baseline.totalEdges;
  const currentDeps = current.totalDependencies || current.totalEdges;
  const baseCoupling = baseline.averageCoupling || baseline.averageDependencies;
  const currentCoupling = current.averageCoupling || current.averageDependencies;
  
  return {
    totalModules: currentModules - baseModules,
    totalDependencies: currentDeps - baseDeps,
    internalDependencies: current.internalDependencies - baseline.internalDependencies,
    externalDependencies: current.externalDependencies - baseline.externalDependencies,
    circularDependencies: current.circularDependencies.length - baseline.circularDependencies.length,
    averageCoupling: currentCoupling - baseCoupling,
    newHotspots: (current.hotspots || []).filter(h => !(baseline.hotspots || []).includes(h)),
    resolvedHotspots: (baseline.hotspots || []).filter(h => !(current.hotspots || []).includes(h)),
    newLayers: (current.layers || []).filter(l => !(baseline.layers || []).includes(l)),
    removedLayers: (baseline.layers || []).filter(l => !(current.layers || []).includes(l)),
    layerViolations: 0, // Simplified for now
  };
}

/**
 * Convert existing GraphMetrics to enhanced GraphMetrics for diff analysis
 */
function adaptGraphMetrics(existingMetrics: ExistingGraphMetrics): GraphMetrics {
  const circularCount = existingMetrics.circularDependencies.length;
  const hotspots = detectHotspots(existingMetrics);
  const layers = detectArchitectureLayers(existingMetrics);
  
  return {
    totalNodes: existingMetrics.totalNodes,
    totalEdges: existingMetrics.totalEdges,
    internalDependencies: existingMetrics.internalDependencies,
    externalDependencies: existingMetrics.externalDependencies,
    circularDependencies: existingMetrics.circularDependencies,
    averageDependencies: existingMetrics.averageDependencies,
    mostConnectedModule: existingMetrics.mostConnectedModule,
    hotspots: hotspots,
    layers: layers,
    layerViolations: 0, // Will be calculated separately
    
    // Computed properties for backwards compatibility
    averageCoupling: existingMetrics.averageDependencies,
    totalModules: existingMetrics.totalNodes,
    totalDependencies: existingMetrics.totalEdges,
  };
}

/**
 * Detect hotspots (modules with high coupling)
 */
function detectHotspots(metrics: ExistingGraphMetrics): string[] {
  // Simple heuristic: modules with above-average dependencies are hotspots
  const threshold = metrics.averageDependencies * 1.5;
  const hotspots: string[] = [];
  
  // For now, just include the most connected module if it exists
  if (metrics.mostConnectedModule && metrics.averageDependencies > threshold) {
    hotspots.push(metrics.mostConnectedModule);
  }
  
  return hotspots;
}

/**
 * Detect architecture layers from file paths
 */
function detectArchitectureLayers(metrics: ExistingGraphMetrics): string[] {
  // Simple heuristic based on common directory patterns
  const layers = new Set<string>();
  
  // This would normally analyze the actual file paths, but since we don't have them
  // in the metrics, we'll return common layer patterns
  const commonLayers = ['components', 'services', 'utils', 'types', 'api', 'database'];
  
  return commonLayers;
}

/**
 * Create empty metrics for cases with no files
 */
function createEmptyMetrics(): GraphMetrics {
  return adaptGraphMetrics({
    totalNodes: 0,
    totalEdges: 0,
    internalDependencies: 0,
    externalDependencies: 0,
    circularDependencies: [],
    averageDependencies: 0,
  });
}