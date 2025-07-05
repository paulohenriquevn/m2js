# 📊 Dependency Analysis - ./src

## 🔗 Module Dependencies
### Internal Dependencies
- **batch-processor.ts** → `./types`, `./types`, `./parser`, `./generator`, `./generator`
- **cli.ts** → `./parser`, `./generator`, `./generator`, `./generator`, `./types`, `./types`, `./file-scanner`, `./file-scanner`, `./file-scanner`, `./batch-processor`, `./dependency-analyzer`
- **dependency-analyzer.ts** → `./types`, `./types`, `./types`, `./types`
- **file-scanner.ts** → `./types`
- **generator.ts** → `./types`, `./types`, `./types`, `./types`, `./types`, `./types`, `./types`, `./types`, `./types`
- **index.ts** → `./parser`, `./generator`, `./generator`, `./types`
- **parser.ts** → `./types`, `./types`, `./types`, `./types`, `./types`, `./types`, `./types`

### External Dependencies
- **@babel/parser** (used by: dependency-analyzer.ts, parser.ts)
- **@babel/traverse** (used by: dependency-analyzer.ts, parser.ts)
- **@babel/types** (used by: dependency-analyzer.ts, parser.ts)
- **chalk** (used by: cli.ts)
- **commander** (used by: cli.ts)
- **fs** (used by: batch-processor.ts, cli.ts, dependency-analyzer.ts, file-scanner.ts)
- **path** (used by: batch-processor.ts, cli.ts, dependency-analyzer.ts, file-scanner.ts, generator.ts, parser.ts)

## 📈 Dependency Metrics
- **Total Modules**: 15
- **Total Dependencies**: 60
- **Internal Dependencies**: 41
- **External Dependencies**: 19
- **Average Dependencies per Module**: 2.7
- **Most Connected Module**: cli.ts
- **Circular Dependencies**: ❌ None detected

## 🏗️ Architecture Layers
### CLI Layer
- **cli.ts** - Command-line interface and argument parsing
- **commander** - Core functionality

### Core Logic
- **batch-processor.ts** - Batch processing coordination
- **dependency-analyzer.ts** - Dependency analysis and graph building
- **file-scanner.ts** - File system scanning and discovery
- **generator.ts** - Markdown generation and formatting
- **index.ts** - Core functionality
- **parser.ts** - Code parsing and AST analysis
- **parser** - Code parsing and AST analysis
- **traverse** - Core functionality
- **chalk** - Core functionality
- **fs** - Core functionality
- **path** - Core functionality

### Types
- **types.ts** - TypeScript type definitions
- **types** - TypeScript type definitions
