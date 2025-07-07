# M2JS Architecture Documentation

🏗️ **Comprehensive guide to M2JS design, architecture, and implementation decisions**

## 📋 Table of Contents

1. [System Overview](#system-overview)
2. [Core Architecture](#core-architecture)
3. [Dead Code Detection Pipeline](#dead-code-detection-pipeline)
4. [Graph-Deep Diff Analysis](#graph-deep-diff-analysis)
5. [AI Enhancement Pipeline](#ai-enhancement-pipeline)
6. [VS Code Extension Architecture](#vs-code-extension-architecture)
7. [CI/CD Pipeline](#cicd-pipeline)
8. [Performance & Scalability](#performance--scalability)
9. [Security & Privacy](#security--privacy)
10. [Design Decisions](#design-decisions)

## System Overview

### 🎯 Mission Statement
M2JS transforms TypeScript/JavaScript code into LLM-friendly Markdown documentation with 60-90% token reduction, provides intelligent dead code detection with confidence levels, and offers architectural change analysis between git references - enabling better AI coding assistant interactions and safer codebase maintenance.

### 🏗️ High-Level Architecture
```mermaid
graph TB
    A[Source Code] --> B[M2JS CLI]
    A1[Git Repository] --> B
    B --> C[Babel Parser]
    C --> D[AST Analysis]
    D --> E[AI Enhancement Pipeline]
    D --> E2[Dead Code Analyzer]
    D --> E3[Graph Diff Analyzer]
    E --> F[Markdown Generator]
    E2 --> F2[Dead Code Reporter]
    E3 --> F3[Architectural Diff Reporter]
    F --> G[Optimized Output]
    F2 --> G2[Cleanup Suggestions]
    F3 --> G3[Health Score & Recommendations]
    
    H[VS Code Extension] --> B
    I[GitHub Actions] --> B
    J[NPM Package] --> B
    
    E --> K[Business Context]
    E --> L[Architecture Analysis]
    E --> M[Semantic Analysis]
    E --> N[Template Generation]
    
    E2 --> O[Confidence Assessment]
    E2 --> P[Risk Analysis]
    E2 --> Q[Usage Tracking]
    
    E3 --> R[Git Integration]
    E3 --> S[Change Detection]
    E3 --> T[Impact Scoring]
```

### 🎯 Key Value Propositions
1. **Token Efficiency**: 60-90% reduction in LLM context size
2. **Business Intelligence**: Automatic domain and pattern detection
3. **Dead Code Intelligence**: Confidence-based unused code detection
4. **Architectural Health**: Git-based change analysis and health scoring
5. **Developer Experience**: Native IDE integration with VS Code
6. **Template-Driven Development**: LLM-guided implementation guides
7. **Zero Configuration**: Works out-of-the-box with smart defaults

## Core Architecture

### 🧩 Component Breakdown

#### 1. CLI Engine (`src/cli.ts`)
**Responsibility**: Command-line interface and orchestration
- Argument parsing with Commander.js
- File discovery and validation
- Output formatting and streaming
- Error handling and user feedback

```typescript
// Core CLI architecture
CLI → File Scanner → Parser → Generator → Output
```

#### 2. Parser Engine (`src/parser.ts`)
**Responsibility**: TypeScript/JavaScript AST analysis
- Babel parser integration
- Type extraction and resolution
- JSDoc comment processing
- Export detection and filtering

```typescript
// Parser pipeline
Source Code → Babel AST → Type Analysis → Export Extraction → Structured Data
```

#### 3. Generator Engine (`src/generator.ts`)
**Responsibility**: Markdown generation and optimization
- Template-based output generation
- Token optimization strategies
- Dependency graph creation
- Mermaid diagram generation

```typescript
// Generator pipeline
Parsed Data → Template Engine → Token Optimization → Markdown Output
```

#### 4. Dead Code Analyzer (`src/dead-code-*.ts`)
**Responsibility**: Intelligent unused code detection with risk assessment
- Cross-file usage analysis
- Confidence-based scoring (High/Medium/Low)
- Risk factor evaluation
- Actionable removal suggestions

```typescript
// Dead Code Analysis pipeline
Source Files → Usage Analysis → Cross-Reference → Confidence Assessment → Risk Analysis → Suggestions
```

#### 5. Graph Diff Analyzer (`src/graph-diff-*.ts`)
**Responsibility**: Architectural change detection between git references
- Git repository integration
- Dependency graph comparison
- Health score calculation
- Impact assessment and recommendations

```typescript
// Graph Diff Analysis pipeline
Git Refs → Temp Workspaces → Dependency Graphs → Change Detection → Impact Scoring → Health Analysis
```

#### 6. AI Enhancement Pipeline
**Responsibility**: Intelligent analysis and context extraction

##### Business Context Analyzer (`src/business-context-analyzer.ts`)
- Domain detection (e-commerce, blog, API, etc.)
- Framework identification (React, Express, etc.)
- Business rule extraction from JSDoc
- Pattern recognition (Repository, Service Layer, etc.)

##### Architecture Analyzer (`src/architecture-analyzer.ts`)
- Layer architecture detection (MVC, Onion, etc.)
- Design pattern identification
- Dependency analysis
- Code organization insights

##### Semantic Analyzer (`src/semantic-analyzer.ts`)
- Entity relationship extraction
- Business workflow detection
- State transition analysis
- Data flow mapping

##### Usage Pattern Analyzer (`src/usage-pattern-analyzer.ts`)
- Function usage examples
- API pattern detection
- Error handling analysis
- Performance consideration extraction

### 🔄 Data Flow Architecture

```mermaid
sequenceDiagram
    participant User
    participant CLI
    participant Parser
    participant AI_Pipeline
    participant Generator
    participant Output
    
    User->>CLI: m2js file.ts --ai-enhanced
    CLI->>Parser: Parse TypeScript file
    Parser->>AI_Pipeline: Send parsed AST
    AI_Pipeline->>AI_Pipeline: Business Context Analysis
    AI_Pipeline->>AI_Pipeline: Architecture Analysis
    AI_Pipeline->>AI_Pipeline: Semantic Analysis
    AI_Pipeline->>Generator: Enhanced metadata
    Generator->>Output: Optimized Markdown
    Output->>User: 80% token reduction
```

## Dead Code Detection Pipeline

### 🧹 Smart Dead Code Detection Architecture

```mermaid
graph TB
    A[Source Files] --> B[File Scanner]
    B --> C[AST Parser]
    C --> D[Export Extractor]
    C --> E[Import Extractor]
    D --> F[Usage Analyzer]
    E --> F
    F --> G[Cross-Reference Engine]
    G --> H[Confidence Calculator]
    H --> I[Risk Assessor]
    I --> J[Suggestion Generator]
    J --> K[LLM-Friendly Report]
    
    L[Performance Cache] --> C
    M[Configuration] --> F
    N[Progress Tracker] --> K
```

### 🎯 Confidence Scoring Algorithm

```typescript
interface ConfidenceFactors {
  isExported: boolean;           // -30 points if true
  hasExternalNaming: boolean;    // -20 points if suggests external use
  isTypeDefinition: boolean;     // -25 points if true
  isFrameworkImport: boolean;    // -20 points if true
  isDefaultExport: boolean;      // -15 points if true
  isTestFile: boolean;          // +10 points if true
  hasDocumentation: boolean;     // -10 points if true
  usageCount: number;           // Direct impact on confidence
}

function calculateConfidence(factors: ConfidenceFactors): ConfidenceLevel {
  let score = 100;
  
  // Apply penalties and bonuses
  score -= factors.isExported ? 30 : 0;
  score -= factors.hasExternalNaming ? 20 : 0;
  score -= factors.isTypeDefinition ? 25 : 0;
  // ... more factors
  
  if (score >= 80) return 'HIGH';
  if (score >= 50) return 'MEDIUM';
  return 'LOW';
}
```

### 🔍 Risk Assessment Matrix

| Risk Factor | Impact | Reasoning |
|-------------|--------|-----------|
| **Export Name Pattern** | High | Names like `createApi`, `utils` suggest external usage |
| **Framework Import** | High | React hooks, Next.js functions may be used implicitly |
| **Type Definition** | Medium | TypeScript types used in annotations |
| **Default Export** | Medium | Can be imported with any name |
| **Test File Location** | Low | Test framework may use exports |
| **Documentation Present** | Low | Documented code likely has purpose |

### ⚡ Performance Optimization

#### LRU Cache Implementation
```typescript
class DeadCodeCache {
  private cache = new Map<string, CacheEntry>();
  private maxSize = 1000;
  
  get(filePath: string): ParsedFile | null {
    const entry = this.cache.get(filePath);
    if (!entry) return null;
    
    // Check if file modified since cache
    const stats = fs.statSync(filePath);
    if (stats.mtime > entry.timestamp) {
      this.cache.delete(filePath);
      return null;
    }
    
    // Move to end (LRU)
    this.cache.delete(filePath);
    this.cache.set(filePath, entry);
    return entry.data;
  }
}
```

## Graph-Deep Diff Analysis

### 🏗️ Architectural Change Detection System

```mermaid
graph TB
    A[Git Repository] --> B[GitIntegrator]
    B --> C[Baseline Ref Resolution]
    B --> D[Current Ref Resolution]
    C --> E[Temp Workspace Creation]
    D --> F[Current Analysis]
    E --> G[Baseline Analysis]
    F --> H[Dependency Graph Current]
    G --> I[Dependency Graph Baseline]
    H --> J[Graph Diff Engine]
    I --> J
    J --> K[Change Detection]
    K --> L[Impact Assessment]
    L --> M[Health Score Calculation]
    M --> N[Recommendation Engine]
    N --> O[LLM-Friendly Report]
```

### 📊 Health Score Calculation

```typescript
function calculateHealthScore(metrics: GraphMetrics): number {
  let score = 100;
  
  // Penalize circular dependencies heavily
  score -= metrics.circularDependencies.length * 10;
  
  // Penalize high coupling
  const avgCoupling = metrics.averageDependencies;
  if (avgCoupling > 5) {
    score -= (avgCoupling - 5) * 5;
  }
  
  // Penalize too many external dependencies relative to modules
  const externalRatio = metrics.totalNodes > 0 ? 
    metrics.externalDependencies / metrics.totalNodes : 0;
  if (externalRatio > 2) {
    score -= (externalRatio - 2) * 10;
  }
  
  // Penalize complexity hotspots
  score -= (metrics.hotspots?.length || 0) * 3;
  
  return Math.max(0, Math.min(100, score));
}
```

### 🔄 Change Detection Categories

#### 1. Circular Dependencies
- **Detection**: Compare circular dependency arrays between refs
- **Severity**: Critical if new circles, Low if resolved
- **Impact**: High negative impact on maintainability and testability

#### 2. Coupling Changes
- **Detection**: Average dependencies per module analysis
- **Severity**: Based on magnitude of change (threshold: 0.5)
- **Impact**: Affects modularity and maintainability

#### 3. External Dependencies
- **Detection**: NPM package additions/removals
- **Severity**: Medium for additions, Low for removals
- **Impact**: Maintenance burden and security considerations

#### 4. Layer Violations
- **Detection**: Heuristic analysis of architectural boundaries
- **Example**: UI components directly importing database modules
- **Severity**: High - breaks architectural principles

#### 5. Complexity Hotspots
- **Detection**: Modules with above-average coupling
- **Threshold**: 1.5x average dependencies
- **Impact**: Difficulty in testing and maintaining specific modules

### 🎯 Impact Scoring Algorithm

```typescript
interface ChangeImpact {
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  maintainability: number;    // -5 to +5
  performance: number;        // -5 to +5  
  testability: number;        // -5 to +5
  overallScore: number;       // Sum of above
  reasoning: string;
  affectedAreas: string[];
}

function calculateImpact(change: ArchitecturalChange): ChangeImpact {
  switch (change.type) {
    case 'circular-dependency-introduced':
      return {
        riskLevel: 'critical',
        maintainability: -3,
        performance: -1,
        testability: -2,
        overallScore: -6,
        reasoning: 'Circular dependencies make code harder to understand, test, and maintain',
        affectedAreas: ['maintainability', 'testability', 'code organization']
      };
    // ... more cases
  }
}
```

### 🔗 Git Integration Architecture

```typescript
class GitIntegrator {
  // Create temporary workspace with files from specific git ref
  async createTempWorkspace(ref: string): Promise<string> {
    const tempDir = path.join(tmpdir(), `m2js-workspace-${ref}-${Date.now()}`);
    const files = this.getFilesAtRef(ref);
    
    // Copy files maintaining directory structure
    for (const file of files) {
      const content = this.getFileContentAtRef(file, ref);
      const tempPath = path.join(tempDir, path.relative(this.repoPath, file));
      fs.writeFileSync(tempPath, content);
    }
    
    return tempDir;
  }
  
  // Cleanup temporary workspace
  cleanupWorkspace(workspacePath: string): void {
    fs.rmSync(workspacePath, { recursive: true, force: true });
  }
}
```

## AI Enhancement Pipeline

### 🧠 Intelligence Layers

#### Layer 1: Syntactic Analysis
- **Input**: Raw TypeScript/JavaScript code
- **Process**: Babel AST parsing, type extraction
- **Output**: Structured representation of exports
- **Value**: Clean, noise-free code representation

#### Layer 2: Semantic Analysis
- **Input**: Parsed AST + type information
- **Process**: Entity detection, relationship mapping
- **Output**: Business domain model
- **Value**: Understanding of what the code represents

#### Layer 3: Contextual Analysis
- **Input**: Semantic model + code patterns
- **Process**: Framework detection, pattern recognition
- **Output**: Architectural insights
- **Value**: Understanding of how the code fits in larger system

#### Layer 4: Intent Analysis
- **Input**: All previous layers + JSDoc comments
- **Process**: Business rule extraction, workflow detection
- **Output**: Intent and purpose documentation
- **Value**: Understanding of why the code exists

### 🎯 Domain Detection Strategy

```typescript
// Example domain detection scoring
const domainPatterns = {
  ecommerce: {
    entities: ['User', 'Product', 'Order', 'Cart', 'Payment'],
    methods: ['addToCart', 'checkout', 'processPayment'],
    imports: ['stripe', 'paypal', 'shopping-cart'],
    confidence: calculateConfidence(matches)
  },
  blog: {
    entities: ['Post', 'Author', 'Comment', 'Category'],
    methods: ['publish', 'moderate', 'subscribe'],
    imports: ['markdown', 'cms', 'blog-engine'],
    confidence: calculateConfidence(matches)
  }
};
```

### 📊 Confidence Scoring Algorithm

```typescript
function calculateConfidence(matches: DomainMatch[]): number {
  const weights = {
    entityMatch: 0.4,      // 40% weight for entity names
    methodMatch: 0.3,      // 30% weight for method patterns
    importMatch: 0.2,      // 20% weight for imports
    commentMatch: 0.1      // 10% weight for JSDoc keywords
  };
  
  return Math.min(100, weightedSum(matches, weights));
}
```

## VS Code Extension Architecture

### 🔌 Extension Component Architecture

```mermaid
graph TB
    A[Extension Host] --> B[Extension Entry Point]
    B --> C[Command Manager]
    B --> D[Webview Provider]
    B --> E[Tree Data Provider]
    B --> F[M2JS Manager]
    
    C --> G[Generate Docs]
    C --> H[Enhanced Analysis]
    C --> I[Template Wizard]
    
    D --> J[Result Display]
    D --> K[Interactive UI]
    
    E --> L[Project Sidebar]
    
    F --> M[CLI Bridge]
    F --> N[Auto-detection]
```

#### Core Components

##### 1. Extension Entry Point (`src/extension.ts`)
- Extension activation and deactivation
- Command registration
- Event handler setup
- Configuration management

##### 2. M2JS Manager (`src/m2jsManager.ts`)
- CLI integration and bridge
- Auto-detection of M2JS installation
- Command execution and result processing
- Error handling and user feedback

##### 3. Webview Provider (`src/webviewProvider.ts`)
- Interactive result display
- HTML generation with VS Code theming
- User action handling (copy, save, etc.)
- Auto-save to workspace functionality

##### 4. Template Wizard (`src/templateWizard.ts`)
- Interactive template creation
- Domain selection and configuration
- Progressive disclosure UI
- Integration with template generator

##### 5. Project Tree Provider (`src/projectTreeProvider.ts`)
- Project sidebar integration
- Quick action organization
- Category-based navigation
- Command shortcuts

### 🎨 User Experience Flow

```mermaid
journey
    title M2JS VS Code User Journey
    section Discovery
      Install Extension: 5: User
      See Context Menu: 4: User
      Try First Analysis: 5: User
    section Daily Usage
      Right-click File: 5: User
      Review Results: 4: User
      Copy for AI: 5: User
      Save to Project: 4: User
    section Advanced Features
      Open Template Wizard: 3: User
      Configure Settings: 3: User
      Analyze Project: 4: User
```

## CI/CD Pipeline

### 🔄 Automated Workflow Architecture

```mermaid
graph LR
    A[Git Push] --> B[GitHub Actions]
    B --> C[Quality Gate]
    C --> D[Build & Test]
    D --> E[Security Scan]
    E --> F[Performance Test]
    F --> G[Package Build]
    G --> H[Release Creation]
    H --> I[NPM Publish]
    H --> J[VS Code Marketplace]
    H --> K[Documentation Update]
```

#### Pipeline Components

##### 1. Quality Gate (`ci.yml`)
- Multi-Node.js version testing (16, 18, 20)
- TypeScript compilation validation
- ESLint and Prettier checks
- Unit and integration tests
- Code coverage reporting

##### 2. Security Pipeline
- npm audit for vulnerabilities
- CodeQL static analysis
- Dependency scanning
- License compliance checking

##### 3. Performance Pipeline
- Benchmark execution on various file sizes
- Memory usage profiling
- CLI startup time measurement
- Regression detection

##### 4. Release Pipeline (`release.yml`)
- Automated version management
- Changelog generation
- Dual publishing (NPM + VS Code)
- Asset creation and upload

### 📊 Quality Metrics

```yaml
Quality Gates:
  - Test Coverage: >80%
  - TypeScript Strict: 100% compliance
  - ESLint: Zero errors
  - Security: Zero high/critical vulnerabilities
  - Performance: <2s processing for <1MB files
  - Build: 100% success rate across all Node versions
```

## Performance & Scalability

### ⚡ Performance Optimization Strategies

#### 1. Parser Optimization
- **Lazy Loading**: Only parse exported symbols
- **Caching**: AST caching for repeated analysis
- **Streaming**: Process large files in chunks
- **Parallel Processing**: Multi-file batch processing

#### 2. Memory Management
- **Garbage Collection**: Explicit cleanup of large ASTs
- **Memory Pooling**: Reuse parser instances
- **Streaming Output**: Don't hold entire output in memory

#### 3. Token Optimization Levels

```typescript
const optimizationLevels = {
  minimal: {
    includeComments: false,
    includeTypes: false,
    includeExamples: false,
    reduction: "90%"
  },
  balanced: {
    includeComments: true,
    includeTypes: true, 
    includeExamples: false,
    reduction: "70%"
  },
  detailed: {
    includeComments: true,
    includeTypes: true,
    includeExamples: true,
    reduction: "50%"
  }
};
```

### 📈 Scalability Considerations

#### File Size Handling
- **Small Files** (<10KB): Full analysis
- **Medium Files** (10KB-1MB): Selective analysis
- **Large Files** (>1MB): Streaming analysis with progress

#### Project Scale
- **Small Projects** (<100 files): Full dependency analysis
- **Medium Projects** (100-1000 files): Selective analysis
- **Large Projects** (>1000 files): On-demand analysis

## Security & Privacy

### 🛡️ Security Architecture

#### 1. Local Processing Model
- **Zero Cloud Processing**: All analysis runs locally
- **No Data Collection**: Zero telemetry or usage tracking
- **Offline Capability**: Works without internet connection

#### 2. Input Validation
- **File Type Validation**: Only process supported extensions
- **Path Validation**: Prevent directory traversal
- **Size Limits**: Prevent resource exhaustion
- **Content Sanitization**: Escape special characters in output

#### 3. Output Security
- **XSS Prevention**: Sanitize all HTML output
- **Path Traversal Protection**: Validate output paths
- **Permission Checking**: Respect file system permissions

### 🔒 Privacy Guarantees

```yaml
Data Handling:
  - Source Code: Never leaves local machine
  - Analysis Results: Stored locally only
  - Configuration: Local VS Code settings
  - Telemetry: Completely disabled
  - Network Requests: None (except extension updates)
```

## Design Decisions

### 🎯 Architectural Decisions

#### 1. CLI-First Architecture
**Decision**: Build CLI first, then VS Code extension
**Rationale**: 
- Universal tool that works in any environment
- Easier testing and debugging
- Can be integrated into any workflow
- VS Code extension becomes a UI layer

#### 2. Babel Parser Choice
**Decision**: Use Babel parser instead of TypeScript compiler
**Rationale**:
- Better handling of mixed JS/TS codebases
- More flexible plugin system
- Consistent AST format
- Better error recovery

#### 3. Local-Only Processing
**Decision**: No cloud processing or API calls
**Rationale**:
- Developer privacy and security
- Works offline
- No rate limits or costs
- Corporate firewall friendly

#### 4. Token Optimization Focus
**Decision**: Prioritize token reduction over complete representation
**Rationale**:
- LLM context windows are expensive
- 80/20 rule: 20% of code provides 80% of value
- Focus on exported APIs, not implementation
- Business context > implementation details

### 🔄 Evolution Strategy

#### Phase 1 (Current): Core Functionality ✅
- TypeScript/JavaScript support
- Basic AI enhancement
- VS Code integration
- CI/CD pipeline

#### Phase 2 (Next): Enhanced Intelligence
- Better domain detection
- More framework support
- Custom template creation
- Performance optimization

#### Phase 3 (Future): Ecosystem Expansion
- Multi-language support (Python, Java, C#)
- Team collaboration features
- IDE integrations (JetBrains, Vim)
- Advanced analytics

### 📊 Success Metrics

```yaml
Technical Metrics:
  - Token Reduction: Target 60-90%
  - Processing Speed: <2s for typical files
  - Accuracy: >95% for domain detection
  - Reliability: <1% failure rate

User Metrics:
  - VS Code Extension Downloads: Target 10K+
  - NPM Package Downloads: Target 1K+/month
  - GitHub Stars: Target 1K+
  - Community Contributions: Target 10+ contributors

Business Metrics:
  - Developer Productivity: Measure context preparation time
  - AI Assistant Effectiveness: Measure better AI responses
  - Adoption Rate: Track daily/weekly active users
```

---

## 🚀 Getting Started for Contributors

### Development Setup
```bash
# Clone repository
git clone https://github.com/paulohenriquevn/m2js.git
cd m2js

# Install dependencies
npm install

# Build and test
npm run build
npm test

# Test CLI locally
npm link
m2js examples/User.ts

# VS Code extension development
cd vscode-extension
npm install
npm run compile
# Press F5 to launch Extension Development Host
```

### Architecture Principles to Follow
1. **KISS**: Keep implementations simple and focused
2. **FAIL-FAST**: Fail quickly with clear error messages
3. **VERTICAL SLICE**: Each feature should work end-to-end
4. **ANTI-MOCK**: Use real integrations in development
5. **LOCAL-FIRST**: Never send code to external services

This architecture enables M2JS to be a powerful, reliable, and secure tool for enhancing developer productivity with AI coding assistants while maintaining complete privacy and control over source code.