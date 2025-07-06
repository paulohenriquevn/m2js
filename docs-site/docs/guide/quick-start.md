# Quick Start Guide

Get M2JS running in under 5 minutes and start transforming your code into AI-ready documentation.

## Installation

Choose your preferred installation method:

::: code-group

```bash [Global Install (Recommended)]
# Install globally via NPM
npm install -g @paulohenriquevn/m2js

# Verify installation
m2js --version
m2js --help
```

```bash [Project Install]
# Install as dev dependency
npm install --save-dev @paulohenriquevn/m2js

# Add to package.json scripts
{
"scripts": {
"docs:ai": "m2js src/ --batch --output docs/ai/"
}
}
```

```bash [npx (One-time use)]
# Run without installing
npx @paulohenriquevn/m2js src/MyComponent.ts
npx @paulohenriquevn/m2js src/ --batch
```

:::

## Basic Usage

### Transform a Single File

```bash
# Basic transformation
m2js src/UserService.ts

# Custom output location
m2js src/UserService.ts --output docs/UserService.md

# Skip comments (faster processing)
m2js src/UserService.ts --no-comments
```

### Process Entire Directory

```bash
# Process all TypeScript/JavaScript files
m2js src/ --batch

# Process with custom patterns
m2js src/components/ --batch
m2js src/services/ --batch --output docs/services/
```

## First Run Example

Let's transform a sample TypeScript file:

```typescript
// src/Calculator.ts
export class Calculator {
/**
* Adds two numbers together
* @param a First number
* @param b Second number
* @returns Sum of a and b
*/
add(a: number, b: number): number {
return a + b;
}

/**
* Multiplies two numbers
*/
multiply(a: number, b: number): number {
return a * b;
}
}

export function createCalculator(): Calculator {
return new Calculator();
}
```

Run M2JS:

```bash
m2js src/Calculator.ts
```

**Output** (`Calculator.md`):

```markdown
# Calculator.ts

## Functions

### createCalculator
```typescript
export function createCalculator(): Calculator
```

## Classes

### Calculator
```typescript
export class Calculator {
add(a: number, b: number): number
multiply(a: number, b: number): number
}
```

#### Methods

##### add
```typescript
add(a: number, b: number): number
```
Adds two numbers together

**Parameters:**
- `a`: number - First number
- `b`: number - Second number

**Returns:** number - Sum of a and b

##### multiply
```typescript
multiply(a: number, b: number): number
```
Multiplies two numbers
```

## Dependency Analysis

Analyze project structure and relationships:

```bash
# Generate dependency graph
m2js src/ --graph

# Include Mermaid diagrams
m2js src/ --graph --mermaid

# Analyze single file dependencies
m2js src/UserService.ts --graph
```

## Common Workflows

### Code Review Preparation

```bash
# Generate docs for changed files
git diff --name-only HEAD~1 | grep -E '\.(ts|js)$' | xargs m2js

# Process specific module
m2js src/auth/ --batch --output docs/review/
```

### AI Assistant Integration

```bash
# Generate optimized context for ChatGPT/Claude
m2js src/ComplexService.ts --no-comments
# Copy output to your AI chat

# Process entire feature
m2js src/user-management/ --batch
# Share multiple related files
```

### Documentation Generation

```bash
# Generate project documentation
m2js src/ --batch --output docs/api/

# Organize by feature
m2js src/auth/ --batch --output docs/auth/
m2js src/payment/ --batch --output docs/payment/
```

## Performance Tips

### File Size Optimization

- **Small files (< 10KB)**: Process instantly
- **Medium files (10-100KB)**: ~1-5 seconds
- **Large files (100KB-1MB)**: ~5-15 seconds

### Batch Processing

```bash
# Process specific file types
find src/ -name "*.ts" -not -path "*/test/*" | xargs m2js

# Parallel processing (if you have GNU parallel)
find src/ -name "*.ts" | parallel m2js {}
```

### Token Reduction Results

| Original Size | M2JS Output | Reduction |
|---------------|-------------|-----------|
| 15KB TypeScript | 3KB Markdown | **80%** |
| 45KB Class | 8KB Summary | **82%** |
| 120KB Module | 18KB Docs | **85%** |

## Next Steps

- [**Configuration Guide**](/guide/configuration) - Customize M2JS behavior
- [**Best Practices**](/guide/best-practices) - Maximize effectiveness 
- [**VS Code Extension**](/extension/overview) - IDE integration
- [**CLI Reference**](/reference/cli) - Complete command list

## Troubleshooting

### Common Issues

**File not found:**
```bash
# Ensure file exists and path is correct
ls -la src/MyFile.ts
m2js src/MyFile.ts
```

**No exports found:**
```bash
# M2JS only extracts exported code
# Make sure your functions/classes are exported
export function myFunction() { }
export class MyClass { }
```

**Permission errors:**
```bash
# Fix global install permissions
sudo npm install -g @paulohenriquevn/m2js
# Or use npx
npx @paulohenriquevn/m2js src/MyFile.ts
```

### Getting Help

- [Full documentation](/guide/getting-started)
- [Report issues](https://github.com/paulohenriquevn/m2js/issues)
- [Join discussions](https://github.com/paulohenriquevn/m2js/discussions)