# Épicos e Histórias - M2JS
> Baseado no MVP Definition + System Wireframes - Etapa 06/14

## 🎯 Análise do Sistema

### Tipo de Sistema Identificado
**Workflow System** - O M2JS segue um pipeline sequencial claro: Input → Parsing → Extraction → Generation → Output, onde cada etapa depende da anterior e processa dados de forma estruturada através de rules definidas.

### Padrões Aplicados
- **Padrão Primário**: Workflow Steps - Sistema processa arquivos através de etapas sequenciais bem definidas (descoberta → parsing → extração → geração → output)
- **Padrão Secundário**: Simple vs Complex - Começar com arquivo único simples, evoluir para batch processing e estruturas complexas
- **Padrão Terciário**: Major Effort - Batch processing e descoberta de arquivos são funcionalidades independentes grandes que merecem histórias próprias

### Job-to-be-Done Principal
Desenvolvedor quer transformar código TypeScript/JavaScript em documentação markdown otimizada para LLMs, economizando tokens e melhorando contexto, processando arquivos individualmente ou em lote com saída estruturada e co-localizada.

## 📋 Estrutura de Épicos e Histórias

### ÉPICO 1: Core Processing Pipeline
**Objetivo**: Estabelecer o workflow básico de transformação de um arquivo TS/JS em markdown estruturado
**Justificativa**: É o coração do sistema - sem este pipeline funcionando, nenhuma outra funcionalidade faz sentido

#### História 1.1: Desenvolvedor converte arquivo TypeScript simples em markdown básico
- **Padrão Aplicado**: Workflow Steps + Simple vs Complex
- **Value Statement**: Desenvolvedor consegue transformar um arquivo .ts com funções exportadas em markdown limpo, economizando tokens imediatamente
- **Vertical Slice**: 
  - **UI**: CLI aceita `m2js arquivo.ts` e mostra progresso básico
  - **Backend**: Parser Babel + extrator de funções exportadas + gerador markdown básico
  - **API**: Não aplicável (é CLI tool)
  - **Database**: Sistema de arquivos (lê .ts, escreve .md)
- **Estimativa**: 15 dias
- **Dependências**: Nenhuma
- **Critério de Valor**: Desenvolvedor executa `m2js utils.ts`, arquivo `utils.md` é criado com funções exportadas em formato markdown limpo

#### História 1.2: Sistema extrai classes, métodos e comentários JSDoc completos
- **Padrão Aplicado**: Workflow Steps (expandindo extração)
- **Value Statement**: Desenvolvedor obtém documentação completa incluindo classes, métodos públicos e comentários, criando contexto rico para LLMs
- **Vertical Slice**: 
  - **UI**: CLI mostra tipos de elementos extraídos (funções, classes, comentários)
  - **Backend**: Extrator expandido para classes + métodos públicos + JSDoc + type annotations
  - **API**: Não aplicável
  - **Database**: Arquivo .md com estrutura mais rica (seções separadas)
- **Estimativa**: 15 dias
- **Dependências**: História 1.1
- **Critério de Valor**: Arquivo com classe AuthService gera markdown mostrando métodos públicos com parâmetros e comentários JSDoc

### ÉPICO 2: Batch Processing & File Discovery
**Objetivo**: Permitir processamento de múltiplos arquivos automaticamente, descobrindo arquivos TS/JS em projetos
**Justificativa**: Desenvolvedores precisam documentar projetos inteiros, não apenas arquivos individuais

#### História 2.1: Desenvolvedor processa todos os arquivos TS/JS de um diretório
- **Padrão Aplicado**: Major Effort + Workflow Steps
- **Value Statement**: Desenvolvedor executa um comando e obtém documentação markdown para todo o projeto, economizando horas de trabalho manual
- **Vertical Slice**: 
  - **UI**: CLI aceita `m2js ./src` e mostra progresso para múltiplos arquivos
  - **Backend**: File system scanner + batch processor + progresso paralelo
  - **API**: Não aplicável
  - **Database**: Múltiplos arquivos .md criados junto dos .ts originais
- **Estimativa**: 15 dias
- **Dependências**: História 1.2
- **Critério de Valor**: Executar `m2js ./src` processa 10 arquivos TS e cria 10 arquivos .md correspondentes no mesmo local

#### História 2.2: Sistema ignora arquivos de teste e gera relatório de processamento
- **Padrão Aplicado**: Business Rule Variations + Happy/Unhappy Path
- **Value Statement**: Desenvolvedor obtém apenas documentação relevante (sem arquivos de teste) e relatório claro do que foi processado
- **Vertical Slice**: 
  - **UI**: CLI mostra arquivos ignorados e estatísticas finais
  - **Backend**: Filtros para .test.ts, .spec.ts + relatório de status
  - **API**: Não aplicável
  - **Database**: Apenas arquivos relevantes processados + log de atividades
- **Estimativa**: 15 dias
- **Dependências**: História 2.1
- **Critério de Valor**: Projeto com 15 arquivos (5 testes) processa apenas 10 arquivos principais e mostra "5 arquivos de teste ignorados"

