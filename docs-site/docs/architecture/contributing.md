# Contributing Guide

Welcome to M2JS! We're excited to have you contribute to making AI-assisted development more accessible.

## Quick Start for Contributors

### 1. Setup Development Environment

```bash
# Clone the repository
git clone https://github.com/paulohenriquevn/m2js.git
cd m2js

# Install dependencies
npm install

# Build and link for local testing
npm run build
npm link

# Verify installation
m2js --help
```

### 2. Development Workflow

```bash
# Make changes to src/
# Run in watch mode
npm run dev

# Test your changes
m2js examples/User.ts

# Run tests
npm test

# Validate before committing
npm run validate
```

## Project Structure

### Core Files

```
src/
cli.ts # CLI interface - entry point
parser.ts # Babel AST parsing core
generator.ts # Markdown generation engine
dependency-analyzer.ts # Dependency graph analysis
batch-processor.ts # Multi-file processing
file-scanner.ts # Directory traversal
types.ts # TypeScript definitions
utils/ # Utility functions

tests/
*.test.ts # Unit tests
fixtures/ # Test data
integration.test.ts # End-to-end tests

docs-site/ # VitePress documentation
docs/ # Documentation content
.vitepress/ # Site configuration
```

### Currently Disabled (Being Rebuilt)

```
src/
enhanced-generator.ts # AI-enhanced analysis (v2.0)
semantic-analyzer.ts # Business entity analysis
template-generator.ts # LLM specification templates
usage-pattern-analyzer.ts # Usage pattern extraction
```

## Development Philosophy

### CLAUDE.md Compliance

