# 🧹 M2JS Dead Code Detection: Complete Guide

## 🎯 Overview

M2JS Dead Code Detection is an intelligent assistant that goes beyond traditional linters to provide **confidence-based analysis** and **actionable removal suggestions** for unused code in TypeScript/JavaScript projects.

## 🆚 Why Not Just Use ESLint?

### **The Honest Truth: We're Not Replacing ESLint**

**ESLint is excellent for what it does.** M2JS complements it by adding intelligence to dead code removal.

### **What ESLint Tells You:**
```bash
src/utils.ts:25:1 - warning: 'unusedFunction' is defined but never used
src/api.ts:15:1 - warning: 'createApi' is defined but never used  
src/config.ts:5:1 - warning: 'default' is defined but never used
```

**Your reaction:** *"But wait... are these actually safe to remove? What if createApi is used by external packages? What about that default export in a config file?"*

### **What M2JS Tells You:**
```bash
🔥 Remove function: unusedFunction [HIGH CONFIDENCE] ✅ SAFE TO REMOVE
    # Remove lines around 25 in utils.ts

⚠️  Review function: createApi [MEDIUM CONFIDENCE] ⚠️ REVIEW NEEDED  
    Risk: Export name suggests it may be used by external packages

🚨 Review default export [LOW CONFIDENCE] 🚨 HIGH RISK
    Risks: Default export, Configuration file - may be loaded dynamically
```

**Your reaction:** *"Perfect! I can safely remove unusedFunction right now, review createApi later, and be extra careful with that config default export."*

## 🧠 Intelligence Behind the Analysis

### **Confidence Levels Explained**

#### **🟢 HIGH Confidence - Safe to Remove**
- Simple internal functions with clear names
- Variables/constants not following external API patterns
- Functions clearly marked as internal/private in naming

**Example:**
```typescript
// HIGH confidence - clearly internal
function internalHelper() {}
const TEMP_VALUE = 42;
class PrivateUtility {}
```

#### **🟡 MEDIUM Confidence - Review Recommended**
- Functions with external-style naming patterns
- Exports in main directories but not obviously public
- Type definitions that might be used in annotations

**Example:**
```typescript
// MEDIUM confidence - could be external API
export function createUser() {}
export const API_CONFIG = {};
export interface UserData {}
```

#### **🔴 LOW Confidence - High Risk**
- Default exports (can be imported with any name)
- Exports in index files or public directories
- Configuration files that might be loaded dynamically
- Framework-related patterns

**Example:**
```typescript
// LOW confidence - high risk
export default class SomeClass {}  // Could be imported as anything
// In index.ts or config.ts files
```

### **Risk Assessment Factors**

#### **🚨 Public API Patterns**
- Files in `lib/`, `public/`, `api/` directories
- Files named `index.*` (common entry points)
- Export names matching `create*`, `use*`, `get*`, `*Config`, `*Utils`

#### **⚠️ Framework & Side-Effect Patterns**
- React imports (might be used implicitly in JSX)
- CSS/SCSS imports (side-effect imports)
- Polyfill imports (`core-js`, etc.)

#### **🔍 Type System Patterns**
- Interface/Type exports (might be used in type annotations only)
- Names ending in `Type`, `Interface`, or starting with `I`

#### **📁 File Location Signals**
- Test files (`.test.*`, `.spec.*`) - might be used by test frameworks
- Configuration files - might be loaded dynamically

## 🛠️ Practical Usage Guide

### **Phase 1: Quick Wins (Start Here)**
```bash
# 1. Run analysis
m2js src --detect-unused

# 2. Look for "✅ SAFE TO REMOVE" items  
# 3. Copy-paste the provided commands
# 4. Remove safe items immediately
```

**Example workflow:**
```bash
# M2JS Output:
🔥 Remove function: tempHelper
   # Remove lines around 25 in utils.ts

# You execute:
# Delete lines 23-30 in utils.ts (the tempHelper function)
```

