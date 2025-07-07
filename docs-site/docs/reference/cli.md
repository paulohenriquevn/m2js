# CLI Reference

Complete command-line reference for M2JS - AI documentation + smart dead code detection.

## Basic Usage

```bash
# AI Documentation
m2js src/UserService.ts
m2js src/UserService.ts --output docs/UserService.md
m2js src/ --batch

# Smart Dead Code Detection
m2js src/ --detect-unused
m2js src/ --detect-unused --format json
m2js --init-config
```

## Command Options

### Core Options

| Option | Alias | Description | Example |
|--------|-------|-------------|---------|
| `<path>` | - | File or directory to process | `m2js src/file.ts` |
| `--output <file>` | `-o` | Specify output file | `m2js file.ts -o output.md` |
| `--no-comments` | - | Skip JSDoc extraction | `m2js file.ts --no-comments` |
| `--help` | `-h` | Show help | `m2js --help` |
| `--version` | `-V` | Show version | `m2js --version` |

### Dead Code Detection Options

| Option | Description | Example |
|--------|-------------|---------|
| `--detect-unused` | Analyze unused exports and imports | `m2js src/ --detect-unused` |
| `--format <type>` | Output format: table, json | `m2js src/ --detect-unused --format json` |
| `--init-config` | Generate .m2jsrc configuration file | `m2js --init-config` |
| `--help-dead-code` | Show detailed dead code help | `m2js --help-dead-code` |

### AI Documentation Options

| Option | Status | Description |
|--------|--------|-------------|
| `--graph` | Available | Generate dependency analysis |
| `--mermaid` | Available | Include Mermaid diagrams |
| `--usage-examples` | Disabled | Extract usage patterns |
| `--business-context` | Disabled | Analyze business domain |
| `--architecture-insights` | Disabled | Analyze architecture |
| `--semantic-analysis` | Disabled | Analyze relationships |
| `--ai-enhanced` | Disabled | Enable all AI features |

## Examples

### File Processing

```bash
# Basic transformation
m2js src/Calculator.ts

# Custom output location
m2js src/Calculator.ts -o docs/calculator-api.md

# Skip comments for faster processing
m2js src/LargeFile.ts --no-comments
```

### Directory Processing

```bash
# Process entire directory
m2js src/ --batch

# Process specific subdirectory
m2js src/services/ --batch

# Use with shell patterns
m2js src/components/*.ts
```

### Dependency Analysis

```bash
# Basic dependency graph
m2js src/ --graph

# With visual diagrams
m2js src/ --graph --mermaid

# Single file dependencies
m2js src/UserService.ts --graph

# Custom output
m2js src/ --graph -o architecture.md
```

## Supported File Types

- `.ts` - TypeScript files
- `.tsx` - TypeScript React files
- `.js` - JavaScript files
- `.jsx` - JavaScript React files

## Exit Codes

| Code | Meaning |
|------|---------|
| `0` | Success |
| `1` | General error (file not found, unsupported type) |
| `2` | Parse error (invalid syntax) |
| `3` | Permission error |

## Environment Variables

```bash
# Set default output directory
export M2JS_OUTPUT_DIR="docs/ai"

# Enable verbose logging
export M2JS_VERBOSE="true"

# Use in commands
M2JS_OUTPUT_DIR=review/ m2js src/changed-files/
```

## Common Patterns

### Code Review Workflow

```bash
# Generate docs for changed files
git diff --name-only main...HEAD | grep -E '\.(ts|js)$' | xargs m2js
```

### Project Documentation

```bash
# Generate comprehensive docs
m2js src/ --batch --output docs/api/

# Architecture overview
m2js src/ --graph --mermaid --output docs/architecture.md
```

### Integration Scripts

```json
{
"scripts": {
"docs:ai": "m2js src/ --batch",
"docs:review": "git diff --name-only HEAD~1 | grep -E '\\.(ts|js)$' | xargs m2js"
}
}
```

This CLI reference covers all current M2JS functionality and common usage patterns.