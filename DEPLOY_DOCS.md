# 📚 Deploy da Documentação M2JS

Guia completo para fazer o deploy da documentação do M2JS no GitHub Pages.

## 🚀 Setup Inicial (Uma Vez)

### 1. Configurar GitHub Pages

1. **Acesse as configurações do repositório**:
   ```
   https://github.com/paulohenriquevn/m2js/settings
   ```

2. **Navegue até a seção Pages**:
   ```
   Settings → Pages
   ```

3. **Configure a fonte**:
   ```
   Source: GitHub Actions
   ✅ Enforce HTTPS
   ```

### 2. Verificar Arquivos de Configuração

Certifique-se de que estes arquivos existem e estão configurados:

#### `.github/workflows/deploy-docs.yml`
```yaml
name: Deploy M2JS Documentation

on:
  push:
    branches: [main]
    paths: ['docs-site/**']
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

# ... resto da configuração
```

#### `docs-site/docs/.vitepress/config.mts`
```typescript
export default defineConfig({
  title: 'M2JS',
  description: 'Transform TypeScript/JavaScript into LLM-friendly Markdown',
  base: '/m2js/',  // ⚠️ IMPORTANTE: Nome do repositório
  
  // ... resto da configuração
})
```

## 🔄 Deploy Automático

### Como Funciona

1. **Qualquer push para `main`** que afete arquivos em `docs-site/**`
2. **GitHub Actions detecta** as mudanças
3. **Build automático** da documentação com VitePress
4. **Deploy automático** para GitHub Pages
5. **Site atualizado** em: https://paulohenriquevn.github.io/m2js/

### Workflow do Desenvolvedor

```bash
# 1. Fazer mudanças na documentação
cd docs-site/docs/
# Editar arquivos .md

# 2. Testar localmente
cd ../
npm run dev
# Verificar em http://localhost:5173

# 3. Build local (opcional)
npm run build
npm run preview

# 4. Commit e push
git add docs-site/
git commit -m "docs: atualizar documentação X"
git push origin main

# 5. GitHub Actions faz o deploy automaticamente
# Verificar em: https://github.com/paulohenriquevn/m2js/actions
```

## 🛠️ Deploy Manual

### Via GitHub Actions UI

1. **Acesse o repositório**:
   ```
   https://github.com/paulohenriquevn/m2js
   ```

2. **Vá para Actions**:
   ```
   Aba "Actions"
   ```

3. **Execute o workflow**:
   ```
   → "Deploy M2JS Documentation"
   → "Run workflow"
   → Branch: main
   → "Run workflow"
   ```

### Via Command Line (Alternativo)

```bash
# Instalar GitHub CLI (se não tiver)
# https://cli.github.com/

# Trigger manual do workflow
gh workflow run deploy-docs.yml

# Verificar status
gh run list --workflow=deploy-docs.yml
```

## 📝 Atualizando Documentação

### Estrutura dos Arquivos

```
docs-site/docs/
├── index.md                     # Página inicial
├── guide/                       # Guias do usuário
│   ├── quick-start.md
│   ├── best-practices.md
│   └── configuration.md
├── reference/                   # Referência técnica
│   ├── cli.md
│   └── ai-analyzers.md
├── architecture/                # Documentação para desenvolvedores
│   ├── overview.md
│   ├── contributing.md
│   └── deployment.md
├── extension/                   # Extensão VS Code
│   └── overview.md
└── deployment/                  # Guias de deploy
    └── github-pages.md
```

### Adicionando Nova Página

1. **Criar arquivo markdown**:
   ```bash
   # Exemplo: Nova funcionalidade
   touch docs-site/docs/guide/nova-funcionalidade.md
   ```

2. **Adicionar conteúdo**:
   ```markdown
   # 🎯 Nova Funcionalidade
   
   Descrição da nova funcionalidade...
   
   ## Como Usar
   
   ```bash
   m2js src/ --nova-funcionalidade
   ```
   ```

3. **Atualizar navegação** em `config.mts`:
   ```typescript
   sidebar: {
     '/guide/': [
       {
         text: 'Getting Started',
         items: [
           { text: 'Quick Start', link: '/guide/quick-start' },
           { text: 'Nova Funcionalidade', link: '/guide/nova-funcionalidade' }, // ⭐ ADICIONAR
           { text: 'Best Practices', link: '/guide/best-practices' }
         ]
       }
     ]
   }
   ```

4. **Testar e fazer commit**:
   ```bash
   cd docs-site/
   npm run dev  # Testar localmente
   
   git add .
   git commit -m "docs: adicionar guia da nova funcionalidade"
   git push origin main
   ```

## ⚡ Desenvolvimento Local

### Setup do Ambiente

