/**
 * Duplicate Code Analyzer - Integration with jscpd
 * Provides LLM-friendly duplicate code detection and reporting
 */

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { tmpdir } from 'os';
import {
  DuplicateCodeOptions,
  DuplicateCodeReport,
  DuplicateBlock,
  DuplicateLocation,
  RefactoringSuggestion,
  DuplicateCodeMetrics,
  JscpdResult,
  JscpdDuplicate,
  JscpdConfig,
} from './duplicate-code-types';

/**
 * Analyze duplicate code in the provided files using jscpd
 */
export async function analyzeDuplicateCode(
  files: string[],
  options: DuplicateCodeOptions = {}
): Promise<DuplicateCodeReport> {
  if (!files || files.length === 0) {
    throw new Error('No files provided for duplicate code analysis');
  }

  const startTime = Date.now();
  
  // Determine project path
  const projectPath = path.dirname(path.resolve(files[0]));
  
  // Set default options
  const analysisOptions: Required<DuplicateCodeOptions> = {
    minLines: options.minLines ?? 5,
    minTokens: options.minTokens ?? 50,
    format: options.format ?? 'table',
    includeContext: options.includeContext ?? true,
    includeSuggestions: options.includeSuggestions ?? true,
    maxFiles: options.maxFiles ?? 1000,
    ignore: options.ignore ?? ['node_modules', 'dist', 'build', '*.test.ts', '*.spec.ts'],
  };

  try {
    // Run jscpd analysis
    const jscpdResult = await runJscpdAnalysis(files, analysisOptions, projectPath);
    
    // Process jscpd results into our format
    const duplicates = processJscpdResults(jscpdResult, projectPath);
    
    // Generate refactoring suggestions
    const suggestions = generateRefactoringSuggestions(duplicates);
    
    // Calculate metrics
    const metrics = calculateMetrics(files, duplicates, Date.now() - startTime);
    
    // Analyze files that were processed
    const analyzedFiles = files.filter(file => fs.existsSync(file));
    const skippedFiles = files.filter(file => !fs.existsSync(file));

    return {
      projectPath,
      options: analysisOptions,
      duplicates,
      suggestions,
      metrics,
      timestamp: new Date(),
      analyzedFiles,
      skippedFiles,
    };
  } catch (error) {
    throw new Error(`Duplicate code analysis failed: ${(error as Error).message}`);
  }
}

/**
 * Run jscpd analysis and return parsed results
 */
async function runJscpdAnalysis(
  files: string[],
  options: Required<DuplicateCodeOptions>,
  projectPath: string
): Promise<JscpdResult> {
  // Create temporary output file for jscpd JSON results
  const tempDir = tmpdir();
  const outputFile = path.join(tempDir, `jscpd-${Date.now()}.json`);
  
  // Create jscpd config
  const jscpdConfig = {
    minLines: options.minLines,
    minTokens: options.minTokens,
    format: ['typescript', 'javascript'],
    ignore: options.ignore,
    reporters: ['json'],
    output: path.dirname(outputFile),
  };

  // Create temporary config file
  const configFile = path.join(tempDir, `jscpd-config-${Date.now()}.json`);
  fs.writeFileSync(configFile, JSON.stringify(jscpdConfig, null, 2));

  try {
    // Determine if we're analyzing files or directories
    const targets = files.length === 1 && fs.statSync(files[0]).isDirectory() 
      ? [files[0]] 
      : [path.dirname(files[0])];

    // Build jscpd command
    const jscpdCmd = [
      'npx jscpd',
      ...targets.map(t => `"${t}"`),
      `--config "${configFile}"`,
      '-r json',
      `--output "${path.dirname(outputFile)}"`,
      '--silent'
    ].join(' ');

    // Execute jscpd
    execSync(jscpdCmd, { 
      cwd: projectPath,
      stdio: 'pipe',
      timeout: 120000 // 2 minute timeout
    });

    // Read and parse results - jscpd creates jscpd-report.json in the output directory
    const reportFile = path.join(path.dirname(outputFile), 'jscpd-report.json');
    
    if (!fs.existsSync(reportFile)) {
      // No duplicates found
      return {
        duplicates: [],
        statistics: {
          total: { files: files.length, lines: 0, tokens: 0 },
          clones: { lines: 0, tokens: 0, duplicatedLines: 0, percentage: 0 },
          formats: {}
        }
      };
    }

    const resultContent = fs.readFileSync(reportFile, 'utf-8');
    const result: JscpdResult = JSON.parse(resultContent);

    // Cleanup temporary files
    fs.unlinkSync(reportFile);
    fs.unlinkSync(configFile);

    return result;
  } catch (error) {
    // Cleanup on error
    try {
      const reportFile = path.join(path.dirname(outputFile), 'jscpd-report.json');
      if (fs.existsSync(reportFile)) fs.unlinkSync(reportFile);
      if (fs.existsSync(configFile)) fs.unlinkSync(configFile);
    } catch {
      // Ignore cleanup errors
    }

    throw new Error(`jscpd execution failed: ${(error as Error).message}`);
  }
}

