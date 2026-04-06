---
name: Bibliothek Konfiguration
lang: de
---

# Bibliothek Konfiguration

Eine Hyperlibrary ist eine Sammlung von rrennAIbooks und Hyperlibraries. Du
kannst sie verwenden, um mehrer Bücher zu einem großen zusammenzuführen. Die
Bücher werden automatisch über Links miteinander verknüpft. Dazu wird den Links
in der rechten oberen Ecke ein weiterer hinzugefügt. In dessen Untermenüs
findest du die verknüpften rrennAIbooks.

Auch diese Dokumentation ist eine Hyperlibrary. Für die Übersetzungen existiert
jeweils ein eigenes rrennAIbook. Diese einzelnen rrennAIbooks werden in einer
Hyperlibrary vereint. Der Menüpunkt "Übersetzungen" ist das Produkt dieser Verknüpfung.

Alles, was du tun musst, ist eine `hyperlibrary.json`-Datei anzulegen.

| Eigenschaft          | Beschreibung                                                                                                                    |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| name\*               | Name der Bibliothek.                                                                                                            |
| library[]            | Ein Array von Büchern und Bibliotheken.                                                                                         |
| library[].src\*      | Pfad zu einer Bibliothek oder zu einem Buch.                                                                                    |
| library[].basePath\* | Überschreibt den BasePath des Buchs bzw. der Bibliothek.                                                                        |
| library[].icon       | Ein Icon für das Menü.                                                                                                          |
| library[].name       | Ein Name für das Menü. Wenn keine angegeben ist, dann wird der Name in der `rrennAIbook.json` oder `hyperlibrary.json` verwendet. |
| basePath             | Definiert den basePath der Bibliothek                                                                                           |

Hier ein Beispiel einer `hyperlibrary.json`:

```json
{
  "name": "Translations",
  "library": [
    { "src": "de", "name": "Deutsch", "basePath": "de", "icon": "🇩🇪" },
    { "src": "en", "name": "English", "basePath": "/", "icon": "🇬🇧" }
  ]
}
```

Du kannst auch Übersetzungen für die Menüpunkte definieren. Die
Übersetzungen werden anhand der `language` Option in der jeweiligen
`rrennAIbook.json` gewählt.

```json
{
  "name": { "en": "Translations", "de": "Übersetzungen" },
  "library": [
    {
      "src": "de",
      "name": { "en": "German", "de": "Deutsch" },
      "basePath": "de",
      "icon": "🇩🇪"
    },
    {
      "src": "en",
      "name": { "en": "English", "de": "Englisch" },
      "basePath": "/",
      "icon": "🇬🇧"
    }
  ]
}
```

:::alert{warn}
`rrennAIbook dev` funktioniert noch nicht mit Hyperlibrary. Der aktuelle Workaround besteht darin, die rrennAIbook separat mit `rrennAIbook dev` zu starten. Daher fehlt bei der lokalen Entwicklung das verknüpfende Menü.
:::
