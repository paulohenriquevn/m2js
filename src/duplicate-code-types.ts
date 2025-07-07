/**
 * Types for duplicate code detection integration with jscpd
 */

export interface DuplicateCodeOptions {
  /** Minimum number of lines to consider as duplicate */
  minLines?: number;
  /** Minimum number of tokens to consider as duplicate */
  minTokens?: number;
  /** Output format for reporting */
  format?: 'table' | 'json';
  /** Include code context in output */
  includeContext?: boolean;
  /** Show refactoring suggestions */
  includeSuggestions?: boolean;
  /** Maximum files to analyze (performance limit) */
  maxFiles?: number;
  /** File patterns to ignore */
  ignore?: string[];
}

export interface DuplicateBlock {
  /** Unique identifier for this duplicate block */
  id: string;
  /** Source code content of the duplicate */
  code: string;
  /** Number of lines in the duplicate */
  lines: number;
  /** Number of tokens in the duplicate */
  tokens: number;
  /** File locations where this duplicate appears */
  locations: DuplicateLocation[];
  /** Similarity percentage between locations */
  similarity: number;
  /** Type of duplicate (exact, similar, structural) */
  type: 'exact' | 'similar' | 'structural';
  /** Estimated complexity/impact score */
  complexity: number;
}

export interface DuplicateLocation {
  /** File path relative to project root */
  file: string;
  /** Starting line number */
  startLine: number;
  /** Ending line number */
  endLine: number;
  /** Starting column */
  startColumn?: number;
  /** Ending column */
  endColumn?: number;
  /** Function/class context if available */
  context?: string;
}

export interface RefactoringSuggestion {
  /** Unique ID for this suggestion */
  id: string;
  /** Priority level for refactoring */
  priority: 'high' | 'medium' | 'low';
  /** Type of refactoring suggested */
  type: 'extract-function' | 'extract-class' | 'extract-module' | 'parameterize';
  /** Description of the suggested refactoring */
  description: string;
  /** Estimated effort required */
  effort: 'low' | 'medium' | 'high';
  /** Estimated impact of refactoring */
  impact: string;
  /** Code blocks that would be affected */
  affectedBlocks: string[];
  /** Suggested new function/class name */
  suggestedName?: string;
  /** Example of refactored code */
  example?: string;
}

export interface DuplicateCodeMetrics {
  /** Total number of files analyzed */
  totalFiles: number;
  /** Total lines of code analyzed */
  totalLines: number;
  /** Number of duplicate blocks found */
  totalDuplicates: number;
  /** Total lines that are duplicated */
  duplicatedLines: number;
  /** Percentage of code that is duplicated */
  duplicationPercentage: number;
  /** Average duplicate block size */
  averageDuplicateSize: number;
  /** Largest duplicate block size */
  largestDuplicateSize: number;
  /** Files with most duplications */
  mostDuplicatedFiles: string[];
  /** Analysis time in milliseconds */
  analysisTimeMs: number;
  /** Potential lines saved by refactoring */
  potentialSavings: number;
}

export interface DuplicateCodeReport {
  /** Project path that was analyzed */
  projectPath: string;
  /** Analysis options used */
  options: DuplicateCodeOptions;
  /** All duplicate blocks found */
  duplicates: DuplicateBlock[];
  /** Refactoring suggestions */
  suggestions: RefactoringSuggestion[];
  /** Analysis metrics */
  metrics: DuplicateCodeMetrics;
  /** Timestamp of analysis */
  timestamp: Date;
  /** Files that were analyzed */
  analyzedFiles: string[];
  /** Files that were skipped/ignored */
  skippedFiles: string[];
}

export interface JscpdConfig {
  /** Minimum lines for duplication */
  minLines: number;
  /** Minimum tokens for duplication */
  minTokens: number;
  /** File extensions to analyze */
  formats: string[];
  /** Patterns to ignore */
  ignore: string[];
  /** Output reporters */
  reporters: string[];
  /** Absolute paths mode */
  absolute: boolean;
  /** Blame authors */
  blame: boolean;
  /** Silent mode */
  silent: boolean;
}

export interface JscpdResult {
  /** Detected duplicates */
  duplicates: JscpdDuplicate[];
  /** Overall statistics */
  statistics: JscpdStatistics;
}

export interface JscpdDuplicate {
  /** Format/language of the duplicate */
  format: string;
  /** Number of lines in duplicate */
  lines: number;
  /** Code fragment content */
  fragment: string;
  /** Number of tokens */
  tokens: number;
  /** First location */
  firstFile: JscpdFile;
  /** Second location */
  secondFile: JscpdFile;
}

export interface JscpdFile {
  /** File name */
  name: string;
  /** Starting line */
  start: number;
  /** Ending line */
  end: number;
  /** Start location details */
  startLoc?: {
    line: number;
    column: number;
    position: number;
  };
  /** End location details */
  endLoc?: {
    line: number;
    column: number;
    position: number;
  };
}

export interface JscpdFragment {
  /** Number of lines in fragment */
  lines: number;
  /** Number of tokens in fragment */
  tokens: number;
}

export interface JscpdStatistics {
  /** Total files analyzed */
  total: {
    files: number;
    lines: number;
    tokens: number;
  };
  /** Clones statistics */
  clones: {
    lines: number;
    tokens: number;
    duplicatedLines: number;
    percentage: number;
  };
  /** Formats analyzed */
  formats: Record<string, {
    lines: number;
    tokens: number;
    files: number;
  }>;
}