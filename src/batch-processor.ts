import { promises as fs } from 'fs';
import path from 'path';
import { BatchOptions, BatchResult } from './types';
import { parseFile } from './parser';
import { generateMarkdown, getOutputPath } from './generator';

export async function processBatch(
  options: BatchOptions
): Promise<BatchResult> {
  const result: BatchResult = {
    totalFiles: 0,
    successCount: 0,
    failureCount: 0,
    processedFiles: [],
  };

  // Import scanDirectory here to avoid circular dependencies
  const { scanDirectory } = await import('./file-scanner');

  // Discover files in directory
  const scanResult = await scanDirectory(options.sourceDirectory);

  if (scanResult.errors.length > 0) {
    throw new Error(`Directory scan failed: ${scanResult.errors.join(', ')}`);
  }

  if (scanResult.files.length === 0) {
    throw new Error(
      `No TypeScript/JavaScript files found in directory: ${options.sourceDirectory}`
    );
  }

  result.totalFiles = scanResult.files.length;

  // Process each file sequentially
  for (let i = 0; i < scanResult.files.length; i++) {
    const filePath = scanResult.files[i];
    const fileName = path.basename(filePath);

    // Call progress callback if provided
    if (options.onProgress) {
      options.onProgress(i + 1, result.totalFiles, fileName);
    }

    try {
      await processIndividualFile(filePath, options.includeComments || false);

      const outputPath = getOutputPath(filePath);
      result.processedFiles.push({
        filePath,
        success: true,
        outputPath,
      });
      result.successCount++;

      // Call file processed callback if provided
      if (options.onFileProcessed) {
        options.onFileProcessed(filePath, true);
      }
    } catch (error) {
      const errorMessage = (error as Error).message;
      result.processedFiles.push({
        filePath,
        success: false,
        error: errorMessage,
      });
      result.failureCount++;

      // Call file processed callback if provided
      if (options.onFileProcessed) {
        options.onFileProcessed(filePath, false, errorMessage);
      }

      // Continue processing other files (don't fail the entire batch)
      continue;
    }
  }

  return result;
}

async function processIndividualFile(
  filePath: string,
  includeComments: boolean
): Promise<void> {
  // Read file content
  const content = await fs.readFile(filePath, 'utf-8');

  // Parse with existing pipeline
  const parsedFile = parseFile(filePath, content);

  // Generate markdown with existing generator
  const markdown = generateMarkdown(parsedFile, {
    includeComments,
  });

  // Write output file co-located with source
  const outputPath = getOutputPath(filePath);
  await fs.writeFile(outputPath, markdown, 'utf-8');
}
