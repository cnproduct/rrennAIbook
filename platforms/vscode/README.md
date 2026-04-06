# rrennAIbook Support for Visual Studio Code

[![version](https://img.shields.io/vscode-marketplace/v/openpatch.rrennAIbook-studio.svg?label=version)](https://marketplace.visualstudio.com/items?itemName=openpatch.rrennAIbook-studio)
[![installs](https://img.shields.io/vscode-marketplace/d/openpatch.rrennAIbook-studio.svg?label=installs)](https://marketplace.visualstudio.com/items?itemName=openpatch.rrennAIbook-studio)
![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/openpatch/rrennAIbook/changeset-version.yml)
[![GitHub stars](https://img.shields.io/github/stars/openpatch/rrennAIbook.svg?label=github%20stars)](https://github.com/openpatch/rrennAIbook)
[![GitHub Contributors](https://img.shields.io/github/contributors/openpatch/rrennAIbook.svg?)](https://github.com/openpatch/rrennAIbook/graphs/contributors)
[![License](https://img.shields.io/github/license/openpatch/rrennAIbook)](https://github.com/openpatch/rrennAIbook)

Complete tooling for authoring rrennAIbooks in Visual Studio Code. This extension provides live preview, snippets, auto-completion, syntax highlighting, and schema validation for rrennAIbook projects.

All you need for writing rrennAIbooks (auto preview, snippets, auto-completion and more).

## Features

### Preview

You can preview your rrennAIbook pages by clicking the preview icon in the top right-hand corner or by running the command `Show side preview`.

![Preview](https://github.com/openpatch/rrennAIbook/raw/main/platforms/vscode/screenshots/preview.gif)

### rrennAIbook Config

The `rrennAIbook.json` is validated against a schema, which presents you
from making mistakes. It also enables a color picker for your brand
color.

![Config](https://github.com/openpatch/rrennAIbook/raw/main/platforms/vscode/screenshots/config.gif)

### Syntax Highlighting

Each element has its own syntax highlighting. So you know when you typed it right.

### Snippets

Each element can be inserted by using a snippet. Type `:` and hit your auto-completion key combo (default Ctrl+Space).

![](https://github.com/openpatch/rrennAIbook/raw/main/platforms/vscode/screenshots/snippets.gif)

### Auto completion

![](https://github.com/openpatch/rrennAIbook/raw/main/platforms/vscode/screenshots/autocomplete.gif)

- Glossary terms

  - Move your cursor between the curly braces of a term/t element, e.g.: `:t[My term]{`
  - Type `#` to trigger the completion

- Link to book pages
  - Type `/` to trigger the completion
- Link to files in the public folder
  - Type `/` to trigger the completion
- Archives
  - Move your cursor in the src parameter of an archive element, e.g.: `:archive[My archive]{src=`
  - Type `"` to trigger the completion

## Changelog

See [CHANGELOG](https://github.com/openpatch/rrennAIbook/blob/main/platforms/vscode/CHANGELOG.md) for more information.
