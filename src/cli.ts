#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { promises as fs } from 'fs';
import path from 'path';
import { parseFile } from './parser';
import { generateMarkdown, getOutputPath } from './generator';
import { CliOptions } from './types';

const program = new Command();

program
  .name('m2js')
  .description('Transform TypeScript/JavaScript code into LLM-friendly Markdown summaries')
  .version('1.0.0')
  .argument('<file>', 'TypeScript or JavaScript file to convert')
  .option('-o, --output <file>', 'specify output file')
  .option('--no-comments', 'skip comment extraction')
  .action(async (filePath: string, options: CliOptions) => {
    try {
      await processFile(filePath, options);
    } catch (error) {
      console.error(chalk.red(`❌ Error: ${(error as Error).message}`));
      process.exit(1);
    }
  });

async function processFile(inputPath: string, options: CliOptions): Promise<void> {
  const resolvedPath = path.resolve(inputPath);
  
  console.log(chalk.blue(`📁 Reading ${path.basename(resolvedPath)}...`));
  
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

  console.log(chalk.blue('✨ Extracting exported functions...'));
  if (parsedFile.classes.length > 0) {
    console.log(chalk.blue('🏗️  Extracting exported classes...'));
  }
  if (parsedFile.functions.length > 0 || parsedFile.classes.length > 0) {
    console.log(chalk.blue('📝 Extracting JSDoc comments...'));
  }
  
  if (parsedFile.functions.length === 0 && parsedFile.classes.length === 0) {
    console.log(chalk.yellow('⚠️  No exported functions or classes found'));
    return;
  }

  console.log(chalk.blue('📄 Generating markdown...'));
  const markdown = generateMarkdown(parsedFile, {
    includeComments: !options.noComments,
    outputPath: options.output
  });

  const outputPath = getOutputPath(resolvedPath, options.output);
  await fs.writeFile(outputPath, markdown, 'utf-8');

  console.log(chalk.green(`✅ Created ${path.basename(outputPath)}`));
  
  // Enhanced statistics
  const totalMethods = parsedFile.classes.reduce((sum, cls) => sum + cls.methods.filter(m => !m.isPrivate).length, 0);
  const stats: string[] = [];
  
  if (parsedFile.functions.length > 0) {
    stats.push(`${parsedFile.functions.length} function${parsedFile.functions.length === 1 ? '' : 's'}`);
  }
  if (parsedFile.classes.length > 0) {
    stats.push(`${parsedFile.classes.length} class${parsedFile.classes.length === 1 ? '' : 'es'}`);
  }
  if (totalMethods > 0) {
    stats.push(`${totalMethods} method${totalMethods === 1 ? '' : 's'}`);
  }
  
  console.log(chalk.cyan(`📊 Found ${stats.join(', ')}`));
  
  const inputStats = await fs.stat(resolvedPath);
  const outputStats = await fs.stat(outputPath);
  const reduction = Math.round((1 - outputStats.size / inputStats.size) * 100);
  
  console.log(chalk.cyan(`💾 Saved to ${path.basename(outputPath)} (${inputStats.size} → ${outputStats.size} bytes, ${reduction}% reduction)`));
}

if (require.main === module) {
  program.parse();
}