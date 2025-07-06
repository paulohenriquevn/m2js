/**
 * Template Wizard - Interactive template generation for M2JS
 */

import * as vscode from 'vscode';
import { M2JSManager, M2JSResult, DomainInfo } from './m2jsManager';

export interface TemplateWizardOptions {
    domain: string;
    component: string;
    businessContext: boolean;
    examples: boolean;
    architectureGuide: boolean;
    testingGuide: boolean;
}

export class TemplateWizard {
    private m2jsManager: M2JSManager;

    constructor(m2jsManager: M2JSManager) {
        this.m2jsManager = m2jsManager;
    }

    /**
     * Open template wizard and guide user through template creation
     */
    async openWizard(preSelectedDomain?: string): Promise<M2JSResult | undefined> {
        try {
            // Step 1: Select domain
            const domains = await this.m2jsManager.getAvailableDomains();
            const selectedDomain = preSelectedDomain || await this.selectDomain(domains);
            
            if (!selectedDomain) {
                return undefined;
            }

            // Step 2: Enter component name
            const componentName = await this.getComponentName();
            if (!componentName) {
                return undefined;
            }

            // Step 3: Configure options
            const options = await this.configureOptions();
            if (!options) {
                return undefined;
            }

            // Step 4: Generate template
            const result = await this.generateTemplate(selectedDomain, componentName, options);
            
            if (result) {
                vscode.window.showInformationMessage(
                    `✅ Template for ${componentName} generated successfully!`
                );
            }

            return result;

        } catch (error) {
            vscode.window.showErrorMessage(`Template wizard failed: ${error}`);
            return undefined;
        }
    }

    /**
     * Let user select domain from available options
     */
    private async selectDomain(domains: DomainInfo[]): Promise<string | undefined> {
        const domainItems: vscode.QuickPickItem[] = domains.map(domain => ({
            label: `$(symbol-class) ${domain.name}`,
            description: domain.description,
            detail: `Entities: ${domain.entities.join(', ')} | Workflows: ${domain.workflows.join(', ')}`,
            picked: false
        }));

        // Add custom domain option
        domainItems.push({
            label: '$(add) Custom Domain',
            description: 'Create a template for a custom business domain',
            detail: 'Use generic patterns for any domain'
        });

        const selected = await vscode.window.showQuickPick(domainItems, {
            title: '🎯 Select Business Domain',
            placeHolder: 'Choose the domain that best matches your project',
            ignoreFocusOut: true,
            matchOnDescription: true,
            matchOnDetail: true
        });

        if (!selected) {
            return undefined;
        }

        if (selected.label.includes('Custom Domain')) {
            return 'custom';
        }

        // Extract domain key from label
        return domains.find(d => d.name === selected.label.replace('$(symbol-class) ', ''))?.key;
    }

    /**
     * Get component name from user
     */
    private async getComponentName(): Promise<string | undefined> {
        const componentName = await vscode.window.showInputBox({
            title: '🔧 Component Name',
            prompt: 'Enter the name of the component to create (e.g., User, OrderService, PaymentController)',
            placeHolder: 'User',
            validateInput: (value) => {
                if (!value || !value.trim()) {
                    return 'Component name is required';
                }
                if (!/^[A-Za-z][A-Za-z0-9]*$/.test(value.trim())) {
                    return 'Component name must be a valid identifier (letters and numbers only)';
                }
                return undefined;
            },
            ignoreFocusOut: true
        });

        return componentName?.trim();
    }

    /**
     * Configure template generation options
     */
    private async configureOptions(): Promise<Partial<TemplateWizardOptions> | undefined> {
        interface OptionItem extends vscode.QuickPickItem {
            key: keyof TemplateWizardOptions;
            value: boolean;
        }

        const optionItems: OptionItem[] = [
            {
                label: '$(info) Business Context',
                description: 'Include domain analysis and business rules',
                detail: 'Recommended for LLM understanding',
                picked: true,
                key: 'businessContext',
                value: true
            },
            {
                label: '$(code) Usage Examples',
                description: 'Include code examples and usage patterns',
                detail: 'Helps LLM generate better implementations',
                picked: true,
                key: 'examples',
                value: true
            },
            {
                label: '$(organization) Architecture Guide',
                description: 'Include architectural patterns and implementation guidance',
                detail: 'Ensures consistent code structure',
                picked: true,
                key: 'architectureGuide',
                value: true
            },
            {
                label: '$(beaker) Testing Guide',
                description: 'Include testing strategies and test scenarios',
                detail: 'Promotes test-driven development',
                picked: true,
                key: 'testingGuide',
                value: true
            }
        ];

        const selected = await vscode.window.showQuickPick(optionItems, {
            title: '⚙️ Configure Template Options',
            placeHolder: 'Select the sections to include in your template',
            canPickMany: true,
            ignoreFocusOut: true,
            matchOnDescription: true
        });

        if (!selected) {
            return undefined;
        }

        // Build options object
        const options: Partial<TemplateWizardOptions> = {
            businessContext: selected.some(item => item.key === 'businessContext'),
            examples: selected.some(item => item.key === 'examples'),
            architectureGuide: selected.some(item => item.key === 'architectureGuide'),
            testingGuide: selected.some(item => item.key === 'testingGuide')
        };

        return options;
    }

