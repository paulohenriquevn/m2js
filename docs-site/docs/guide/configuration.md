# Configuration

Customize M2JS to fit your workflow and project needs.

## Configuration File

Create a `.m2jsrc.json` file in your project root:

```json
{
  "aiEnhanced": true,
  "businessContext": true,
  "architectureInsights": true,
  "semanticAnalysis": true,
  "tokenOptimization": "balanced",
  "outputDirectory": "docs/api",
  "includePrivateMembers": false,
  "defaultFormat": "ai-enhanced"
}
```

## VS Code Settings

Configure the extension via `settings.json`:

```json
{
  "m2js.enableAutoAnalysis": false,
  "m2js.defaultOutputFormat": "ai-enhanced",
  "m2js.outputDirectory": "m2js-output",
  "m2js.autoOpenResults": true,
  "m2js.tokenOptimization": "balanced"
}
```

## Options Reference

### Core Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `aiEnhanced` | boolean | `false` | Enable all AI features |
| `businessContext` | boolean | `false` | Analyze business domain |
| `architectureInsights` | boolean | `false` | Detect design patterns |
| `semanticAnalysis` | boolean | `false` | Extract relationships |

### Output Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `outputDirectory` | string | `"."` | Output directory for files |
| `tokenOptimization` | string | `"balanced"` | Token optimization level |
| `includePrivateMembers` | boolean | `false` | Include private methods |
| `defaultFormat` | string | `"standard"` | Default output format |

## Best Practices

See our [best practices guide](/guide/ai-enhancement) for optimization tips.