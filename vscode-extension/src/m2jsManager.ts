/**
 * M2JS Manager - Bridge between VS Code extension and M2JS CLI
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import * as vscode from 'vscode';
import * as path from 'path';

const execAsync = promisify(exec);

export interface M2JSResult {
    content: string;
    filePath: string;
    analysisType: 'standard' | 'enhanced' | 'dependencies' | 'template';
    metadata?: {
        tokenReduction?: number;
        exportCount?: number;
        businessDomain?: string;
        confidence?: number;
    };
}

export interface DomainInfo {
    key: string;
    name: string;
    description: string;
    entities: string[];
    workflows: string[];
}

export class M2JSManager {
    private m2jsPath: string;

    constructor() {
        this.m2jsPath = this.detectM2JSPath();
    }

    /**
     * Generate standard M2JS documentation
     */
    async generateDocumentation(filePath: string): Promise<M2JSResult> {
        try {
            const command = `"${this.m2jsPath}" "${filePath}"`;
            const { stdout, stderr } = await execAsync(command, {
                cwd: path.dirname(filePath),
                timeout: 30000 // 30 second timeout
            });

            if (stderr) {
                console.warn('M2JS Warning:', stderr);
            }

            return {
                content: stdout,
                filePath,
                analysisType: 'standard',
                metadata: this.extractMetadata(stdout)
            };
        } catch (error) {
            throw new Error(`M2JS CLI execution failed: ${error}`);
        }
    }

    /**
     * Generate AI-enhanced analysis
     */
    async generateEnhancedAnalysis(filePath: string): Promise<M2JSResult> {
        try {
            const config = vscode.workspace.getConfiguration('m2js');
            
            let command = `"${this.m2jsPath}" "${filePath}" --ai-enhanced`;
            
            // Add optional features based on configuration
            if (config.get('enableBusinessContext', true)) {
                command += ' --business-context';
            }
            
            if (config.get('enableArchitectureInsights', true)) {
                command += ' --architecture-insights';
            }
            
            if (config.get('enableSemanticAnalysis', true)) {
                command += ' --semantic-analysis';
            }

            // Add token optimization level
            const tokenOptimization = config.get('tokenOptimization', 'balanced');
            if (tokenOptimization !== 'balanced') {
                command += ` --token-optimization ${tokenOptimization}`;
            }

            // Include private members if configured
            if (config.get('includePrivateMembers', false)) {
                command += ' --include-private';
            }

            const { stdout, stderr } = await execAsync(command, {
                cwd: path.dirname(filePath),
                timeout: 60000 // 60 second timeout for enhanced analysis
            });

            if (stderr) {
                console.warn('M2JS Warning:', stderr);
            }

            return {
                content: stdout,
                filePath,
                analysisType: 'enhanced',
                metadata: this.extractMetadata(stdout)
            };
        } catch (error) {
            throw new Error(`M2JS Enhanced analysis failed: ${error}`);
        }
    }

    /**
     * Analyze project dependencies
     */
    async analyzeProjectDependencies(projectPath: string): Promise<M2JSResult> {
        try {
            const command = `"${this.m2jsPath}" "${projectPath}" --graph --mermaid`;
            const { stdout, stderr } = await execAsync(command, {
                cwd: projectPath,
                timeout: 120000 // 2 minute timeout for project analysis
            });

            if (stderr) {
                console.warn('M2JS Warning:', stderr);
            }

            return {
                content: stdout,
                filePath: projectPath,
                analysisType: 'dependencies',
                metadata: this.extractDependencyMetadata(stdout)
            };
        } catch (error) {
            throw new Error(`M2JS Dependency analysis failed: ${error}`);
        }
    }

    /**
     * Generate LLM template
     */
    async generateTemplate(domain: string, component: string, options?: {
        businessContext?: boolean;
        examples?: boolean;
        architectureGuide?: boolean;
        testingGuide?: boolean;
    }): Promise<M2JSResult> {
        try {
            let command = `"${this.m2jsPath}" template ${domain} ${component}`;
            
            // Add options
            if (options?.businessContext === false) {
                command += ' --no-business-context';
            }
            if (options?.examples === false) {
                command += ' --no-examples';
            }
            if (options?.architectureGuide === false) {
                command += ' --no-architecture-guide';
            }
            if (options?.testingGuide === false) {
                command += ' --no-testing-guide';
            }

            const { stdout, stderr } = await execAsync(command, {
                timeout: 30000
            });

            if (stderr) {
                console.warn('M2JS Warning:', stderr);
            }

            return {
                content: stdout,
                filePath: `${component}.spec.md`,
                analysisType: 'template',
                metadata: {
                    businessDomain: domain
                }
            };
        } catch (error) {
            throw new Error(`M2JS Template generation failed: ${error}`);
        }
    }

    /**
     * Get available domains
     */
    async getAvailableDomains(): Promise<DomainInfo[]> {
        try {
            const command = `"${this.m2jsPath}" domains`;
            const { stdout, stderr } = await execAsync(command, {
                timeout: 10000
            });

            if (stderr) {
                console.warn('M2JS Warning:', stderr);
            }

            return this.parseDomainInfo(stdout);
        } catch (error) {
            throw new Error(`Failed to get domains: ${error}`);
        }
    }

    /**
     * Detect M2JS CLI path
     */
    private detectM2JSPath(): string {
        // Check user configuration first
        const config = vscode.workspace.getConfiguration('m2js');
        const userPath = config.get<string>('cliPath');
        if (userPath && userPath.trim()) {
            return userPath.trim();
        }

        // Try to find M2JS in the current project
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (workspaceFolder) {
            const projectM2JSPath = path.join(workspaceFolder.uri.fsPath, 'dist', 'cli.js');
            return `node "${projectM2JSPath}"`;
        }

        // Try global installation
        return 'm2js';
    }

    /**
     * Extract metadata from M2JS output
     */
    private extractMetadata(content: string): M2JSResult['metadata'] {
        const metadata: M2JSResult['metadata'] = {};

        // Extract token reduction from output
        const reductionMatch = content.match(/(\d+)% reduction/);
        if (reductionMatch) {
            metadata.tokenReduction = parseInt(reductionMatch[1]);
        }

        // Extract export count
        const exportMatch = content.match(/(\d+) exported/);
        if (exportMatch) {
            metadata.exportCount = parseInt(exportMatch[1]);
        }

        // Extract business domain
        const domainMatch = content.match(/\*\*Domain\*\*:\s*([^\n]+)/);
        if (domainMatch) {
            metadata.businessDomain = domainMatch[1].trim();
        }

        // Extract confidence
        const confidenceMatch = content.match(/(\d+)% confidence/);
        if (confidenceMatch) {
            metadata.confidence = parseInt(confidenceMatch[1]);
        }

        return metadata;
    }

    /**
     * Extract dependency analysis metadata
     */
    private extractDependencyMetadata(content: string): M2JSResult['metadata'] {
        const metadata: M2JSResult['metadata'] = {};

        // Extract total modules
        const modulesMatch = content.match(/\*\*Total modules\*\*:\s*(\d+)/);
        if (modulesMatch) {
            metadata.exportCount = parseInt(modulesMatch[1]);
        }

        return metadata;
    }

    /**
     * Parse domain information from CLI output
     */
    private parseDomainInfo(output: string): DomainInfo[] {
        const domains: DomainInfo[] = [];
        const sections = output.split('## ').slice(1); // Skip the header

        sections.forEach(section => {
            const lines = section.trim().split('\n');
            const key = lines[0].trim();
            
            let name = '';
            let description = '';
            const entities: string[] = [];
            const workflows: string[] = [];

            lines.forEach(line => {
                if (line.startsWith('**Domain**:')) {
                    name = line.replace('**Domain**:', '').trim();
                } else if (line.startsWith('**Description**:')) {
                    description = line.replace('**Description**:', '').trim();
                } else if (line.startsWith('- **') && line.includes('**Common Entities**:')) {
                    // Skip header
                } else if (line.startsWith('- **') && !line.includes('**Common Workflows**:')) {
                    // Extract entity name
                    const entityMatch = line.match(/- \*\*([^*]+)\*\*/);
                    if (entityMatch) {
                        entities.push(entityMatch[1]);
                    }
                } else if (line.startsWith('- **') && line.includes('workflow')) {
                    // Extract workflow name
                    const workflowMatch = line.match(/- \*\*([^*]+)\*\*/);
                    if (workflowMatch) {
                        workflows.push(workflowMatch[1]);
                    }
                }
            });

            if (key && name) {
                domains.push({
                    key,
                    name,
                    description,
                    entities,
                    workflows
                });
            }
        });

        return domains;
    }

    /**
     * Check if M2JS CLI is available
     */
    async checkAvailability(): Promise<boolean> {
        try {
            const command = `"${this.m2jsPath}" --version`;
            await execAsync(command, { timeout: 5000 });
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Get M2JS version
     */
    async getVersion(): Promise<string> {
        try {
            const command = `"${this.m2jsPath}" --version`;
            const { stdout } = await execAsync(command, { timeout: 5000 });
            return stdout.trim();
        } catch (error) {
            return 'Unknown';
        }
    }
}