### **Phase 2: Review Items (Medium Risk)**
```bash
# 1. Look for "⚠️ REVIEW BEFORE REMOVING" items
# 2. Check each risk factor mentioned
# 3. Verify no external usage
# 4. Remove if confirmed safe
```

**Decision tree for medium confidence:**
```
Is this function/export used by:
├─ External packages? ❌ → DON'T REMOVE
├─ Other teams/projects? ❌ → DON'T REMOVE  
├─ Dynamic imports? ❌ → DON'T REMOVE
├─ Test frameworks? ❌ → DON'T REMOVE
└─ None of the above? ✅ → SAFE TO REMOVE
```

### **Phase 3: High-Risk Analysis (Careful)**
```bash
# 1. Look for "🚨 HIGH RISK" items
# 2. Read all risk factors carefully
# 3. Consider keeping unless absolutely certain
# 4. Document decisions for future reference
```

## 📊 Configuration & Performance

### **Project Setup**
```bash
# 1. Generate configuration
m2js --init-config

# 2. Customize .m2jsrc for your project
# 3. Add to .gitignore if needed
echo ".m2jsrc" >> .gitignore  # If you prefer ENV vars
```

### **Example .m2jsrc Configuration**
```json
{
  "deadCode": {
    "enableCache": true,
    "maxCacheSize": 1000,
    "chunkSize": 50,
    "showProgress": true,
    "format": "table"
  },
  "files": {
    "ignorePatterns": [
      "**/node_modules/**",
      "**/dist/**",
      "**/*.test.*",
      "**/*.spec.*",
      "**/storybook/**",
      "**/docs/**"
    ],
    "maxFileSize": 10
  }
}
```

### **Performance Tuning**
```bash
# For large projects (>1000 files)
M2JS_CHUNK_SIZE=25 m2js src --detect-unused

# For very large projects (>5000 files)  
M2JS_CHUNK_SIZE=10 M2JS_CACHE_SIZE=2000 m2js src --detect-unused

# Disable progress for CI/CD
M2JS_SHOW_PROGRESS=false m2js src --detect-unused --format json
```

## 🔄 Workflow Integration

### **Pre-Refactoring Cleanup**
```bash
# Before major refactoring
npm run lint                 # Fix code quality issues
m2js src --detect-unused     # Remove dead code safely
npm run test                 # Ensure nothing breaks
# Now refactor with confidence
```

### **Code Review Process**
```bash
# Reviewer workflow
m2js src --detect-unused > dead-code-report.txt
# Review the report alongside code changes
# Suggest removing safe items in review comments
```

### **CI/CD Integration**
```yaml
# .github/workflows/code-quality.yml
- name: Dead Code Analysis
  run: |
    npm install -g @paulohenriquevn/m2js
    m2js src --detect-unused --format json > dead-code.json
    
    # Fail if too much dead code accumulates
    DEAD_COUNT=$(jq '.deadExports | length' dead-code.json)
    if [ "$DEAD_COUNT" -gt 50 ]; then
      echo "Too much dead code detected: $DEAD_COUNT items"
      exit 1
    fi
```

### **Team Onboarding**
```bash
# New developer workflow
git clone project
cd project
npm install
m2js src --detect-unused     # Understand current code health
m2js src --ai-enhanced       # Get AI-ready documentation
```

## 🎯 Advanced Patterns

### **Monorepo Setup**
```bash
# Analyze each package separately
m2js packages/api/src --detect-unused
m2js packages/web/src --detect-unused
m2js packages/shared/src --detect-unused

# Or analyze all at once (cross-package analysis)
m2js packages/*/src --detect-unused
```

### **Legacy Code Migration**
```bash
# Step 1: Understand current state
m2js legacy-system --detect-unused --format json > baseline.json

# Step 2: Start with safest removals
m2js legacy-system --detect-unused | grep "SAFE TO REMOVE" -A2

# Step 3: Document high-risk items for later
m2js legacy-system --detect-unused | grep "HIGH RISK" -A5 > review-later.txt
```

### **Framework-Specific Considerations**