### ÉPICO 3: Structured Output Formatting
**Objetivo**: Implementar o formato de saída estruturado hierárquico solicitado pelo usuário
**Justificativa**: Formato específico melhora legibilidade e organização para consumo por LLMs

#### História 3.1: Sistema gera markdown com estrutura hierárquica de classes e métodos
- **Padrão Aplicado**: Interface Variations + Simple vs Complex
- **Value Statement**: Desenvolvedor obtém documentação com formato consistente e hierárquico que facilita navegação e compreensão
- **Vertical Slice**: 
  - **UI**: CLI mostra preview da estrutura sendo gerada
  - **Backend**: Template engine para formato hierárquico + organizador de seções
  - **API**: Não aplicável
  - **Database**: Arquivos .md com formato estruturado específico
- **Estimativa**: 15 dias
- **Dependências**: História 1.2
- **Critério de Valor**: Arquivo com AuthService gera formato `#class_name → #method_name01 → - param1, - param2`

#### História 3.2: Output inclui caminho do arquivo e informações de exports
- **Padrão Aplicado**: Data Variations + Interface Variations
- **Value Statement**: Desenvolvedor vê contexto completo de onde cada código vem, facilitando navegação em projetos grandes
- **Vertical Slice**: 
  - **UI**: Cabeçalhos dos arquivos .md mostram caminho completo
  - **Backend**: Path resolver + organizador de exports + metadata extractor
  - **API**: Não aplicável
  - **Database**: Headers com caminho completo em cada arquivo .md
- **Estimativa**: 15 dias
- **Dependências**: História 3.1
- **Critério de Valor**: Arquivo `/projeto/services/auth.ts` gera markdown começando com `#/projeto/services/auth.ts` seguido de `#exports`

### ÉPICO 4: CLI & Developer Experience
**Objetivo**: Criar interface de linha de comando robusta com opções e tratamento de erros
**Justificativa**: Interface bem feita é crucial para adoção e produtividade do desenvolvedor

#### História 4.1: CLI oferece opções essenciais e ajuda contextual
- **Padrão Aplicado**: Interface Variations + Happy/Unhappy Path
- **Value Statement**: Desenvolvedor usa tool facilmente com opções claras para customizar comportamento e obter ajuda quando necessário
- **Vertical Slice**: 
  - **UI**: Commander.js com --output, --help, --version, mensagens coloridas
  - **Backend**: Option parser + help generator + version manager
  - **API**: Não aplicável
  - **Database**: Arquivos salvos conforme opções especificadas
- **Estimativa**: 15 dias
- **Dependências**: História 2.1
- **Critério de Valor**: `m2js --help` mostra ajuda clara, `m2js file.ts -o custom.md` salva em local específico

#### História 4.2: Sistema trata erros graciosamente e oferece feedback útil
- **Padrão Aplicado**: Happy vs Unhappy Path + Simple vs Complex
- **Value Statement**: Desenvolvedor recebe mensagens de erro claras e sugestões de correção, evitando frustração e perda de tempo
- **Vertical Slice**: 
  - **UI**: Mensagens de erro coloridas e informativas
  - **Backend**: Error handlers + validation + recovery suggestions
  - **API**: Não aplicável
  - **Database**: Logs de erro opcionais para debugging
- **Estimativa**: 15 dias
- **Dependências**: História 4.1
- **Critério de Valor**: Arquivo inexistente mostra "Arquivo não encontrado: suggestions...", arquivo inválido mostra "Syntax error na linha X"

## 📊 Mapa de Dependências

### Sequência Obrigatória
```
Sprint 1: História 1.1 (Core pipeline básico)
Sprint 2: História 1.2 (Extração completa - depende do parser básico)
Sprint 3: História 3.1 (Formato estruturado - precisa da extração completa)
Sprint 4: História 2.1 (Batch processing - usa o core pipeline)
Sprint 5: História 3.2 (Metadata nos outputs - complementa estrutura)
Sprint 6: História 2.2 (Filtros e relatórios - expande batch processing)
Sprint 7: História 4.1 (CLI robusto - integra todas as funcionalidades)
Sprint 8: História 4.2 (Error handling - finaliza UX)
```

### Justificativas de Sequência
- **História 1.1 primeiro**: Base fundamental - parser e gerador básicos precisam funcionar antes de qualquer expansão
- **História 1.2 após 1.1**: Expande extração mantendo mesmo pipeline - validação incremental
- **História 3.1 após 1.2**: Precisa de extração rica para formatar estrutura hierárquica
- **História 2.1 após 1.2**: Batch processing reutiliza pipeline individual validado
- **História 4.1 após 2.1**: CLI precisa integrar funcionalidades core + batch para ser útil
- **História 4.2 por último**: Error handling funciona melhor quando todas as features estão implementadas

## ✅ Validação de Vertical Slice

### Checklist por História

