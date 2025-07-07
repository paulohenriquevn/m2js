/**
 * Git Integration for Graph-Deep Diff Analysis
 * Handles git operations for baseline comparisons
 */

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { tmpdir } from 'os';
import { GitComparisonOptions, GitFileChange } from './graph-diff-types';

/**
 * Git integration class for handling repository operations
 */
export class GitIntegrator {
  private repoPath: string;

  constructor(repoPath: string) {
    this.repoPath = repoPath;
    this.validateGitRepo();
  }

  /**
   * Validate that the path is a git repository
   */
  private validateGitRepo(): void {
    try {
      execSync('git rev-parse --git-dir', { 
        cwd: this.repoPath, 
        stdio: 'pipe' 
      });
    } catch {
      throw new Error(`Not a git repository: ${this.repoPath}`);
    }
  }

  /**
   * Get the current git reference (branch or commit)
   */
  getCurrentRef(): string {
    try {
      const result = execSync('git rev-parse --abbrev-ref HEAD', {
        cwd: this.repoPath,
        encoding: 'utf8',
        stdio: 'pipe'
      });
      return result.trim();
    } catch {
      // Fallback to commit hash
      try {
        const result = execSync('git rev-parse HEAD', {
          cwd: this.repoPath,
          encoding: 'utf8',
          stdio: 'pipe'
        });
        return result.trim().substring(0, 8);
      } catch {
        return 'unknown';
      }
    }
  }

