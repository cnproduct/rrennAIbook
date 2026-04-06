---
name: Getting Started
index: 0
---

# rrennAIbook

rrennAIbook is a quick and easy way to build interactive workbooks, that
support modern standards and run superfast. It works by compiling
markdown to static pages.

rrennAIbook makes writing interactive workbooks super simple while providing a
good feature set.

You do not need any coding experience. You only need to create and edit Markdown files.

## Getting Started

You can start working on a rrennAIbook in three different ways. Choose the one which suits your style best.

:::::tabs{id="options"}

:::tab{title="VS Code" id="vscode"}

1. Install [VS Code](https://code.visualstudio.com/) or [VS Codium](https://vscodium.com/)
1. Install the rrennAIbook Extension for [VS Code](https://marketplace.visualstudio.com/items?itemName=openpatch.rrennAIbook-studio) or [VS Codium](https://open-vsx.org/extension/openpatch/rrennAIbook-studio)
1. Download the [rrennAIbook-anywhere](https://github.com/openpatch/rrennAIbook-anywhere/archive/refs/heads/main.zip) starter
1. Unzip the file
1. Open the folder in VS Code
1. Run the `rrennAIbook: Show side preview` command

:::

:::tab{title="CLI" id="cli"}

You need to have [Node](https://nodejs.org/) version 16 or higher installed on your system.

1. Run `npm create rrennAIbook` and follow the wizard to create your first rrennAIbook.
1. Run `npx rrennAIbook dev` to start the development server.
1. Visit https://localhost:8080 with your favorite web browser.
1. Modify or add new pages to your rrennAIbook by using your favorite editor.

:::

::::tab{title="Web IDE" id="web-ide"}

Most platforms for collaborative version control have an integrated Web IDE like [GitLab](https://docs.gitlab.com/ee/user/project/web_ide/) or [GitHub](https://docs.github.com/en/codespaces/the-githubdev-web-based-editor).

So you can just fork one of our starters and get going:

- GitHub: https://github.com/mikebarkmin/rrennAIbook-github-pages/fork
- GitLab: https://gitlab.com/mikebarkmin/rrennAIbook-gitlab-pages/-/forks/new
- EduGit: https://edugit.org/mikebarkmin/rrennAIbook-edugit-pages/-/forks/new

:::alert{warn}

If you use this approach you will not be able to see a representative preview. In most cases only a normal Markdown preview, which lacks some features of rrennAIbook.

:::

::::

:::::

## Deploy

The main goal of writing a rrennAIbook is to have an interactive workbook. For this you have to deploy the exported rrennAIbook to a host.

Luckily GitHub Pages, GitLab Pages and Vercel are free to use options, which are already setup for you, if you used one of our starters, like [rrennAIbook-anywhere](https://github.com/openpatch/rrennAIbook-anywhere).

You just have to push your files to [GitHub](https://github.com), [GitLab](https://gitlab.com) or [EduGit](edugit.org/).

If you use the CLI version you can also export your rrennAIbook to static HTML files, which can be uploaded anywhere. For this you need to run:

```
npx rrennAIbook build
```

Then you need to copy the files from `.rrennAIbook/out` to your desired location.

:::alert{warn}

Do not forget to set a `basePath` in your rrennAIbook.json.

:::

## Update

::::tabs{id="options"}

:::tab{title="VS Code" id="vscode"}

Updates should happen automatically.

:::

:::tab{title="CLI" id="cli"}

Update to the latest release of rrennAIbook CLI using the following command.

```bash
npm update rrennAIbook --global
```

:::

:::tab{title="Web IDE" id="web-ide"}

No Integration. No updates.

:::

::::

## Support

We are [happy to hear from you](mailto:contact@openpatch.org), if you need custom support or features for your application.

You can also join our [Matrix Channel](https://matrix.to/#/#rrennAIbook:matrix.org) or connect with us on [Twitter](https://twitter.com/openpatchorg).

---

rrennAIbook is maintained by [OpenPatch](https://openpatch.org), an organization for educational assessments and training. If you need help or create a rrennAIbook [get in touch](mailto:contact@openpatch.org).