#### História 1.1 - Core Processing
- [ ] **UI Completa**: CLI aceita arquivo e mostra progresso básico
- [ ] **Backend Completo**: Babel parser + function extractor + markdown generator funcionam end-to-end
- [ ] **API Funcional**: N/A (é ferramenta CLI)
- [ ] **Database Operacional**: Lê arquivo .ts, escreve arquivo .md correspondente
- [ ] **Valor Independente**: Desenvolvedor consegue transformar arquivo TS em markdown útil
- [ ] **Testável**: Arquivo real gera markdown que economiza tokens vs arquivo original
- [ ] **15 Dias**: Scope focado apenas em funções exportadas simples

#### História 1.2 - Extração Completa
- [ ] **UI Completa**: CLI mostra tipos de elementos sendo extraídos
- [ ] **Backend Completo**: Extratores de classes, métodos, JSDoc integrados ao pipeline
- [ ] **API Funcional**: N/A
- [ ] **Database Operacional**: Markdown estruturado com seções organizadas
- [ ] **Valor Independente**: Documentação rica suficiente para LLMs entenderem classes complexas
- [ ] **Testável**: Arquivo com classe + métodos + comentários gera markdown completo
- [ ] **15 Dias**: Expansion controlada do extrator existente

#### História 2.1 - Batch Processing
- [ ] **UI Completa**: CLI processa diretório com progresso visual
- [ ] **Backend Completo**: File scanner + parallel processor + batch coordinator
- [ ] **API Funcional**: N/A
- [ ] **Database Operacional**: Múltiplos arquivos .md criados em locais corretos
- [ ] **Valor Independente**: Projeto inteiro documentado com um comando
- [ ] **Testável**: Diretório com N arquivos gera N arquivos markdown
- [ ] **15 Dias**: Reutiliza pipeline individual, adiciona coordenação

#### História 3.1 - Structured Format
- [ ] **UI Completa**: Preview da estrutura hierárquica sendo gerada
- [ ] **Backend Completo**: Template engine + hierarchical organizer
- [ ] **API Funcional**: N/A
- [ ] **Database Operacional**: Markdown com formato específico solicitado
- [ ] **Valor Independente**: Documentação mais legível e navegável
- [ ] **Testável**: Classes geram formato hierárquico consistente
- [ ] **15 Dias**: Foco no template engine, não mudança de extração

## 🎯 Validação de Valor Incremental

### História 1.1: Core Processing Pipeline
**Antes**: Desenvolvedor copia código manualmente para LLMs, incluindo imports e código interno
**Depois**: Desenvolvedor executa `m2js file.ts` e obtém markdown com apenas funções exportadas
**Valor Perceptível**: 60% menos tokens, contexto mais limpo, primeira economia real imediata
**Teste de Valor**: Arquivo 200 linhas vira markdown 80 linhas - LLM entende melhor o código

### História 1.2: Extração Completa
**Antes**: Markdown básico sem classes nem comentários
**Depois**: Markdown rico com classes, métodos públicos, JSDoc e type annotations
**Valor Perceptível**: LLMs compreendem arquitetura completa, não apenas funções isoladas
**Teste de Valor**: Arquivo com AuthService + comentários gera documentação que LLM usa para sugerir melhorias arquiteturais

### História 2.1: Batch Processing
**Antes**: Desenvolvedor processa arquivos um por um manualmente
**Depois**: Um comando documenta projeto inteiro automaticamente
**Valor Perceptível**: Horas de trabalho manual eliminadas, documentação de projeto completo
**Teste de Valor**: Projeto 20 arquivos documentado em 2 minutos vs 2 horas de trabalho manual

### História 3.1: Structured Format
**Antes**: Markdown básico sem hierarquia clara
**Depois**: Documentação com estrutura consistente e navegável
**Valor Perceptível**: LLMs navegam código mais facilmente, desenvolvedores entendem estrutura
**Teste de Valor**: Formato `#class → #method → params` facilita prompt engineering com LLMs

## ⚠️ Riscos e Validações

### Riscos de Sequência
- **Risco 1**: Se História 1.1 falhar no parser Babel, toda sequência para - **Mitigação**: Protótipo parser isoladamente antes da História 1.1
- **Risco 2**: Batch processing (2.1) pode ser complexo demais - **Mitigação**: Começar com processamento sequencial, não paralelo

### Premissas de Complexidade
- **Premissa 1**: Babel parser funciona bem com TS moderno (async/await, decorators) - **Validação**: Testar com arquivos reais na História 1.1
- **Premissa 2**: Formato hierárquico pode ser implementado com templates simples - **Validação**: Protótipo geração na História 3.1

### Critérios de Revalidação
- **Se História > 15 dias**: Quebrar extração por tipo (primeiro funções, depois classes, depois comentários)
- **Se valor não for claro**: Testar com usuários reais usando markdown gerado com LLMs
- **Se dependência for bloqueante**: História 2.1 pode ser movida para depois de 3.1 se batch for muito complexo

---
*Épicos e Histórias gerados pelo Identificador de Histórias - DevSolo Docs V4.1*