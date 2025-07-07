# Changelog

All notable changes to M2JS will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-07-05

### Added
- ✨ Core TypeScript/JavaScript parsing with Babel AST
- 🚀 CLI interface with Commander.js
- 📝 Hierarchical Markdown generation with enhanced structure
- 🏗️ Exported functions, classes, and methods extraction
- 📋 JSDoc comment preservation and formatting
- 📁 Batch directory processing with progress tracking
- 🔍 Enhanced headers with file paths and export metadata
- ⚡ Fast processing (< 2s for files under 1MB)
- 🎯 60%+ token reduction for LLM context optimization
- 🌐 Cross-platform support (Windows, macOS, Linux)
- 🧪 Comprehensive test suite with 55+ tests
- 📦 NPM package with global CLI installation

### Features
- Process single files or entire directories
- Extract only exported code (public interfaces)
- Preserve JSDoc comments for documentation context
- Generate clean, structured Markdown output
- Support for TypeScript, JavaScript, JSX, and TSX files
- Sequential file processing with error isolation
- Progress tracking for batch operations
- Custom output file specification
- CLI help and version commands

### Technical Details
- Node.js >= 16.0.0 requirement
- TypeScript strict mode compliance
- Zero security vulnerabilities
- MIT License
- Comprehensive error handling
- Deterministic output generation

## [1.3.0] - 2025-07-07

### Added - Graph-Deep Diff Analysis System
- 🏗️ **Architectural Change Detection** - Compare codebase architecture between git references
- 📊 **Health Score Tracking** - 0-100 architectural health metric with trend analysis
- 🔄 **Change Categories** - Circular dependencies, coupling, layer violations, external deps
- 🎯 **Impact Assessment** - Maintainability, performance, testability scoring for each change
- 💡 **Prioritized Recommendations** - Actionable suggestions with effort estimation
- 🔗 **Git Integration** - Support for branches, commits, tags, and relative references (HEAD~1)
- 📋 **LLM-Friendly Reporting** - Rich context with severity distribution and category breakdown
- ⚙️ **CLI Integration** - New `--graph-diff` command with comprehensive options

### Features - Graph-Deep Diff
- Compare any two git references (branches, commits, tags)
- Detect architectural changes: circular deps, coupling, layer violations
- Health score calculation with penalty system for architectural debt
- Severity classification: Critical, High, Medium, Low
- Impact scoring for maintainability, performance, testability
- Actionable recommendations with effort estimates
- JSON output for CI/CD integration
- Configurable severity filtering
- Temporary workspace management for git analysis
- Error handling for invalid git references

### CLI Commands Added
- `m2js <path> --graph-diff --baseline <ref>` - Basic architectural diff
- `m2js <path> --graph-diff --baseline <ref> --current <ref>` - Compare two refs
- `m2js <path> --graph-diff --baseline <ref> --format json` - JSON output
- `m2js <path> --graph-diff --baseline <ref> --min-severity high` - Filter by severity
- `m2js --help-graph-diff` - Comprehensive help with examples

### Technical Implementation
- **GitIntegrator** - Complete git operations with temporary workspace management
- **GraphDiffAnalyzer** - Core architectural comparison engine
- **GraphDiffTypes** - Comprehensive TypeScript type system
- **GraphDiffCLI** - LLM-friendly reporting with visual formatting
- **File Scanner Updates** - Enhanced filtering for node_modules, .d.ts, test files
- **Type Safety** - Full TypeScript strict mode compliance
- **Performance** - Efficient AST parsing and git operations

### CI/CD Integration Examples
- GitHub Actions workflow for PR architectural health checks
- Pre-commit hooks for preventing architectural regression
- JSON output format for automated analysis and reporting
- Health score delta checking for CI/CD pipelines

## [1.2.0] - 2025-07-06

### Added - Smart Dead Code Detection System
- 🧹 **Intelligent Dead Code Analysis** - Confidence-based unused code detection
- 🎯 **Risk Assessment Engine** - High/Medium/Low confidence levels for every finding
- 🛡️ **Smart Suggestions** - Actionable removal commands with safety analysis
- ⚡ **Performance Optimization** - LRU caching with 80% faster re-analysis
- 📊 **Progress Indicators** - Visual feedback for large project analysis
- ⚙️ **Configuration System** - .m2jsrc files + environment variable overrides
- 🔍 **Cross-file Analysis** - Understanding entire codebase context
- 📋 **LLM-Friendly Output** - Rich context for AI-assisted cleanup decisions

### Features - Dead Code Detection
- Confidence levels: High (safe), Medium (review), Low (risky)
- Risk factor analysis: framework imports, type definitions, default exports
- Actionable suggestions with ready-to-use removal commands
- Performance caching with LRU algorithm and timestamp validation
- Chunk processing for memory optimization
- Progress bars for large codebases
- JSON output for CI/CD integration
- Configuration via .m2jsrc files and environment variables

### CLI Commands Added
- `m2js <path> --detect-unused` - Basic dead code analysis
- `m2js <path> --detect-unused --format json` - JSON output
- `m2js --init-config` - Generate example .m2jsrc configuration
- `m2js --help-dead-code` - Detailed help for dead code features

### Technical Features
- LRU cache with configurable size limits
- Memory-efficient chunk processing
- Smart file filtering and ignore patterns
- Cross-reference analysis between files
- Risk assessment algorithms
- Performance monitoring and optimization

## [1.1.0] - 2025-07-05

### Added - AI Intelligence & Enhanced Analysis
- 🧠 **Business Context Analysis** - Automatic domain detection with 90%+ accuracy
- 🏗️ **Architecture Pattern Recognition** - Identifies Service Layer, Repository, MVC patterns
- 🔗 **Semantic Relationship Mapping** - Understanding between components and their interactions
- 📊 **Dependency Graph Generation** - Visual Mermaid diagrams with advanced metrics
- 🎯 **Template Generation** - LLM-guided development with domain-specific templates
- ⚡ **Enhanced Performance** - 40% faster processing with optimized AST traversal
- 🎨 **Rich CLI Output** - Color-coded results with progress indicators

### Features - AI Enhancement
- Domain detection: Authentication, API, Database, UI, Utilities, Business Logic
- Pattern recognition: Service Layer, Repository, MVC, Factory, Observer, Strategy
- Business context extraction with confidence scoring
- Advanced dependency analysis with circular dependency detection
- Template generation for rapid prototyping
- Enhanced error handling and user feedback

### CLI Commands Added
- `m2js <file> --ai-enhanced` - AI-powered analysis with business context
- `m2js <path> --graph` - Generate dependency graphs
- `m2js <path> --mermaid` - Mermaid diagram generation
- `m2js <path> --business-context` - Extract business rules and patterns

## [Unreleased]

### Planned Features
- Multi-language support (Python, Java, C#)
- Advanced pattern recognition
- Team collaboration features
- JetBrains IDE integrations
- Plugin system for custom extractors

---

For more details about each release, see the [GitHub Releases](https://github.com/m2js/m2js/releases) page.