# CLAUDE.md - M2JS Development Rules & Standards

**📋 Documento de Regras Fundamentais para o M2JS**  
**Versão**: 1.0  
**Última Atualização**: July 2025  
**Status**: Regras Obrigatórias e Inegociáveis

---

## 🎯 **IDENTIDADE DO PROJETO**

### **M2JS (Markdown from JavaScript)**
- **Propósito**: CLI tool que extrai código TypeScript/JavaScript para Markdown LLM-friendly
- **Target**: Developers usando AI coding assistants (ChatGPT, Claude)
- **Value Prop**: 60%+ token reduction + melhor contexto para LLMs
- **Stack**: Node.js + TypeScript + Babel Parser + Commander.js CLI
- **Distribution**: NPM package global + Open Source (MIT)

### **Filosofia Central**
```
"Simplicidade radical para developers que trabalham com IA"

Prefira:
- 1 comando simples vs 10 opções complexas
- Hardcode inicial vs abstração prematura  
- Falha rápida vs recuperação silenciosa
- Output determinístico vs flexibilidade excessiva
```

---

## 📋 **PRINCÍPIOS FUNDAMENTAIS - NUNCA QUEBRAR**

Estas regras são **INEGOCIÁVEIS** em qualquer implementação:

### **🎯 1. KISS (Keep It Simple, Stupid)**

#### **SEMPRE:**
- ✅ Escolher a solução mais simples que funciona
- ✅ Hardcode antes de generalizar
- ✅ 1 funcionalidade por story/commit
- ✅ Arquivos < 300 linhas, funções < 30 linhas
- ✅ Dependências mínimas necessárias

#### **NUNCA:**
- ❌ Over-engineer ou criar abstrações desnecessárias
- ❌ "Preparar para o futuro" sem valor imediato
- ❌ Plugin architectures ou frameworks complexos
- ❌ Multiple patterns quando 1 simples funciona
- ❌ Linguagem vaga: "robusto", "escalável", "flexível"

#### **Exemplo KISS:**
```typescript
// ❌ Over-engineered
class ConfigurableMarkdownTemplateEngineWithPluginSupport { ... }

// ✅ KISS
function generateMarkdown(functions: ParsedFunction[]): string {
  return `## Functions\n\n${functions.map(formatFunction).join('\n\n')}`;
}
```

### **⚡ 2. FAIL-FAST**

#### **SEMPRE:**
- ✅ Falhar rapidamente com mensagens claras
- ✅ Validar inputs no início das funções
- ✅ TypeScript strict mode (zero `any`)
- ✅ Error codes apropriados (0 = success, 1 = error)
- ✅ Feedback imediato (< 3 dias por story)

#### **NUNCA:**
- ❌ Mascarar erros ou tentar recuperação silenciosa
- ❌ Continue processando após erro conhecido
- ❌ Error messages vagas ou técnicas demais
- ❌ Warnings ignorados ou console.logs esquecidos

#### **Exemplo FAIL-FAST:**
```typescript
// ❌ Mascara erro
function parseFile(path: string) {
  try {
    return babel.parse(readFileSync(path, 'utf8'));
  } catch {
    return null; // ❌ Usuário não sabe o que aconteceu
  }
}

