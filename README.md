# M2JS

M2JS is a command-line tool that reads TypeScript and JavaScript files and writes a Markdown summary of them: exported functions, classes, signatures and comments, without the function bodies. The summary is meant to be pasted into an LLM as context.

The same CLI has three analysis modes: unused exports and imports, duplicate code, and the difference in dependency structure between two git references.

## Install

Needs Node.js 16 or newer.

```bash
npm install -g @paulohenriquevn/m2js
```

## Use

Summarize a file or a directory:

```bash
m2js src/UserService.ts
m2js src/UserService.ts -o UserService.md
m2js src/UserService.ts --ai-enhanced
```

`--ai-enhanced` turns on four extra sections: business context, usage examples, architecture insights and semantic analysis. Each one also has its own flag (`--business-context`, `--usage-examples`, `--architecture-insights`, `--semantic-analysis`). `--no-comments` leaves comments out.

Draw the dependency graph, with Mermaid diagrams if you ask for them:

```bash
m2js src --graph --mermaid
```

Find unused exports and imports:

```bash
m2js src --detect-unused
m2js src --detect-unused --format json
```

Find duplicate code (uses jscpd):

```bash
m2js src --detect-duplicates --min-lines 5 --min-tokens 50
```

Compare the dependency structure of two git references:

```bash
m2js src --graph-diff --baseline main
m2js . --graph-diff --baseline v1.0.0 --current v1.1.0 --min-severity high
```

`m2js --init-config` writes an example `.m2jsrc`. The longer guides are in [docs/DEAD_CODE_GUIDE.md](docs/DEAD_CODE_GUIDE.md) and [docs/GRAPH_DIFF_GUIDE.md](docs/GRAPH_DIFF_GUIDE.md), and the CLI prints the same help with `--help-dead-code`, `--help-duplicates` and `--help-graph-diff`.

## VS Code extension

The extension lives in [`vscode-extension/`](vscode-extension/) and ships as a `.vsix` file in that directory. It is not published on the Marketplace. Install it with:

```bash
code --install-extension vscode-extension/m2js-vscode-0.1.0.vsix
```

## Status

The code has not changed since July 2025. Issues are open, but nobody is working on them.

## License

MIT. See [LICENSE](LICENSE).
