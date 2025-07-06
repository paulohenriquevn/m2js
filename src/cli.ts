#!/usr/bin/env node

/* eslint-disable max-lines */
/* eslint-disable max-lines-per-function */
/* eslint-disable complexity */

import { Command } from 'commander';
import chalk from 'chalk';
import { promises as fs } from 'fs';
import path from 'path';
import { parseFile } from './parser';
import {
  generateMarkdown,
  getOutputPath,
  generateDependencyMarkdown,
} from './generator';
// import { generateEnhancedMarkdown } from './enhanced-generator';
// import { generateTemplate, listAvailableDomains } from './template-generator';
import { CliOptions, GraphOptions } from './types';
import { isDirectory, isFile, scanDirectory } from './file-scanner';
import { processBatch } from './batch-processor';
import { analyzeDependencies } from './dependency-analyzer';

const program = new Command();

program
  .name('m2js')
  .description(
    'Transform TypeScript/JavaScript code into LLM-friendly Markdown summaries'
  )
  .version('1.0.0')
  .argument('<path>', 'TypeScript/JavaScript file or directory to convert')
  .option('-o, --output <file>', 'specify output file (only for single files)')
  .option('--no-comments', 'skip comment extraction')
  .option(
    '--graph',
    'generate dependency graph analysis instead of code extraction'
  )
  .option(
    '--mermaid',
    'include Mermaid diagrams in graph output (use with --graph)'
  )
  .option(
    '--usage-examples',
    'include usage examples and patterns found in the code'
  )
  .option('--business-context', 'analyze and include business domain context')
  .option(
    '--architecture-insights',
    'analyze and include architectural patterns and decisions'
  )
  .option(
    '--semantic-analysis',
    'analyze business entities, relationships, and workflows'
  )
  .option(
    '--ai-enhanced',
    'enable all AI-friendly analysis features (business context, usage examples, architecture, semantic)'
  )
  .action(async (inputPath: string, options: CliOptions) => {
    try {
      await processInput(inputPath, options);
    } catch (error) {
      console.error(chalk.red(`❌ Error: ${(error as Error).message}`));
      process.exit(1);
    }
  });

async function processInput(
  inputPath: string,
  options: CliOptions
): Promise<void> {
  const resolvedPath = path.resolve(inputPath);

  // Determine if input is a file or directory
  const isDir = await isDirectory(resolvedPath);
  const isFileTarget = await isFile(resolvedPath);

  if (!isDir && !isFileTarget) {
    throw new Error(`Path not found: ${resolvedPath}`);
  }

  // Route to graph analysis if --graph option is used
  if (options.graph) {
    await processGraphAnalysis(resolvedPath, options);
    return;
  }

  if (isDir) {
    // Process directory
    await processDirectory(resolvedPath, options);
  } else {
    // Process single file
    await processSingleFile(resolvedPath, options);
  }
}

async function processSingleFile(
  inputPath: string,
  options: CliOptions
): Promise<void> {
  const resolvedPath = path.resolve(inputPath);

  console.log(chalk.blue(`📁 Reading ${path.basename(resolvedPath)}...`));
  console.log(chalk.blue(`🗂️  Resolving file path...`));

  try {
    await fs.access(resolvedPath);
  } catch {
    throw new Error(`File not found: ${resolvedPath}`);
  }

  if (!resolvedPath.match(/\.(ts|tsx|js|jsx)$/)) {
    throw new Error(
      `Unsupported file type: ${resolvedPath}. Only .ts, .tsx, .js, .jsx are supported.`
    );
  }

  console.log(chalk.blue('🔍 Parsing with Babel...'));
  const content = await fs.readFile(resolvedPath, 'utf-8');
  const parsedFile = parseFile(resolvedPath, content);

  // Enhanced messages with export counting
  const { exportMetadata } = parsedFile;
  if (exportMetadata.totalFunctions > 0) {
    console.log(
      chalk.blue(
        `✨ Extracting exported functions (${exportMetadata.totalFunctions} found)...`
      )
    );
  }
  if (exportMetadata.totalClasses > 0) {
    console.log(
      chalk.blue(
        `🏗️  Extracting exported classes (${exportMetadata.totalClasses} found)...`
      )
    );
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

  // Check if AI enhancements are requested
  const needsEnhancement =
    options.businessContext ||
    options.usageExamples ||
    options.architectureInsights ||
    options.semanticAnalysis ||
    options.aiEnhanced;

  let markdown: string;

  if (needsEnhancement) {
    // Enhanced generation temporarily disabled due to build issues
    console.log(
      chalk.yellow('⚠️  Enhanced analysis features temporarily disabled')
    );
    console.log(chalk.blue('📄 Generating standard markdown...'));
    markdown = generateMarkdown(parsedFile);
  } else {
    markdown = generateMarkdown(parsedFile);
  }

  const outputPath = getOutputPath(resolvedPath, options.output);
  await fs.writeFile(outputPath, markdown, 'utf-8');

  console.log(
    chalk.green(`✅ Created ${path.basename(outputPath)} with enhanced context`)
  );

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
    exportStats.push(
      `${exportMetadata.totalFunctions} function${exportMetadata.totalFunctions === 1 ? '' : 's'}`
    );
  }
  if (exportMetadata.totalClasses > 0) {
    exportStats.push(
      `${exportMetadata.totalClasses} class${exportMetadata.totalClasses === 1 ? '' : 'es'}`
    );
  }
  if (exportMetadata.hasDefaultExport) {
    exportStats.push(`1 default ${exportMetadata.defaultExportType}`);
  }
  console.log(chalk.cyan(`📦 Exports: ${exportStats.join(', ')}`));

  // Generate structure preview
  console.log(chalk.cyan('📋 Generated enhanced structure:'));
  if (parsedFile.functions.length > 0) {
    console.log(
      chalk.cyan(`    📁 Functions (${parsedFile.functions.length})`)
    );
  }
  if (parsedFile.classes.length > 0) {
    console.log(chalk.cyan(`    📁 Classes (${parsedFile.classes.length})`));
    parsedFile.classes.forEach(cls => {
      const publicMethodsCount = cls.methods.filter(m => !m.isPrivate).length;
      console.log(
        chalk.cyan(`      └── ${cls.name} (${publicMethodsCount} methods)`)
      );
    });
  }

  const inputStats = await fs.stat(resolvedPath);
  const outputStats = await fs.stat(outputPath);
  const reduction = Math.round((1 - outputStats.size / inputStats.size) * 100);

  console.log(
    chalk.cyan(
      `💾 Saved to ${path.basename(outputPath)} (${inputStats.size} → ${outputStats.size} bytes, ${reduction}% reduction)`
    )
  );
}

