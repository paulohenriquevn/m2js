# Extension Commands

Complete reference for all VS Code extension commands.

## Available Commands

### Generate Documentation
**Command**: `m2js.generateDocs`
- **Purpose**: Basic code documentation generation
- **Access**: Right-click menu, Command Palette
- **Output**: Standard Markdown documentation

### Generate AI-Enhanced Analysis 
**Command**: `m2js.generateDocsEnhanced`
- **Purpose**: Full AI-powered analysis
- **Access**: Right-click menu, Command Palette 
- **Output**: AI-enhanced documentation with business context

### Create LLM Template
**Command**: `m2js.createTemplate`
- **Purpose**: Generate implementation guides
- **Access**: Right-click menu, Command Palette
- **Output**: Domain-specific templates

### Analyze Project Dependencies
**Command**: `m2js.analyzeProject`
- **Purpose**: Project-wide analysis
- **Access**: Right-click menu, Command Palette
- **Output**: Dependency graphs and architecture insights

### Template Wizard
**Command**: `m2js.openTemplateWizard`
- **Purpose**: Interactive template creation
- **Access**: Command Palette
- **Output**: Custom implementation guides

### Show Available Domains
**Command**: `m2js.showDomains`
- **Purpose**: Browse domain templates
- **Access**: Command Palette
- **Output**: Domain template catalog

## Keyboard Shortcuts

You can assign custom keyboard shortcuts in VS Code:

1. Open Command Palette (`Ctrl+Shift+P`)
2. Search "Preferences: Open Keyboard Shortcuts"
3. Search for "M2JS" commands
4. Assign your preferred shortcuts

### Suggested Shortcuts

```json
{
"key": "ctrl+shift+m ctrl+d",
"command": "m2js.generateDocs"
},
{
"key": "ctrl+shift+m ctrl+a", 
"command": "m2js.generateDocsEnhanced"
},
{
"key": "ctrl+shift+m ctrl+t",
"command": "m2js.createTemplate"
}
```