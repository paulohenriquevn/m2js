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

## [Unreleased]

### Planned Features
- Test file filtering and reporting
- Advanced CLI options and error handling
- Plugin system for custom extractors
- IDE integrations

---

For more details about each release, see the [GitHub Releases](https://github.com/m2js/m2js/releases) page.