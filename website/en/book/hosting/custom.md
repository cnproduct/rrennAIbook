---
name: Custom
---

# Deploy on Your Server

You just need to copy the output folder after running build command.

```
npx rrennAIbook build

cp -R .rrennAIbook/out /var/www/my-website
```

:::alert{warn}
If you deploy to a subfolder ensure to set the basePath option in your [rrennAIbook configuration](/configuration/book).
:::
