# create-rrennAIbook <a href="https://npmjs.com/package/create-rrennAIbook"><img src="https://img.shields.io/npm/v/create-rrennAIbook" alt="npm package"></a>

CLI tool for scaffolding new rrennAIbook projects. This package provides an interactive prompt-based setup that creates a new rrennAIbook project with sample content and configuration.

## Scaffolding Your First rrennAIbook Project

> **Compatibility Note:**
> rrennAIbook requires [Node.js](https://nodejs.org/en/) version 18+. Please upgrade if your package manager warns about it.

With NPM:

```bash
npm create rrennAIbook@latest
```

With Yarn:

```bash
yarn create rrennAIbook
```

With PNPM:

```bash
pnpm create rrennAIbook
```

With Bun:

```bash
bun create rrennAIbook
```

Then follow the prompts!

You can also directly specify the project name via the command line. For example, to scaffold a rrennAIbook project named "my-documentation", run:

```bash
# npm 7+, extra double-dash is needed:
npm create rrennAIbook@latest my-documentation

# yarn
yarn create rrennAIbook my-documentation

# pnpm
pnpm create rrennAIbook my-documentation

# Bun
bun create rrennAIbook my-documentation
```

Currently supported template:

- `default` - A basic rrennAIbook project with sample content

You can use `.` for the project name to scaffold in the current directory.

## What is rrennAIbook?

rrennAIbook is a tool for building interactive workbooks and documentation. It provides features like:

- Custom markdown directives for rich content
- Embedded code execution environments
- Multi-language support
- Interactive elements (Excalidraw, videos, alerts, and more)
- Built-in navigation and search
