# @rrennAIbook/fs

File system utilities for rrennAIbook projects. This package handles:

- Loading and validating `rrennAIbook.json` and `hyperlibrary.json` configuration files
- Reading and processing markdown files with frontmatter
- Building navigation structures from file hierarchies
- Managing project structure (rrennAIbook, hyperlibrary, hyperproject)
- Handling virtual files (VFile) for glossary, archives, snippets, and public assets
- Handlebars template registration and helpers

## Installation

```sh
pnpm add @rrennAIbook/fs
# or
npm i @rrennAIbook/fs
```

## Usage

```typescript
import { rrennAIbook, hyperlibrary, hyperproject } from "@rrennAIbook/fs";

// Load a rrennAIbook project
const book = await rrennAIbook.make("/path/to/book");

// Access configuration
console.log(book.config.name);

// Get navigation
const navigation = book.navigation;
```