#### **React Projects**
```json
{
  "files": {
    "ignorePatterns": [
      "**/*.stories.*",     // Storybook files
      "**/src/setupTests.*", // Test setup
      "**/src/index.*"      // Entry points
    ]
  }
}
```

#### **Node.js APIs**
```json
{
  "files": {
    "ignorePatterns": [
      "**/routes/**",       // Route handlers might be auto-registered
      "**/middleware/**",   // Middleware might be used dynamically
      "**/config/**"        // Config files loaded dynamically
    ]
  }
}
```

## 🐛 Troubleshooting

### **Common Issues**

#### **"False Positive: Function is actually used"**
```bash
# Possible causes:
# 1. Dynamic imports (import() calls)
# 2. String-based imports (require() with variables)
# 3. Framework auto-registration
# 4. External package usage

# Solution: Add to ignore patterns
{
  "files": {
    "ignorePatterns": ["**/src/auto-registered/**"]
  }
}
```

#### **"Performance is slow on large project"**
```bash
# Tune chunk size
M2JS_CHUNK_SIZE=10 m2js src --detect-unused

# Increase cache size
M2JS_CACHE_SIZE=2000 m2js src --detect-unused

# Check file size limits
M2JS_MAX_FILE_SIZE=5 m2js src --detect-unused
```

#### **"Too many false positives"**
```bash
# Check your ignore patterns
m2js --init-config
# Edit .m2jsrc to exclude framework-specific directories

# Use more conservative settings
{
  "deadCode": {
    "format": "json"  // Then filter results programmatically
  }
}
```

## 📚 Examples & Case Studies

### **Real-World Example: E-commerce Cleanup**

**Before M2JS:**
- 15,000 lines of code
- 200+ exported functions
- Unknown which exports were safe to remove
- 3 days manual analysis needed

**With M2JS:**
```bash
m2js src --detect-unused
# Result: 45 dead exports found
# 25 HIGH confidence (removed immediately)
# 15 MEDIUM confidence (reviewed in 2 hours)
# 5 LOW confidence (kept for safety)
# Result: 2,500 lines removed safely
```

**ROI:** 3 days → 3 hours, 17% codebase reduction

### **Team Integration Success Story**

**Setup:**
```json
{
  "scripts": {
    "cleanup": "m2js src --detect-unused",
    "cleanup-safe": "m2js src --detect-unused | grep 'SAFE TO REMOVE'",
    "pre-refactor": "npm run lint && npm run cleanup && npm test"
  }
}
```

**Results:**
- 40% reduction in dead code over 3 months
- 60% faster code reviews (less noise)
- 90% developer confidence in removal decisions

## 🔗 Integration with Other Tools

### **With ESLint**
```json
{
  "scripts": {
    "quality": "eslint src && m2js src --detect-unused",
    "fix": "eslint src --fix && npm run cleanup-safe"
  }
}
```

### **With Prettier**
```json
{
  "scripts": {
    "format": "prettier --write src && m2js src --detect-unused"
  }
}
```

### **With TypeScript**
```json
{
  "scripts": {
    "check": "tsc --noEmit && m2js src --detect-unused"
  }
}
```

## 🚀 Best Practices

### **Do's**
- ✅ Start with HIGH confidence removals
- ✅ Always run tests after removing code
- ✅ Use configuration files for team consistency
- ✅ Integrate into your development workflow
- ✅ Document decisions for LOW confidence items

### **Don'ts**
- ❌ Remove LOW confidence items without careful analysis
- ❌ Skip testing after removals
- ❌ Ignore risk factors mentioned in output
- ❌ Remove framework-specific patterns blindly
- ❌ Use as the only tool (complement with ESLint)

### **Team Guidelines**
1. **Daily Development:** Use for quick cleanup during feature work
2. **Code Reviews:** Include M2JS analysis in PR reviews
3. **Refactoring:** Always run before major refactoring
4. **Legacy Migration:** Use for understanding existing codebases
5. **Documentation:** Combine with AI documentation for complete context

---

**Remember: M2JS is your intelligent assistant for confident dead code removal. It doesn't replace human judgment, but it makes that judgment much more informed.**