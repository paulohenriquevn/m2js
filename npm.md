# 📦 M2JS NPM Deployment Guide

**Guia completo para deploy e gestão do package M2JS no NPM Registry**

---

## 🎯 **Informações do Package**

- **Nome**: `@paulohenriquevn/m2js`
- **Versão Atual**: `1.0.0`
- **Registry**: https://www.npmjs.com/package/@paulohenriquevn/m2js
- **Escopo**: Scoped package (`@paulohenriquevn/`)
- **Acesso**: Público
- **License**: MIT

---

## 🚀 **Processo de Deploy - Passo a Passo**

### **1. Pré-requisitos**

```bash
# Verificar se está logado no NPM
npm whoami

# Se não estiver logado:
npm login
```

**Credenciais necessárias:**
- Username NPM
- Password NPM
- Email NPM
- OTP (se 2FA estiver habilitado)

### **2. Preparação para Deploy**

#### **Validação Completa:**
```bash
# 1. Verificar testes
npm test

# 2. Verificar TypeScript
npm run type-check

# 3. Build de produção
npm run build

# 4. Auditoria de segurança
npm audit

# 5. Verificar dependências desatualizadas
npm outdated
```

#### **Estrutura de Arquivos (obrigatória):**
```
m2js/
├── dist/                 # Build output (obrigatório)
├── README.md            # Documentação (obrigatório)
├── LICENSE              # License MIT (obrigatório)
├── CHANGELOG.md         # Histórico de versões
├── package.json         # Metadata NPM
├── .npmignore          # Arquivos excluídos do package
└── src/                # Código fonte (excluído via .npmignore)
```

### **3. Versioning e Release**

#### **Semantic Versioning (obrigatório):**
```bash
# PATCH: Bug fixes (1.0.0 → 1.0.1)
npm version patch

# MINOR: New features (1.0.0 → 1.1.0)
npm version minor

# MAJOR: Breaking changes (1.0.0 → 2.0.0)
npm version major
```

#### **Atualizando CHANGELOG.md:**
```markdown
## [1.0.1] - 2025-07-05
### Fixed
- Correção de bug específico

## [1.1.0] - 2025-07-05  
### Added
- Nova funcionalidade X
- Nova funcionalidade Y
```

### **4. Deploy para NPM**

#### **Deploy Normal:**
```bash
# Para packages scoped públicos
npm publish --access=public
```

#### **Deploy com Validação:**
```bash
# Testar package sem publicar
npm pack --dry-run

# Validar conteúdo do package
npm publish --dry-run

# Publicar quando estiver certo
npm publish --access=public
```

### **5. Pós-Deploy Validation**

```bash
# Verificar se foi publicado
npm view @paulohenriquevn/m2js

# Testar instalação global
npm install -g @paulohenriquevn/m2js

# Testar CLI funcionando
m2js --version
m2js --help

# Testar funcionalidade básica
m2js examples/service.ts
```

---

## ⚙️ **Configurações Críticas**

### **package.json - Configurações Obrigatórias:**

```json
{
  "name": "@paulohenriquevn/m2js",
  "version": "1.0.0",
  "description": "🚀 Transform TypeScript/JavaScript code into LLM-friendly Markdown summaries...",
  "main": "dist/index.js",
  "bin": {
    "m2js": "dist/cli.js"
  },
  "files": [
    "dist/**/*",
    "README.md", 
    "LICENSE",
    "CHANGELOG.md"
  ],
  "engines": {
    "node": ">=16.0.0"
  },
  "scripts": {
    "prepublishOnly": "npm run type-check && npm test && npm run build"
  },
  "keywords": [
    "typescript", "javascript", "markdown", "llm", "ai", 
    "chatgpt", "claude", "documentation", "cli"
  ],
  "repository": {
    "type": "git",
    "url": "https://github.com/paulohenriquevn/m2js.git"
  },
  "homepage": "https://github.com/paulohenriquevn/m2js#readme",
  "bugs": {
    "url": "https://github.com/paulohenriquevn/m2js/issues"
  }
}
```

### **.npmignore - Arquivos Excluídos:**

```gitignore
# Source files
src/
tests/
examples/
docs/

# Development files
*.log
.nyc_output
coverage/
node_modules/

# IDE files
.vscode/
.idea/

# Config files
tsconfig.json
jest.config.js
.eslintrc.*

# Development docs
CLAUDE.md
CONTRIBUTING.md
```

---

## 🔄 **Fluxo de Atualização**

### **Para Bug Fixes (Patch):**
```bash
# 1. Fix o bug no código
# 2. Atualizar testes se necessário
npm test

# 3. Atualizar versão
npm version patch

# 4. Atualizar CHANGELOG.md
# 5. Deploy
npm publish --access=public

# 6. Git commit e push
git add .
git commit -m "fix: [descrição do bug fix]"
git push origin main
git push --tags
```

