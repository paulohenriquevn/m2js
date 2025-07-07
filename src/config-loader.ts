/**
 * Configuration Loader for M2JS
 * Loads settings from .m2jsrc files and environment variables
 */

import { readFileSync, existsSync } from 'fs';
import path from 'path';
import { PerformanceOptions } from './performance-optimizer';

/**
 * M2JS Configuration interface
 */
export interface M2JSConfig {
  // Dead code analysis settings
  deadCode: {
    enableCache: boolean;
    maxCacheSize: number;
    chunkSize: number;
    showProgress: boolean;
    format: 'table' | 'json';
    includeMetrics: boolean;
    includeSuggestions: boolean;
  };

  // Duplicate code analysis settings
  duplicateCode: {
    minLines: number;
    minTokens: number;
    ignorePatterns: string[];
    includeContext: boolean;
    includeSuggestions: boolean;
    format: 'table' | 'json';
  };

  // Code extraction settings
  extraction: {
    includeComments: boolean;
    includeUsageExamples: boolean;
    includeBusinessContext: boolean;
    includeArchitectureInsights: boolean;
    includeSemanticAnalysis: boolean;
  };

  // File processing settings
  files: {
    extensions: string[];
    ignorePatterns: string[];
    maxFileSize: number; // in MB
  };

  // Output settings
  output: {
    format: 'markdown' | 'json';
    preserveStructure: boolean;
  };
}

/**
 * Default configuration
 */
const DEFAULT_CONFIG: M2JSConfig = {
  deadCode: {
    enableCache: true,
    maxCacheSize: 1000,
    chunkSize: 50,
    showProgress: true,
    format: 'table',
    includeMetrics: true,
    includeSuggestions: true,
  },
  duplicateCode: {
    minLines: 5,
    minTokens: 50,
    ignorePatterns: [
      '**/*.test.*',
      '**/*.spec.*',
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
    ],
    includeContext: true,
    includeSuggestions: true,
    format: 'table',
  },
  extraction: {
    includeComments: true,
    includeUsageExamples: false,
    includeBusinessContext: false,
    includeArchitectureInsights: false,
    includeSemanticAnalysis: false,
  },
  files: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    ignorePatterns: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/.next/**',
      '**/coverage/**',
      '**/*.test.*',
      '**/*.spec.*',
    ],
    maxFileSize: 10, // 10MB
  },
  output: {
    format: 'markdown',
    preserveStructure: true,
  },
};

/**
 * Configuration loader class
 */
export class ConfigLoader {
  private static configCache: M2JSConfig | null = null;

  /**
   * Load configuration from multiple sources with precedence:
   * 1. Environment variables (highest priority)
   * 2. .m2jsrc in current directory
   * 3. .m2jsrc in home directory
   * 4. Default configuration (lowest priority)
   */
  static loadConfig(projectPath?: string): M2JSConfig {
    // Return cached config if available
    if (this.configCache) {
      return this.configCache;
    }

    let config = { ...DEFAULT_CONFIG };

    // Try to load from project directory
    if (projectPath) {
      const projectConfigPath = path.join(projectPath, '.m2jsrc');
      config = this.mergeConfigs(
        config,
        this.loadConfigFile(projectConfigPath)
      );
    }

    // Try to load from current directory
    const localConfigPath = path.join(process.cwd(), '.m2jsrc');
    config = this.mergeConfigs(config, this.loadConfigFile(localConfigPath));

    // Try to load from home directory
    const homeConfigPath = path.join(require('os').homedir(), '.m2jsrc');
    config = this.mergeConfigs(config, this.loadConfigFile(homeConfigPath));

    // Apply environment variable overrides
    config = this.applyEnvironmentOverrides(config);

    // Cache the final configuration
    this.configCache = config;
    return config;
  }

  /**
   * Load configuration from a specific file
   */
  private static loadConfigFile(filePath: string): Partial<M2JSConfig> | null {
    if (!existsSync(filePath)) {
      return null;
    }

    try {
      const content = readFileSync(filePath, 'utf-8');

      // Support both JSON and JavaScript module formats
      if (filePath.endsWith('.json') || content.trim().startsWith('{')) {
        return JSON.parse(content);
      } else {
        // For .m2jsrc files, expect JSON format
        return JSON.parse(content);
      }
    } catch (error) {
      console.warn(
        `Warning: Failed to load config from ${filePath}: ${(error as Error).message}`
      );
      return null;
    }
  }

