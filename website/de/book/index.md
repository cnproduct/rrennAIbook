---
name: Los Gehts
index: 0
lang: de
---

# rrennAIbook

rrennAIbook ist eine schnelle und einfache Möglichkeit interaktive Arbeitshefte zu erstellen, die moderne Standards unterstützen und sehr schnell sind. Dazu werden Markdown-Datein in statische HTML-Seiten umgewandelt.

Du brauchst keine Programmiererfahrung. Du brauchst nur Markdown-Dateien erstellen und editieren.

## Los Gehts

Du kannst mit der Erstellung deines rrennAIbook auf drei Arten starten. Wähle die Art die am besten zu dir passt.

:::::tabs{id="options"}

:::tab{title="VS Code" id="vscode"}

1. Installiere [VS Code](https://code.visualstudio.com/) oder [VS Codium](https://vscodium.com/)
1. Installiere die rrennAIbook Erweiterung für [VS Code](https://marketplace.visualstudio.com/items?itemName=openpatch.rrennAIbook-studio) oder [VS Codium](https://open-vsx.org/extension/openpatch/rrennAIbook-studio)
1. Downloade den [rrennAIbook-anywhere](https://github.com/openpatch/rrennAIbook-anywhere/archive/refs/heads/main.zip) Starter
1. Entpacke die Datei
1. Öffne den Order in VS Code
1. Führe den Befehl `rrennAIbook: Show side preview` aus

:::

:::tab{title="CLI" id="cli"}

Du benötigst [Node](https://nodejs.org/) version 16 oder höherer auf deinem System.

1. Führe `npm create rrennAIbook` aus und folge den Anweisungen, um dein erstes rrennAIbook zu erstellen.
1. Führe `npx rrennAIbook dev` aus, um den Entwicklungsserver zu starten.
1. Besuche https://localhost:8080 mit deinem Lieblingsbrowser.
1. Modifiziere oder füge neue Seiten zu deinen rrennAIbook hinzu mit deinem Lieblingseditor.

:::

::::tab{title="Web IDE" id="web-ide"}

Die meisten Platformen für kollaborative Versionskontrolle haben eine integrierte Web IDE, wie [GitLab](https://docs.gitlab.com/ee/user/project/web_ide/) oder [GitHub](https://docs.github.com/en/codespaces/the-githubdev-web-based-editor).

Du kannst eins der Startprojekte forken und direkt loslegen:

- GitHub: https://github.com/mikebarkmin/rrennAIbook-github-pages/fork
- GitLab: https://gitlab.com/mikebarkmin/rrennAIbook-gitlab-pages/-/forks/new
- EduGit: https://edugit.org/mikebarkmin/rrennAIbook-edugit-pages/-/forks/new

:::alert{warn}

Wenn du diesen Ansatz wählt, wirst du keine repräsentative Vorschau bekommen. In den meisten Fällen bekommst du nur eine normale Markdown-Vorschau, welche manche Features von rrennAIbook nicht unterstützt.

:::

::::

:::::

## Bereitstellen

Das Hauptziel des Schreibens eines rrennAIbooks ist ein interaktives Arbeitsheft. Dafür muss diese auf einen Server bereitgestellt werden.

Zum Glück sind GitHub Pages, GitLab Pages und Vercel kostenlose Optionen, welche bereits für dich konfiguriert sind, wenn du unseren Starter benutzt hast [rrennAIbook-anywhere](https://github.com/openpatch/rrennAIbook-anywhere).

Du musst die Dateien nur zu [GitHub](https://github.com), [GitLab](https://gitlab.com) oder [EduGit](edugit.org/) pushen.

Wenn du die CLI Version verwendet hast, kannst du außerdem dein rrennAIbook in statische HTML-Dateien umwandeln, welche du überall hochladen kannst. Dafür musst du den folgenden Befehl ausführen:

```
npx rrennAIbook build
```

Danach kannst du die Dateien vom Ordner `.rrennAIbook/out` zum Zielort kopieren.

:::alert{warn}

Vergiss nicht den `basePath` in deiner rrennAIbook.json zu setzen.

:::

## Update

::::tabs{id="options"}

:::tab{title="VS Code" id="vscode"}

Updates sollten automatisch funktionieren.

:::

:::tab{title="CLI" id="cli"}

Um die neuste Version des rrennAIbook CLI zu bekommen, benutzte den folgenden Befehl:

```bash
npm update rrennAIbook --global
```

:::

::::

## Unterstützung

Wir [freuen uns von dir zu hören](mailto:contact@openpatch.org), wenn du Unterstützung oder neue Features für deinen Anwendungszweck benötigst.

Du kannst außerdem unserem [Matrix Channel](https://matrix.to/#/#rrennAIbook:matrix.org) beitreten oder uns auf [Twitter](https://twitter.com/openpatchorg) folgen.

---

rrennAIbook is maintained by [OpenPatch](https://openpatch.org), an organization for educational assessments and training. If you need help or create a rrennAIbook [get in touch](mailto:contact@openpatch.org).