// ✅ FAIL-FAST
function parseFile(path: string): ParsedAST {
  if (!existsSync(path)) {
    throw new Error(`File not found: ${path}`);
  }
  
  if (!path.match(/\.(ts|tsx|js|jsx)$/)) {
    throw new Error(`Unsupported file type: ${path}. Only .ts, .tsx, .js, .jsx are supported.`);
  }
  
  try {
    return babel.parse(readFileSync(path, 'utf8'), BABEL_CONFIG);
  } catch (error) {
    throw new Error(`Parse error in ${path}: ${error.message}`);
  }
}
```

### **🏗️ 3. VERTICAL SLICE (Obrigatório)**

#### **SEMPRE:**
- ✅ Implementação end-to-end que entrega valor ao usuário
- ✅ Atravessar todas as camadas: CLI → Parser → Logic → File I/O
- ✅ Funcionalidade testável pelo usuário final
- ✅ Deployável independentemente via NPM

#### **NUNCA:**
- ❌ Implementação apenas horizontal (só parser, só CLI, só output)
- ❌ Stories que não entregam valor completo
- ❌ Dependência de outras stories para funcionar
- ❌ Setup/configuração sem funcionalidade real

#### **Template Vertical Slice Obrigatório:**
```yaml
CAMADAS OBRIGATÓRIAS (todas devem estar presentes):
□ CLI Interface: [Comando específico que usuário executa]
□ Parser Logic: [Babel AST processing específico]  
□ Business Logic: [Extração/transformação específica]
□ File I/O: [Input/output de arquivos específicos]
□ Integration: [Fluxo completo funcionando end-to-end]

VALOR ENTREGUE AO USUÁRIO:
□ Usuário consegue executar comando completo
□ Output Markdown utilizável imediatamente
□ Não depende de outras stories para funcionar
□ Deployável independentemente via NPM
```

### **🚫 4. ANTI-MOCK (Exceto Testes Unitários)**

#### **SEMPRE:**
- ✅ Integração real com filesystem
- ✅ Babel parser real (não syntax simulation)
- ✅ Commander.js real (não command mocks)
- ✅ File I/O real para testing

#### **NUNCA:**
- ❌ Mocks em desenvolvimento ou produção
- ❌ Simular filesystem operations
- ❌ Fake AST responses
- ❌ Stub de APIs externas (use feature flags)

#### **EXCEÇÃO:**
- ✅ **SOMENTE** em arquivos `.test.ts` para unit tests específicos
- ✅ Mock de external APIs em tests (não filesystem)

---

## 🏗️ **REGRAS ESPECÍFICAS DO M2JS**

### **📦 1. Stack e Dependencies**

#### **Stack Obrigatório:**
```json
{
  "required": {
    "node": ">=16.0.0",
    "typescript": "^5.0.0",
    "@babel/parser": "^7.23.0",
    "@babel/traverse": "^7.23.0",
    "commander": "^11.0.0",
    "chalk": "^4.1.2"
  },
  "forbidden": [
    "any custom AST parsers",
    "heavy frameworks",
    "database dependencies",
    "complex CLI frameworks"
  ]
}
```

#### **Estrutura de Pastas Obrigatória:**
```
m2js/
├── src/
│   ├── cli.ts          # CLI interface entry point
│   ├── parser.ts       # Babel AST parsing logic
│   ├── generator.ts    # Markdown generation
│   ├── types.ts        # TypeScript definitions
│   └── utils/          # Utility functions
├── tests/
│   ├── *.test.ts       # Unit tests
│   └── fixtures/       # Test input/output files
├── examples/           # Sample usage files
├── docs/              # Documentation
└── dist/              # Compiled output
```

### **⌨️ 2. CLI Interface Standards**

#### **Command Structure Obrigatória:**
```bash
# Primary command
m2js <file>                    # Basic usage
m2js <file> -o output.md       # Custom output
m2js <file> --no-comments      # Skip comments
m2js --help                    # Show help
m2js --version                 # Show version

# FORBIDDEN patterns:
m2js config set ...            # ❌ Sem subcommands complexos
m2js --advanced-parser-options # ❌ Sem configurações complexas
```

#### **Error Handling Obrigatório:**
```typescript
// Exit codes padrão
const EXIT_CODES = {
  SUCCESS: 0,
  ERROR: 1,
  INVALID_INPUT: 2,
  FILE_NOT_FOUND: 3,
  PARSE_ERROR: 4
} as const;

