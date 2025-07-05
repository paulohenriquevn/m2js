# 📁 ./src/dependency-analyzer.ts

## 📦 Exports
- **Functions**: 3 exported functions

## 🔧 Functions

### extractFileDependencies
/***
 * Extract dependencies from a single file's AST
 */


**Parameters:**
- filePath: string
- content: string

**Returns:** DependencyRelationship[]

```typescript
export function extractFileDependencies(filePath: string, content: string): DependencyRelationship[]
```

### analyzeDependencies
/***
 * Analyze dependencies for an array of files
 */


**Parameters:**
- files: string[]
- options?: GraphOptions

**Returns:** DependencyGraph

```typescript
export function analyzeDependencies(files: string[], options?: GraphOptions): DependencyGraph
```

### resolveModulePath
/***
 * Resolve relative paths to absolute paths within project
 */


**Parameters:**
- fromFile: string
- toModule: string

**Returns:** string

```typescript
export function resolveModulePath(fromFile: string, toModule: string): string
```