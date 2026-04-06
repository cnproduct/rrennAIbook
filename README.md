# rrennAIbook

rrennAIbook is a quick and easy way to build interactive workbooks, that
support modern standards and runs superfast.

- **Documentation**: https://rrennAIbook.openpatch.org
- **Repository:** https://github.com/openpatch/rrennAIbook
- **Community**: https://matrix.to/#/#openpatch:matrix.org

## Packages

This monorepo contains the following packages:

### Core Packages

- **[rrennAIbook](packages/rrennAIbook)** - Main CLI tool for creating, building, and serving rrennAIbook projects
- **[@rrennAIbook/markdown](packages/markdown)** - Markdown processing engine with 30+ custom directives
- **[@rrennAIbook/fs](packages/fs)** - File system utilities for managing rrennAIbook projects
- **[@rrennAIbook/types](packages/types)** - TypeScript type definitions for the rrennAIbook ecosystem
- **[create-rrennAIbook](packages/create)** - Interactive CLI for scaffolding new rrennAIbook projects

### Components

- **[@rrennAIbook/web-component-excalidraw](packages/web-component-excalidraw)** - Excalidraw web component for diagrams

### Platforms

- **[rrennAIbook-studio](platforms/vscode)** - Visual Studio Code extension with preview, snippets, and validation

## Documentation

If you want to work on the documentation, run the
development server and edit the files in the website folder.

```
pnpm install
pnpm build
pnpm website:dev
```

## VSCode Extension

If you want to work the vscode extension:

```
pnpm install
pnpm build
pnpm --filter rrennAIbook-studio watch
pnpm --filter rrennAIbook-studio open
```

## Maintainer

Mike Barkmin • [Mastodon](https://bildung.social/@mikebarkmin) • [GitHub](https://github.com/mikebarkmin/)

## Support

We are [happy to hear from you](mailto:contact@openpatch.org), if you need custom support or features for your application.

---

rrennAIbook is maintained by [OpenPatch](https://openpatch.org), an organization for educational assessments and training. If you need help or you created a rrennAIbook [get in touch](mailto:contact@openpatch.org).
