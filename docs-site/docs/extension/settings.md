# Extension Settings

Complete configuration reference for the M2JS VS Code extension.

## Core Settings

### `m2js.enableAutoAnalysis`
- **Type**: boolean
- **Default**: `false`
- **Description**: Automatically analyze files when opened

### `m2js.defaultOutputFormat`
- **Type**: string
- **Options**: `"standard"`, `"ai-enhanced"`, `"template"`
- **Default**: `"standard"`
- **Description**: Default output format for analysis

### `m2js.outputDirectory`
- **Type**: string
- **Default**: `"m2js-output"`
- **Description**: Directory name for output files

### `m2js.autoOpenResults`
- **Type**: boolean
- **Default**: `true`
- **Description**: Automatically open generated files

## AI Enhancement Settings

### `m2js.enableBusinessContext`
- **Type**: boolean
- **Default**: `true`
- **Description**: Enable business context analysis

### `m2js.enableArchitectureInsights`
- **Type**: boolean
- **Default**: `true`
- **Description**: Enable architecture pattern detection

### `m2js.tokenOptimization`
- **Type**: string
- **Options**: `"minimal"`, `"balanced"`, `"detailed"`
- **Default**: `"balanced"`
- **Description**: Token optimization level

## Display Settings

### `m2js.webview.theme`
- **Type**: string
- **Options**: `"auto"`, `"light"`, `"dark"`
- **Default**: `"auto"`
- **Description**: Webview theme preference

### `m2js.webview.fontSize`
- **Type**: string
- **Default**: `"14px"`
- **Description**: Font size for webview content

## Example Configuration

```json
{
  "m2js.enableAutoAnalysis": false,
  "m2js.defaultOutputFormat": "ai-enhanced",
  "m2js.outputDirectory": "docs/generated",
  "m2js.autoOpenResults": true,
  "m2js.enableBusinessContext": true,
  "m2js.enableArchitectureInsights": true,
  "m2js.tokenOptimization": "balanced",
  "m2js.webview.theme": "auto",
  "m2js.webview.fontSize": "14px"
}
```