/**
 * Process jscpd results into our duplicate block format
 */
function processJscpdResults(
  jscpdResult: JscpdResult,
  projectPath: string
): DuplicateBlock[] {
  const duplicates: DuplicateBlock[] = [];
  const processedFragments = new Set<string>();

  jscpdResult.duplicates.forEach((duplicate, index) => {
    // Use the actual fragment content as key
    const fragmentKey = duplicate.fragment || `${duplicate.lines}-${index}`;
    
    // Skip if we've already processed this fragment pattern
    if (processedFragments.has(fragmentKey)) {
      return;
    }
    processedFragments.add(fragmentKey);

    // Get code content from the jscpd fragment or extract from file
    const code = duplicate.fragment || extractCodeFromFile(
      duplicate.firstFile.name,
      duplicate.firstFile.start,
      duplicate.firstFile.end
    );

    // Calculate similarity (jscpd finds exact matches, so 100%)
    const similarity = 100;

    // Determine duplicate type
    const type = similarity === 100 ? 'exact' as const : 'similar' as const;

    // Get lines and tokens from jscpd data or calculate
    const lines = duplicate.lines || (duplicate.firstFile.end - duplicate.firstFile.start + 1);
    const tokens = duplicate.tokens || 50; // fallback

    // Calculate complexity based on lines and tokens
    const complexity = calculateComplexity(lines, tokens);

    const locations: DuplicateLocation[] = [
      {
        file: path.relative(projectPath, duplicate.firstFile.name),
        startLine: duplicate.firstFile.start,
        endLine: duplicate.firstFile.end,
        context: extractContext(duplicate.firstFile.name, duplicate.firstFile.start),
      },
      {
        file: path.relative(projectPath, duplicate.secondFile.name),
        startLine: duplicate.secondFile.start,
        endLine: duplicate.secondFile.end,
        context: extractContext(duplicate.secondFile.name, duplicate.secondFile.start),
      },
    ];

    duplicates.push({
      id: `dup-${index + 1}`,
      code,
      lines,
      tokens,
      locations,
      similarity,
      type,
      complexity,
    });
  });

  return duplicates;
}

/**
 * Extract code content from file between specified lines
 */
function extractCodeFromFile(filePath: string, startLine: number, endLine: number): string {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    return lines
      .slice(startLine - 1, endLine)
      .join('\n')
      .trim();
  } catch {
    return 'Could not read file content';
  }
}

/**
 * Extract context information (function/class name) around the duplicate
 */
