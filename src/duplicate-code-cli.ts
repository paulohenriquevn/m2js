/**
 * CLI Integration for Duplicate Code Analysis
 * Handles --detect-duplicates flag and LLM-friendly output formatting
 */

import chalk from 'chalk';
import { DuplicateCodeReport, DuplicateCodeOptions } from './duplicate-code-types';
import { analyzeDuplicateCode } from './duplicate-code-analyzer';

/**
 * Execute duplicate code analysis and output LLM-friendly results
 */
export async function executeDuplicateCodeAnalysis(
  files: string[],
  options: DuplicateCodeOptions = {
    format: 'table',
    includeContext: true,
    includeSuggestions: true,
  }
): Promise<void> {
  try {
    console.log(chalk.cyan.bold('Duplicate Code Analysis Report'));
    console.log(chalk.dim(`Analyzing ${files.length} files...\n`));

    const report = await analyzeDuplicateCode(files, options);

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
  report: DuplicateCodeReport,
  options: DuplicateCodeOptions
): void {
  const { duplicates, suggestions, metrics, projectPath } = report;

  // Project info
  console.log(chalk.dim(`Project: ${projectPath}`));
  console.log(chalk.dim(`Files analyzed: ${metrics.totalFiles}`));
  console.log(chalk.dim(`Analysis time: ${metrics.analysisTimeMs}ms\n`));

  // Summary section
  if (duplicates.length === 0) {
    console.log(chalk.green.bold('Great! No duplicate code found!'));
    console.log(chalk.green('All code appears to be unique.\n'));
  } else {
    console.log(chalk.red.bold(`Duplicate Code Found (${duplicates.length} blocks):`));
    console.log(chalk.gray('┌─────────────────────────────────────────────────┐'));

    duplicates.forEach((duplicate, index) => {
      const isLast = index === duplicates.length - 1;
      const complexity = getComplexityIndicator(duplicate.complexity);
      const duplicateType = chalk.cyan(`[${duplicate.type.toUpperCase()}]`);
      
      console.log(chalk.gray('│ ') + chalk.yellow(`Block ${duplicate.id}`) + ' ' + duplicateType + ' ' + complexity);
      console.log(chalk.gray('│ ') + chalk.gray('└─ ') + chalk.white(`${duplicate.lines} lines, ${duplicate.tokens} tokens`));
      console.log(chalk.gray('│    ') + chalk.dim(`${duplicate.similarity}% similarity`));
      
      // Show locations
      duplicate.locations.forEach((location, locIndex) => {
        const isLastLocation = locIndex === duplicate.locations.length - 1;
        const locationPrefix = isLastLocation ? '└─' : '├─';
        console.log(chalk.gray('│    ') + chalk.gray(locationPrefix) + ' ' + chalk.blue(`${location.file}:${location.startLine}-${location.endLine}`));
        
        if (location.context) {
          const contextPrefix = isLastLocation ? '   ' : '│  ';
          console.log(chalk.gray('│    ') + chalk.gray(contextPrefix) + ' ' + chalk.dim(`in ${location.context}`));
        }
      });

      // Show code preview if requested
      if (options.includeContext && duplicate.code) {
        const preview = getCodePreview(duplicate.code);
        console.log(chalk.gray('│    ') + chalk.dim('Code preview:'));
        console.log(chalk.gray('│    ') + chalk.gray(preview));
      }

      if (!isLast) {
        console.log(chalk.gray('│'));
      }
    });

    console.log(chalk.gray('└─────────────────────────────────────────────────┘\n'));
  }

  // Impact summary
  if (duplicates.length > 0) {
    console.log(chalk.blue.bold('Impact Analysis:'));
    console.log(chalk.blue(`• Total duplicated lines: ${metrics.duplicatedLines}`));
    console.log(chalk.blue(`• Duplication percentage: ${metrics.duplicationPercentage.toFixed(1)}%`));
    console.log(chalk.blue(`• Average duplicate size: ${Math.round(metrics.averageDuplicateSize)} lines`));
    console.log(chalk.blue(`• Largest duplicate: ${metrics.largestDuplicateSize} lines`));
    console.log(chalk.blue(`• Potential savings: ${metrics.potentialSavings} lines`));
    
    if (metrics.mostDuplicatedFiles.length > 0) {
      console.log(chalk.blue('• Most affected files:'));
      metrics.mostDuplicatedFiles.slice(0, 3).forEach(file => {
        console.log(chalk.blue(`  - ${file}`));
      });
    }
    console.log();
  }

  // Refactoring suggestions section
  if (
    options.includeSuggestions !== false &&
    suggestions &&
    suggestions.length > 0
  ) {
    console.log(chalk.blue.bold('Refactoring Suggestions:'));
    console.log(chalk.gray('┌─────────────────────────────────────────────────┐'));

    // Group suggestions by priority
    const highPriority = suggestions.filter(s => s.priority === 'high');
    const mediumPriority = suggestions.filter(s => s.priority === 'medium');
    const lowPriority = suggestions.filter(s => s.priority === 'low');

    // Show high priority suggestions first
    if (highPriority.length > 0) {
      console.log(chalk.gray('│ ') + chalk.red.bold('HIGH PRIORITY:'));
      highPriority.slice(0, 3).forEach((suggestion, index) => {
        const isLast = index === Math.min(2, highPriority.length - 1);
        outputSuggestion(suggestion, isLast);
      });

      if (highPriority.length > 3) {
        console.log(
          chalk.gray('│   ') +
            chalk.dim(`... and ${highPriority.length - 3} more high priority suggestions`)
        );
      }
      console.log(chalk.gray('│'));
    }

    // Show medium priority suggestions
    if (mediumPriority.length > 0) {
      console.log(chalk.gray('│ ') + chalk.yellow.bold('MEDIUM PRIORITY:'));
      mediumPriority.slice(0, 2).forEach((suggestion, index) => {
        const isLast = index === Math.min(1, mediumPriority.length - 1);
        outputSuggestion(suggestion, isLast);
      });

      if (mediumPriority.length > 2) {
        console.log(
          chalk.gray('│   ') +
            chalk.dim(`... and ${mediumPriority.length - 2} more medium priority suggestions`)
        );
      }
      console.log(chalk.gray('│'));
    }

    // Show count of low priority suggestions
    if (lowPriority.length > 0) {
      console.log(chalk.gray('│ ') + chalk.blue.bold('LOW PRIORITY:'));
      console.log(
        chalk.gray('│   ') +
          chalk.blue(`${lowPriority.length} additional suggestions available`)
      );
      console.log(
        chalk.gray('│   ') + chalk.blue('Run with --format json for complete list')
      );
    }

    console.log(chalk.gray('└─────────────────────────────────────────────────┘\n'));
  }

  // Next steps guidance
  if (duplicates.length > 0) {
    console.log(chalk.blue.bold('Recommended Next Steps:'));

    const highPrioritySuggestions = suggestions?.filter(s => s.priority === 'high') || [];
    const mediumPrioritySuggestions = suggestions?.filter(s => s.priority === 'medium') || [];

    if (highPrioritySuggestions.length > 0) {
      console.log(chalk.blue('1. Address high priority duplications first'));
      console.log(chalk.blue('2. Focus on extract-function refactoring for immediate wins'));
    }

    if (mediumPrioritySuggestions.length > 0) {
      console.log(chalk.blue('3. Plan medium priority refactoring in next sprint'));
      console.log(chalk.blue('4. Consider extract-class for larger duplications'));
    }

    if (metrics.duplicationPercentage > 10) {
      console.log(chalk.blue('5. Set up pre-commit hooks to prevent new duplications'));
      console.log(chalk.blue('6. Consider code review guidelines for duplication'));
    }

    console.log(chalk.blue('7. Re-run analysis after refactoring to track progress'));
  }
}

/**
 * Output a single suggestion
 */
function outputSuggestion(suggestion: any, isLast: boolean): void {
  const priorityIcon = getPriorityIcon(suggestion.priority);
  const effortBadge = getEffortBadge(suggestion.effort);

  console.log(
    chalk.gray('│ ') + priorityIcon + ' ' + chalk.white(suggestion.description)
  );
  console.log(
    chalk.gray('│   ') + chalk.dim(`Type: ${suggestion.type} | Effort: `) + effortBadge
  );
  console.log(chalk.gray('│   ') + chalk.dim(suggestion.impact));

  if (suggestion.suggestedName) {
    console.log(chalk.gray('│   ') + chalk.cyan(`Suggested name: ${suggestion.suggestedName}`));
  }

  if (suggestion.example) {
    const exampleLines = suggestion.example.split('\n').slice(0, 2);
    console.log(chalk.gray('│   ') + chalk.dim('Example:'));
    exampleLines.forEach(line => {
      console.log(chalk.gray('│   ') + chalk.gray(line));
    });
  }

  if (!isLast) {
    console.log(chalk.gray('│'));
  }
}

/**
 * Output report in JSON format
 */
function outputJsonFormat(report: DuplicateCodeReport): void {
  console.log(JSON.stringify(report, null, 2));
}

/**
 * Get complexity indicator
 */
function getComplexityIndicator(complexity: number): string {
  if (complexity >= 8) return chalk.red('[HIGH COMPLEXITY]');
  if (complexity >= 5) return chalk.yellow('[MEDIUM COMPLEXITY]');
  return chalk.green('[LOW COMPLEXITY]');
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
 * Get effort badge
 */
function getEffortBadge(effort: 'low' | 'medium' | 'high'): string {
  switch (effort) {
    case 'high':
      return chalk.red(effort);
    case 'medium':
      return chalk.yellow(effort);
    case 'low':
      return chalk.green(effort);
    default:
      return effort;
  }
}

/**
 * Get code preview (first few lines)
 */
function getCodePreview(code: string): string {
  const lines = code.split('\n');
  const preview = lines.slice(0, 2).join(' ').trim();
  return preview.length > 60 ? preview.substring(0, 60) + '...' : preview;
}

/**
 * Get help text for duplicate code analysis
 */
export function getDuplicateCodeHelpText(): string {
  return `
Duplicate Code Analysis:
  --detect-duplicates          Analyze code for duplicate blocks using jscpd
  --min-lines <number>         Minimum lines to consider duplicate (default: 5)
  --min-tokens <number>        Minimum tokens to consider duplicate (default: 50)
  --format <type>             Output format: table, json (default: table)

Configuration Options:
  Environment Variables:
    M2JS_DUPLICATE_MIN_LINES=5      Minimum lines for duplication
    M2JS_DUPLICATE_MIN_TOKENS=50    Minimum tokens for duplication
    M2JS_DUPLICATE_IGNORE=pattern   Comma-separated ignore patterns

Configuration File (.m2jsrc):
  Add duplicate detection settings to your .m2jsrc file:
  {
    "duplicateCode": {
      "minLines": 5,
      "minTokens": 50,
      "ignore": ["*.test.ts", "*.spec.ts"]
    }
  }

Examples:
  # Basic duplicate code analysis
  m2js src/ --detect-duplicates
  
  # Custom thresholds
  m2js src/ --detect-duplicates --min-lines 10 --min-tokens 100
  
  # JSON output for tool integration
  m2js src/ --detect-duplicates --format json
  
  # Analyze specific files
  m2js src/utils.ts src/helpers.ts --detect-duplicates

Features:
  ✓ Integration with jscpd for accurate detection
  ✓ LLM-friendly reporting with context and suggestions
  ✓ Intelligent refactoring recommendations
  ✓ Complexity analysis and priority scoring
  ✓ Support for TypeScript, JavaScript, JSX, TSX
  ✓ Configurable thresholds and ignore patterns
`;
}