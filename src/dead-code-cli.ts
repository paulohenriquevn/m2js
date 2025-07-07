/**
 * CLI Integration for Dead Code Analysis
 * Handles --detect-unused flag and output formatting
 */

import chalk from 'chalk';
import { DeadCodeReport, DeadCodeOptions } from './dead-code-types';
import { analyzeDeadCode } from './dead-code-analyzer';
import { ConfigLoader } from './config-loader';

/**
 * Execute dead code analysis and output results
 */
export async function executeDeadCodeAnalysis(
  files: string[],
  options: DeadCodeOptions = {
    format: 'table',
    includeMetrics: true,
    includeSuggestions: true,
  }
): Promise<void> {
  try {
    console.log(chalk.cyan.bold('Dead Code Analysis Report'));
    console.log(chalk.dim(`Analyzing ${files.length} files...\n`));

    // Load configuration from .m2jsrc and environment variables
    const config = ConfigLoader.loadConfig();
    const performanceOptions = ConfigLoader.toPerformanceOptions(config);

    // Override showProgress based on file count if not explicitly set
    if (files.length <= 10 && !process.env.M2JS_SHOW_PROGRESS) {
      performanceOptions.showProgress = false;
    }

    const report = await analyzeDeadCode(files, performanceOptions);

    if (options.format === 'json') {
      outputJsonFormat(report);
    } else {
      outputTableFormat(report, options);
    }

    // Exit with code 0 (informational, not error)
    process.exit(0);
  } catch (error) {
    console.error(chalk.red(`Error: ${(error as Error).message}`));
    process.exit(1);
  }
}

/**
 * Output report in table format (default)
 */
