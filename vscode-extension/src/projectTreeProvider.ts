/**
 * M2JS Project Tree Provider - Show project insights in sidebar
 */

import * as vscode from 'vscode';
import * as path from 'path';

export class ProjectTreeProvider implements vscode.TreeDataProvider<ProjectItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<ProjectItem | undefined | null | void> = new vscode.EventEmitter<ProjectItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<ProjectItem | undefined | null | void> = this._onDidChangeTreeData.event;

    constructor() {}

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: ProjectItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: ProjectItem): Thenable<ProjectItem[]> {
        if (!vscode.workspace.workspaceFolders) {
            return Promise.resolve([]);
        }

        if (!element) {
            // Root level items
            return Promise.resolve([
                new ProjectItem(
                    'Project Overview',
                    '📊 Project Analysis',
                    vscode.TreeItemCollapsibleState.Expanded,
                    'overview'
                ),
                new ProjectItem(
                    'Templates',
                    '🎯 Template Generation',
                    vscode.TreeItemCollapsibleState.Expanded,
                    'templates'
                ),
                new ProjectItem(
                    'Quick Actions',
                    '⚡ Quick Actions',
                    vscode.TreeItemCollapsibleState.Expanded,
                    'actions'
                )
            ]);
        }

        // Handle different categories
        switch (element.contextValue) {
            case 'overview':
                return this.getOverviewItems();
            case 'templates':
                return this.getTemplateItems();
            case 'actions':
                return this.getActionItems();
            default:
                return Promise.resolve([]);
        }
    }

    private getOverviewItems(): Promise<ProjectItem[]> {
        const items: ProjectItem[] = [
            new ProjectItem(
                'Analyze Dependencies',
                '📊 Generate dependency graph',
                vscode.TreeItemCollapsibleState.None,
                'action',
                {
                    command: 'm2js.analyzeProject',
                    title: 'Analyze Project',
                    arguments: []
                }
            ),
            new ProjectItem(
                'Show Domains',
                '🎯 View available domain templates',
                vscode.TreeItemCollapsibleState.None,
                'action',
                {
                    command: 'm2js.showDomains',
                    title: 'Show Domains',
                    arguments: []
                }
            )
        ];

        return Promise.resolve(items);
    }

    private getTemplateItems(): Promise<ProjectItem[]> {
        const items: ProjectItem[] = [
            new ProjectItem(
                'E-commerce',
                '🛒 User, Product, Order templates',
                vscode.TreeItemCollapsibleState.Collapsed,
                'domain-ecommerce'
            ),
            new ProjectItem(
                'Blog/CMS',
                '📝 Author, Post, Content templates',
                vscode.TreeItemCollapsibleState.Collapsed,
                'domain-blog'
            ),
            new ProjectItem(
                'REST API',
                '🌐 Service, Controller, Auth templates',
                vscode.TreeItemCollapsibleState.Collapsed,
                'domain-api'
            ),
            new ProjectItem(
                'Template Wizard',
                '🪄 Interactive template creation',
                vscode.TreeItemCollapsibleState.None,
                'action',
                {
                    command: 'm2js.openTemplateWizard',
                    title: 'Open Template Wizard',
                    arguments: []
                }
            )
        ];

        return Promise.resolve(items);
    }

    private getActionItems(): Promise<ProjectItem[]> {
        const items: ProjectItem[] = [
            new ProjectItem(
                'Generate Docs',
                '📝 Analyze current file',
                vscode.TreeItemCollapsibleState.None,
                'action',
                {
                    command: 'm2js.generateDocs',
                    title: 'Generate Documentation',
                    arguments: []
                }
            ),
            new ProjectItem(
                'AI Enhanced',
                '🧠 Full AI analysis',
                vscode.TreeItemCollapsibleState.None,
                'action',
                {
                    command: 'm2js.generateDocsEnhanced',
                    title: 'Generate Enhanced Analysis',
                    arguments: []
                }
            ),
            new ProjectItem(
                'Create Template',
                '🎯 New LLM template',
                vscode.TreeItemCollapsibleState.None,
                'action',
                {
                    command: 'm2js.createTemplate',
                    title: 'Create Template',
                    arguments: []
                }
            )
        ];

        return Promise.resolve(items);
    }
}

export class ProjectItem extends vscode.TreeItem {
    constructor(
        public readonly id: string,
        public readonly label: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly contextValue: string,
        public readonly command?: vscode.Command
    ) {
        super(label, collapsibleState);

        this.tooltip = label;
        this.contextValue = contextValue;
        
        if (command) {
            this.command = command;
        }

        // Set icons based on context
        this.iconPath = this.getIcon(contextValue);
    }

    private getIcon(contextValue: string): vscode.ThemeIcon {
        switch (contextValue) {
            case 'overview':
                return new vscode.ThemeIcon('graph');
            case 'templates':
                return new vscode.ThemeIcon('template');
            case 'actions':
                return new vscode.ThemeIcon('zap');
            case 'domain-ecommerce':
                return new vscode.ThemeIcon('package');
            case 'domain-blog':
                return new vscode.ThemeIcon('book');
            case 'domain-api':
                return new vscode.ThemeIcon('cloud');
            case 'action':
                return new vscode.ThemeIcon('play');
            default:
                return new vscode.ThemeIcon('file');
        }
    }
}