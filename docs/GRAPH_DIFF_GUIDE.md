# Graph-Deep Diff Analysis Guide

🏗️ **Comprehensive guide to M2JS architectural change detection and health monitoring**

## 📋 Table of Contents

1. [Overview](#overview)
2. [Getting Started](#getting-started)
3. [Understanding the Output](#understanding-the-output)
4. [Advanced Usage](#advanced-usage)
5. [CI/CD Integration](#cicd-integration)
6. [Best Practices](#best-practices)
7. [Troubleshooting](#troubleshooting)
8. [Technical Reference](#technical-reference)

## Overview

### 🎯 What is Graph-Deep Diff Analysis?

Graph-Deep Diff Analysis is M2JS's architectural change detection system that compares your codebase architecture between different git references (branches, commits, tags) to:

- **Track Technical Debt Evolution** - See how architectural health changes over time
- **Prevent Architectural Regression** - Catch problematic changes before they reach production
- **Guide Refactoring Decisions** - Understand the impact of architectural changes
- **Monitor Health Trends** - Track 0-100 architectural health score with trend analysis

### 🔍 What Does It Detect?

#### **Architectural Changes**
- 🔄 **Circular Dependencies** - New/resolved circular imports between modules
- 🔗 **Coupling Changes** - Average dependencies per module increases/decreases
- 📦 **External Dependencies** - NPM package additions/removals and their impact
- 🏗️ **Layer Violations** - Architecture boundary violations (e.g., UI → DB direct connections)
- 🧩 **Complexity Hotspots** - Modules with high coupling that become harder to maintain
- 📁 **Architecture Layers** - New/removed structural layers in your codebase

#### **Impact Assessment**
- 📊 **Health Score** - 0-100 architectural health with trend tracking
- 🎯 **Maintainability Impact** - How changes affect code maintainability (-5 to +5)
- ⚡ **Performance Impact** - Potential performance implications (-5 to +5)
- 🧪 **Testability Impact** - How changes affect ability to test code (-5 to +5)
- 🚨 **Risk Assessment** - Critical, High, Medium, Low severity classifications

## Getting Started

### 🚀 Basic Usage

```bash
# Compare current working directory with main branch
m2js src/ --graph-diff --baseline main

# Compare two specific branches
m2js . --graph-diff --baseline main --current feature-branch

# Track changes over time (commit by commit)
m2js src/ --graph-diff --baseline HEAD~1

# Focus on critical issues only
m2js src/ --graph-diff --baseline main --min-severity high

# JSON output for automation
m2js . --graph-diff --baseline main --format json
```

### 📋 Command Reference

```bash
# Required
--baseline <ref>        # Baseline git reference (branch, commit, tag)

# Optional
--current <ref>         # Current reference (default: working directory)
--format <type>         # Output format: table (default), json
--min-severity <level>  # Filter: low, medium, high, critical
--include-details       # Include detailed analysis (default: true)
--include-impact        # Include impact scoring (default: true)
--include-suggestions   # Include recommendations (default: true)

# Help
--help-graph-diff       # Comprehensive help with examples
```

### 🔗 Git Reference Examples

```bash
# Branches
m2js src/ --graph-diff --baseline main
m2js src/ --graph-diff --baseline develop --current feature-auth

# Commits (relative)
m2js . --graph-diff --baseline HEAD~1      # Previous commit
m2js . --graph-diff --baseline HEAD~5      # 5 commits ago

# Commits (absolute)
m2js . --graph-diff --baseline abc123def --current xyz789abc

# Tags (releases)
m2js src/ --graph-diff --baseline v1.0.0 --current v1.1.0

# Remote references
m2js . --graph-diff --baseline origin/main
m2js . --graph-diff --baseline upstream/develop
```

## Understanding the Output

### 📊 Sample Report Structure

```bash
📊 GRAPH-DEEP DIFF ANALYSIS REPORT
============================================================

📋 COMPARISON OVERVIEW
----------------------------------------
Project: /home/user/my-project/src
Baseline: main
Current: feature-branch
Analyzed: 2025-07-07T14:32:02.196Z
Total Changes: 3

🎯 IMPACT SUMMARY
----------------------------------------
Severity Distribution:
  🚨 CRITICAL: 1 changes
  ⚠️ HIGH: 1 changes
  ⚡ MEDIUM: 1 changes
  💡 LOW: 0 changes

Category Distribution:
  🔄 dependencies: 1 changes
  🔗 coupling: 1 changes
  📦 external: 1 changes

📈 Health Score: 85 → 78 (-7.0) 📉 Declining

📈 KEY METRICS CHANGES
----------------------------------------
🔄 Circular Dependencies: 0 → 2 (+2)
🔗 Average Coupling: 3.2 → 4.8 (+1.6)
📦 External Dependencies: 15 → 18 (+3)
📁 Module Count: 45 → 47 (+2)

🏗️ ARCHITECTURAL CHANGES
----------------------------------------

1. 🚨 CRITICAL - 🔄 dependencies
   2 new circular dependencies introduced
   Risk: critical | Overall Score: -12
   Reasoning: Circular dependencies make code harder to understand, test, and maintain
   Affected Areas: maintainability, testability, code organization

💡 RECOMMENDATIONS
----------------------------------------

1. 🔧 HIGH - Resolve Circular Dependencies
   New circular dependencies were introduced that should be resolved.
   🔴 Effort: medium | Impact: Improve code organization and testability
   Actions:
     • Identify the circular dependency chain
     • Extract common functionality to a shared module
     • Use dependency injection or event-driven patterns
     • Consider architectural refactoring

🏥 ARCHITECTURAL HEALTH ANALYSIS
----------------------------------------
Current Health: 78.0/100 (GOOD)
Health Trend: 📉 Declining (-7.0)
Recommendation: Significant refactoring needed
```

### 🎯 Severity Levels

| Severity | Icon | Description | When to Act |
|----------|------|-------------|-------------|
| **CRITICAL** | 🚨 | Severe architectural problems | Immediate action required |
| **HIGH** | ⚠️ | Significant issues affecting maintainability | Address before merge |
| **MEDIUM** | ⚡ | Moderate impact on code quality | Review and plan fixes |
| **LOW** | 💡 | Minor improvements or positive changes | Optional optimization |

### 📊 Health Score Interpretation

| Score Range | Status | Action Needed |
|-------------|--------|---------------|
| **80-100** | 🟢 EXCELLENT | Continue good practices |
| **60-79** | 🟡 GOOD | Minor improvements recommended |
| **40-59** | 🟠 FAIR | Significant refactoring needed |
| **0-39** | 🔴 POOR | Critical architectural issues require immediate attention |

### 🔄 Change Categories

#### **Dependencies (🔄)**
- Circular dependency introduction/resolution
- Import/export relationship changes
- Module dependency modifications

#### **Coupling (🔗)**
- Average dependencies per module changes
- Module interconnection variations
- Coupling density modifications

#### **External (📦)**
- NPM package additions/removals
- Third-party dependency changes
- External API integrations

#### **Architecture (🏗️)**
- Layer boundary violations
- Architectural pattern changes
- Structure reorganization

#### **Complexity (🧩)**
- Hotspot creation/resolution
- Complexity metric changes
- Maintainability variations

## Advanced Usage

### 🎯 Filtering and Customization

#### **Severity Filtering**
```bash
# Only show critical and high severity issues
m2js src/ --graph-diff --baseline main --min-severity high

# All issues (default)
m2js src/ --graph-diff --baseline main --min-severity low
```

#### **Output Customization**
```bash
# Minimal output (no details, impact, or suggestions)
m2js src/ --graph-diff --baseline main --include-details=false --include-impact=false --include-suggestions=false

# JSON format for automation
m2js src/ --graph-diff --baseline main --format json
```

### 🔄 Common Workflows

#### **1. Pre-merge Validation**
```bash
# Before merging feature branch to main
git checkout feature-branch
m2js src/ --graph-diff --baseline main --current HEAD

# Review changes and ensure health score doesn't decline significantly
# Look for critical/high severity issues
```

#### **2. Release Preparation**
```bash
# Compare current release candidate with last stable version
m2js . --graph-diff --baseline v1.0.0 --current release/v1.1.0

# Ensure architectural improvements or at least no regression
```

#### **3. Refactoring Progress Tracking**
```bash
# Before refactoring
git tag refactor-start
# ... perform refactoring work ...
# After refactoring
m2js src/ --graph-diff --baseline refactor-start --current HEAD

# Validate that refactoring improved architectural health
```

#### **4. Technical Debt Audit**
```bash
# Analyze how architecture has evolved since initial release
m2js . --graph-diff --baseline v1.0.0 --current main

# Track trends over multiple versions
m2js . --graph-diff --baseline v1.0.0 --current v2.0.0
```

#### **5. Commit-by-commit Analysis**
```bash
# Track changes over last 10 commits
for i in {1..10}; do
  echo "=== HEAD~$i vs HEAD~$((i-1)) ==="
  m2js src/ --graph-diff --baseline HEAD~$i --current HEAD~$((i-1)) --min-severity high
done
```

## CI/CD Integration

### 🚀 GitHub Actions

#### **Pull Request Health Check**
```yaml
# .github/workflows/architecture-health.yml
name: Architecture Health Check
on:
  pull_request:
    branches: [main]

jobs:
  architecture-diff:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
        with:
          fetch-depth: 0  # Need full history for git refs
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install M2JS
        run: npm install -g @paulohenriquevn/m2js
      
      - name: Run Architecture Analysis
        run: |
          m2js src --graph-diff --baseline origin/main --format json > arch-report.json
          
          # Extract health score delta
          HEALTH_DELTA=$(jq '.impact.healthChange.delta' arch-report.json)
          
          # Fail if health declines more than 10 points
          if (( $(echo "$HEALTH_DELTA < -10" | bc -l) )); then
            echo "❌ Architecture health declined by $HEALTH_DELTA points"
            echo "Review architectural changes before merging"
            exit 1
          fi
          
          # Check for critical issues
          CRITICAL_COUNT=$(jq '.impact.bySeverity.critical // 0' arch-report.json)
          if [ "$CRITICAL_COUNT" -gt 0 ]; then
            echo "❌ $CRITICAL_COUNT critical architectural issues found"
            exit 1
          fi
          
          echo "✅ Architecture health check passed"
      
      - name: Upload Architecture Report
        uses: actions/upload-artifact@v3
        with:
          name: architecture-report
          path: arch-report.json
```

#### **Release Health Validation**
```yaml
# .github/workflows/release-validation.yml
name: Release Architecture Validation
on:
  release:
    types: [created]

jobs:
  validate-architecture:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install M2JS
        run: npm install -g @paulohenriquevn/m2js
      
      - name: Compare with Previous Release
        run: |
          # Get previous release tag
          PREVIOUS_TAG=$(git tag --sort=-version:refname | sed -n '2p')
          CURRENT_TAG=${GITHUB_REF#refs/tags/}
          
          echo "Comparing $PREVIOUS_TAG → $CURRENT_TAG"
          
          m2js . --graph-diff --baseline $PREVIOUS_TAG --current $CURRENT_TAG --format json > release-comparison.json
          
          # Validate health improvement or at least no regression
          HEALTH_DELTA=$(jq '.impact.healthChange.delta' release-comparison.json)
          
          if (( $(echo "$HEALTH_DELTA < -5" | bc -l) )); then
            echo "⚠️  Architecture health declined by $HEALTH_DELTA points in this release"
          else
            echo "✅ Architecture health maintained or improved ($HEALTH_DELTA)"
          fi
      
      - name: Generate Release Notes
        run: |
          echo "## 🏗️ Architecture Analysis" >> release-notes.md
          echo "" >> release-notes.md
          
          # Extract key metrics
          jq -r '
            "### Health Score: " + (.impact.healthChange.before | tostring) + " → " + (.impact.healthChange.after | tostring) + " (" + 
            (if .impact.healthChange.delta > 0 then "+" else "" end) + (.impact.healthChange.delta | tostring) + ")",
            "",
            "### Changes by Severity:",
            "- Critical: " + (.impact.bySeverity.critical // 0 | tostring),
            "- High: " + (.impact.bySeverity.high // 0 | tostring),
            "- Medium: " + (.impact.bySeverity.medium // 0 | tostring),
            "- Low: " + (.impact.bySeverity.low // 0 | tostring)
          ' release-comparison.json >> release-notes.md
```

### 🔧 Pre-commit Hooks

```bash
#!/bin/sh
# .git/hooks/pre-commit
# Check architectural health before commits

echo "🔍 Checking architectural changes..."

# Run graph diff analysis
m2js src --graph-diff --baseline HEAD~1 --min-severity high --format json > /tmp/arch-check.json

# Check exit code
if [ $? -ne 0 ]; then
  echo "❌ Architecture analysis failed"
  exit 1
fi

# Check for critical issues
CRITICAL_COUNT=$(jq '.impact.bySeverity.critical // 0' /tmp/arch-check.json)
if [ "$CRITICAL_COUNT" -gt 0 ]; then
  echo "❌ $CRITICAL_COUNT critical architectural issues detected"
  echo "Run 'm2js src --graph-diff --baseline HEAD~1' to see details"
  echo "Use 'git commit --no-verify' to skip this check"
  exit 1
fi

# Check health score decline
HEALTH_DELTA=$(jq '.impact.healthChange.delta' /tmp/arch-check.json)
if (( $(echo "$HEALTH_DELTA < -5" | bc -l) )); then
  echo "⚠️  Architecture health declined by $HEALTH_DELTA points"
  echo "Consider reviewing changes before committing"
  echo "Use 'git commit --no-verify' to skip this check"
  exit 1
fi

echo "✅ Architecture check passed"
exit 0
```

### 📊 Custom Scripts

#### **Package.json Scripts**
```json
{
  "scripts": {
    "arch:check": "m2js src --graph-diff --baseline main",
    "arch:check-strict": "m2js src --graph-diff --baseline main --min-severity high",
    "arch:compare-release": "m2js . --graph-diff --baseline v1.0.0 --current HEAD",
    "arch:json": "m2js src --graph-diff --baseline main --format json",
    "arch:history": "for i in {1..5}; do echo \"=== HEAD~$i vs HEAD~$((i-1)) ===\"; m2js src --graph-diff --baseline HEAD~$i --current HEAD~$((i-1)) --min-severity high; done"
  }
}
```

#### **Analysis Automation Script**
```bash
#!/bin/bash
# arch-analysis.sh - Comprehensive architecture analysis

set -e

# Configuration
BASELINE=${1:-main}
CURRENT=${2:-HEAD}
MIN_SEVERITY=${3:-medium}
OUTPUT_DIR="./architecture-reports"

echo "🏗️ M2JS Architecture Analysis"
echo "Baseline: $BASELINE"
echo "Current: $CURRENT"
echo "Min Severity: $MIN_SEVERITY"
echo ""

# Create output directory
mkdir -p "$OUTPUT_DIR"

# Generate timestamp
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Run analysis
echo "🔍 Running architecture analysis..."
m2js src --graph-diff \
  --baseline "$BASELINE" \
  --current "$CURRENT" \
  --min-severity "$MIN_SEVERITY" \
  --format json > "$OUTPUT_DIR/arch-report-$TIMESTAMP.json"

# Extract key metrics
REPORT_FILE="$OUTPUT_DIR/arch-report-$TIMESTAMP.json"

echo "📊 Analysis Results:"
echo "==================="

# Health score
HEALTH_BEFORE=$(jq '.impact.healthChange.before' "$REPORT_FILE")
HEALTH_AFTER=$(jq '.impact.healthChange.after' "$REPORT_FILE")
HEALTH_DELTA=$(jq '.impact.healthChange.delta' "$REPORT_FILE")

echo "Health Score: $HEALTH_BEFORE → $HEALTH_AFTER ($HEALTH_DELTA)"

# Changes by severity
echo ""
echo "Changes by Severity:"
echo "- Critical: $(jq '.impact.bySeverity.critical // 0' "$REPORT_FILE")"
echo "- High: $(jq '.impact.bySeverity.high // 0' "$REPORT_FILE")"
echo "- Medium: $(jq '.impact.bySeverity.medium // 0' "$REPORT_FILE")"
echo "- Low: $(jq '.impact.bySeverity.low // 0' "$REPORT_FILE")"

# Total changes
TOTAL_CHANGES=$(jq '.impact.totalChanges' "$REPORT_FILE")
echo ""
echo "Total Changes: $TOTAL_CHANGES"

# Generate human-readable report
echo ""
echo "📋 Generating human-readable report..."
m2js src --graph-diff \
  --baseline "$BASELINE" \
  --current "$CURRENT" \
  --min-severity "$MIN_SEVERITY" > "$OUTPUT_DIR/arch-report-$TIMESTAMP.txt"

echo "✅ Reports generated:"
echo "  JSON: $OUTPUT_DIR/arch-report-$TIMESTAMP.json"
echo "  Text: $OUTPUT_DIR/arch-report-$TIMESTAMP.txt"

# Return exit code based on critical issues
CRITICAL_COUNT=$(jq '.impact.bySeverity.critical // 0' "$REPORT_FILE")
if [ "$CRITICAL_COUNT" -gt 0 ]; then
  echo ""
  echo "❌ $CRITICAL_COUNT critical issues found"
  exit 1
fi

echo ""
echo "✅ Architecture analysis completed successfully"
```

## Best Practices

### 🎯 When to Use Graph-Deep Diff

#### **✅ Recommended Use Cases**
- **Before merging feature branches** - Prevent architectural regression
- **During code reviews** - Understand architectural impact of changes
- **Release preparation** - Validate architectural health before deployment
- **Refactoring tracking** - Measure improvement from refactoring efforts
- **Technical debt audits** - Understand long-term architectural evolution
- **CI/CD health gates** - Automated architectural quality control

#### **⚠️ Consider Carefully**
- **Very small commits** - May not show meaningful architectural changes
- **Pure documentation changes** - Unlikely to have architectural impact
- **Configuration-only changes** - May not involve code architecture

#### **❌ Not Recommended**
- **First commit of project** - No baseline to compare against
- **Non-TypeScript/JavaScript projects** - Tool is language-specific
- **Repositories without git history** - Requires git references

### 🏗️ Interpretation Guidelines

#### **Understanding Health Score Changes**
- **+10 or more**: Significant architectural improvement
- **+5 to +10**: Moderate improvement
- **-5 to +5**: Minimal impact
- **-5 to -10**: Concerning regression, review recommended
- **-10 or less**: Significant regression, action required

#### **Prioritizing Issues by Severity**
1. **Critical** - Address immediately, consider blocking merge
2. **High** - Plan fixes before release
3. **Medium** - Include in next refactoring cycle
4. **Low** - Optional improvements, good practice

#### **Reading Change Categories**
- **Dependencies**: Focus on circular dependency changes
- **Coupling**: Monitor average coupling increases
- **External**: Evaluate new dependency necessity
- **Architecture**: Review layer violations carefully
- **Complexity**: Address hotspot creation proactively

### 📊 Performance Considerations

#### **Project Size Guidelines**
| Project Size | Analysis Time | Memory Usage | Recommended Frequency |
|--------------|---------------|--------------|----------------------|
| Small (<50 files) | < 10s | < 100MB | Every commit |
| Medium (50-200 files) | 10-30s | 100-200MB | Every PR |
| Large (200-1000 files) | 30-120s | 200-400MB | Release milestones |
| Enterprise (>1000 files) | 2-5min | 400-800MB | Weekly/monthly audits |

#### **Optimization Tips**
- Use `--min-severity high` for faster analysis in CI/CD
- Limit analysis to specific directories with targeted paths
- Use JSON format for automated processing to avoid rendering overhead
- Cache analysis results when possible to avoid repeated git operations

## Troubleshooting

### 🔧 Common Issues and Solutions

#### **"Not a git repository" Error**
```bash
❌ Error: Not a git repository: /path/to/project
```
**Solution**: Ensure you're running the command from within a git repository:
```bash
cd /path/to/your/git/project
m2js src/ --graph-diff --baseline main
```

#### **"Invalid git reference" Error**
```bash
❌ Error: Invalid git reference: invalid-branch-name
```
**Solutions**:
```bash
# List available branches
git branch -a

# List available tags
git tag -l

# Use correct reference
m2js src/ --graph-diff --baseline origin/main
```

#### **"No TypeScript/JavaScript files found" Warning**
```bash
⚠️ Warning: No TypeScript/JavaScript files found in directory
```
**Solutions**:
```bash
# Check if files exist
ls src/

# Ensure correct path
m2js ./src --graph-diff --baseline main

# Check file extensions
find . -name "*.ts" -o -name "*.js" -o -name "*.tsx" -o -name "*.jsx"
```

#### **Memory Issues with Large Projects**
```bash
❌ Error: JavaScript heap out of memory
```
**Solutions**:
```bash
# Increase Node.js memory limit
NODE_OPTIONS="--max-old-space-size=4096" m2js src --graph-diff --baseline main

# Analyze smaller directories
m2js src/components --graph-diff --baseline main
m2js src/services --graph-diff --baseline main

# Use minimal options
m2js src --graph-diff --baseline main --include-details=false
```

#### **Git Permission Issues**
```bash
❌ Error: Permission denied (publickey)
```
**Solutions**:
```bash
# Use local references only
m2js src/ --graph-diff --baseline HEAD~1

# Fetch remote references first
git fetch origin
m2js src/ --graph-diff --baseline origin/main
```

### 🔍 Debug Mode

Enable debug output for troubleshooting:
```bash
# Set debug environment variable
DEBUG=m2js:* m2js src/ --graph-diff --baseline main

# Or use verbose mode (if available)
m2js src/ --graph-diff --baseline main --verbose
```

### 📞 Getting Help

If you encounter issues:

1. **Check the help documentation**:
   ```bash
   m2js --help-graph-diff
   ```

2. **Verify your setup**:
   ```bash
   m2js --version
   git --version
   node --version
   ```

3. **Try a minimal test case**:
   ```bash
   # Simple test with one commit back
   m2js src/ --graph-diff --baseline HEAD~1
   ```

4. **Report issues** with:
   - M2JS version
   - Node.js version
   - Git version
   - Operating system
   - Command that failed
   - Full error message

## Technical Reference

### 🔧 Architecture Components

#### **GitIntegrator**
- Handles all git operations
- Creates temporary workspaces for baseline analysis
- Manages git reference resolution
- Provides file content at specific commits

#### **GraphDiffAnalyzer**
- Core comparison engine
- Detects architectural changes
- Calculates impact scores
- Generates recommendations

#### **GraphDiffCLI**
- User interface layer
- Formats output for human consumption
- Handles JSON serialization
- Manages error reporting

### 📊 Metrics Calculation

#### **Health Score Formula**
```typescript
function calculateHealthScore(metrics: GraphMetrics): number {
  let score = 100;
  
  // Circular dependencies (heavy penalty)
  score -= metrics.circularDependencies.length * 10;
  
  // High coupling penalty
  if (metrics.averageDependencies > 5) {
    score -= (metrics.averageDependencies - 5) * 5;
  }
  
  // External dependency ratio penalty
  const externalRatio = metrics.totalNodes > 0 ? 
    metrics.externalDependencies / metrics.totalNodes : 0;
  if (externalRatio > 2) {
    score -= (externalRatio - 2) * 10;
  }
  
  // Complexity hotspots penalty
  score -= (metrics.hotspots?.length || 0) * 3;
  
  return Math.max(0, Math.min(100, score));
}
```

#### **Change Severity Calculation**
```typescript
function calculateSeverity(change: ArchitecturalChange): Severity {
  switch (change.type) {
    case 'circular-dependency-introduced':
      return change.details.increase > 2 ? 'critical' : 
             change.details.increase > 1 ? 'high' : 'medium';
    
    case 'coupling-increased':
      return change.details.increase > 2 ? 'high' :
             change.details.increase > 1 ? 'medium' : 'low';
    
    case 'layer-violation-introduced':
      return 'high'; // Always high severity
    
    // ... more cases
  }
}
```

### 🔄 File Processing Pipeline

1. **Git Reference Resolution** - Convert branch/tag names to commit hashes
2. **Workspace Creation** - Create temporary directories with files from each reference
3. **File Scanning** - Discover TypeScript/JavaScript files in both workspaces
4. **AST Parsing** - Parse files using Babel parser
5. **Dependency Extraction** - Build dependency graphs for both references
6. **Change Detection** - Compare graphs to identify architectural changes
7. **Impact Assessment** - Calculate severity and impact scores for each change
8. **Recommendation Generation** - Create actionable suggestions
9. **Report Formatting** - Generate human-readable or JSON output
10. **Cleanup** - Remove temporary workspaces

### 📈 Performance Characteristics

- **Git Operations**: O(n) where n = number of files
- **AST Parsing**: O(m) where m = total lines of code
- **Dependency Analysis**: O(n²) for cross-reference analysis
- **Change Detection**: O(n) for metric comparison
- **Memory Usage**: Linear with project size
- **Disk Usage**: Temporary workspace = 2x project size during analysis

This comprehensive guide should help you effectively use M2JS Graph-Deep Diff Analysis to maintain and improve your codebase architecture over time.