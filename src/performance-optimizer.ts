/**
 * Performance Optimizer for M2JS Dead Code Analysis
 * Provides caching, parallelization, and memory optimization
 */

import { readFileSync, statSync } from 'fs';
import path from 'path';
import { ExportInfo, ImportInfo } from './dead-code-types';

/**
 * File parsing cache with timestamp validation
 */
interface FileCacheEntry {
  content: string;
  exports: ExportInfo[];
  imports: ImportInfo[];
  mtime: number;  // Last modified time
  size: number;   // File size for quick validation
}

/**
 * Performance optimization options
 */
export interface PerformanceOptions {
  enableCache: boolean;
  maxCacheSize: number;  // Max number of files to cache
  chunkSize: number;     // Number of files to process in each chunk
  showProgress: boolean;
}

/**
 * Progress callback function
 */
export type ProgressCallback = (processed: number, total: number, currentFile: string) => void;

/**
 * File parsing cache manager
 */
class FileParsingCache {
  private cache = new Map<string, FileCacheEntry>();
  private accessOrder: string[] = [];
  private maxSize: number;

  constructor(maxSize: number = 1000) {
    this.maxSize = maxSize;
  }

  /**
   * Check if file is cached and still valid
   */
  isValid(filePath: string): boolean {
    const cached = this.cache.get(filePath);
    if (!cached) return false;

    try {
      const stats = statSync(filePath);
      return cached.mtime === stats.mtimeMs && cached.size === stats.size;
    } catch {
      // File no longer exists
      this.cache.delete(filePath);
      return false;
    }
  }

  /**
   * Get cached parsing results
   */
  get(filePath: string): { exports: ExportInfo[]; imports: ImportInfo[] } | null {
    if (!this.isValid(filePath)) return null;

    const cached = this.cache.get(filePath)!;
    
    // Update access order (LRU)
    this.updateAccessOrder(filePath);
    
    return {
      exports: [...cached.exports],  // Return copies to prevent mutation
      imports: [...cached.imports]
    };
  }

  /**
   * Cache parsing results
   */
  set(
    filePath: string, 
    content: string, 
    exports: ExportInfo[], 
    imports: ImportInfo[]
  ): void {
    try {
      const stats = statSync(filePath);
      
      // Evict old entries if cache is full
      while (this.cache.size >= this.maxSize && this.accessOrder.length > 0) {
        const oldest = this.accessOrder.shift()!;
        this.cache.delete(oldest);
      }

      this.cache.set(filePath, {
        content,
        exports: [...exports],  // Store copies
        imports: [...imports],
        mtime: stats.mtimeMs,
        size: stats.size
      });

      this.updateAccessOrder(filePath);
    } catch {
      // Ignore cache errors
    }
  }

  /**
   * Update LRU access order
   */
  private updateAccessOrder(filePath: string): void {
    // Remove from current position
    const index = this.accessOrder.indexOf(filePath);
    if (index !== -1) {
      this.accessOrder.splice(index, 1);
    }
    
    // Add to end (most recently used)
    this.accessOrder.push(filePath);
  }

  /**
   * Clear cache
   */
  clear(): void {
    this.cache.clear();
    this.accessOrder = [];
  }

  /**
   * Get cache statistics
   */
  getStats(): { size: number; hitRate?: number } {
    return {
      size: this.cache.size
    };
  }
}

/**
 * Performance-optimized file processor
 */
export class OptimizedFileProcessor {
  private cache: FileParsingCache;
  private options: PerformanceOptions;
  private cacheHits = 0;
  private cacheMisses = 0;

  constructor(options: Partial<PerformanceOptions> = {}) {
    this.options = {
      enableCache: true,
      maxCacheSize: 1000,
      chunkSize: 50,
      showProgress: false,
      ...options
    };

    this.cache = new FileParsingCache(this.options.maxCacheSize);
  }

  /**
   * Process files with optimization
   */
  async processFiles(
    files: string[],
    parseFunction: (filePath: string, content: string) => { exports: ExportInfo[]; imports: ImportInfo[] },
    progressCallback?: ProgressCallback
  ): Promise<{ allExports: ExportInfo[]; allImports: ImportInfo[] }> {
    const allExports: ExportInfo[] = [];
    const allImports: ImportInfo[] = [];

    // Process files in chunks to manage memory
    for (let i = 0; i < files.length; i += this.options.chunkSize) {
      const chunk = files.slice(i, i + this.options.chunkSize);
      
      for (const filePath of chunk) {
        try {
          let result: { exports: ExportInfo[]; imports: ImportInfo[] };

          // Try cache first
          if (this.options.enableCache) {
            const cached = this.cache.get(filePath);
            if (cached) {
              result = cached;
              this.cacheHits++;
            } else {
              const content = readFileSync(filePath, 'utf-8');
              result = parseFunction(filePath, content);
              this.cache.set(filePath, content, result.exports, result.imports);
              this.cacheMisses++;
            }
          } else {
            const content = readFileSync(filePath, 'utf-8');
            result = parseFunction(filePath, content);
            this.cacheMisses++;
          }

          allExports.push(...result.exports);
          allImports.push(...result.imports);

          // Report progress
          if (progressCallback) {
            progressCallback(i + chunk.indexOf(filePath) + 1, files.length, filePath);
          }
        } catch (error) {
          throw new Error(
            `Failed to process file ${filePath}: ${(error as Error).message}`
          );
        }
      }

      // Force garbage collection opportunity between chunks
      if (global.gc && chunk.length === this.options.chunkSize) {
        global.gc();
      }
    }

    return { allExports, allImports };
  }

