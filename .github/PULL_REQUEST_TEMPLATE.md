# Pull Request

## 📋 Description
<!-- Provide a clear and concise description of what this PR accomplishes -->

## 🎯 Type of Change
<!-- Mark the appropriate option with an [x] -->

- [ ] 🐛 Bug fix (non-breaking change that fixes an issue)
- [ ] ✨ New feature (non-breaking change that adds functionality)
- [ ] 💥 Breaking change (fix or feature that would cause existing functionality to change)
- [ ] 📚 Documentation update
- [ ] 🔧 Maintenance (dependency updates, build improvements, etc.)
- [ ] ⚡ Performance improvement
- [ ] 🧪 Test improvement

## 🔗 Related Issues
<!-- Link to related issues using keywords: Fixes #123, Closes #456, Related to #789 -->

## 🧪 Testing
<!-- Describe the testing you've performed -->

### Test Coverage
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed
- [ ] CLI testing completed
- [ ] VS Code extension testing completed (if applicable)

### Test Results
```bash
# Paste test results here
npm run test
npm run test:integration
```

## 📱 Screenshots/Examples
<!-- If applicable, add screenshots or examples of the changes -->

### Before
```typescript
// Previous behavior/code
```

### After
```typescript
// New behavior/code
```

## 🎯 Performance Impact
<!-- Describe any performance implications -->

- [ ] No performance impact
- [ ] Performance improvement
- [ ] Performance regression (explain below)

**Benchmark Results:**
```bash
# Paste benchmark results if applicable
npm run benchmark
```

## 📋 CLAUDE.md Compliance
<!-- Confirm compliance with project rules -->

- [ ] ✅ KISS: Solution is as simple as possible
- [ ] ✅ FAIL-FAST: Errors fail quickly with clear messages
- [ ] ✅ VERTICAL SLICE: Delivers complete end-to-end value
- [ ] ✅ ANTI-MOCK: Uses real integrations (except unit tests)
- [ ] ✅ File size limits: All files < 300 lines
- [ ] ✅ Function size limits: All functions < 30 lines
- [ ] ✅ No TypeScript 'any' types used
- [ ] ✅ No console.log statements in production code

## 🔍 Code Quality Checklist

### Build & Tests
- [ ] ✅ `npm run type-check` passes
- [ ] ✅ `npm run lint` passes  
- [ ] ✅ `npm run test` passes
- [ ] ✅ `npm run test:coverage` meets threshold (80%+)
- [ ] ✅ `npm run build` succeeds
- [ ] ✅ `npm run test:integration` passes

### Code Standards
- [ ] ✅ Code follows existing patterns and conventions
- [ ] ✅ Error messages are clear and actionable
- [ ] ✅ Functions have single responsibility
- [ ] ✅ Variable and function names are descriptive
- [ ] ✅ No code duplication
- [ ] ✅ Proper TypeScript types used throughout

### Documentation
- [ ] ✅ JSDoc comments added for public APIs
- [ ] ✅ README updated (if needed)
- [ ] ✅ CHANGELOG.md updated
- [ ] ✅ Examples updated (if needed)

## 🚀 Deployment Notes
<!-- Any special deployment considerations -->

- [ ] No special deployment steps required
- [ ] Requires npm version bump
- [ ] Requires VS Code extension republish
- [ ] Requires documentation site update

## 📝 Reviewer Notes
<!-- Anything specific you want reviewers to focus on -->

### Focus Areas
- [ ] Algorithm correctness
- [ ] Error handling
- [ ] Performance implications
- [ ] User experience
- [ ] Breaking change impact

### Questions for Reviewers
<!-- Any specific questions or areas where you'd like feedback -->

## 🎉 Post-Merge Tasks
<!-- Tasks to complete after merge -->

- [ ] Update version number
- [ ] Create release notes
- [ ] Update documentation site
- [ ] Announce in Discord/Slack
- [ ] Monitor for issues

---

**By submitting this PR, I confirm that:**
- [ ] I have read and followed the CLAUDE.md guidelines
- [ ] My code follows the project's coding standards
- [ ] I have performed self-review of my code
- [ ] I have tested my changes thoroughly
- [ ] My changes do not introduce breaking changes (or are properly documented)
- [ ] I consent to the release of this contribution under the MIT license