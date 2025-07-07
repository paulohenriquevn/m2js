/**
 * CLI interface for Graph-Deep Diff Analysis
 * LLM-friendly reporting with rich context and impact scoring
 */

import chalk from 'chalk';
import { analyzeGraphDiff } from './graph-diff-analyzer';
import {
  GraphDiffOptions,
  GraphDiffReport,
  ArchitecturalChange,
  ImpactSummary,
  Recommendation,
} from './graph-diff-types';

/**
 * Get detailed help text for graph diff analysis
 */
export function getGraphDiffHelpText(): string {
  return `
${chalk.bold.blue('🔍 M2JS Graph-Deep Diff Analysis')}

${chalk.bold('PURPOSE:')}
Compare architectural states between git references to detect problematic changes
and track technical debt evolution over time.

${chalk.bold('BASIC USAGE:')}
  m2js <path> --graph-diff --baseline <ref>
  m2js <path> --graph-diff --baseline main --current feature-branch
  m2js <path> --graph-diff --baseline HEAD~1 --format json

${chalk.bold('OPTIONS:')}
  --baseline <ref>        Baseline git reference (required)
                         Examples: main, HEAD~1, v1.0.0, commit-hash
  
  --current <ref>         Current reference (default: working directory)
                         Examples: feature-branch, HEAD, working files
  
  --format <type>         Output format: table (default), json
  
  --min-severity <level>  Filter by severity: low, medium, high, critical
  
  --include-details       Include detailed change analysis (default: true)
  --include-impact        Include impact scoring (default: true)  
  --include-suggestions   Include improvement suggestions (default: true)

${chalk.bold('DETECTION CAPABILITIES:')}
  🔄 Circular Dependencies    - New/resolved circular imports
  🔗 Coupling Changes        - Average dependencies per module
  📦 External Dependencies   - NPM package additions/removals
  🏗️  Layer Violations        - Architecture boundary violations
  🧩 Complexity Hotspots     - High-coupling modules
  📁 Architecture Layers     - New/removed structural layers

${chalk.bold('OUTPUT INFORMATION:')}
  • Severity Distribution  - Critical, High, Medium, Low changes
  • Category Breakdown     - Dependencies, Architecture, Coupling, etc.
  • Health Score Tracking  - 0-100 architectural health metric
  • Impact Analysis        - Maintainability, Performance, Testability
  • Actionable Recommendations - Prioritized improvement steps

${chalk.bold('EXAMPLES:')}
  # Compare current branch to main
  m2js src/ --graph-diff --baseline main
  
  # Compare two specific commits
  m2js . --graph-diff --baseline v1.0.0 --current v1.1.0
  
  # Focus on critical issues only
  m2js src/ --graph-diff --baseline HEAD~5 --min-severity high
  
  # JSON output for CI/CD integration
  m2js . --graph-diff --baseline main --format json > architecture-report.json

${chalk.bold('CI/CD INTEGRATION:')}
  # Use in PR checks to prevent architectural regression
  m2js src/ --graph-diff --baseline origin/main --format json | jq '.impact.healthChange.delta'

${chalk.bold('COMMON WORKFLOWS:')}
  1. Pre-merge validation  - Compare feature branch to main
  2. Release preparation   - Compare current to last stable version
  3. Refactoring tracking  - Monitor architectural improvements
  4. Technical debt audit  - Analyze historical architectural changes

${chalk.green('💡 Pro Tip:')} Use --baseline HEAD~1 for commit-by-commit analysis
${chalk.green('💡 Pro Tip:')} Set up git hooks to track architectural health automatically
`;
}

/**
 * Execute graph diff analysis with LLM-friendly output
 */
export async function executeGraphDiffAnalysis(
  projectPath: string,
  options: GraphDiffOptions
): Promise<void> {
  const startTime = Date.now();
  
  try {
    console.log(chalk.blue('🔍 Starting Graph-Deep Diff Analysis...'));
    console.log(chalk.gray(`Comparing ${options.baseline} → ${options.current || 'current'}`));
    
    // Perform analysis
    const report = await analyzeGraphDiff(projectPath, options);
    
    // Output results based on format
    if (options.format === 'json') {
      console.log(JSON.stringify(report, null, 2));
    } else {
      await displayTableReport(report, options);
    }
    
    const duration = Date.now() - startTime;
    console.log(chalk.gray(`\n⏱️  Analysis completed in ${duration}ms`));
    
  } catch (error) {
    console.error(chalk.red(`❌ Graph diff analysis failed: ${(error as Error).message}`));
    process.exit(1);
  }
}

