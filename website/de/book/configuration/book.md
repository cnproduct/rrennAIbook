---
name: Buch Konfiguration
index: 0
lang: de
---

# Buch Konfiguration

In deinem neuen rrennAIbook-Projekt findest du eine `rrennAIbook.json` Datei. Diese
Datei wird verwendet, um dein rrennAIbook zu konfigurieren. Hier ist eine Liste
von Optionen, die du definieren kannst. Optionen mit einem "\*" müssen gesetzt werden.

| Property           | Description                                                                                                                                                                                     |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| name\*             | Name des rrennAIbooks. Wird für den Seitentitel verwendet.                                                                                                                                        |
| description        | Beschreibung des rrennAIbooks. Wird für SEO verwendet.                                                                                                                                            |
| search             | Erlaubt es im rrennAIbook zu suchen.                                                                                                                                                              |
| logo               | URL eines Logos. Wird für den Seitentitel verwendet. Diese kann relative zum public-Ordner (z.B.: /mein-logo.png) sein oder ein externes Bild referenzieren.                                    |
| author.name        | Name des Autors des rrennAIbooks. Wird in der Fußzeile verwendet.                                                                                                                                 |
| author.url         | URL zur Homepage des Autors. Wird in der Fußzeile verwendet.                                                                                                                                    |
| font               | URL zu einer Schriftart. Wird für Überschriften und normalen Text verwendet. Du kannst ":90%" hinzufügen um die Schriftgröße anzupassen.                                                        |
| fonts.heading      | URL zu einer Schriftart. Wird für Überschriften verwendet. Du kannst ":90%" hinzufügen um die Schriftgröße anzupassen.                                                                          |
| fonts.body         | URL zu einer Schriftart. Wird für normalen Text verwendet. Du kannst ":90%" hinzufügen um die Schriftgröße anzupassen.                                                                          |
| fonts.code         | URL zu einer Schriftart. Wird für Quelltexte verwendet. Du kannst ":90%" hinzufügen um die Schriftgröße anzupassen.                                                                             |
| colors.brand       | Die Farbe der Kopfzeile und von Akzenten z.B. von Links.                                                                                                                                        |
| colors.brandDark   | Die Farbe der Akzente z.B. von Links. Nur relevant für das dunkle Design. Brand text wird im dunklen Design nicht verwendet.                                                                    |
| colors.brandText   | Die Farbe für den Text in der Kopfzeile.                                                                                                                                                        |
| basePath           | Wenn das rrennAIbook aus einem Unterordner bereitgestellt werden soll, muss dieser hier angegeben werden.                                                                                         |
| license            | Lizenz unter der das rrennAIbook veröffentlicht ist.                                                                                                                                              |
| language           | Die Sprach des rrennAIbooks.                                                                                                                                                                      |
| repo               | Der Link zum GitHub-Repository. Wird für das Zeigen eines Edit-Buttons verwendet. Der Platzhalter %path% wird durch den aktuellen Pfad ersetzt oder der aktuelle Pfad wird ans Ende angehangen. |
| repo.url           | Der Link zum Repository. Wird für das Zeigen eines Edit-Buttons verwendet. Der Platzhalter %path% wird durch den aktuellen Pfad ersetzt oder der aktuelle Pfad wird ans Ende angehangen.        |
| repo.label         | Der Bezeichner für den Repository-Link.                                                                                                                                                         |
| elements           | Hier können einzelne Elemente konfiguriert werden. Schaue dazu auf die Elementseiten.                                                                                                           |
| links              | Hier können Links hinzugefügt werden, welche in der rechten oberen Ecke angezeigt werden. Schaue dir dazu das untere Beispiel an.                                                               |
| styles             | Hier können Links zu eigenen CSS-Styles gesetzt werden.                                                                                                                                         |
| scripts            | Hier können Links zu eigenen JavaScript-Dateien gesetzt werden.                                                                                                                                 |
| allowDangerousHtml | Erlaube HTML im rrennAIbook. Dies kann zu Inkompatibilität in zukünftigen Versionen führen.                                                                                                       |
| qrcode             | Zeigt ein Icon, um einen QR-Code zur aktuellen Seite anzuzeigen.                                                                                                                                |
| toc         | Zeige ein Inhaltsverzeichnis. Diese ist standardmäßig aktiviert für Seiten und deaktiviert für Begriffe im Glossar.                            |
| llms               | Wenn auf true gesetzt, wird eine llms.txt-Datei generiert, die alle Markdown-Dateien in Reihenfolge kombiniert. Die Datei enthält den Buchnamen und die Version im Header-Format.              |
| trailingSlash      | Exportiert alle Datei in eigene Verzeichnisse und erzeugt nur index.html Dateien.                                                                                                               |
| importExport       | Ermöglicht das Importieren und Exportieren des Zustands des rrennAIbooks als Datei. Schaltflächen zum Importieren und Exportieren befinden sich am unteren Rand der Seite.                        |
| cloud.url          | URL deines [rrennAIbook Cloud](/configuration/cloud)-Servers. Aktiviert den Schüler-Login und die Cloud-Synchronisierung.                                                                         |
| cloud.id           | Der rrennAIbook-Slug/ID auf dem Cloud-Server. Muss mit dem Slug übereinstimmen, der in der Cloud-Admin-Oberfläche konfiguriert ist.                                                               |
| version | Konfiguriert, wo die Version des rrennAIbooks angezeigt wird. "text" zeigt sie unter dem "Powered by rrennAIbook"-Text an. "tooltip" als Tooltip beim Hover über den "Powered by rrennAIbook"-Text und "console" nur in der Konsole. |

Hier ist eine Beispielkonfiguration:

```json
{
  "name": "rrennAIbook Documentation",
  "description": "Documentation for rrennAIbook created with rrennAIbook",
  "search": true,
  "qrcode": false,
  "author": {
    "name": "OpenPatch",
    "url": "https://openpatch.org"
  },
  "font": "/fonts/my-font.woff2:90%",
  "logo": "/logo.png",
  "license": "CC-BY-SA",
  "language": "en",
  "basePath": "/rrennAIbook-github-pages",
  "repo": "https://github.com/mikebarkmin/rrennAIbook-github-pages/edit/main",
  "colors": {
    "brand": "#FF0000"
  },
  "cloud": {
    "url": "https://cloud.example.com",
    "id": "my-rrennAIbook"
  },
  "elements": {
    "bookmarks": false
  },
  "links": [
    {
      "label": "Contact",
      "links": [
        {
          "label": "Mail",
          "icon": "📧",
          "href": "mailto:contact@openpatch.org"
        },
        {
          "label": "Twitter",
          "icon": "🐦",
          "href": "https://twitter.com/openpatchorg"
        },
        {
          "label": "Mastodon",
          "icon": "🐘",
          "href": "https://fosstodon.org/@openpatch"
        },
        {
          "label": "Matrix (Chat)",
          "icon": "👨‍💻",
          "href": "https://matrix.to/#/#rrennAIbook:matrix.org"
        }
      ]
    },
    {
      "label": "OpenPatch",
      "href": "https://openpatch.org"
    }
  ]
}
```
