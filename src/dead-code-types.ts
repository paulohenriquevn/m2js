/**
 * Dead Code Analysis Types for M2JS
 * Core interfaces for detecting unused exports
 */

export interface DeadExport {
  file: string;
  name: string;
  type: 'function' | 'class' | 'variable' | 'interface' | 'type';
  line: number;
  reason: string;
  confidence: 'high' | 'medium' | 'low';
  riskFactors: string[];
}

export interface ExportInfo {
  name: string;
  type: 'function' | 'class' | 'variable' | 'interface' | 'type';
  file: string;
  line: number;
  isDefault: boolean;
}

export interface ImportInfo {
  name: string;
  from: string;
  file: string;
  line: number;
  type: 'named' | 'default' | 'namespace';
}

export interface DeadCodeMetrics {
  totalFiles: number;
  totalExports: number;
  totalImports: number;
  deadExports: number;
  unusedImports: number;
  analysisTimeMs: number;
  estimatedSavingsKB: number;
}

export interface UnusedImport {
  file: string;
  name: string;
  from: string;
  line: number;
  type: 'named' | 'default' | 'namespace';
  reason: string;
  confidence: 'high' | 'medium' | 'low';
  riskFactors: string[];
}

export interface RemovalSuggestion {
  id: string;
  priority: 'high' | 'medium' | 'low';
  safety: 'safe' | 'review-needed' | 'risky';
  action: string;
  file: string;
  line: number;
  impact: string;
  type: 'remove-export' | 'remove-import' | 'refactor';
  command?: string;
  warnings?: string[];
}

export interface DeadCodeReport {
  deadExports: DeadExport[];
  unusedImports: UnusedImport[];
  suggestions: RemovalSuggestion[];
  metrics: DeadCodeMetrics;
  projectPath: string;
}

export interface DeadCodeOptions {
  format: 'table' | 'json';
  includeMetrics: boolean;
  includeSuggestions?: boolean;
}
