# 📁 ./src/generator.ts

## 📦 Exports
- **Functions**: 3 exported functions

## 🔧 Functions

### generateMarkdown

**Parameters:**
- parsedFile: ParsedFile
- _options?: GeneratorOptions

**Returns:** string

```typescript
export function generateMarkdown(parsedFile: ParsedFile, _options?: GeneratorOptions): string
```

### getOutputPath

**Parameters:**
- inputPath: string
- customOutput?: string

**Returns:** string

```typescript
export function getOutputPath(inputPath: string, customOutput?: string): string
```

### generateDependencyMarkdown
/***
 * Generate comprehensive dependency graph markdown
 */


**Parameters:**
- graph: DependencyGraph
- options?: GraphOptions

**Returns:** string

```typescript
export function generateDependencyMarkdown(graph: DependencyGraph, options?: GraphOptions): string
```