function outputTableFormat(
  report: DeadCodeReport,
  options: DeadCodeOptions
): void {
  const { deadExports, unusedImports, suggestions, metrics, projectPath } =
    report;

  // Project info
  console.log(chalk.dim(`Project: ${projectPath}`));

  if (options.includeMetrics) {
    console.log(chalk.dim(`Files analyzed: ${metrics.totalFiles}`));
    console.log(chalk.dim(`Analysis time: ${metrics.analysisTimeMs}ms\n`));
  }

  // Dead exports section
  if (deadExports.length === 0 && unusedImports.length === 0) {
    console.log(chalk.green.bold('Great! No dead code found!'));
    console.log(chalk.green('All exports and imports are being used.\n'));
  } else {
    console.log(
      chalk.red.bold(`Dead Exports (${deadExports.length} found):`)
    );
    console.log(
      chalk.gray('┌─────────────────────────────────────────────────┐')
    );

    deadExports.forEach((deadExport, index) => {
      const isLast = index === deadExports.length - 1;
      const fileLocation = chalk.yellow(
        `${deadExport.file}:${deadExport.line}`
      );
      const exportName = chalk.white.bold(deadExport.name);
      const exportType = chalk.cyan(`${deadExport.type}`);
      const reason = chalk.dim(deadExport.reason);
      const confidenceColor = getConfidenceColor(deadExport.confidence);
      const confidence = confidenceColor(
        `[${deadExport.confidence.toUpperCase()}]`
      );

      console.log(chalk.gray('│ ') + fileLocation + ' ' + confidence);
      console.log(
        chalk.gray('│ ') + chalk.gray('└─ ') + exportType + ' ' + exportName
      );
      console.log(chalk.gray('│    ') + reason);

      // Show risk factors if any
      if (deadExport.riskFactors.length > 0) {
        console.log(chalk.gray('│    ') + chalk.red('Risk factors:'));
        deadExport.riskFactors.forEach(risk => {
          console.log(chalk.gray('│      • ') + chalk.red(risk));
        });
      }

      if (!isLast) {
        console.log(chalk.gray('│'));
      }
    });

    console.log(
      chalk.gray('└─────────────────────────────────────────────────┘\n')
    );

    // Unused imports section
    if (unusedImports.length > 0) {
      console.log(
        chalk.yellow.bold(`Unused Imports (${unusedImports.length} found):`)
      );
      console.log(
        chalk.gray('┌─────────────────────────────────────────────────┐')
      );

      unusedImports.forEach((unusedImport, index) => {
        const isLast = index === unusedImports.length - 1;
        const fileLocation = chalk.yellow(
          `${unusedImport.file}:${unusedImport.line}`
        );
        const importName = chalk.white.bold(unusedImport.name);
        const importFrom = chalk.cyan(`from '${unusedImport.from}'`);
        const reason = chalk.dim(unusedImport.reason);
        const confidenceColor = getConfidenceColor(unusedImport.confidence);
        const confidence = confidenceColor(
          `[${unusedImport.confidence.toUpperCase()}]`
        );

        console.log(chalk.gray('│ ') + fileLocation + ' ' + confidence);
        console.log(
          chalk.gray('│ ') + chalk.gray('└─ ') + importName + ' ' + importFrom
        );
        console.log(chalk.gray('│    ') + reason);

        // Show risk factors if any
        if (unusedImport.riskFactors.length > 0) {
          console.log(chalk.gray('│    ') + chalk.red('Risk factors:'));
          unusedImport.riskFactors.forEach(risk => {
            console.log(chalk.gray('│      • ') + chalk.red(risk));
          });
        }

        if (!isLast) {
          console.log(chalk.gray('│'));
        }
      });

      console.log(
        chalk.gray('└─────────────────────────────────────────────────┘\n')
      );
    }
  }

  // Impact summary
  if (
    options.includeMetrics &&
    (deadExports.length > 0 || unusedImports.length > 0)
  ) {
    console.log(chalk.blue.bold('Impact Summary:'));

    // Count by type
    const typeCount = deadExports.reduce(
      (acc, exp) => {
        acc[exp.type] = (acc[exp.type] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    Object.entries(typeCount).forEach(([type, count]) => {
      const plural = count === 1 ? '' : 's';
      console.log(
        chalk.blue(`• ${capitalize(type)}${plural}: ${count} unused`)
      );
    });

    // Add unused imports to summary
    if (unusedImports.length > 0) {
      console.log(chalk.blue(`• Imports: ${unusedImports.length} unused`));
    }

    console.log(
      chalk.blue(`• Estimated size: ~${metrics.estimatedSavingsKB}KB`)
    );

    // Show performance metrics if available
    if ((metrics as any).performanceStats) {
      const perfStats = (metrics as any).performanceStats;
      console.log(
        chalk.dim(
          `Cache: ${perfStats.cacheHits} hits, ${perfStats.cacheMisses} misses (${Math.round(perfStats.hitRate * 100)}% hit rate)`
        )
      );
    }

    console.log();
  }

  // Removal suggestions section
  if (
    options.includeSuggestions !== false &&
    suggestions &&
    suggestions.length > 0
  ) {
    console.log(chalk.blue.bold('Removal Suggestions:'));
    console.log(
      chalk.gray('┌─────────────────────────────────────────────────┐')
    );

    // Group suggestions by safety level
    const safeSuggestions = suggestions.filter(s => s.safety === 'safe');
    const reviewSuggestions = suggestions.filter(
      s => s.safety === 'review-needed'
    );
    const riskySuggestions = suggestions.filter(s => s.safety === 'risky');

    // Show safe suggestions first
    if (safeSuggestions.length > 0) {
      console.log(chalk.gray('│ ') + chalk.green.bold('SAFE TO REMOVE:'));
      safeSuggestions.slice(0, 5).forEach((suggestion, index) => {
        const isLast = index === Math.min(4, safeSuggestions.length - 1);
        const priorityIcon = getPriorityIcon(suggestion.priority);

        console.log(
          chalk.gray('│ ') + priorityIcon + ' ' + chalk.white(suggestion.action)
        );
        console.log(
          chalk.gray('│   ') +
            chalk.dim(`${suggestion.file}:${suggestion.line}`)
        );
        console.log(chalk.gray('│   ') + chalk.dim(suggestion.impact));

        if (suggestion.command) {
          console.log(chalk.gray('│   ') + chalk.cyan(suggestion.command));
        }

        if (!isLast) {
          console.log(chalk.gray('│'));
        }
      });

      if (safeSuggestions.length > 5) {
        console.log(
          chalk.gray('│   ') +
            chalk.dim(
              `... and ${safeSuggestions.length - 5} more safe suggestions`
            )
        );
      }
      console.log(chalk.gray('│'));
    }

    // Show review-needed suggestions
    if (reviewSuggestions.length > 0) {
      console.log(
        chalk.gray('│ ') + chalk.yellow.bold('REVIEW BEFORE REMOVING:')
      );
      reviewSuggestions.slice(0, 3).forEach((suggestion, index) => {
        const isLast = index === Math.min(2, reviewSuggestions.length - 1);
        const priorityIcon = getPriorityIcon(suggestion.priority);

        console.log(
          chalk.gray('│ ') + priorityIcon + ' ' + chalk.white(suggestion.action)
        );
        console.log(
          chalk.gray('│   ') +
            chalk.dim(`${suggestion.file}:${suggestion.line}`)
        );

        if (suggestion.warnings && suggestion.warnings.length > 0) {
          suggestion.warnings.forEach(warning => {
            console.log(
              chalk.gray('│   ') + chalk.yellow('Warning: ') + chalk.yellow(warning)
            );
          });
        }

        if (!isLast) {
          console.log(chalk.gray('│'));
        }
      });

      if (reviewSuggestions.length > 3) {
        console.log(
          chalk.gray('│   ') +
            chalk.dim(
              `... and ${reviewSuggestions.length - 3} more suggestions to review`
            )
        );
      }
      console.log(chalk.gray('│'));
    }

    // Show risky suggestions (just count)
    if (riskySuggestions.length > 0) {
      console.log(chalk.gray('│ ') + chalk.red.bold('HIGH RISK:'));
      console.log(
        chalk.gray('│   ') +
          chalk.red(
            `${riskySuggestions.length} suggestions require careful analysis`
          )
      );
      console.log(
        chalk.gray('│   ') + chalk.red('Manual review strongly recommended')
      );
    }

    console.log(
      chalk.gray('└─────────────────────────────────────────────────┘\n')
    );
  }

  // Next steps guidance
  if (deadExports.length > 0 || unusedImports.length > 0) {
    console.log(chalk.blue.bold('Next Steps:'));

    const safeSuggestions = suggestions?.filter(s => s.safety === 'safe') || [];
    const reviewSuggestions =
      suggestions?.filter(s => s.safety === 'review-needed') || [];
    const riskySuggestions =
      suggestions?.filter(s => s.safety === 'risky') || [];

    if (safeSuggestions.length > 0) {
      console.log(
        chalk.blue('1. Start with safe-to-remove items (high confidence)')
      );
      console.log(chalk.blue('2. Use provided commands for quick removal'));
    }

    if (reviewSuggestions.length > 0) {
      console.log(chalk.blue('3. Review medium-risk items manually'));
      console.log(
        chalk.blue('4. Check external consumers and dynamic imports')
      );
    }

    if (riskySuggestions.length > 0) {
      console.log(chalk.blue('5. Analyze high-risk items very carefully'));
      console.log(chalk.blue('6. Consider keeping public API exports'));
    }
  }
}

/**
 * Output report in JSON format
 */
function outputJsonFormat(report: DeadCodeReport): void {
  console.log(JSON.stringify(report, null, 2));
}

/**
 * Capitalize first letter of a string
 */
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Get color function for confidence level
 */
function getConfidenceColor(confidence: 'high' | 'medium' | 'low') {
  switch (confidence) {
    case 'high':
      return chalk.green;
    case 'medium':
      return chalk.yellow;
    case 'low':
      return chalk.red;
    default:
      return chalk.gray;
  }
}

/**
 * Get priority icon for suggestions
 */
function getPriorityIcon(priority: 'high' | 'medium' | 'low'): string {
  switch (priority) {
    case 'high':
      return chalk.red('HIGH');
    case 'medium':
      return chalk.yellow('MED');
    case 'low':
      return chalk.blue('LOW');
    default:
      return '•';
  }
}

/**
 * Get help text for dead code analysis
 */
export function getDeadCodeHelpText(): string {
  return `
Dead Code Analysis:
  --detect-unused              Detect unused exports and imports with confidence levels
  --format <type>             Output format: table, json (default: table)

Performance Options:
  Environment Variables:
    M2JS_CACHE_ENABLED=true    Enable/disable parsing cache (default: true)
    M2JS_CACHE_SIZE=1000       Max files in cache (default: 1000)
    M2JS_CHUNK_SIZE=50         Files processed per chunk (default: 50)
    M2JS_SHOW_PROGRESS=true    Show progress bar for large projects (default: true)
    M2JS_MAX_FILE_SIZE=10      Max file size in MB (default: 10)

Configuration File (.m2jsrc):
  Create a .m2jsrc file in your project root for persistent settings.
  Run 'npx m2js --init-config' to generate an example configuration.

Examples:
  # Basic dead code analysis
  m2js src/**/*.ts --detect-unused
  
  # Analyze specific file with JSON output
  m2js src/utils.ts --detect-unused --format json
  
  # Analyze entire project
  m2js . --detect-unused
  
  # Analyze with custom performance settings
  M2JS_CHUNK_SIZE=100 M2JS_SHOW_PROGRESS=true m2js src --detect-unused
  
  # Generate configuration file
  npx m2js --init-config

Features:
  ✓ High-confidence removal suggestions with automated commands
  ! Medium-risk items flagged for manual review  
  !! High-risk items with detailed warnings
  Performance metrics and caching for large codebases
  Smart detection of public APIs, frameworks, and side-effects
`;
}
