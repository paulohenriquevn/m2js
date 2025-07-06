/**
 * M2JS VS Code Extension
 * Transform TypeScript/JavaScript into LLM-friendly Markdown documentation
 */

import * as vscode from 'vscode';
import { M2JSManager } from './m2jsManager';
import { M2JSWebviewProvider } from './webviewProvider';
import { TemplateWizard } from './templateWizard';
import { ProjectTreeProvider } from './projectTreeProvider';

let m2jsManager: M2JSManager;
let webviewProvider: M2JSWebviewProvider;
let templateWizard: TemplateWizard;
let projectTreeProvider: ProjectTreeProvider;

export function activate(context: vscode.ExtensionContext) {
    console.log('M2JS extension is now active!');

    // Initialize core components
    m2jsManager = new M2JSManager();
    webviewProvider = new M2JSWebviewProvider(context.extensionUri);
    templateWizard = new TemplateWizard(m2jsManager);
    projectTreeProvider = new ProjectTreeProvider();

    // Register tree data provider
    vscode.window.registerTreeDataProvider('m2jsProjectView', projectTreeProvider);

    // Register commands
    registerCommands(context);

    // Register event handlers
    registerEventHandlers(context);

    // Show welcome message
    vscode.window.showInformationMessage('M2JS Extension activated! Right-click on TypeScript files to get started.');
}

function registerCommands(context: vscode.ExtensionContext) {
    // Generate standard documentation
    const generateDocs = vscode.commands.registerCommand('m2js.generateDocs', async (uri?: vscode.Uri) => {
        const targetUri = uri || vscode.window.activeTextEditor?.document.uri;
        if (!targetUri) {
            vscode.window.showErrorMessage('No TypeScript/JavaScript file selected');
            return;
        }

        try {
            await vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: 'Generating M2JS Documentation...',
                cancellable: false
            }, async () => {
                const result = await m2jsManager.generateDocumentation(targetUri.fsPath);
                await webviewProvider.showAnalysis(result, 'M2JS Documentation');
            });
        } catch (error) {
            vscode.window.showErrorMessage(`M2JS Error: ${error}`);
        }
    });

    // Generate AI-enhanced analysis
    const generateDocsEnhanced = vscode.commands.registerCommand('m2js.generateDocsEnhanced', async (uri?: vscode.Uri) => {
        const targetUri = uri || vscode.window.activeTextEditor?.document.uri;
        if (!targetUri) {
            vscode.window.showErrorMessage('No TypeScript/JavaScript file selected');
            return;
        }

        try {
            await vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: 'Generating AI-Enhanced Analysis...',
                cancellable: false
            }, async () => {
                const result = await m2jsManager.generateEnhancedAnalysis(targetUri.fsPath);
                await webviewProvider.showAnalysis(result, 'AI-Enhanced Analysis');
            });
        } catch (error) {
            vscode.window.showErrorMessage(`M2JS Error: ${error}`);
        }
    });

    // Create LLM template
    const createTemplate = vscode.commands.registerCommand('m2js.createTemplate', async (uri?: vscode.Uri) => {
        try {
            const result = await templateWizard.openWizard();
            if (result) {
                await webviewProvider.showTemplate(result, 'LLM Template');
            }
        } catch (error) {
            vscode.window.showErrorMessage(`Template Error: ${error}`);
        }
    });

    // Analyze project dependencies
    const analyzeProject = vscode.commands.registerCommand('m2js.analyzeProject', async (uri?: vscode.Uri) => {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
            vscode.window.showErrorMessage('No workspace folder open');
            return;
        }

        try {
            await vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: 'Analyzing Project Dependencies...',
                cancellable: false
            }, async () => {
                const result = await m2jsManager.analyzeProjectDependencies(workspaceFolder.uri.fsPath);
                await webviewProvider.showAnalysis(result, 'Project Dependency Analysis');
            });
        } catch (error) {
            vscode.window.showErrorMessage(`Analysis Error: ${error}`);
        }
    });

    // Open template wizard
    const openTemplateWizard = vscode.commands.registerCommand('m2js.openTemplateWizard', async () => {
        try {
            const result = await templateWizard.openWizard();
            if (result) {
                await webviewProvider.showTemplate(result, 'LLM Template Wizard');
            }
        } catch (error) {
            vscode.window.showErrorMessage(`Wizard Error: ${error}`);
        }
    });

    // Show available domains
    const showDomains = vscode.commands.registerCommand('m2js.showDomains', async () => {
        try {
            const domains = await m2jsManager.getAvailableDomains();
            await webviewProvider.showDomains(domains, 'Available Domain Templates');
        } catch (error) {
            vscode.window.showErrorMessage(`Domains Error: ${error}`);
        }
    });

    // Copy to clipboard for AI
    const copyForAI = vscode.commands.registerCommand('m2js.copyForAI', async (content: string) => {
        await vscode.env.clipboard.writeText(content);
        vscode.window.showInformationMessage('M2JS analysis copied to clipboard! Paste in your AI assistant.');
    });

    // Refresh project tree
    const refreshProjectTree = vscode.commands.registerCommand('m2js.refreshProjectTree', () => {
        projectTreeProvider.refresh();
    });

    // Register all commands
    context.subscriptions.push(
        generateDocs,
        generateDocsEnhanced,
        createTemplate,
        analyzeProject,
        openTemplateWizard,
        showDomains,
        copyForAI,
        refreshProjectTree
    );
}

function registerEventHandlers(context: vscode.ExtensionContext) {
    // Auto-analysis on file open (if enabled)
    const onDidOpenTextDocument = vscode.workspace.onDidOpenTextDocument(async (document) => {
        const config = vscode.workspace.getConfiguration('m2js');
        const autoAnalysis = config.get('enableAutoAnalysis', false);
        
        if (autoAnalysis && isTypeScriptFile(document)) {
            // Auto-analyze in background
            try {
                await m2jsManager.generateDocumentation(document.uri.fsPath);
                // Update project tree
                projectTreeProvider.refresh();
            } catch (error) {
                // Silent fail for auto-analysis
                console.error('Auto-analysis failed:', error);
            }
        }
    });

    // Refresh project tree on file changes
    const onDidSaveDocument = vscode.workspace.onDidSaveTextDocument((document: vscode.TextDocument) => {
        if (isTypeScriptFile(document)) {
            projectTreeProvider.refresh();
        }
    });

    context.subscriptions.push(onDidOpenTextDocument, onDidSaveDocument);
}

function isTypeScriptFile(document: vscode.TextDocument): boolean {
    const supportedExtensions = ['.ts', '.tsx', '.js', '.jsx'];
    return supportedExtensions.some(ext => document.fileName.endsWith(ext));
}

export function deactivate() {
    console.log('M2JS extension deactivated');
}