  /**
   * Get performance statistics
   */
  getPerformanceStats(): {
    cacheHits: number;
    cacheMisses: number;
    hitRate: number;
    cacheSize: number;
  } {
    const total = this.cacheHits + this.cacheMisses;
    return {
      cacheHits: this.cacheHits,
      cacheMisses: this.cacheMisses,
      hitRate: total > 0 ? this.cacheHits / total : 0,
      cacheSize: this.cache.getStats().size
    };
  }

  /**
   * Clear all caches
   */
  clearCache(): void {
    this.cache.clear();
    this.cacheHits = 0;
    this.cacheMisses = 0;
  }
}

/**
 * Memory-optimized data structures
 */
export class OptimizedDataStructures {
  /**
   * Create efficient lookup map for imports
   */
  static createImportLookupMap(imports: ImportInfo[]): Map<string, Set<string>> {
    const importMap = new Map<string, Set<string>>();

    for (const imp of imports) {
      // Resolve relative import paths efficiently
      const resolvedPath = this.resolveImportPath(imp.file, imp.from);
      let importNames = importMap.get(resolvedPath);
      
      if (!importNames) {
        importNames = new Set();
        importMap.set(resolvedPath, importNames);
      }

      if (imp.type === 'default') {
        importNames.add('default');
      } else if (imp.type === 'namespace') {
        importNames.add('*');
      } else {
        importNames.add(imp.name);
      }
    }

    return importMap;
  }

  /**
   * Efficient import path resolution with caching
   */
  private static pathCache = new Map<string, string>();

  private static resolveImportPath(fromFile: string, importPath: string): string {
    const cacheKey = `${fromFile}:${importPath}`;
    const cached = this.pathCache.get(cacheKey);
    if (cached) return cached;

    const fromDir = path.dirname(fromFile);
    const resolved = path.resolve(fromDir, importPath);
    const result = path.resolve(resolved);
    
    // Cache the result
    this.pathCache.set(cacheKey, result);
    return result;
  }

  /**
   * Batch process exports for dead code detection
   */
  static findDeadExportsBatch(
    exports: ExportInfo[],
    importMap: Map<string, Set<string>>,
    batchSize: number = 100
  ): ExportInfo[] {
    const deadExports: ExportInfo[] = [];

    for (let i = 0; i < exports.length; i += batchSize) {
      const batch = exports.slice(i, i + batchSize);
      
      for (const exp of batch) {
        const normalizedPath = path.resolve(exp.file);
        const importedNames = importMap.get(normalizedPath);

        const isImported =
          importedNames &&
          (importedNames.has(exp.name) ||
            importedNames.has('*') ||
            (exp.isDefault && importedNames.has('default')));

        if (!isImported) {
          deadExports.push(exp);
        }
      }
    }

    return deadExports;
  }
}

/**
 * Progress indicator for CLI
 */
export class ProgressIndicator {
  private startTime: number;
  private lastUpdate: number = 0;

  constructor() {
    this.startTime = Date.now();
  }

  /**
   * Update progress with throttling
   */
  update(processed: number, total: number, currentFile: string): void {
    const now = Date.now();
    
    // Throttle updates to avoid overwhelming the console
    if (now - this.lastUpdate < 100 && processed < total) return;
    
    this.lastUpdate = now;

    const percentage = Math.round((processed / total) * 100);
    const elapsed = (now - this.startTime) / 1000;
    const estimatedTotal = (elapsed / processed) * total;
    const remaining = Math.max(0, estimatedTotal - elapsed);

    const fileName = path.basename(currentFile);
    const progress = '█'.repeat(Math.floor(percentage / 2)) + '░'.repeat(50 - Math.floor(percentage / 2));
    
    process.stdout.write(
      `\r🔍 [${progress}] ${percentage}% (${processed}/${total}) ${fileName} - ${remaining.toFixed(1)}s remaining`
    );

    if (processed === total) {
      process.stdout.write(`\n✅ Analysis complete in ${elapsed.toFixed(1)}s\n`);
    }
  }
}