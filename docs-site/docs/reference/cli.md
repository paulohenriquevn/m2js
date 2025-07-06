# CLI Reference

Complete command-line interface reference for M2JS.

## Installation

```bash
npm install -g @paulohenriquevn/m2js
```

## Basic Usage

```bash
m2js [file/directory] [options]
```

## Commands

### Basic Analysis

```bash
# Analyze a single file
m2js UserService.ts

# Analyze multiple files
m2js src/services/

# Analyze with custom output
m2js UserService.ts --output UserService.docs.md
```

### AI-Enhanced Analysis

```bash
# Full AI analysis
m2js UserService.ts --ai-enhanced

# With business context
m2js UserService.ts --business-context

# With architecture insights
m2js UserService.ts --architecture-insights

# With semantic analysis
m2js UserService.ts --semantic-analysis
```

## Options

| Option | Description | Default |
|--------|-------------|---------|
| `--ai-enhanced` | Enable all AI features | `false` |
| `--business-context` | Analyze business domain | `false` |
| `--architecture-insights` | Detect design patterns | `false` |
| `--semantic-analysis` | Extract relationships | `false` |
| `--output, -o` | Output file path | `[filename].md` |
| `--batch` | Process multiple files | `false` |
| `--help, -h` | Show help | - |
| `--version, -v` | Show version | - |

## Examples

See the [Examples](/examples/basic) section for real-world usage scenarios.