/**
 * Display analysis results in table format (LLM-friendly)
 */
async function displayTableReport(
  report: GraphDiffReport,
  options: GraphDiffOptions
): Promise<void> {
  console.log('\n' + chalk.bold.blue('📊 GRAPH-DEEP DIFF ANALYSIS REPORT'));
  console.log(chalk.blue('=' .repeat(60)));
  
  // Comparison overview
  displayComparisonOverview(report);
  
  // Impact summary
  displayImpactSummary(report.impact);
  
  // Key metrics changes
  displayMetricsChanges(report);
  
  // Architectural changes
  if (options.includeDetails !== false) {
    displayArchitecturalChanges(report.changes, options);
  }
  
  // Recommendations
  if (options.includeSuggestions !== false) {
    displayRecommendations(report.recommendations);
  }
  
  // Health score analysis
  displayHealthScoreAnalysis(report.impact);
}

/**
 * Display comparison overview
 */
function displayComparisonOverview(report: GraphDiffReport): void {
  console.log('\n' + chalk.bold.yellow('📋 COMPARISON OVERVIEW'));
  console.log(chalk.yellow('-'.repeat(40)));
  
  console.log(`${chalk.cyan('Project:')} ${report.projectPath}`);
  console.log(`${chalk.cyan('Baseline:')} ${report.comparison.baseline}`);
  console.log(`${chalk.cyan('Current:')} ${report.comparison.current}`);
  console.log(`${chalk.cyan('Analyzed:')} ${report.comparison.timestamp.toISOString()}`);
  console.log(`${chalk.cyan('Total Changes:')} ${report.changes.length}`);
}

/**
 * Display impact summary with severity distribution
 */
function displayImpactSummary(impact: ImpactSummary): void {
  console.log('\n' + chalk.bold.red('🎯 IMPACT SUMMARY'));
  console.log(chalk.red('-'.repeat(40)));
  
  // Severity breakdown
  console.log(chalk.bold('Severity Distribution:'));
  const severities = ['critical', 'high', 'medium', 'low'];
  severities.forEach(severity => {
    const count = impact.bySeverity[severity] || 0;
    const color = getSeverityColor(severity);
    const icon = getSeverityIcon(severity);
    console.log(`  ${icon} ${color(severity.toUpperCase())}: ${count} changes`);
  });
  
  // Category breakdown
  console.log(chalk.bold('\nCategory Distribution:'));
  Object.entries(impact.byCategory).forEach(([category, count]) => {
    const icon = getCategoryIcon(category);
    console.log(`  ${icon} ${chalk.cyan(category)}: ${count} changes`);
  });
  
  // Health score change
  const healthDelta = impact.healthChange.delta;
  const healthColor = healthDelta >= 0 ? chalk.green : chalk.red;
  const healthIcon = healthDelta >= 0 ? '📈' : '📉';
  console.log(`\n${healthIcon} ${chalk.bold('Health Score:')} ${impact.healthChange.before} → ${impact.healthChange.after} (${healthColor(healthDelta > 0 ? '+' : '')}${healthDelta.toFixed(1)})`);
}

/**
 * Display key metrics changes
 */
function displayMetricsChanges(report: GraphDiffReport): void {
  console.log('\n' + chalk.bold.green('📈 KEY METRICS CHANGES'));
  console.log(chalk.green('-'.repeat(40)));
  
  const metrics = report.impact.keyMetrics;
  
  displayMetricChange(
    'Circular Dependencies',
    metrics.circularDependencies.before,
    metrics.circularDependencies.after,
    metrics.circularDependencies.delta,
    '🔄'
  );
  
  displayMetricChange(
    'Average Coupling',
    metrics.averageCoupling.before,
    metrics.averageCoupling.after,
    metrics.averageCoupling.delta,
    '🔗',
    1
  );
  
  displayMetricChange(
    'External Dependencies',
    metrics.externalDependencies.before,
    metrics.externalDependencies.after,
    metrics.externalDependencies.delta,
    '📦'
  );
  
  displayMetricChange(
    'Module Count',
    metrics.moduleCount.before,
    metrics.moduleCount.after,
    metrics.moduleCount.delta,
    '📁'
  );
}

