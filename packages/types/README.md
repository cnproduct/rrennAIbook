# @rrennAIbook/types

TypeScript type definitions for rrennAIbook. This package provides all the core types used across the rrennAIbook ecosystem, including:

- Configuration types for `rrennAIbook.json` and `hyperlibrary.json`
- Page and section navigation types
- Language and layout definitions
- Element and directive configuration types
- Glossary and frontmatter types

## Installation

```sh
pnpm add @rrennAIbook/types
# or
npm i @rrennAIbook/types
```

## Usage

```typescript
import type { rrennAIbookJson, Language, Navigation } from "@rrennAIbook/types";

const config: rrennAIbookJson = {
  name: "My Documentation",
  language: "en",
  // ...
};
```
