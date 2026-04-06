---
name: Library Configuration
---

# Library Configuration

A Hyperlibrary is a collection of rrennAIbooks and Hyperlibraries. You can use it
to merge several books into one big one. The books are automatically linked to
each other. For this purpose a new link will be added to the links in the upper
right corner. In its submenus you will find the linked rrennAIbooks.

This documentation is also a Hyperlibrary. For the translations there is
a separate rrennAIbook for each translation. These individual rrennAIbooks are combined in a
Hyperlibrary. The menu item 'Translations' is the product of this linkage.

All you have to do is create a `hyperlibrary.json` file.

| Property             | Description                                                                                                             |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| name\*               | Name of the library.                                                                                                    |
| library[]            | An array of books and libraries.                                                                                        |
| library[].src\*      | Path to a book or library.                                                                                              |
| library[].basePath\* | Overwrites the basePath of a book or library.                                                                           |
| library[].icon       | An icon für the menu.                                                                                                   |
| library[].name       | A name für the menu. If no name is provided, it will use the one defined in the `rrennAIbook.json` or `hyperlibrary.json` |
| basePath             | Defines the basePath of the library.                                                                                    |

Here is an example of a `hyperlibrary.json`:

```json
{
  "name": "Translations",
  "library": [
    { "src": "de", "name": "Deutsch", "basePath": "de", "icon": "🇩🇪" },
    { "src": "en", "name": "English", "basePath": "/", "icon": "🇬🇧" }
  ]
}
```

You can also define translations. The translations will be selected based on
the `lanauge` option in the corresponding `rrennAIbook.json`

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