/**
 * Display individual metric change
 */
function displayMetricChange(
  name: string,
  before: number,
  after: number,
  delta: number,
  icon: string,
  decimals: number = 0
): void {
  const deltaColor = delta > 0 ? chalk.red : delta < 0 ? chalk.green : chalk.gray;
  const deltaSign = delta > 0 ? '+' : '';
  const beforeStr = decimals > 0 ? before.toFixed(decimals) : before.toString();
  const afterStr = decimals > 0 ? after.toFixed(decimals) : after.toString();
  const deltaStr = decimals > 0 ? delta.toFixed(decimals) : delta.toString();
  
  console.log(`${icon} ${chalk.cyan(name)}: ${beforeStr} → ${afterStr} (${deltaColor(deltaSign)}${deltaColor(deltaStr)})`);
}

/**
 * Display architectural changes with filtering
 */
function displayArchitecturalChanges(
  changes: ArchitecturalChange[],
  options: GraphDiffOptions
): void {
  if (changes.length === 0) {
    console.log('\n' + chalk.bold.green('✅ NO ARCHITECTURAL CHANGES DETECTED'));
    return;
  }
  
  console.log('\n' + chalk.bold.magenta('🏗️  ARCHITECTURAL CHANGES'));
  console.log(chalk.magenta('-'.repeat(40)));
  
  // Filter by minimum severity if specified
  let filteredChanges = changes;
  if (options.minSeverity) {
    const severityOrder = ['low', 'medium', 'high', 'critical'];
    const minIndex = severityOrder.indexOf(options.minSeverity);
    filteredChanges = changes.filter(change => 
      severityOrder.indexOf(change.severity) >= minIndex
    );
  }
  
  // Sort by severity (critical first)
  const severityOrder = ['critical', 'high', 'medium', 'low'];
  filteredChanges.sort((a, b) => 
    severityOrder.indexOf(a.severity) - severityOrder.indexOf(b.severity)
  );
  
  filteredChanges.forEach((change, index) => {
    displayArchitecturalChange(change, index + 1, options);
  });
  
  if (filteredChanges.length < changes.length) {
    const hiddenCount = changes.length - filteredChanges.length;
    console.log(chalk.gray(`\n... and ${hiddenCount} more lower-severity changes`));
  }
}

/**
 * Display individual architectural change
 */
function displayArchitecturalChange(change: ArchitecturalChange, index: number, options?: GraphDiffOptions): void {
  const severityColor = getSeverityColor(change.severity);
  const severityIcon = getSeverityIcon(change.severity);
  const categoryIcon = getCategoryIcon(change.category);
  
  console.log(`\n${index}. ${severityIcon} ${severityColor(change.severity.toUpperCase())} - ${categoryIcon} ${change.category}`);
  console.log(`   ${chalk.bold(change.description)}`);
  
  if (options?.includeImpact !== false) {
    const impact = change.impact;
    console.log(`   ${chalk.cyan('Risk:')} ${impact.riskLevel} | ${chalk.cyan('Overall Score:')} ${impact.overallScore > 0 ? '+' : ''}${impact.overallScore}`);
    console.log(`   ${chalk.cyan('Reasoning:')} ${impact.reasoning}`);
    
    if (impact.affectedAreas.length > 0) {
      console.log(`   ${chalk.cyan('Affected Areas:')} ${impact.affectedAreas.join(', ')}`);
    }
  }
  
  if (change.affected.length > 0) {
    console.log(`   ${chalk.cyan('Affected Modules:')} ${change.affected.slice(0, 3).join(', ')}${change.affected.length > 3 ? '...' : ''}`);
  }
}

/**
 * Display recommendations
 */