    /**
     * Generate template with selected options
     */
    private async generateTemplate(
        domain: string, 
        component: string, 
        options: Partial<TemplateWizardOptions>
    ): Promise<M2JSResult | undefined> {
        return await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: 'Generating LLM Template...',
            cancellable: false
        }, async (progress) => {
            progress.report({ increment: 0, message: 'Analyzing domain...' });
            
            await new Promise(resolve => setTimeout(resolve, 500)); // Small delay for UX
            
            progress.report({ increment: 30, message: 'Building component specification...' });
            
            const result = await this.m2jsManager.generateTemplate(domain, component, {
                businessContext: options.businessContext,
                examples: options.examples,
                architectureGuide: options.architectureGuide,
                testingGuide: options.testingGuide
            });
            
            progress.report({ increment: 70, message: 'Finalizing template...' });
            
            await new Promise(resolve => setTimeout(resolve, 300));
            
            progress.report({ increment: 100, message: 'Complete!' });
            
            return result;
        });
    }

    /**
     * Quick template generation for common scenarios
     */
    async quickGenerate(domain: string, component: string): Promise<M2JSResult | undefined> {
        try {
            const result = await this.m2jsManager.generateTemplate(domain, component, {
                businessContext: true,
                examples: true,
                architectureGuide: true,
                testingGuide: true
            });

            vscode.window.showInformationMessage(
                `✅ Quick template for ${component} generated!`
            );

            return result;
        } catch (error) {
            vscode.window.showErrorMessage(`Quick template generation failed: ${error}`);
            return undefined;
        }
    }

    /**
     * Create template from existing file analysis
     */
    async createFromFile(filePath: string): Promise<M2JSResult | undefined> {
        try {
            // First analyze the existing file
            const analysis = await this.m2jsManager.generateEnhancedAnalysis(filePath);
            
            // Extract component name from file
            const fileName = filePath.split('/').pop()?.replace(/\.(ts|tsx|js|jsx)$/, '') || 'Component';
            
            // Try to detect domain from analysis
            const detectedDomain = this.detectDomainFromAnalysis(analysis.content);
            
            // Show confirmation dialog
            const action = await vscode.window.showInformationMessage(
                `Create LLM template based on ${fileName}?`,
                {
                    detail: `Detected domain: ${detectedDomain || 'Custom'}\nThis will create a specification template that an LLM can use to implement similar components.`
                },
                'Create Template',
                'Cancel'
            );

            if (action !== 'Create Template') {
                return undefined;
            }

            // Use wizard to confirm options
            const domain = detectedDomain || await this.selectDomain(await this.m2jsManager.getAvailableDomains());
            if (!domain) {
                return undefined;
            }

            const options = await this.configureOptions();
            if (!options) {
                return undefined;
            }

            return await this.generateTemplate(domain, fileName, options);

        } catch (error) {
            vscode.window.showErrorMessage(`Failed to create template from file: ${error}`);
            return undefined;
        }
    }

    /**
     * Detect domain from analysis content
     */
    private detectDomainFromAnalysis(content: string): string | undefined {
        const domainPatterns = {
            'ecommerce': ['user', 'product', 'order', 'payment', 'cart', 'customer'],
            'blog': ['post', 'article', 'author', 'comment', 'publish'],
            'api': ['endpoint', 'route', 'middleware', 'auth', 'request', 'response']
        };

        const lowerContent = content.toLowerCase();
        
        for (const [domain, keywords] of Object.entries(domainPatterns)) {
            const matches = keywords.filter(keyword => lowerContent.includes(keyword));
            if (matches.length >= 2) {
                return domain;
            }
        }

        return undefined;
    }
}