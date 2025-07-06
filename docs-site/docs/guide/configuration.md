# 🔧 Configuration

Customize M2JS behavior for your specific workflow and project requirements.

## Command-Line Options

### Basic Usage

```bash
# Input/Output
m2js <path>                    # Source file or directory
m2js src/file.ts -o output.md  # Custom output file

# Processing Control
m2js file.ts --no-comments     # Skip comment extraction
m2js file.ts --graph           # Generate dependency graph
m2js file.ts --graph --mermaid # Include Mermaid diagrams
```

### Complete CLI Reference

| Option | Description | Default |
|--------|-------------|---------|
| `<path>` | File or directory to process | Required |
| `-o, --output <file>` | Output file path | Auto-generated |
| `--no-comments` | Skip JSDoc extraction | `false` |
| `--graph` | Generate dependency analysis | `false` |
| `--mermaid` | Include Mermaid diagrams | `false` |
| `--usage-examples` | Extract usage patterns | `false` |
| `--business-context` | Analyze business domain | `false` |
| `--architecture-insights` | Analyze architecture | `false` |
| `--semantic-analysis` | Analyze relationships | `false` |
| `--ai-enhanced` | Enable all AI features | `false` |

## Package.json Scripts

### Basic Setup

```json
{
  "scripts": {
    "docs:ai": "m2js src/ --batch",
    "docs:services": "m2js src/services/ --batch",
    "docs:review": "m2js $(git diff --name-only main | grep -E '\\.(ts|js)$')"
  }
}
```

### Advanced Workflows

```json
{
  "scripts": {
    "docs:generate": "m2js src/ --batch --output docs/ai/",
    "docs:api": "m2js src/services/ src/api/ --batch --output docs/api/",
    "docs:graph": "m2js src/ --graph --mermaid --output docs/architecture.md",
    "docs:clean": "rm -rf docs/ai/ && npm run docs:generate",
    "review:prep": "git diff --name-only HEAD~1 | grep -E '\\.(ts|js)$' | xargs m2js"
  }
}
```

## Environment Variables

```bash
# Set default output directory
export M2JS_OUTPUT_DIR="docs/ai"
m2js src/file.ts  # Outputs to docs/ai/file.md

# Enable verbose logging
export M2JS_VERBOSE="true"
m2js src/file.ts

# Use in specific commands
M2JS_OUTPUT_DIR=review/ m2js src/changed-files/
```

## Integration Patterns

### GitHub Actions

```yaml
# .github/workflows/docs.yml
name: Generate Documentation
on:
  push:
    paths: ['src/**/*.ts', 'src/**/*.js']

jobs:
  docs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install -g @paulohenriquevn/m2js
      - run: m2js src/ --batch --output docs/ai/
      - uses: actions/upload-artifact@v3
        with:
          name: documentation
          path: docs/ai/
```

### VS Code Tasks

```json
// .vscode/tasks.json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Generate M2JS Documentation",
      "type": "shell",
      "command": "m2js",
      "args": ["${file}"],
      "group": "build"
    }
  ]
}
```

## Common Workflows

### Code Review Preparation

```bash
# Get changed files for review
CHANGED_FILES=$(git diff --name-only main...HEAD | grep -E '\.(ts|js)$')
echo "$CHANGED_FILES" | xargs m2js
```

### Documentation Generation

```bash
# Full project documentation
m2js src/ --batch --output docs/api/

# Service layer documentation
m2js src/services/ --batch --output docs/services/

# Architecture overview
m2js src/ --graph --mermaid --output docs/architecture.md
```

## Performance Tips

### Selective Processing

```bash
# Process only modified files
git diff --name-only | grep -E '\.(ts|js)$' | xargs m2js

# Process by directory
m2js src/components/ --batch
m2js src/services/ --batch
```

### File Organization

```bash
# Organize by feature
m2js src/auth/ --batch --output docs/auth/
m2js src/payment/ --batch --output docs/payment/

# Use find for complex patterns
find src/ -name "*.ts" -not -path "*/test/*" | xargs m2js
```

This configuration approach provides flexibility while keeping M2JS simple and focused.