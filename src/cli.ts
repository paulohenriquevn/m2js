#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { promises as fs } from 'fs';
import path from 'path';
import { parseFile } from './parser';
import { generateMarkdown, getOutputPath } from './generator';
import { CliOptions } from './types';
import { isDirectory, isFile } from './file-scanner';
import { processBatch } from './batch-processor';

const program = new Command();

program
  .name('m2js')
  .description('Transform TypeScript/JavaScript code into LLM-friendly Markdown summaries')
  .version('1.0.0')
  .argument('<path>', 'TypeScript/JavaScript file or directory to convert')
  .option('-o, --output <file>', 'specify output file (only for single files)')
  .option('--no-comments', 'skip comment extraction')
  .action(async (inputPath: string, options: CliOptions) => {
    try {
      await processInput(inputPath, options);
    } catch (error) {
      console.error(chalk.red(`❌ Error: ${(error as Error).message}`));
      process.exit(1);
    }
  });

async function processInput(inputPath: string, options: CliOptions): Promise<void> {
  const resolvedPath = path.resolve(inputPath);

  // Determine if input is a file or directory
  const isDir = await isDirectory(resolvedPath);
  const isFileTarget = await isFile(resolvedPath);

  if (!isDir && !isFileTarget) {
    throw new Error(`Path not found: ${resolvedPath}`);
  }

  if (isDir) {
    // Process directory
    await processDirectory(resolvedPath, options);
  } else {
    // Process single file
    await processSingleFile(resolvedPath, options);
  }
}

async function processSingleFile(inputPath: string, options: CliOptions): Promise<void> {
  const resolvedPath = path.resolve(inputPath);
  
  console.log(chalk.blue(`📁 Reading ${path.basename(resolvedPath)}...`));
  console.log(chalk.blue(`🗂️  Resolving file path...`));
  
  try {
    await fs.access(resolvedPath);
  } catch {
    throw new Error(`File not found: ${resolvedPath}`);
  }

  if (!resolvedPath.match(/\.(ts|tsx|js|jsx)$/)) {
    throw new Error(`Unsupported file type: ${resolvedPath}. Only .ts, .tsx, .js, .jsx are supported.`);
  }

  console.log(chalk.blue('🔍 Parsing with Babel...'));
  const content = await fs.readFile(resolvedPath, 'utf-8');
  const parsedFile = parseFile(resolvedPath, content);

  // Enhanced messages with export counting
  const { exportMetadata } = parsedFile;
  if (exportMetadata.totalFunctions > 0) {
    console.log(chalk.blue(`✨ Extracting exported functions (${exportMetadata.totalFunctions} found)...`));
  }
  if (exportMetadata.totalClasses > 0) {
    console.log(chalk.blue(`🏗️  Extracting exported classes (${exportMetadata.totalClasses} found)...`));
  }
  if (parsedFile.functions.length > 0 || parsedFile.classes.length > 0) {
    console.log(chalk.blue('📝 Extracting JSDoc comments...'));
  }
  
  if (parsedFile.functions.length === 0 && parsedFile.classes.length === 0) {
    console.log(chalk.yellow('⚠️  No exported functions or classes found'));
    return;
  }

  console.log(chalk.blue('📋 Organizing hierarchical structure...'));
  console.log(chalk.blue('📄 Generating enhanced markdown...'));
  const markdown = generateMarkdown(parsedFile, {
    includeComments: !options.noComments,
    outputPath: options.output
  });

  const outputPath = getOutputPath(resolvedPath, options.output);
  await fs.writeFile(outputPath, markdown, 'utf-8');

  console.log(chalk.green(`✅ Created ${path.basename(outputPath)} with enhanced context`));
  
  // Enhanced statistics with path information
  // Show path information
  const cwd = process.cwd();
  let displayPath = parsedFile.filePath;
  if (parsedFile.filePath.startsWith(cwd)) {
    displayPath = path.relative(cwd, parsedFile.filePath);
    if (!displayPath.startsWith('.')) {
      displayPath = `./${displayPath}`;
    }
  }
  console.log(chalk.cyan(`📁 Source: ${displayPath}`));
  
  // Show export metadata
  const exportStats: string[] = [];
  if (exportMetadata.totalFunctions > 0) {
    exportStats.push(`${exportMetadata.totalFunctions} function${exportMetadata.totalFunctions === 1 ? '' : 's'}`);
  }
  if (exportMetadata.totalClasses > 0) {
    exportStats.push(`${exportMetadata.totalClasses} class${exportMetadata.totalClasses === 1 ? '' : 'es'}`);
  }
  if (exportMetadata.hasDefaultExport) {
    exportStats.push(`1 default ${exportMetadata.defaultExportType}`);
  }
  console.log(chalk.cyan(`📦 Exports: ${exportStats.join(', ')}`));
  
  // Generate structure preview
  console.log(chalk.cyan('📋 Generated enhanced structure:'));
  if (parsedFile.functions.length > 0) {
    console.log(chalk.cyan(`    📁 Functions (${parsedFile.functions.length})`));
  }
  if (parsedFile.classes.length > 0) {
    console.log(chalk.cyan(`    📁 Classes (${parsedFile.classes.length})`));
    parsedFile.classes.forEach(cls => {
      const publicMethodsCount = cls.methods.filter(m => !m.isPrivate).length;
      console.log(chalk.cyan(`      └── ${cls.name} (${publicMethodsCount} methods)`));
    });
  }
  
  const inputStats = await fs.stat(resolvedPath);
  const outputStats = await fs.stat(outputPath);
  const reduction = Math.round((1 - outputStats.size / inputStats.size) * 100);
  
  console.log(chalk.cyan(`💾 Saved to ${path.basename(outputPath)} (${inputStats.size} → ${outputStats.size} bytes, ${reduction}% reduction)`));
}

async function processDirectory(directoryPath: string, options: CliOptions): Promise<void> {
  console.log(chalk.blue(`📁 Scanning directory ${path.basename(directoryPath)}...`));
  
  // Warn about --output option for directories
  if (options.output) {
    console.log(chalk.yellow('⚠️  Note: --output option is ignored for directory processing'));
  }

  const batchOptions = {
    sourceDirectory: directoryPath,
    includeComments: !options.noComments,
    onProgress: (current: number, total: number, fileName: string) => {
      console.log(chalk.blue(`📊 Processing files (${current}/${total}): ${fileName}`));
    },
    onFileProcessed: (filePath: string, success: boolean, error?: string) => {
      if (success) {
        console.log(chalk.green(`✅ Generated ${path.basename(filePath, path.extname(filePath))}.md`));
      } else {
        console.log(chalk.red(`❌ Failed ${path.basename(filePath)}: ${error}`));
      }
    }
  };

  const result = await processBatch(batchOptions);

  // Display final summary
  console.log(chalk.cyan('📋 Batch processing complete:'));
  console.log(chalk.cyan(`📊 Total files: ${result.totalFiles}`));
  console.log(chalk.green(`✅ Successful: ${result.successCount}`));
  
  if (result.failureCount > 0) {
    console.log(chalk.red(`❌ Failed: ${result.failureCount}`));
    
    // List failed files
    const failedFiles = result.processedFiles
      .filter(f => !f.success)
      .map(f => `  • ${path.basename(f.filePath)}: ${f.error}`)
      .join('\n');
    
    if (failedFiles) {
      console.log(chalk.red('Failed files:'));
      console.log(chalk.red(failedFiles));
    }
  }
  
  console.log(chalk.cyan(`🎯 Generated ${result.successCount} markdown files in the same directory as source files`));
}

if (require.main === module) {
  program.parse();
}