async function processDirectory(
  directoryPath: string,
  options: CliOptions
): Promise<void> {
  console.log(
    chalk.blue(`📁 Scanning directory ${path.basename(directoryPath)}...`)
  );

  // Warn about --output option for directories
  if (options.output) {
    console.log(
      chalk.yellow(
        '⚠️  Note: --output option is ignored for directory processing'
      )
    );
  }

  const batchOptions = {
    sourceDirectory: directoryPath,
    includeComments: !options.noComments,
    onProgress: (current: number, total: number, fileName: string): void => {
      console.log(
        chalk.blue(`📊 Processing files (${current}/${total}): ${fileName}`)
      );
    },
    onFileProcessed: (
      filePath: string,
      success: boolean,
      error?: string
    ): void => {
      if (success) {
        console.log(
          chalk.green(
            `✅ Generated ${path.basename(filePath, path.extname(filePath))}.md`
          )
        );
      } else {
        console.log(
          chalk.red(`❌ Failed ${path.basename(filePath)}: ${error}`)
        );
      }
    },
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

  console.log(
    chalk.cyan(
      `🎯 Generated ${result.successCount} markdown files in the same directory as source files`
    )
  );
}

async function processGraphAnalysis(
  inputPath: string,
  options: CliOptions
): Promise<void> {
  const resolvedPath = path.resolve(inputPath);

  console.log(chalk.blue('📊 Starting dependency graph analysis...'));

  // Check if --mermaid option was used without --graph
  if (options.mermaid && !options.graph) {
    console.log(
      chalk.yellow('⚠️  --mermaid option requires --graph. Ignoring --mermaid.')
    );
  }

  // Determine input type and scan for files
  let files: string[] = [];

  const isDir = await isDirectory(resolvedPath);
  const isFileTarget = await isFile(resolvedPath);

  if (isDir) {
    console.log(
      chalk.blue(`📁 Scanning directory: ${path.basename(resolvedPath)}`)
    );
    const scanResult = await scanDirectory(resolvedPath);
    files = scanResult.files;

    if (files.length === 0) {
      throw new Error(
        `No TypeScript/JavaScript files found in directory: ${resolvedPath}`
      );
    }

    console.log(
      chalk.blue(`🔍 Found ${files.length} TypeScript/JavaScript files`)
    );
  } else if (isFileTarget) {
    // Single file - warn that graph analysis works better with directories
    console.log(
      chalk.yellow(
        '⚠️  Graph analysis works best with directories. Analyzing single file...'
      )
    );
    files = [resolvedPath];
  } else {
    throw new Error(`Path not found: ${resolvedPath}`);
  }

  // Analyze dependencies
  console.log(chalk.blue('🔗 Analyzing dependencies...'));

  const graphOptions: GraphOptions = {
    includeMermaid: options.mermaid || false,
    includeExternalDeps: true,
    detectCircular: true,
  };

  try {
    const dependencyGraph = analyzeDependencies(files, graphOptions);

    console.log(chalk.blue('📄 Generating dependency graph markdown...'));
    const markdown = generateDependencyMarkdown(dependencyGraph, graphOptions);

    // Determine output path
    let outputPath: string;
    if (options.output) {
      outputPath = options.output;
    } else {
      const baseName = isDir
        ? path.basename(resolvedPath)
        : path.basename(resolvedPath, path.extname(resolvedPath));
      outputPath = path.join(
        isDir ? resolvedPath : path.dirname(resolvedPath),
        `${baseName}-dependencies.md`
      );
    }

    // Write output
    await fs.writeFile(outputPath, markdown, 'utf-8');

    console.log(chalk.green(`✅ Dependency graph generated successfully!`));

    // Display summary
    const { metrics } = dependencyGraph;
    console.log(chalk.cyan('📋 Analysis Summary:'));
    console.log(chalk.cyan(`📊 Total modules analyzed: ${metrics.totalNodes}`));
    console.log(chalk.cyan(`🔗 Total dependencies: ${metrics.totalEdges}`));
    console.log(
      chalk.cyan(`📦 Internal dependencies: ${metrics.internalDependencies}`)
    );
    console.log(
      chalk.cyan(`🌐 External dependencies: ${metrics.externalDependencies}`)
    );

    if (metrics.circularDependencies.length > 0) {
      console.log(
        chalk.yellow(
          `⚠️  Circular dependencies detected: ${metrics.circularDependencies.length}`
        )
      );
    } else {
      console.log(chalk.green('✅ No circular dependencies found'));
    }

    console.log(
      chalk.cyan(
        `💾 Output saved to: ${path.relative(process.cwd(), outputPath)}`
      )
    );
  } catch (error) {
    throw new Error(`Dependency analysis failed: ${(error as Error).message}`);
  }
}

// === TEMPLATE GENERATION COMMANDS ===

// Template generation command - temporarily disabled
// program
//   .command('template')
//   .description(
//     'Generate LLM-friendly specification templates for guided development'
//   )
//   .argument(
//     '<domain>',
//     `Domain template to use (${availableDomains.join(', ')})`
//   )
//   .argument(
//     '<component>',
//     'Component name to generate (e.g., User, OrderService, ProductController)'
//   )
//   .option('-o, --output <file>', 'specify output file')
//   .option('--no-examples', 'skip usage examples')
//   .option('--no-business-context', 'skip business context section')
//   .option('--no-architecture-guide', 'skip architecture implementation guide')
//   .option('--no-testing-guide', 'skip testing guide section')
//   .option('--interactive', 'interactive template customization')
//   .action(async (domain: string, component: string, options: Record<string, unknown>) => {
//     try {
//       await processTemplateGeneration(domain, component, options);
//     } catch (error) {
//       console.error(
//         chalk.red(`❌ Template generation failed: ${(error as Error).message}`)
//       );
//       process.exit(1);
//     }
//   });

// List domains command - temporarily disabled
// program
//   .command('domains')
//   .description('List available domain templates with descriptions')
//   .action(() => {
//     console.log(listAvailableDomains());
//   });

// Template generation function - temporarily disabled
// async function processTemplateGeneration(
//   domain: string,
//   component: string,
//   options: Record<string, unknown>
// ): Promise<void> {
//   console.log(chalk.blue('🎯 M2JS Template Generator'));
//   console.log(chalk.blue(`📋 Domain: ${domain}`));
//   console.log(chalk.blue(`🔧 Component: ${component}`));

//   if (!availableDomains.includes(domain)) {
//     console.log(
//       chalk.yellow(`⚠️  Available domains: ${availableDomains.join(', ')}`)
//     );
//     throw new Error(`Domain '${domain}' not supported`);
//   }

//   const templateOptions: TemplateOptions = {
//     domain,
//     component,
//     output: options.output as string | undefined,
//     interactive: (options.interactive as boolean) || false,
//     examples: options.examples !== false,
//     businessContext: options.businessContext !== false,
//     architectureGuide: options.architectureGuide !== false,
//     testingGuide: options.testingGuide !== false,
//   };

//   console.log(chalk.blue('🧠 Generating LLM specification template...'));

//   const template = generateTemplate(templateOptions);

//   // Determine output path
//   const outputPath = (options.output as string) || `./${component}.spec.md`;

//   // Write template
//   await fs.writeFile(outputPath, template, 'utf-8');

//   console.log(chalk.green(`✅ Template generated successfully!`));
//   console.log(chalk.cyan(`📁 Output: ${outputPath}`));
//   console.log('');
//   console.log(chalk.cyan('🤖 Next steps:'));
//   console.log(chalk.cyan('1. Review the generated specification template'));
//   console.log(
//     chalk.cyan('2. Provide the template to your LLM coding assistant')
//   );
//   console.log(
//     chalk.cyan(
//       '3. Ask the LLM to implement the component following the specification'
//     )
//   );
//   console.log(
//     chalk.cyan('4. Use the business rules and examples to guide implementation')
//   );
//   console.log('');
//   console.log(chalk.blue('💡 Example LLM prompt:'));
//   console.log(
//     chalk.blue(
//       '"Please implement the component described in this specification template, following all business rules and architectural guidelines."'
//     )
//   );
// }

if (require.main === module) {
  program.parse();
}