function extractContext(filePath: string, lineNumber: number): string | undefined {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    
    // Look backwards from the duplicate line to find function/class context
    for (let i = lineNumber - 2; i >= Math.max(0, lineNumber - 20); i--) {
      const line = lines[i]?.trim();
      if (!line) continue;
      
      // Look for function declarations
      const functionMatch = line.match(/(?:function|const|let|var)\s+(\w+)|(\w+)\s*[:=]\s*(?:function|\()/);
      if (functionMatch) {
        return `function ${functionMatch[1] || functionMatch[2]}`;
      }
      
      // Look for class declarations
      const classMatch = line.match(/class\s+(\w+)/);
      if (classMatch) {
        return `class ${classMatch[1]}`;
      }
      
      // Look for method declarations
      const methodMatch = line.match(/(\w+)\s*\([^)]*\)\s*[:{]/);
      if (methodMatch) {
        return `method ${methodMatch[1]}`;
      }
    }
    
    return undefined;
  } catch {
    return undefined;
  }
}

/**
 * Calculate complexity score based on lines and tokens
 */
function calculateComplexity(lines: number, tokens: number): number {
  // Simple complexity calculation
  // More lines and tokens = higher complexity
  const lineScore = Math.min(lines / 10, 10); // Max 10 points for lines
  const tokenScore = Math.min(tokens / 100, 10); // Max 10 points for tokens
  return Math.round((lineScore + tokenScore) / 2);
}

/**
 * Generate refactoring suggestions based on duplicate blocks
 */
function generateRefactoringSuggestions(duplicates: DuplicateBlock[]): RefactoringSuggestion[] {
  const suggestions: RefactoringSuggestion[] = [];

  duplicates.forEach((duplicate, index) => {
    if (duplicate.locations.length < 2) return;

    // Determine suggestion type based on duplicate characteristics
    const suggestionType = determineSuggestionType(duplicate);
    
    // Calculate priority based on complexity and number of duplications
    const priority = calculatePriority(duplicate);
    
    // Estimate effort based on complexity
    const effort = duplicate.complexity > 7 ? 'high' : duplicate.complexity > 4 ? 'medium' : 'low';
    
    // Calculate potential impact
    const potentialSavings = (duplicate.locations.length - 1) * duplicate.lines;
    const impact = `Remove ${potentialSavings} lines, reduce duplication by ${duplicate.locations.length}x`;

    // Generate suggested name
    const suggestedName = generateSuggestedName(duplicate, suggestionType);

    suggestions.push({
      id: `suggestion-${index + 1}`,
      priority,
      type: suggestionType,
      description: generateSuggestionDescription(suggestionType, duplicate),
      effort,
      impact,
      affectedBlocks: [duplicate.id],
      suggestedName,
      example: generateRefactoringExample(duplicate, suggestionType, suggestedName),
    });
  });

  // Sort by priority and impact
  return suggestions.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });
}

/**
 * Determine the best refactoring approach for a duplicate
 */
function determineSuggestionType(duplicate: DuplicateBlock): RefactoringSuggestion['type'] {
  // Analyze the code content to suggest appropriate refactoring
  const code = duplicate.code.toLowerCase();
  
  if (code.includes('class ') || code.includes('interface ')) {
    return 'extract-class';
  }
  
  if (code.includes('function ') || code.includes('=>') || duplicate.lines > 15) {
    return 'extract-function';
  }
  
  if (duplicate.locations.length > 3 && duplicate.lines > 20) {
    return 'extract-module';
  }
  
  return 'extract-function'; // Default
}

/**
 * Calculate suggestion priority
 */
function calculatePriority(duplicate: DuplicateBlock): RefactoringSuggestion['priority'] {
  const score = duplicate.complexity + (duplicate.locations.length * 2) + (duplicate.lines / 5);
  
  if (score > 15) return 'high';
  if (score > 8) return 'medium';
  return 'low';
}

/**
 * Generate suggested name for extracted code
 */
function generateSuggestedName(duplicate: DuplicateBlock, type: RefactoringSuggestion['type']): string {
  const context = duplicate.locations[0]?.context;
  const baseName = context?.includes('function') ? 'sharedLogic' : 'commonCode';
  
  switch (type) {
    case 'extract-function':
      return `extract${capitalize(baseName)}`;
    case 'extract-class':
      return `${capitalize(baseName)}Helper`;
    case 'extract-module':
      return `${baseName}Module`;
    default:
      return baseName;
  }
}