// Error messages user-friendly
function showError(message: string, code: number = EXIT_CODES.ERROR): never {
  console.error(chalk.red(`❌ Error: ${message}`));
  process.exit(code);
}
```

### **🔍 3. Parser e AST Rules**

#### **Babel Configuration Obrigatória:**
```typescript
const BABEL_CONFIG = {
  sourceType: 'module' as const,
  plugins: [
    'typescript',
    'jsx',
    'decorators-legacy',
    'classProperties',
    'asyncGenerators',
    'bigInt',
    'dynamicImport'
  ]
};

// ❌ FORBIDDEN: Custom AST parsing
// ❌ FORBIDDEN: Regex-based code extraction
// ✅ REQUIRED: Babel parser sempre
```

#### **Extraction Rules Obrigatórias:**
```typescript
// ✅ EXTRACT (only exported code):
- ExportNamedDeclaration
- ExportDefaultDeclaration  
- FunctionDeclaration (if exported)
- ClassDeclaration (if exported)
- JSDoc comments attached to exports

// ❌ NEVER EXTRACT (private code):
- Private functions/methods
- Internal helper functions
- Implementation details
- Non-exported classes/interfaces
- Debug code or comments
```

### **📝 4. Output Quality Standards**

#### **Markdown Format Obrigatório:**
```markdown
# 📝 filename.ts

## 📦 Dependencies
```typescript
import ... from '...'
```

## 🔧 Functions

### functionName
/**
 * JSDoc comment preserved exactly
 */
```typescript
export function functionName(): ReturnType {
  // Implementation hidden - only signature shown
}
```

## 🏗️ Classes

### ClassName
```typescript
export class ClassName {
  // Only public interface shown
}
```
```

#### **Quality Rules:**
- ✅ **Deterministic output**: Same input = same output always
- ✅ **Valid Markdown**: Must pass markdown validators
- ✅ **Clean formatting**: Consistent spacing and structure
- ✅ **Special character escaping**: Handle `<>{}[]` correctly
- ❌ **No private code leakage**: Zero internal implementation details

---

## 💻 **PADRÕES DE CÓDIGO OBRIGATÓRIOS**

### **📏 Size e Complexity Limits**

```yaml
HARD LIMITS (nunca exceeder):
  - Files: 300 lines max
  - Functions: 30 lines max  
  - Nesting: 3 levels max
  - Cyclomatic complexity: 10 max
  
SOFT LIMITS (avisos):
  - Classes: 200 lines
  - Function parameters: 5 max
  - Import statements: 10 max per file
```

### **🎯 TypeScript Strict Rules**

```typescript
// tsconfig.json OBRIGATÓRIO:
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}

// ❌ FORBIDDEN em qualquer código:
const data: any = {};           // ❌ Never use 'any'
function process(input) {}      // ❌ Must have types
let result;                     // ❌ Must declare type
```

### **🧹 Code Quality Rules**

```typescript
// ✅ REQUIRED patterns:
export function parseFile(filePath: string): ParsedResult {
  // Early validation
  if (!filePath) {
    throw new Error('File path is required');
  }
  
  // Single responsibility
  const content = readFile(filePath);
  const ast = parseWithBabel(content);
  const extracted = extractExports(ast);
  
  return extracted;
}

