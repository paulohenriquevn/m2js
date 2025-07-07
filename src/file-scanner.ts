import { promises as fs } from 'fs';
import path from 'path';
import { ScanResult } from './types';

const SUPPORTED_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx'];
const IGNORED_DIRECTORIES = [
  'node_modules',
  'dist',
  'build',
  '.next',
  'coverage',
  '.git',
  '.svn',
  '.hg',
  'vendor',
  'target',
  'bin',
  'obj'
];
const IGNORED_FILE_PATTERNS = [
  '.d.ts',        // TypeScript declaration files
  '.test.',       // Test files
  '.spec.',       // Spec files
  '.min.',        // Minified files
  '.bundle.',     // Bundle files
];

export async function scanDirectory(
  directoryPath: string
): Promise<ScanResult> {
  const absolutePath = path.resolve(directoryPath);
  const result: ScanResult = {
    files: [],
    totalFound: 0,
    errors: [],
  };

  try {
    // Verify directory exists and is accessible
    const stats = await fs.stat(absolutePath);
    if (!stats.isDirectory()) {
      throw new Error(`Path is not a directory: ${absolutePath}`);
    }
  } catch (error) {
    result.errors.push(`Cannot access directory: ${(error as Error).message}`);
    return result;
  }

  try {
    const files = await scanDirectoryRecursive(absolutePath);
    result.files = files;
    result.totalFound = files.length;
  } catch (error) {
    result.errors.push(`Error scanning directory: ${(error as Error).message}`);
  }

  return result;
}

async function scanDirectoryRecursive(dirPath: string): Promise<string[]> {
  const foundFiles: string[] = [];

  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);

      if (entry.isDirectory()) {
        // Skip ignored directories
        if (!shouldIgnoreDirectory(entry.name)) {
          const subFiles = await scanDirectoryRecursive(fullPath);
          foundFiles.push(...subFiles);
        }
      } else if (entry.isFile()) {
        // Check if file has supported extension and is not ignored
        if (isSupportedFile(entry.name) && !shouldIgnoreFile(entry.name)) {
          foundFiles.push(fullPath);
        }
      }
    }
  } catch (error) {
    // Log error but continue scanning other directories
    console.warn(
      `Warning: Could not scan directory ${dirPath}: ${(error as Error).message}`
    );
  }

  return foundFiles;
}

function isSupportedFile(fileName: string): boolean {
  const extension = path.extname(fileName).toLowerCase();
  return SUPPORTED_EXTENSIONS.includes(extension);
}

function shouldIgnoreDirectory(dirName: string): boolean {
  return IGNORED_DIRECTORIES.includes(dirName) || dirName.startsWith('.');
}

function shouldIgnoreFile(fileName: string): boolean {
  // Check against ignored patterns
  for (const pattern of IGNORED_FILE_PATTERNS) {
    if (fileName.includes(pattern)) {
      return true;
    }
  }
  return false;
}

export function isDirectory(targetPath: string): Promise<boolean> {
  return fs
    .stat(path.resolve(targetPath))
    .then(stats => stats.isDirectory())
    .catch(() => false);
}

export function isFile(targetPath: string): Promise<boolean> {
  return fs
    .stat(path.resolve(targetPath))
    .then(stats => stats.isFile())
    .catch(() => false);
}