/**
 * Generate description for refactoring suggestion
 */
function generateSuggestionDescription(
  type: RefactoringSuggestion['type'], 
  duplicate: DuplicateBlock
): string {
  const locations = duplicate.locations.length;
  const lines = duplicate.lines;
  
  switch (type) {
    case 'extract-function':
      return `Extract ${lines} lines of duplicated code into a reusable function. Found in ${locations} locations.`;
    case 'extract-class':
      return `Extract duplicated class/interface pattern into a base class or shared interface. Found in ${locations} locations.`;
    case 'extract-module':
      return `Extract large duplicated block (${lines} lines) into a separate module. Found in ${locations} locations.`;
    case 'parameterize':
      return `Parameterize similar code blocks to reduce duplication. Found in ${locations} locations.`;
    default:
      return `Refactor duplicated code found in ${locations} locations.`;
  }
}

/**
 * Generate example of refactored code
 */
function generateRefactoringExample(
  duplicate: DuplicateBlock,
  type: RefactoringSuggestion['type'],
  suggestedName: string
): string {
  const firstLines = duplicate.code.split('\n').slice(0, 3).join('\n');
  
  switch (type) {
    case 'extract-function':
      return `// Before: ${duplicate.lines} lines duplicated\n// After:\nfunction ${suggestedName}() {\n  ${firstLines}\n  // ... rest of logic\n}\n\n// Usage:\n${suggestedName}();`;
    case 'extract-class':
      return `// Before: ${duplicate.lines} lines duplicated\n// After:\nclass ${suggestedName} {\n  ${firstLines}\n  // ... rest of logic\n}\n\n// Usage:\nconst helper = new ${suggestedName}();`;
    default:
      return `// Extract into: ${suggestedName}\n${firstLines}\n// ... rest of logic`;
  }
}

/**
 * Calculate analysis metrics
 */
function calculateMetrics(
  files: string[],
  duplicates: DuplicateBlock[],
  analysisTimeMs: number
): DuplicateCodeMetrics {
  // Calculate total lines across all files
  let totalLines = 0;
  let totalFiles = 0;
  
  files.forEach(file => {
    try {
      if (fs.existsSync(file)) {
        const content = fs.readFileSync(file, 'utf-8');
        totalLines += content.split('\n').length;
        totalFiles++;
      }
    } catch {
      // Skip files that can't be read
    }
  });

  const duplicatedLines = duplicates.reduce((sum, dup) => 
    sum + (dup.lines * (dup.locations.length - 1)), 0
  );
  
  const duplicationPercentage = totalLines > 0 ? (duplicatedLines / totalLines) * 100 : 0;
  
  const averageDuplicateSize = duplicates.length > 0 
    ? duplicates.reduce((sum, dup) => sum + dup.lines, 0) / duplicates.length 
    : 0;
  
  const largestDuplicateSize = duplicates.length > 0 
    ? Math.max(...duplicates.map(dup => dup.lines)) 
    : 0;

  // Find files with most duplications
  const fileOccurrences = new Map<string, number>();
  duplicates.forEach(dup => {
    dup.locations.forEach(loc => {
      fileOccurrences.set(loc.file, (fileOccurrences.get(loc.file) || 0) + 1);
    });
  });
  
  const mostDuplicatedFiles = Array.from(fileOccurrences.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([file]) => file);

  const potentialSavings = duplicatedLines;

  return {
    totalFiles,
    totalLines,
    totalDuplicates: duplicates.length,
    duplicatedLines,
    duplicationPercentage,
    averageDuplicateSize,
    largestDuplicateSize,
    mostDuplicatedFiles,
    analysisTimeMs,
    potentialSavings,
  };
}

/**
 * Utility function to capitalize first letter
 */
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}