// ❌ FORBIDDEN patterns:
export function doEverything(input: any): any {  // ❌ Vague naming, any types
  try {
    // ❌ Silent error swallowing
    const result = somethingComplex();
    console.log('Debug info');  // ❌ Console logs
    return result || {};        // ❌ Unclear fallback
  } catch {
    return null;               // ❌ Silent failures
  }
}
```

---

## ✅ **DEFINITION OF DONE UNIVERSAL**

### **🚨 BLOQUEADORES CRÍTICOS**
**NENHUMA história pode ser aprovada sem:**

1. **🚨 TODOS OS TESTES UNITÁRIOS PASSANDO** (100% obrigatório)
2. **🚨 TypeScript compilation sem erros** (zero warnings)
3. **🚨 CLI funciona globalmente via npm link** (testado)
4. **🚨 Output Markdown é válido** (verificado)

### **📋 Checklist Funcional**
- [ ] Critérios de aceite 100% atendidos
- [ ] Happy path testado 3x manualmente
- [ ] Edge cases principais testados
- [ ] Error handling adequado implementado
- [ ] Performance < 2s para arquivos < 1MB

### **⚙️ Checklist Técnico**
- [ ] **Testes unitários**: Cobertura > 80% das funcionalidades principais
- [ ] **Code quality**: ESLint + Prettier passando
- [ ] **Type safety**: TypeScript strict sem erros
- [ ] **CLI quality**: Help text claro, error messages úteis
- [ ] **NPM package**: Instala e funciona globalmente

### **🔬 Testing Strategy por Tipo**

#### **Parser/AST Components:**
```typescript
// REQUIRED tests:
describe('Parser', () => {
  it('should extract exported functions only', () => {
    const input = `
      export function publicFn() {}
      function privateFn() {}
    `;
    const result = parseCode(input);
    expect(result.functions).toHaveLength(1);
    expect(result.functions[0].name).toBe('publicFn');
  });
  
  it('should handle TypeScript syntax', () => {
    const input = `export function typed(x: number): string { return ''; }`;
    expect(() => parseCode(input)).not.toThrow();
  });
  
  it('should fail fast on invalid syntax', () => {
    const input = `export function broken( { // malformed`;
    expect(() => parseCode(input)).toThrow('Parse error');
  });
});
```

#### **CLI Interface:**
```typescript
// REQUIRED tests:
describe('CLI', () => {
  it('should show help when --help is used', () => {
    const result = execSync('m2js --help');
    expect(result.toString()).toContain('Usage:');
  });
  
  it('should exit with code 1 on file not found', () => {
    try {
      execSync('m2js non-existent.ts');
    } catch (error) {
      expect(error.status).toBe(1);
    }
  });
});
```

### **📦 NPM Package Quality**
- [ ] **package.json**: Bin config correto, keywords apropriadas
- [ ] **README.md**: Atualizado com novas funcionalidades
- [ ] **Versioning**: Semantic versioning respeitado
- [ ] **Dependencies**: Mínimas necessárias, vulnerabilities zero
- [ ] **Global install**: `npm install -g m2js` funciona
- [ ] **Cross-platform**: Funciona em Windows/macOS/Linux

---

## 🚫 **RED FLAGS - PARE IMEDIATAMENTE SE**

### **🚨 Complexity Red Flags**
```yaml
PARE se a implementação tem:
❌ > 5 arquivos modificados para 1 story
❌ > 3 dependências novas adicionadas
❌ > 2 horas sem progresso claro
❌ Necessidade de mocks fora de testes
❌ Breaking changes na CLI interface
❌ Performance degradation > 50%
```

### **🎯 Scope Red Flags**
```yaml
PARE se a story inclui:
❌ Múltiplas funcionalidades (functions + classes + interfaces)
❌ Configuração complexa ou plugin system
❌ Features de "preparação para futuro"
❌ Abstrações que não têm uso imediato
❌ More than 1 new command/option
```

### **🔧 Technical Red Flags**
```yaml
PARE se o código tem:
❌ Uso de 'any' no TypeScript
❌ Console.log statements esquecidos
❌ Arquivos > 300 linhas
❌ Funções > 30 linhas
❌ Tests falhando ou com baixa cobertura
❌ TypeScript errors ou warnings
```

---

## 🛠️ **COMANDOS DE DESENVOLVIMENTO**

### **📋 Setup e Validation**
```bash
# Environment setup
npm install
npm run type-check
npm run lint
npm run build

# Local testing
npm link              # Install globally for testing
m2js --help           # Test CLI works
m2js examples/test.ts # Test basic functionality