All contributions must follow the [CLAUDE.md](https://github.com/paulohenriquevn/m2js/blob/main/CLAUDE.md) principles:

#### 1. KISS (Keep It Simple, Stupid)

```typescript
// Good: Simple, focused function
export function generateMarkdown(parsedFile: ParsedFile): string {
const sections: string[] = [];
sections.push(generateHeader(parsedFile));
sections.push(generateFunctions(parsedFile.functions));
sections.push(generateClasses(parsedFile.classes));
return sections.join('\n\n');
}

// Bad: Over-engineered solution
export class ConfigurableMarkdownTemplateEngineWithPluginSupport {
private templateEngine: TemplateEngine;
private pluginManager: PluginManager;
// ... 200+ lines of complexity
}
```

#### 2. Fail-Fast

```typescript
// Good: Clear, immediate failure
export function parseFile(filePath: string): ParsedFile {
if (!existsSync(filePath)) {
throw new Error(`File not found: ${filePath}`);
}

if (!filePath.match(/\.(ts|tsx|js|jsx)$/)) {
throw new Error(`Unsupported file type: ${filePath}`);
}

try {
return babel.parse(readFileSync(filePath, 'utf8'));
} catch (error) {
throw new Error(`Parse error in ${filePath}: ${error.message}`);
}
}

// Bad: Silent failures
export function parseFile(filePath: string): ParsedFile | null {
try {
return babel.parse(readFileSync(filePath, 'utf8'));
} catch {
return null; // User doesn't know what happened
}
}
```

#### 3. Vertical Slice

Every feature must be end-to-end functional:

```
CLI Command → Parser → Logic → File Output → Manual Testing
```

Never implement horizontal layers without immediate value.

#### 4. Anti-Mock

Use real files and real parsing in development and testing:

```typescript
// Good: Real file testing
test('should parse real TypeScript file', () => {
const result = parseFile('./tests/fixtures/UserService.ts');
expect(result.functions).toHaveLength(3);
});

// Bad: Mock everything
test('should parse file', () => {
const mockParser = jest.fn().mockReturnValue({ functions: [] });
// ... testing mocks, not real behavior
});
```

## Code Quality Standards

### TypeScript Requirements

```typescript
// tsconfig.json compliance
{
"strict": true, // Strict mode enabled
"noImplicitAny": true, // No 'any' types
"noImplicitReturns": true, // All paths return values
"noUnusedLocals": true, // No unused variables
"noUnusedParameters": true // No unused parameters
}

// Never use 'any'
function process(data: any): any { }

// Always use explicit types
function processUser(user: User): UserResult { }
```

### File Size Limits

```typescript
// Hard limits from CLAUDE.md
- Files: < 300 lines maximum
- Functions: < 30 lines maximum
- Cyclomatic complexity: < 10
- Nesting depth: < 3 levels
```

### ESLint Rules

```bash
# Required passing checks
npm run lint # Zero warnings allowed
npm run type-check # Zero TypeScript errors
npm test # All tests must pass
```

## Types of Contributions

### Bug Fixes

**Process:**
1. Create issue describing the bug
2. Write failing test that reproduces the bug
3. Fix the bug with minimal changes
4. Ensure test passes
5. Submit PR with test + fix

**Example Bug Fix:**

```typescript
// Issue: M2JS doesn't handle arrow functions in classes
class UserService {
// This wasn't being parsed correctly
validateUser = (user: User): boolean => {
return user.email && user.password;
}
}
```

### Feature Additions

**Requirements:**
- Must follow vertical slice principle
- Must include comprehensive tests
- Must update documentation
- Must maintain performance standards

**Current Priority Features:**

1. **Additional Language Support**
```typescript
// Add support for new file types
const SUPPORTED_EXTENSIONS = [
'.ts', '.tsx', '.js', '.jsx',
'.vue', '.svelte' // New additions
];
```

2. **Enhanced Markdown Output**
```typescript
// Add new output formats
export interface GeneratorOptions {
format: 'standard' | 'github' | 'gitlab' | 'confluence';
includeComments: boolean;
collapsibleSections: boolean;
}
```

3. **Performance Optimizations**
```typescript
// Caching system for large projects
export interface CacheOptions {
enabled: boolean;
directory: string;
ttl: number;
}
```

### Documentation

**Types:**
- Code examples and tutorials
- Use case documentation
- Integration guides
- API reference improvements

**Standards:**
- All examples must be tested and working
- Include both simple and complex scenarios
- Focus on real-world usage patterns

### Testing

**Test Categories:**

1. **Unit Tests** (`*.test.ts`)
```typescript
describe('Parser', () => {
it('should extract exported functions', () => {
const code = 'export function test() {}';
const result = parseCode(code);
expect(result.functions).toHaveLength(1);
});
});
```

2. **Integration Tests** (`integration.test.ts`)
```typescript
describe('CLI Integration', () => {
it('should process file end-to-end', async () => {
await execAsync('m2js tests/fixtures/example.ts');
const output = await readFile('example.md', 'utf8');
expect(output).toContain('# example.ts');
});
});
```

3. **Performance Tests**
```typescript
describe('Performance', () => {
it('should process 100KB file under 5 seconds', async () => {
const start = Date.now();
await parseFile('./tests/fixtures/large-file.ts');
const duration = Date.now() - start;
expect(duration).toBeLessThan(5000);
});
});
```

## Submitting Changes

### Pull Request Process

1. **Fork & Branch**
```bash
git checkout -b feature/amazing-feature
git checkout -b fix/parser-bug
git checkout -b docs/better-examples
```

2. **Development Cycle**
```bash
# Make changes
npm run dev # Watch mode

# Test changes
m2js examples/test.ts
npm test

# Validate code quality
npm run validate
```

3. **Commit Standards**
```bash
# Use conventional commits
git commit -m "feat: add Vue.js file support"
git commit -m "fix: handle arrow functions in classes"
git commit -m "docs: add integration examples"
git commit -m "test: improve parser coverage"
```

4. **Pre-submission Checklist**
- [ ] All tests pass (`npm test`)
- [ ] TypeScript compiles (`npm run type-check`)
- [ ] Linting passes (`npm run lint`)
- [ ] Manual testing with real files
- [ ] Documentation updated if needed
- [ ] CHANGELOG.md updated

### PR Template

```markdown
## Description
Brief description of the change and which issue it fixes.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed

## Checklist
- [ ] Code follows CLAUDE.md principles
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] All tests pass
```

## Advanced Contributions

### Re-enabling AI Features

The enhanced analysis features are temporarily disabled. To re-enable:

1. **Fix TypeScript Issues**
```typescript
// These files need proper type definitions
src/enhanced-generator.ts
src/semantic-analyzer.ts
src/template-generator.ts
src/usage-pattern-analyzer.ts
```

2. **Integration Requirements**
```typescript
// Must integrate with CLI without breaking existing functionality
if (options.aiEnhanced) {
return generateEnhancedMarkdown(parsedFile, options);
} else {
return generateMarkdown(parsedFile);
}
```

3. **Performance Standards**
```typescript
// AI features must not significantly impact performance
// Target: < 2x slowdown compared to basic processing
```

### Architecture Improvements

**Current Limitations:**

1. **Scalability**: Large projects (1000+ files) need optimization
2. **Memory Usage**: High memory consumption on large files
3. **Extensibility**: Plugin system for custom analyzers

**Contribution Opportunities:**

1. **Caching System**
```typescript
interface CacheManager {
get(filePath: string): ParsedFile | null;
set(filePath: string, result: ParsedFile): void;
invalidate(filePath: string): void;
}
```

2. **Streaming Parser**
```typescript
// Process large files in chunks
interface StreamingParser {
parseChunk(chunk: string): Partial<ParsedFile>;
finalize(): ParsedFile;
}
```

3. **Plugin Architecture**
```typescript
interface Analyzer {
name: string;
analyze(parsedFile: ParsedFile): AnalysisResult;
}
```

## Getting Help

### Development Questions

- **GitHub Discussions**: General questions and ideas
- **GitHub Issues**: Bug reports and feature requests 
- **Code Review**: PR feedback and guidance

### Real-time Communication

- Check existing issues before creating new ones
- Tag maintainers for urgent questions: `@paulohenriquevn`
- Include minimal reproduction examples

### Resources

- **CLAUDE.md**: Project principles and standards
- **Architecture docs**: System design and components
- **Test files**: Examples of expected behavior
- **NPM package**: Latest stable release for testing

Remember: M2JS prioritizes simplicity and reliability over complex features. Every contribution should make the tool better for its core mission: transforming code into AI-ready documentation.