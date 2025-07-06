/**
 * M2JS Webview Provider - Display M2JS analysis in beautiful panels
 */

import * as vscode from 'vscode';
import { M2JSResult, DomainInfo } from './m2jsManager';

export class M2JSWebviewProvider {
    private readonly extensionUri: vscode.Uri;
    private panels = new Map<string, vscode.WebviewPanel>();

    constructor(extensionUri: vscode.Uri) {
        this.extensionUri = extensionUri;
    }

    /**
     * Show M2JS analysis in webview panel
     */
    async showAnalysis(result: M2JSResult, title: string): Promise<void> {
        const panel = this.createPanel(title, result.analysisType);
        panel.webview.html = this.generateAnalysisHTML(result);
        
        // Handle messages from webview
        panel.webview.onDidReceiveMessage(
            message => this.handleWebviewMessage(message, result),
            undefined
        );
    }

    /**
     * Show LLM template in webview panel
     */
    async showTemplate(result: M2JSResult, title: string): Promise<void> {
        const panel = this.createPanel(title, 'template');
        panel.webview.html = this.generateTemplateHTML(result);
        
        // Handle messages from webview
        panel.webview.onDidReceiveMessage(
            message => this.handleWebviewMessage(message, result),
            undefined
        );
    }

    /**
     * Show available domains in webview panel
     */
    async showDomains(domains: DomainInfo[], title: string): Promise<void> {
        const panel = this.createPanel(title, 'domains');
        panel.webview.html = this.generateDomainsHTML(domains);
        
        // Handle messages from webview
        panel.webview.onDidReceiveMessage(
            message => this.handleDomainsMessage(message, domains),
            undefined
        );
    }

    /**
     * Create webview panel
     */
    private createPanel(title: string, type: string): vscode.WebviewPanel {
        const panelKey = `${type}-${Date.now()}`;
        
        const panel = vscode.window.createWebviewPanel(
            'm2jsAnalysis',
            title,
            vscode.ViewColumn.Beside,
            {
                enableScripts: true,
                retainContextWhenHidden: true,
                localResourceRoots: [this.extensionUri]
            }
        );

        // Store panel reference
        this.panels.set(panelKey, panel);

        // Clean up when panel is disposed
        panel.onDidDispose(() => {
            this.panels.delete(panelKey);
        });

        return panel;
    }

