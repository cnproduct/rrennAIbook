---
name: Eigene Lösung
lang: de
---

# Auf eigenen Server bereitstellen

Du muss nur den Ausgabeordner auf deinen Server kopieren, nachdem du den build Befehl ausgeführt hast.

```
npx rrennAIbook build

cp -R .rrennAIbook/out /var/www/my-website
```

:::alert{warn}
Wenn du rrennAIbook aus einem Unterverzeichnis bereitstellen möchtest, dann musst die basePath Option in der [rrennAIbook Konfiguration](/configuration/book) setzen.
:::