  /**
   * Deep merge two configuration objects
   */
  private static mergeConfigs(
    base: M2JSConfig,
    override: Partial<M2JSConfig> | null
  ): M2JSConfig {
    if (!override) return base;

    const merged = { ...base };

    // Deep merge each section
    if (override.deadCode) {
      merged.deadCode = { ...merged.deadCode, ...override.deadCode };
    }
    if (override.extraction) {
      merged.extraction = { ...merged.extraction, ...override.extraction };
    }
    if (override.files) {
      merged.files = { ...merged.files, ...override.files };
    }
    if (override.output) {
      merged.output = { ...merged.output, ...override.output };
    }

    return merged;
  }

  /**
   * Apply environment variable overrides
   */
  private static applyEnvironmentOverrides(config: M2JSConfig): M2JSConfig {
    const env = process.env;
    const result = { ...config };

    // Dead code analysis settings
    if (env.M2JS_CACHE_ENABLED !== undefined) {
      result.deadCode.enableCache = env.M2JS_CACHE_ENABLED === 'true';
    }
    if (env.M2JS_CACHE_SIZE !== undefined) {
      result.deadCode.maxCacheSize =
        parseInt(env.M2JS_CACHE_SIZE, 10) || result.deadCode.maxCacheSize;
    }
    if (env.M2JS_CHUNK_SIZE !== undefined) {
      result.deadCode.chunkSize =
        parseInt(env.M2JS_CHUNK_SIZE, 10) || result.deadCode.chunkSize;
    }
    if (env.M2JS_SHOW_PROGRESS !== undefined) {
      result.deadCode.showProgress = env.M2JS_SHOW_PROGRESS === 'true';
    }
    if (env.M2JS_FORMAT !== undefined) {
      result.deadCode.format =
        (env.M2JS_FORMAT as 'table' | 'json') || result.deadCode.format;
    }

    // File processing settings
    if (env.M2JS_MAX_FILE_SIZE !== undefined) {
      result.files.maxFileSize =
        parseInt(env.M2JS_MAX_FILE_SIZE, 10) || result.files.maxFileSize;
    }
    if (env.M2JS_IGNORE_PATTERNS !== undefined) {
      result.files.ignorePatterns = env.M2JS_IGNORE_PATTERNS.split(',').map(p =>
        p.trim()
      );
    }

    return result;
  }

  /**
   * Convert config to performance options
   */
  static toPerformanceOptions(config: M2JSConfig): PerformanceOptions {
    return {
      enableCache: config.deadCode.enableCache,
      maxCacheSize: config.deadCode.maxCacheSize,
      chunkSize: config.deadCode.chunkSize,
      showProgress: config.deadCode.showProgress,
    };
  }

  /**
   * Clear cached configuration (useful for testing)
   */
  static clearCache(): void {
    this.configCache = null;
  }

  /**
   * Generate example configuration file content
   */
  static generateExampleConfig(): string {
    return JSON.stringify(
      {
        // Dead code analysis settings
        deadCode: {
          enableCache: true,
          maxCacheSize: 1000,
          chunkSize: 50,
          showProgress: true,
          format: 'table',
          includeMetrics: true,
          includeSuggestions: true,
        },

        // Code extraction settings
        extraction: {
          includeComments: true,
          includeUsageExamples: false,
          includeBusinessContext: false,
          includeArchitectureInsights: false,
          includeSemanticAnalysis: false,
        },

        // File processing settings
        files: {
          extensions: ['.ts', '.tsx', '.js', '.jsx'],
          ignorePatterns: [
            '**/node_modules/**',
            '**/dist/**',
            '**/build/**',
            '**/.next/**',
            '**/coverage/**',
            '**/*.test.*',
            '**/*.spec.*',
          ],
          maxFileSize: 10,
        },

        // Output settings
        output: {
          format: 'markdown',
          preserveStructure: true,
        },
      },
      null,
      2
    );
  }
}