# Quality gates
npm test              # 🚨 MUST PASS - Unit tests
npm run test:coverage # Verify coverage
npm run build         # 🚨 MUST SUCCEED - No TS errors
```

### **🔄 Development Workflow**
```bash
# Development cycle
npm run dev           # Watch mode compilation
npm run test:watch    # Watch mode testing
npm link              # Test CLI changes
m2js [test-file]      # Manual validation

# Pre-commit checks
npm run type-check    # TypeScript validation
npm run lint          # Code quality
npm test              # All tests must pass
npm run build         # Production build
```

### **📦 Release Process**
```bash
# Version management
npm version patch     # Bug fixes
npm version minor     # New features  
npm version major     # Breaking changes

# NPM publishing
npm run build
npm publish          # Push to NPM registry

# Git workflow
git add .
git commit -m "feat: [clear description]"
git push origin main
```

---

## 📊 **QUALITY METRICS**

### **🎯 Success Criteria**
```yaml
Code Quality:
  - TypeScript strict: 100% compliance
  - Test coverage: >80% for critical paths  
  - Linting: Zero warnings
  - Bundle size: <5MB final package

Performance:
  - Parsing: <2s for files <1MB
  - CLI startup: <500ms
  - Memory usage: <100MB during processing
  - NPM install: <30s

User Experience:
  - Error messages: Clear and actionable
  - Help text: Complete and useful
  - Cross-platform: Works on Win/Mac/Linux
  - Documentation: Up-to-date and comprehensive
```

### **📈 Monitoring**
```yaml
Track sempre:
  - Test pass rate (must be 100%)
  - Build success rate (must be 100%)
  - NPM download statistics
  - GitHub issues and feedback
  - Performance regression alerts
```

---

## 🎯 **FILOSOFIA DE EXECUÇÃO**

### **💡 Decision Framework**
```
Para cada decisão técnica, pergunte:

1. KISS: "Qual é a solução MAIS SIMPLES que funciona?"
2. FAIL-FAST: "Como isso vai falhar? Vai falhar rapidamente e claramente?"
3. VERTICAL SLICE: "Isso entrega valor completo ao usuário?"
4. ANTI-MOCK: "Posso testar isso com dados/APIs reais?"

Se qualquer resposta for "não" ou "não sei", SIMPLIFIQUE.
```

### **⚡ Execution Principles**
```yaml
Velocity over Perfection:
  - Ship working code fast
  - Iterate based on real feedback
  - Refactor when needed, not before

Quality over Features:
  - Better 1 feature that works perfectly
  - Than 5 features that work "mostly"
  - Zero tolerance for broken CLI

Community over Ego:
  - Code should be readable by contributors
  - Documentation should teach, not show off
  - Simplicity enables community contribution
```

---

## 📝 **PROCESSO DE MUDANÇAS**

### **🔄 Para Atualizar Este Documento**
1. **Proposta**: Issue no GitHub com justificativa
2. **Discussão**: Community review + maintainer approval
3. **Teste**: Validar mudança em branch separado
4. **Aprovação**: Merge apenas com consensus
5. **Comunicação**: Announce changes para todos

### **🚫 Regras Imutáveis**
```yaml
NUNCA PODEM SER MUDADAS:
- KISS principle (simplicidade sempre)
- FAIL-FAST principle (falha rápida)
- VERTICAL SLICE requirement (valor end-to-end)
- ANTI-MOCK rule (exceto unit tests)
- TypeScript strict mode
- Test coverage requirements
```

---

## 🎯 **CONCLUSÃO**

**Este documento define a identidade técnica do M2JS.**

Qualquer código, decisão ou processo que **contradiga estas regras** deve ser **rejeitado imediatamente**.

A qualidade e simplicidade do M2JS dependem da **adesão rigorosa** a estes princípios.

**Lembre-se**: 
> "Better to ship something simple that works than something complex that doesn't."

---

**📅 Última Revisão**: July 2025  
**👥 Maintainers**: [Lista de maintainers]  
**📧 Contato**: [Contact info para discussões sobre regras]