### **Para Novas Features (Minor):**
```bash
# 1. Implementar feature
# 2. Adicionar testes
npm test

# 3. Atualizar documentação
# 4. Versioning
npm version minor

# 5. Atualizar CHANGELOG.md
# 6. Deploy
npm publish --access=public

# 7. Git workflow
git add .
git commit -m "feat: [descrição da feature]"
git push origin main
git push --tags
```

### **Para Breaking Changes (Major):**
```bash
# 1. Implementar mudanças
# 2. Atualizar TODOS os testes
# 3. Atualizar documentação extensivamente
# 4. Versioning
npm version major

# 5. Atualizar CHANGELOG.md com BREAKING CHANGES
# 6. Deploy
npm publish --access=public

# 7. Git workflow com tag especial
git add .
git commit -m "feat!: [BREAKING CHANGE description]"
git push origin main
git push --tags
```

---

## 🚨 **Troubleshooting**

### **Problemas Comuns:**

#### **1. Nome do Package Conflito:**
```
Error: Package name too similar to existing package
```
**Solução:** Usar scoped package `@username/package-name`

#### **2. Não Pode Sobrescrever Versão:**
```
Error: You cannot publish over previously published versions
```
**Solução:** Incrementar versão com `npm version patch/minor/major`

#### **3. Não Logado:**
```
Error: need auth This command requires you to be logged in
```
**Solução:** `npm login` primeiro

#### **4. Permissão Negada:**
```
Error: 403 Forbidden
```
**Solução:** Verificar se tem permissão ou usar `--access=public`

### **Comandos de Debug:**
```bash
# Verificar configuração NPM
npm config list

# Verificar registry atual
npm config get registry

# Verificar usuário logado
npm whoami

# Ver detalhes de um package
npm view @paulohenriquevn/m2js

# Verificar conteúdo antes de publicar
npm pack --dry-run
```

---

## 📊 **Monitoramento Pós-Deploy**

### **Métricas para Acompanhar:**

1. **Downloads NPM**: Via npmjs.com dashboard
2. **Issues GitHub**: Bugs reportados pela comunidade
3. **Stars/Forks**: Engajamento da comunidade
4. **Vulnerabilities**: `npm audit` regular

### **Comandos de Monitoramento:**
```bash
# Verificar downloads
npm view @paulohenriquevn/m2js --json

# Verificar versões disponíveis
npm view @paulohenriquevn/m2js versions --json

# Auditoria de segurança
npm audit

# Verificar dependências desatualizadas
npm outdated
```

---

## 🔐 **Segurança e Best Practices**

### **Checklist de Segurança:**
- [ ] `npm audit` sem vulnerabilidades
- [ ] Dependencies mínimas necessárias
- [ ] `.npmignore` configurado corretamente
- [ ] Não incluir arquivos sensíveis (keys, tokens)
- [ ] Validar input do usuário no CLI
- [ ] Error handling adequado

### **Best Practices:**
- [ ] Sempre usar `prepublishOnly` script
- [ ] Manter CHANGELOG.md atualizado
- [ ] Usar semantic versioning rigorosamente
- [ ] Incluir todos os arquivos necessários em `files`
- [ ] Testar package com `npm pack --dry-run`
- [ ] Validar cross-platform antes do deploy

---

## 📝 **Template de Release Notes**

```markdown
## [@paulohenriquevn/m2js@1.1.0] - 2025-07-05

### ✨ Added
- Nova funcionalidade X para melhorar Y
- Suporte para Z syntax

### 🐛 Fixed  
- Correção de bug A que causava B
- Melhoria na performance de C

### 📚 Documentation
- Atualizado README com exemplos
- Adicionado guia de troubleshooting

### 🚀 Installation
```bash
npm install -g @paulohenriquevn/m2js@1.1.0
```

### 📊 Stats
- Package size: X kB
- Dependencies: Y 
- Node.js: >=16.0.0
```

---

## 🎯 **Conclusão**

Este guia cobre o processo completo de deploy do M2JS no NPM. Seguindo estas práticas, garantimos:

- ✅ Deployments consistentes e confiáveis
- ✅ Versionamento semântico adequado  
- ✅ Segurança e qualidade do package
- ✅ Experiência positiva para usuários finais

**Para qualquer dúvida sobre o processo de deploy, consulte este documento ou abra uma issue no repositório.**

---

**📅 Última Atualização**: July 2025  
**👤 Maintainer**: Paulo Henrique Vieira  
**📧 Contato**: Através do GitHub Issues