    /**
     * Generate HTML for M2JS analysis
     */
    private generateAnalysisHTML(result: M2JSResult): string {
        const metadata = result.metadata || {};
        const isEnhanced = result.analysisType === 'enhanced';
        
        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>M2JS Analysis</title>
    <style>
        ${this.getBaseStyles()}
        .analysis-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        .metadata {
            display: flex;
            gap: 20px;
            flex-wrap: wrap;
            margin-top: 15px;
        }
        .metadata-item {
            background: rgba(255,255,255,0.2);
            padding: 8px 12px;
            border-radius: 4px;
            font-size: 0.9em;
        }
        .content-area {
            background: var(--vscode-editor-background);
            border: 1px solid var(--vscode-panel-border);
            border-radius: 6px;
            padding: 20px;
            font-family: var(--vscode-editor-font-family);
            line-height: 1.6;
        }
        .action-buttons {
            margin-top: 20px;
            display: flex;
            gap: 10px;
        }
    </style>
</head>
<body>
    <div class="analysis-header">
        <h1>📋 ${result.analysisType === 'enhanced' ? 'AI-Enhanced' : 'Standard'} Analysis</h1>
        <p>📁 ${this.escapeHtml(result.filePath)}</p>
        <div class="metadata">
            ${metadata.tokenReduction ? `<div class="metadata-item">💾 ${metadata.tokenReduction}% Token Reduction</div>` : ''}
            ${metadata.exportCount ? `<div class="metadata-item">📦 ${metadata.exportCount} Exports</div>` : ''}
            ${metadata.businessDomain ? `<div class="metadata-item">🎯 ${metadata.businessDomain}</div>` : ''}
            ${metadata.confidence ? `<div class="metadata-item">🧠 ${metadata.confidence}% Confidence</div>` : ''}
        </div>
    </div>

    <div class="content-area">
        ${this.markdownToHtml(result.content)}
    </div>

    <div class="action-buttons">
        <button class="action-btn primary" onclick="copyToClipboard()">
            📋 Copy for AI Assistant
        </button>
        <button class="action-btn secondary" onclick="saveToFile()">
            💾 Save to File
        </button>
        ${isEnhanced ? `
        <button class="action-btn secondary" onclick="generateTemplate()">
            🎯 Create Template
        </button>
        ` : ''}
    </div>

    <script>
        const vscode = acquireVsCodeApi();
        
        function copyToClipboard() {
            const content = \`${this.escapeJavaScript(result.content)}\`;
            vscode.postMessage({
                command: 'copyToClipboard',
                content: content
            });
        }
        
        function saveToFile() {
            vscode.postMessage({
                command: 'saveToFile',
                content: \`${this.escapeJavaScript(result.content)}\`,
                filePath: '${this.escapeJavaScript(result.filePath)}'
            });
        }
        
        function generateTemplate() {
            vscode.postMessage({
                command: 'generateTemplate',
                filePath: '${this.escapeJavaScript(result.filePath)}'
            });
        }
    </script>
</body>
</html>`;
    }

    /**
     * Generate HTML for LLM template
     */
    private generateTemplateHTML(result: M2JSResult): string {
        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LLM Template</title>
    <style>
        ${this.getBaseStyles()}
        .template-header {
            background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
            color: white;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        .llm-prompt {
            background: var(--vscode-textBlockQuote-background);
            border-left: 4px solid var(--vscode-textBlockQuote-border);
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .template-content {
            background: var(--vscode-editor-background);
            border: 1px solid var(--vscode-panel-border);
            border-radius: 6px;
            padding: 20px;
            font-family: var(--vscode-editor-font-family);
            line-height: 1.6;
        }
    </style>
</head>
<body>
    <div class="template-header">
        <h1>🎯 LLM Implementation Template</h1>
        <p>📁 ${this.escapeHtml(result.filePath)}</p>
        <p>🎯 Domain: ${result.metadata?.businessDomain || 'Custom'}</p>
    </div>

    <div class="llm-prompt">
        <h3>🤖 Suggested LLM Prompt:</h3>
        <p><em>"Please implement the component described in this specification template, following all business rules and architectural guidelines exactly as specified."</em></p>
    </div>

    <div class="template-content">
        ${this.markdownToHtml(result.content)}
    </div>

    <div class="action-buttons">
        <button class="action-btn primary" onclick="copyTemplateForAI()">
            🤖 Copy Template + Prompt for AI
        </button>
        <button class="action-btn secondary" onclick="saveTemplate()">
            💾 Save Template
        </button>
        <button class="action-btn secondary" onclick="createNewFile()">
            📝 Create Implementation File
        </button>
    </div>

    <script>
        const vscode = acquireVsCodeApi();
        
        function copyTemplateForAI() {
            const prompt = "Please implement the component described in this specification template, following all business rules and architectural guidelines exactly as specified:\\n\\n";
            const content = prompt + \`${this.escapeJavaScript(result.content)}\`;
            vscode.postMessage({
                command: 'copyToClipboard',
                content: content
            });
        }
        
        function saveTemplate() {
            vscode.postMessage({
                command: 'saveToFile',
                content: \`${this.escapeJavaScript(result.content)}\`,
                filePath: '${this.escapeJavaScript(result.filePath)}',
                isTemplate: true
            });
        }
        
        function createNewFile() {
            vscode.postMessage({
                command: 'createImplementationFile',
                templateContent: \`${this.escapeJavaScript(result.content)}\`,
                fileName: '${this.escapeJavaScript(result.filePath.replace('.spec.md', '.ts'))}'
            });
        }
    </script>
</body>
</html>`;
    }

    /**
     * Generate HTML for domains list
     */
    private generateDomainsHTML(domains: DomainInfo[]): string {
        const domainsHTML = domains.map(domain => `
            <div class="domain-card" onclick="selectDomain('${domain.key}')">
                <h3>${domain.name}</h3>
                <p>${domain.description}</p>
                <div class="domain-details">
                    <div class="detail-group">
                        <strong>Entities:</strong>
                        <div class="tags">
                            ${domain.entities.map(entity => `<span class="tag">${entity}</span>`).join('')}
                        </div>
                    </div>
                    <div class="detail-group">
                        <strong>Workflows:</strong>
                        <div class="tags">
                            ${domain.workflows.map(workflow => `<span class="tag workflow">${workflow}</span>`).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Domain Templates</title>
    <style>
        ${this.getBaseStyles()}
        .domains-header {
            background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
            color: white;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        .domain-card {
            background: var(--vscode-editor-background);
            border: 1px solid var(--vscode-panel-border);
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        .domain-card:hover {
            border-color: var(--vscode-focusBorder);
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .domain-details {
            margin-top: 15px;
        }
        .detail-group {
            margin-bottom: 10px;
        }
        .tags {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
            margin-top: 5px;
        }
        .tag {
            background: var(--vscode-badge-background);
            color: var(--vscode-badge-foreground);
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 0.8em;
        }
        .tag.workflow {
            background: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
        }
    </style>
</head>
<body>
    <div class="domains-header">
        <h1>🎯 Available Domain Templates</h1>
        <p>Choose a domain template to guide your LLM-assisted development</p>
    </div>

    <div class="domains-container">
        ${domainsHTML}
    </div>

    <script>
        const vscode = acquireVsCodeApi();
        
        function selectDomain(domainKey) {
            vscode.postMessage({
                command: 'selectDomain',
                domain: domainKey
            });
        }
    </script>
</body>
</html>`;
    }

    /**
     * Get base CSS styles
     */
    private getBaseStyles(): string {
        return `
            body {
                font-family: var(--vscode-font-family);
                font-size: var(--vscode-font-size);
                color: var(--vscode-foreground);
                background-color: var(--vscode-editor-background);
                margin: 0;
                padding: 20px;
                line-height: 1.6;
            }
            h1, h2, h3, h4, h5, h6 {
                color: var(--vscode-foreground);
                margin-top: 0;
            }
            .action-btn {
                background: var(--vscode-button-background);
                color: var(--vscode-button-foreground);
                border: none;
                padding: 8px 16px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
                transition: background 0.2s ease;
            }
            .action-btn:hover {
                background: var(--vscode-button-hoverBackground);
            }
            .action-btn.primary {
                background: var(--vscode-button-background);
            }
            .action-btn.secondary {
                background: var(--vscode-button-secondaryBackground);
                color: var(--vscode-button-secondaryForeground);
            }
            .action-btn.secondary:hover {
                background: var(--vscode-button-secondaryHoverBackground);
            }
            code {
                background: var(--vscode-textCodeBlock-background);
                padding: 2px 4px;
                border-radius: 3px;
                font-family: var(--vscode-editor-font-family);
            }
            pre {
                background: var(--vscode-textCodeBlock-background);
                padding: 16px;
                border-radius: 6px;
                overflow-x: auto;
                font-family: var(--vscode-editor-font-family);
            }
            blockquote {
                border-left: 4px solid var(--vscode-textBlockQuote-border);
                background: var(--vscode-textBlockQuote-background);
                margin: 16px 0;
                padding: 16px;
                border-radius: 4px;
            }
        `;
    }

    /**
     * Convert markdown to HTML (simplified)
     */
    private markdownToHtml(markdown: string): string {
        return markdown
            .replace(/### (.*)/g, '<h3>$1</h3>')
            .replace(/## (.*)/g, '<h2>$1</h2>')
            .replace(/# (.*)/g, '<h1>$1</h1>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            .replace(/```([\\s\\S]*?)```/g, '<pre><code>$1</code></pre>')
            .replace(/^- (.*)/gm, '<li>$1</li>')
            .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
            .replace(/\\n/g, '<br>');
    }

    /**
     * Handle messages from webview
     */
    private async handleWebviewMessage(message: any, result: M2JSResult): Promise<void> {
        switch (message.command) {
            case 'copyToClipboard':
                await vscode.env.clipboard.writeText(message.content);
                vscode.window.showInformationMessage('M2JS analysis copied to clipboard!');
                break;

            case 'saveToFile':
                await this.saveToProjectWorkspace(message.content, message.filePath, message.isTemplate || false);
                break;

            case 'generateTemplate':
                vscode.commands.executeCommand('m2js.openTemplateWizard');
                break;

            case 'createImplementationFile':
                const implUri = await vscode.window.showSaveDialog({
                    defaultUri: vscode.Uri.file(message.fileName),
                    filters: {
                        'TypeScript': ['ts'],
                        'JavaScript': ['js'],
                        'All Files': ['*']
                    }
                });

                if (implUri) {
                    const template = `/**\n * Implementation based on M2JS Template\n * TODO: Implement according to specification\n */\n\n// ${message.templateContent.substring(0, 200)}...\n\n// TODO: Add your implementation here\n`;
                    await vscode.workspace.fs.writeFile(implUri, Buffer.from(template, 'utf8'));
                    const doc = await vscode.workspace.openTextDocument(implUri);
                    await vscode.window.showTextDocument(doc);
                }
                break;
        }
    }

    /**
     * Handle messages from domains webview
     */
    private async handleDomainsMessage(message: any, domains: DomainInfo[]): Promise<void> {
        switch (message.command) {
            case 'selectDomain':
                // Open template wizard with selected domain
                vscode.commands.executeCommand('m2js.openTemplateWizard', message.domain);
                break;
        }
    }

    /**
     * Escape HTML content
     */
    private escapeHtml(unsafe: string): string {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    /**
     * Escape JavaScript content
     */
    private escapeJavaScript(unsafe: string): string {
        return unsafe
            .replace(/\\/g, "\\\\")
            .replace(/"/g, '\\"')
            .replace(/'/g, "\\'")
            .replace(/\n/g, "\\n")
            .replace(/\r/g, "\\r")
            .replace(/\t/g, "\\t");
    }

    /**
     * Save file to project workspace automatically
     */
    private async saveToProjectWorkspace(content: string, originalFilePath: string, isTemplate: boolean = false): Promise<void> {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        
        if (!workspaceFolder) {
            vscode.window.showErrorMessage('No workspace folder open. Cannot save file.');
            return;
        }

        try {
            // Get user configuration
            const config = vscode.workspace.getConfiguration('m2js');
            const outputDirName = config.get('outputDirectory', 'm2js-output');
            const autoOpen = config.get('autoOpenResults', true);

            // Generate output filename based on original file
            const baseName = originalFilePath.split('/').pop()?.replace(/\.(ts|tsx|js|jsx)$/, '') || 'analysis';
            const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
            
            let fileName: string;
            if (isTemplate) {
                fileName = `${baseName}-template-${timestamp}.md`;
            } else {
                fileName = `${baseName}-analysis-${timestamp}.md`;
            }

            // Save to workspace root in configured output folder
            const outputDir = vscode.Uri.joinPath(workspaceFolder.uri, outputDirName);
            
            // Create output directory if it doesn't exist
            try {
                await vscode.workspace.fs.stat(outputDir);
            } catch {
                await vscode.workspace.fs.createDirectory(outputDir);
            }

            const fileUri = vscode.Uri.joinPath(outputDir, fileName);
            
            // Write the file
            await vscode.workspace.fs.writeFile(fileUri, Buffer.from(content, 'utf8'));
            
            // Show success message based on configuration
            const notificationConfig = config.get('notifications', { showSuccess: true }) as any;
            const showSuccess = notificationConfig.showSuccess ?? true;

            if (showSuccess) {
                const actions = autoOpen ? ['Open File', 'Copy Path'] : ['Copy Path'];
                const action = await vscode.window.showInformationMessage(
                    `✅ Saved to ${fileUri.fsPath.replace(workspaceFolder.uri.fsPath, '')}`,
                    ...actions
                );

                if (action === 'Open File' || (autoOpen && !action)) {
                    const doc = await vscode.workspace.openTextDocument(fileUri);
                    await vscode.window.showTextDocument(doc, vscode.ViewColumn.Beside);
                } else if (action === 'Copy Path') {
                    await vscode.env.clipboard.writeText(fileUri.fsPath);
                    vscode.window.showInformationMessage('File path copied to clipboard!');
                }
            } else if (autoOpen) {
                // Auto-open even without notification
                const doc = await vscode.workspace.openTextDocument(fileUri);
                await vscode.window.showTextDocument(doc, vscode.ViewColumn.Beside);
            }

        } catch (error) {
            vscode.window.showErrorMessage(`Failed to save file: ${error}`);
        }
    }
}