```bash
# 1. Navegar para diretório da documentação
cd docs-site/

# 2. Instalar dependências
npm install

# 3. Iniciar servidor de desenvolvimento
npm run dev

# 4. Abrir no navegador
# http://localhost:5173
```

### Scripts Disponíveis

```bash
# Desenvolvimento com hot reload
npm run dev

# Build para produção
npm run build

# Preview do build de produção
npm run preview

# Deploy manual (não recomendado)
npm run deploy
```

## 🔍 Verificando o Deploy

### URLs Importantes

- **Site em produção**: https://paulohenriquevn.github.io/m2js/
- **GitHub Actions**: https://github.com/paulohenriquevn/m2js/actions
- **Configurações Pages**: https://github.com/paulohenriquevn/m2js/settings/pages

### Checklist de Verificação

```bash
# ✅ Site carrega corretamente
curl -I https://paulohenriquevn.github.io/m2js/

# ✅ Navigation funciona
# Testar todos os links do menu principal

# ✅ Sidebar navigation funciona
# Testar links da sidebar

# ✅ Search funciona
# Testar busca local

# ✅ Edit links funcionam
# Testar "Edit this page on GitHub"

# ✅ Responsive design
# Testar em diferentes tamanhos de tela
```

## 🚨 Troubleshooting

### Problemas Comuns

#### 1. Site não carrega (404)
```bash
Problema: https://paulohenriquevn.github.io/m2js/ retorna 404
Solução: Verificar se base: '/m2js/' está correto em config.mts
```

#### 2. CSS/JS não carrega
```bash
Problema: Página carrega mas sem estilos
Solução: Verificar configuração de base URL e caminhos dos assets
```

#### 3. Build falha no GitHub Actions
```bash
Problema: Workflow falha durante build
Solução: 
1. Verificar logs em Actions tab
2. Testar build localmente: npm run build
3. Verificar dependências em package.json
```

#### 4. Links internos quebrados
```bash
Problema: Links para outras páginas não funcionam
Solução: 
1. Usar caminhos relativos: /guide/quick-start
2. Verificar se arquivos existem
3. Atualizar sidebar em config.mts
```

### Debug do Build

```bash
# Build local com debug
cd docs-site/
DEBUG=vitepress:* npm run build

# Verificar output
ls -la docs/.vitepress/dist/

# Testar servidor local
npm run preview
```

### Logs do GitHub Actions

```bash
# Ver logs detalhados
1. Ir para GitHub.com → repositório → Actions
2. Clicar no workflow que falhou
3. Expandir "Build Documentation" ou "Deploy to GitHub Pages"
4. Verificar mensagens de erro
```

## 🔧 Configurações Avançadas

### Custom Domain (Opcional)

```bash
# 1. Adicionar arquivo CNAME
echo "docs.m2js.dev" > docs-site/docs/public/CNAME

# 2. Configurar DNS
# CNAME: docs → paulohenriquevn.github.io

# 3. Atualizar GitHub Pages settings
# Custom domain: docs.m2js.dev
# ✅ Enforce HTTPS
```

### Google Analytics

```typescript
// config.mts
head: [
  ['script', { async: true, src: 'https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID' }],
  ['script', {}, `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'GA_MEASUREMENT_ID');
  `]
]
```

### Performance Optimization

```typescript
// config.mts
export default defineConfig({
  cleanUrls: true,        // URLs limpos
  metaChunk: true,        // Meta info em chunk separado
  
  vite: {
    build: {
      minify: 'terser',   // Minificação otimizada
      rollupOptions: {
        output: {
          manualChunks: { // Code splitting
            'group-vendor': ['vue', 'vitepress']
          }
        }
      }
    }
  }
})
```

## 📋 Checklist de Deploy

### Antes do Deploy

- [ ] Testado localmente com `npm run dev`
- [ ] Build local funciona: `npm run build`
- [ ] Preview funciona: `npm run preview`
- [ ] Todos os links internos funcionam
- [ ] Imagens carregam corretamente
- [ ] Navigation/sidebar atualizados
- [ ] Conteúdo revisado e sem erros

### Após o Deploy

- [ ] Site carrega: https://paulohenriquevn.github.io/m2js/
- [ ] GitHub Actions completou com sucesso
- [ ] Todas as páginas acessíveis
- [ ] Search funciona
- [ ] Links externos funcionam
- [ ] Site responsivo em mobile/desktop

---

## 🎯 Resumo

1. **Setup inicial**: Configurar GitHub Pages (uma vez)
2. **Desenvolver**: Editar arquivos em `docs-site/docs/`
3. **Testar**: `npm run dev` para verificar localmente
4. **Deploy**: Commit e push para `main` (automático)
5. **Verificar**: Site atualizado em poucos minutos

**URL da documentação**: https://paulohenriquevn.github.io/m2js/

Para dúvidas, consulte a [documentação completa de deploy](/deployment/github-pages).