function displayRecommendations(recommendations: Recommendation[]): void {
  if (recommendations.length === 0) {
    return;
  }
  
  console.log('\n' + chalk.bold.blue('💡 RECOMMENDATIONS'));
  console.log(chalk.blue('-'.repeat(40)));
  
  // Sort by priority
  const priorityOrder = ['critical', 'high', 'medium', 'low'];
  const sortedRecs = recommendations.sort((a, b) => 
    priorityOrder.indexOf(a.priority) - priorityOrder.indexOf(b.priority)
  );
  
  sortedRecs.forEach((rec, index) => {
    displayRecommendation(rec, index + 1);
  });
}

/**
 * Display individual recommendation
 */
function displayRecommendation(rec: Recommendation, index: number): void {
  const priorityColor = getSeverityColor(rec.priority);
  const typeIcon = getRecommendationTypeIcon(rec.type);
  const effortIcon = getEffortIcon(rec.effort);
  
  console.log(`\n${index}. ${typeIcon} ${priorityColor(rec.priority.toUpperCase())} - ${rec.title}`);
  console.log(`   ${chalk.gray(rec.description)}`);
  console.log(`   ${effortIcon} ${chalk.cyan('Effort:')} ${rec.effort} | ${chalk.cyan('Impact:')} ${rec.expectedImpact}`);
  
  if (rec.actions.length > 0) {
    console.log(`   ${chalk.cyan('Actions:')}`);
    rec.actions.forEach(action => {
      console.log(`     • ${action}`);
    });
  }
}

/**
 * Display health score analysis
 */
function displayHealthScoreAnalysis(impact: ImpactSummary): void {
  console.log('\n' + chalk.bold.cyan('🏥 ARCHITECTURAL HEALTH ANALYSIS'));
  console.log(chalk.cyan('-'.repeat(40)));
  
  const healthDelta = impact.healthChange.delta;
  const currentHealth = impact.healthChange.after;
  
  let healthStatus = '';
  let recommendations = '';
  
  if (currentHealth >= 80) {
    healthStatus = chalk.green('EXCELLENT');
    recommendations = 'Continue following good practices';
  } else if (currentHealth >= 60) {
    healthStatus = chalk.yellow('GOOD');
    recommendations = 'Minor improvements recommended';
  } else if (currentHealth >= 40) {
    healthStatus = chalk.yellow('FAIR');
    recommendations = 'Significant refactoring needed';
  } else {
    healthStatus = chalk.red('POOR');
    recommendations = 'Critical architectural issues require immediate attention';
  }
  
  console.log(`${chalk.cyan('Current Health:')} ${currentHealth.toFixed(1)}/100 (${healthStatus})`);
  console.log(`${chalk.cyan('Health Trend:')} ${healthDelta >= 0 ? '📈 Improving' : '📉 Declining'} (${healthDelta > 0 ? '+' : ''}${healthDelta.toFixed(1)})`);
  console.log(`${chalk.cyan('Recommendation:')} ${recommendations}`);
}

/**
 * Get color for severity level
 */
function getSeverityColor(severity: string): typeof chalk.red {
  switch (severity) {
    case 'critical': return chalk.red.bold;
    case 'high': return chalk.red;
    case 'medium': return chalk.yellow;
    case 'low': return chalk.green;
    default: return chalk.gray;
  }
}

/**
 * Get icon for severity level
 */
function getSeverityIcon(severity: string): string {
  switch (severity) {
    case 'critical': return '🚨';
    case 'high': return '⚠️';
    case 'medium': return '⚡';
    case 'low': return '💡';
    default: return '📝';
  }
}

/**
 * Get icon for category
 */
function getCategoryIcon(category: string): string {
  switch (category) {
    case 'dependencies': return '🔗';
    case 'architecture': return '🏗️';
    case 'coupling': return '🔀';
    case 'complexity': return '🧩';
    case 'external': return '📦';
    case 'performance': return '⚡';
    case 'maintainability': return '🔧';
    default: return '📋';
  }
}

/**
 * Get icon for recommendation type
 */
function getRecommendationTypeIcon(type: string): string {
  switch (type) {
    case 'fix-issue': return '🔧';
    case 'improve-architecture': return '🏗️';
    case 'refactor': return '♻️';
    case 'monitor': return '👀';
    default: return '💡';
  }
}

/**
 * Get icon for effort level
 */
function getEffortIcon(effort: string): string {
  switch (effort) {
    case 'low': return '🟢';
    case 'medium': return '🟡';
    case 'high': return '🔴';
    default: return '⚪';
  }
}