  /**
   * Check if a git reference exists
   */
  refExists(ref: string): boolean {
    try {
      execSync(`git rev-parse --verify ${ref}`, {
        cwd: this.repoPath,
        stdio: 'pipe'
      });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get list of files at a specific git reference
   */
  getFilesAtRef(ref: string, patterns?: string[]): string[] {
    try {
      // Get list of files at the reference
      let cmd = `git ls-tree -r --name-only ${ref}`;
      
      const result = execSync(cmd, {
        cwd: this.repoPath,
        encoding: 'utf8',
        stdio: 'pipe'
      });

      let files = result.trim().split('\n').filter(f => f.length > 0);
      
      // Filter by TypeScript/JavaScript files
      files = files.filter(file => 
        /\.(ts|tsx|js|jsx)$/.test(file) && 
        !file.includes('node_modules') &&
        !file.includes('.d.ts')
      );

      // Apply additional patterns if provided
      if (patterns && patterns.length > 0) {
        const includePatterns = patterns.filter(p => !p.startsWith('!'));
        const excludePatterns = patterns.filter(p => p.startsWith('!')).map(p => p.slice(1));
        
        if (includePatterns.length > 0) {
          files = files.filter(file => 
            includePatterns.some(pattern => this.matchPattern(file, pattern))
          );
        }
        
        if (excludePatterns.length > 0) {
          files = files.filter(file => 
            !excludePatterns.some(pattern => this.matchPattern(file, pattern))
          );
        }
      }

      return files.map(file => path.join(this.repoPath, file));
    } catch (error) {
      throw new Error(`Failed to get files at ref ${ref}: ${(error as Error).message}`);
    }
  }

  /**
   * Get file content at a specific git reference
   */
  getFileContentAtRef(filePath: string, ref: string): string {
    try {
      const relativePath = path.relative(this.repoPath, filePath);
      const result = execSync(`git show ${ref}:${relativePath}`, {
        cwd: this.repoPath,
        encoding: 'utf8',
        stdio: 'pipe'
      });
      return result;
    } catch {
      // File might not exist at this ref
      return '';
    }
  }

  /**
   * Create temporary directory with files from a git reference
   */
  async createTempWorkspace(ref: string, patterns?: string[]): Promise<string> {
    const tempDir = path.join(tmpdir(), `m2js-workspace-${ref}-${Date.now()}`);
    
    try {
      // Create temp directory
      fs.mkdirSync(tempDir, { recursive: true });
      
      // Get files at the reference
      const files = this.getFilesAtRef(ref, patterns);
      
      // Copy files to temp directory maintaining structure
      for (const filePath of files) {
        const relativePath = path.relative(this.repoPath, filePath);
        const tempFilePath = path.join(tempDir, relativePath);
        const tempFileDir = path.dirname(tempFilePath);
        
        // Create directory structure
        fs.mkdirSync(tempFileDir, { recursive: true });
        
        // Get file content at ref and write to temp location
        const content = this.getFileContentAtRef(filePath, ref);
        if (content) {
          fs.writeFileSync(tempFilePath, content, 'utf8');
        }
      }
      
      return tempDir;
    } catch (error) {
      // Cleanup on error
      if (fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
      throw new Error(`Failed to create workspace for ${ref}: ${(error as Error).message}`);
    }
  }

  /**
   * Get changes between two references
   */
  getChangesBetween(baseRef: string, currentRef: string = 'HEAD'): GitFileChange[] {
    try {
      const cmd = `git diff --name-status --numstat ${baseRef}...${currentRef}`;
      const result = execSync(cmd, {
        cwd: this.repoPath,
        encoding: 'utf8',
        stdio: 'pipe'
      });

      if (!result.trim()) {
        return [];
      }

      const changes: GitFileChange[] = [];
      const lines = result.trim().split('\n');
      
      for (const line of lines) {
        const parts = line.split('\t');
        if (parts.length >= 3) {
          const [linesAdded, linesDeleted, filePath] = parts;
          
          // Skip non-JS/TS files
          if (!/\.(ts|tsx|js|jsx)$/.test(filePath)) {
            continue;
          }
          
          let changeType: GitFileChange['changeType'] = 'modified';
          if (linesAdded === '-' && linesDeleted === '-') {
            changeType = 'renamed';
          } else if (linesDeleted === '0') {
            changeType = 'added';
          } else if (linesAdded === '0') {
            changeType = 'deleted';
          }

          changes.push({
            path: filePath,
            changeType,
            linesAdded: linesAdded === '-' ? 0 : parseInt(linesAdded, 10),
            linesDeleted: linesDeleted === '-' ? 0 : parseInt(linesDeleted, 10),
          });
        }
      }

      return changes;
    } catch (error) {
      throw new Error(`Failed to get changes between ${baseRef} and ${currentRef}: ${(error as Error).message}`);
    }
  }

  /**
   * Get list of recent commits
   */
  getRecentCommits(count: number = 10): Array<{ hash: string; message: string; date: string }> {
    try {
      const result = execSync(`git log --oneline -${count} --pretty=format:"%H|%s|%ai"`, {
        cwd: this.repoPath,
        encoding: 'utf8',
        stdio: 'pipe'
      });

      return result.trim().split('\n').map(line => {
        const [hash, message, date] = line.split('|');
        return { hash: hash.substring(0, 8), message, date };
      });
    } catch {
      return [];
    }
  }

  /**
   * Resolve reference to actual commit hash
   */
  resolveRef(ref: string): string {
    try {
      // Handle special references
      if (ref === 'previous') {
        return this.getPreviousCommit();
      }
      
      const result = execSync(`git rev-parse ${ref}`, {
        cwd: this.repoPath,
        encoding: 'utf8',
        stdio: 'pipe'
      });
      return result.trim();
    } catch {
      throw new Error(`Invalid git reference: ${ref}`);
    }
  }

  /**
   * Get the previous commit hash
   */
  private getPreviousCommit(): string {
    try {
      const result = execSync('git rev-parse HEAD~1', {
        cwd: this.repoPath,
        encoding: 'utf8',
        stdio: 'pipe'
      });
      return result.trim();
    } catch {
      throw new Error('No previous commit found');
    }
  }

  /**
   * Simple pattern matching for file paths
   */
  private matchPattern(filePath: string, pattern: string): boolean {
    // Convert glob pattern to regex
    const regexPattern = pattern
      .replace(/\*\*/g, '.*')
      .replace(/\*/g, '[^/]*')
      .replace(/\?/g, '[^/]');
    
    const regex = new RegExp(`^${regexPattern}$`);
    return regex.test(filePath);
  }

  /**
   * Cleanup temporary workspace
   */
  cleanupWorkspace(workspacePath: string): void {
    try {
      if (fs.existsSync(workspacePath)) {
        fs.rmSync(workspacePath, { recursive: true, force: true });
      }
    } catch {
      // Ignore cleanup errors
    }
  }

  /**
   * Check if working directory is clean
   */
  isWorkingDirectoryClean(): boolean {
    try {
      const result = execSync('git status --porcelain', {
        cwd: this.repoPath,
        encoding: 'utf8',
        stdio: 'pipe'
      });
      return result.trim() === '';
    } catch {
      return false;
    }
  }

  /**
   * Get current branch name
   */
  getCurrentBranch(): string {
    try {
      const result = execSync('git branch --show-current', {
        cwd: this.repoPath,
        encoding: 'utf8',
        stdio: 'pipe'
      });
      return result.trim();
    } catch {
      return 'unknown';
    }
  }
}